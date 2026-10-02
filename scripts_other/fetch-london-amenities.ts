#!/usr/bin/env node
/**
 * fetch-london-amenities.ts
 * Fetches real OpenStreetMap amenity data for every London property via the
 * Overpass API and writes the result to public/data/london_amenities.json.
 *
 * Run:  npx tsx scripts/fetch-london-amenities.ts
 *
 * Strategy
 * ─────────
 * • Properties are processed individually (small ~300m bbox per property).
 * • We resume from where we left off — already-cached IDs are skipped.
 * • A polite 800 ms pause is added between Overpass calls.
 * • Up to 3 retries with exponential back-off per request.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.join(__dirname, '..');

const OUT_JSON        = path.join(ROOT, 'public', 'data', 'london_amenities.json');
const PROPERTIES_JSON = path.join(ROOT, 'public', 'data', 'all-properties.json');

// Multiple Overpass mirrors — rotated if one rate-limits us
const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];
let mirrorIdx = 0;

// ── Category mapping ──────────────────────────────────────────────────────────

function getCategory(tags: Record<string, string>): string | null {
  const am  = tags.amenity        ?? '';
  const le  = tags.leisure        ?? '';
  const sh  = tags.shop           ?? '';
  const pt  = tags.public_transport ?? '';
  const hw  = tags.highway        ?? '';
  const hf  = tags.healthcare     ?? '';
  const rw  = tags.railway        ?? '';

  if (am === 'restaurant')                                      return 'Restaurant';
  if (am === 'cafe')                                            return 'Cafe';
  if (am === 'bar' || am === 'pub')                             return 'Bar';
  if (am === 'nightclub')                                       return 'Nightclub';
  if (sh === 'convenience' || sh === 'kiosk')                   return 'Convenience Store';
  if (sh === 'supermarket'  || sh === 'mall')                   return 'Supermarket';
  if (am === 'pharmacy' || hf === 'pharmacy')                   return 'Pharmacy';
  if (am === 'hospital' || hf === 'hospital' || hf === 'clinic') return 'Hospital';
  if (am === 'library')                                         return 'Library';
  if (rw === 'station' || pt === 'station')                     return 'Metro Station';
  if (hw === 'bus_stop' || pt === 'stop_position')              return 'Bus Stop';
  if (le === 'park' || le === 'garden')                         return 'Park';
  if (le === 'pitch')                                           return 'Sports Pitch';
  if (le === 'sports_centre' || le === 'stadium')               return 'Sports Centre';
  if (le === 'fitness_centre' || le === 'gym')                  return 'Gym';
  if (am === 'university' || am === 'college')                  return 'University';
  if (am === 'place_of_worship')                                return 'Church';
  return null;
}

// ── Geometry helpers ──────────────────────────────────────────────────────────

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R  = 6371000;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a  = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function extractGeometry(el: any): { polygon: number[][], cLat: number, cLng: number, flat: boolean } | null {
  if (el.type === 'node') {
    const d = 0.00005;
    const lat = el.lat, lng = el.lon;
    return {
      polygon: [
        [lng - d, lat - d], [lng + d, lat - d],
        [lng + d, lat + d], [lng - d, lat + d],
        [lng - d, lat - d],
      ],
      cLat: lat, cLng: lng, flat: true,
    };
  }

  if (el.type === 'way' && el.geometry) {
    const raw: number[][] = el.geometry.map((pt: any) => [pt.lon, pt.lat]);
    if (raw.length < 3) return null;
    if (raw[0][0] !== raw[raw.length - 1][0] || raw[0][1] !== raw[raw.length - 1][1]) {
      raw.push([...raw[0]]);
    }
    const cLng = raw.reduce((s, p) => s + p[0], 0) / raw.length;
    const cLat = raw.reduce((s, p) => s + p[1], 0) / raw.length;
    return { polygon: raw, cLat, cLng, flat: false };
  }

  if (el.type === 'relation' && el.members) {
    const outer = el.members.find((m: any) => m.role === 'outer' && m.geometry);
    if (!outer) return null;
    const raw: number[][] = outer.geometry.map((pt: any) => [pt.lon, pt.lat]);
    if (raw.length < 3) return null;
    if (raw[0][0] !== raw[raw.length - 1][0] || raw[0][1] !== raw[raw.length - 1][1]) {
      raw.push([...raw[0]]);
    }
    const cLng = raw.reduce((s, p) => s + p[0], 0) / raw.length;
    const cLat = raw.reduce((s, p) => s + p[1], 0) / raw.length;
    return { polygon: raw, cLat, cLng, flat: false };
  }

  return null;
}

// ── Overpass fetch with retry ─────────────────────────────────────────────────

async function fetchOverpass(query: string, retries = 5): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const url = OVERPASS_MIRRORS[mirrorIdx % OVERPASS_MIRRORS.length];
    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    `data=${encodeURIComponent(query)}`,
        signal:  AbortSignal.timeout(45_000),
      });
      if (res.ok) return await res.json();
      if (res.status === 429) {
        console.warn(`    429 rate-limited on ${url}, switching mirror + waiting 30s…`);
        mirrorIdx++;
        await sleep(30_000);
        continue;
      }
      console.warn(`    HTTP ${res.status} on ${url}, retry ${i + 1}/${retries}…`);
    } catch (e: any) {
      console.warn(`    Fetch error (${e.message}), retry ${i + 1}/${retries}…`);
    }
    await sleep(3000 * (i + 1));
  }
  throw new Error('Overpass unreachable after retries');
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Load properties
  const allProps  = JSON.parse(fs.readFileSync(PROPERTIES_JSON, 'utf-8'));
  const londonProps = allProps.filter((p: any) => p.lat > 51 && p.lat < 52);
  console.log(`\n🗺  Found ${londonProps.length} London properties.`);

  // Load existing cache (resume support)
  const cache: Record<string, any> = fs.existsSync(OUT_JSON)
    ? JSON.parse(fs.readFileSync(OUT_JSON, 'utf-8'))
    : {};

  const todo = londonProps.filter((p: any) => !cache[p.id]);
  console.log(`   Cached: ${londonProps.length - todo.length} | To fetch: ${todo.length}\n`);

  const RADIUS_DEG = 0.003; // ~300 m
  const ASSIGN_M   = 500;   // assign amenities within 500 m of property

  for (let i = 0; i < todo.length; i++) {
    const p = todo[i];
    const pct = (((londonProps.length - todo.length + i + 1) / londonProps.length) * 100).toFixed(1);
    console.log(`[${pct}%] ${i + 1}/${todo.length}: ${p.name} (${p.id})`);

    const bbox = `${p.lat - RADIUS_DEG},${p.lng - RADIUS_DEG},${p.lat + RADIUS_DEG},${p.lng + RADIUS_DEG}`;

    const query = `
[out:json][timeout:35];
(
  nwr["amenity"~"^(restaurant|cafe|bar|pub|nightclub|pharmacy|library|university|college|place_of_worship|hospital|clinic)$"](${bbox});
  nwr["shop"~"^(convenience|supermarket|mall|kiosk)$"](${bbox});
  nwr["leisure"~"^(park|sports_centre|fitness_centre|stadium|garden|pitch|gym)$"](${bbox});
  nwr["public_transport"~"^(station|stop_position)$"](${bbox});
  nwr["highway"="bus_stop"](${bbox});
  nwr["railway"="station"](${bbox});
);
out geom;
    `.trim();

    try {
      await sleep(2500);
      const res      = await fetchOverpass(query);
      const elements = res.elements ?? [];
      console.log(`   ↳ ${elements.length} raw elements`);

      const seen = new Set<string>();
      const features: any[] = [];
      const summary: Record<string, number> = {};

      for (const el of elements) {
        const tags = el.tags ?? {};
        const cat  = getCategory(tags);
        if (!cat) continue;

        const geo = extractGeometry(el);
        if (!geo) continue;

        const dist = haversine(p.lat, p.lng, geo.cLat, geo.cLng);
        if (dist > ASSIGN_M) continue;

        // Deduplicate by OSM id
        const key = `${el.type}/${el.id}`;
        if (seen.has(key)) continue;
        seen.add(key);

        // Compute height
        let height = geo.flat ? 1.0 : 10.0;
        if (!geo.flat) {
          if (tags.height) {
            const h = parseFloat(tags.height.replace(/[^0-9.]/g, ''));
            if (!isNaN(h)) height = h;
          } else if (tags['building:levels']) {
            const lvl = parseFloat(tags['building:levels']);
            if (!isNaN(lvl)) height = lvl * 3.0;
          }
        }

        features.push({
          type: 'Feature',
          properties: {
            name:        tags.name || cat,
            category:    cat,
            height:      height,
            base_height: 0,
            distance_m:  Math.round(dist),
            osm_id:      `${el.type}/${el.id}`,
          },
          geometry: { type: 'Polygon', coordinates: [geo.polygon] },
        });

        summary[cat] = (summary[cat] ?? 0) + 1;
      }

      console.log(`   ↳ ${features.length} usable amenities within ${ASSIGN_M}m`);

      cache[p.id] = { name: p.name, features, summary };

      // Save after every property so we can resume if interrupted
      fs.writeFileSync(OUT_JSON, JSON.stringify(cache, null, 2), 'utf-8');

    } catch (e: any) {
      console.error(`   ✗ Error for ${p.name}: ${e.message}`);
      // Don't save a broken entry — just continue
    }
  }

  const totalFeatures = Object.values(cache).reduce(
    (sum: number, v: any) => sum + (v.features?.length ?? 0), 0
  );
  const sizeMB = (fs.statSync(OUT_JSON).size / 1024 / 1024).toFixed(2);
  console.log(`\n✅ Done!  ${Object.keys(cache).length} properties cached, ${totalFeatures} total amenities, ${sizeMB} MB`);
}

main().catch(console.error);
