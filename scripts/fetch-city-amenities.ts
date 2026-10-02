#!/usr/bin/env node
/**
 * Fetch OpenStreetMap amenities for a city and cache them per property.
 *
 * Run:
 *   npx tsx scripts/fetch-city-amenities.ts --country=uk --city=coventry
 *   npx tsx scripts/fetch-city-amenities.ts --city=uk/coventry
 *   npx tsx scripts/fetch-city-amenities.ts --pair=coventry,uk
 *   npx tsx scripts/fetch-city-amenities.ts --pairs='[["coventry","uk"],["birmingham","us"]]'
 *   npx tsx scripts/fetch-city-amenities.ts --input=./scripts/city-pairs.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const OVERPASS_MIRRORS = [
  'https://overpass-api.de/api/interpreter',
  'https://lz4.overpass-api.de/api/interpreter',
  'https://z.overpass-api.de/api/interpreter',
  'https://overpass.openstreetmap.fr/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.openstreetmap.ru/api/interpreter',
  'https://overpass.nchc.org.tw/api/interpreter',
];
let mirrorIdx = 0;

function getArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith(prefix)) return arg.slice(prefix.length);
  }
  return undefined;
}

type CityPair = [string, string];

function getArgs() {
  const args = process.argv.slice(2);
  const pairs: CityPair[] = [];
  let pairsJson: string | undefined;
  let inputPath: string | undefined;

  for (const arg of args) {
    if (arg.startsWith('--pairs=')) {
      pairsJson = arg.slice('--pairs='.length);
      continue;
    }
    if (arg.startsWith('--pair=')) {
      const raw = arg.slice('--pair='.length);
      const parts = raw.split(',').map((p) => p.trim()).filter(Boolean);
      if (parts.length === 2) {
        pairs.push([parts[0], parts[1]]);
      }
      continue;
    }
    if (arg.startsWith('--input=')) {
      inputPath = arg.slice('--input='.length);
      continue;
    }
  }

  return { pairs, pairsJson, inputPath };
}

function normalizePair(pair: CityPair): CityPair {
  const city = String(pair[0] ?? '').trim().toLowerCase();
  const country = String(pair[1] ?? '').trim().toLowerCase();
  return [city, country];
}

function loadPairsFromJson(raw: string): CityPair[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) return [];
  const result: CityPair[] = [];
  for (const entry of parsed) {
    if (Array.isArray(entry) && entry.length >= 2) {
      result.push([String(entry[0]), String(entry[1])]);
    }
  }
  return result;
}

function parseLocationArgs(): { country: string; city: string } {
  const rawCity = (getArg('city') ?? '').trim().toLowerCase();
  const rawCountry = (getArg('country') ?? '').trim().toLowerCase();

  if (!rawCity) {
    console.error('Missing required --city argument (e.g. --city=coventry or --city=uk/coventry).');
    process.exit(1);
  }

  let country = rawCountry;
  let city = rawCity;

  if (!country && rawCity.includes('/')) {
    const parts = rawCity.split('/').filter(Boolean);
    if (parts.length >= 2) {
      country = parts[0];
      city = parts[1];
    }
  }

  if (!country) country = 'uk';

  return { country, city };
}

function resolvePairs(): CityPair[] {
  const { pairs, pairsJson, inputPath } = getArgs();
  const allPairs: CityPair[] = [...pairs];

  if (pairsJson) {
    try {
      allPairs.push(...loadPairsFromJson(pairsJson));
    } catch (e) {
      console.error('Failed to parse --pairs JSON:', e);
      process.exit(1);
    }
  }

  if (inputPath) {
    try {
      const raw = fs.readFileSync(inputPath, 'utf-8');
      allPairs.push(...loadPairsFromJson(raw));
    } catch (e) {
      console.error(`Failed to read --input file (${inputPath}):`, e);
      process.exit(1);
    }
  }

  const normalized = allPairs
    .map(normalizePair)
    .filter((p) => p[0] && p[1]);

  if (normalized.length === 0) {
    const single = parseLocationArgs();
    return [[single.city, single.country]];
  }

  const uniqueKey = new Set<string>();
  return normalized.filter((p) => {
    const key = `${p[0]}::${p[1]}`;
    if (uniqueKey.has(key)) return false;
    uniqueKey.add(key);
    return true;
  });
}

function getCategory(tags: Record<string, string>): string | null {
  const am = tags.amenity ?? '';
  const le = tags.leisure ?? '';
  const sh = tags.shop ?? '';
  const pt = tags.public_transport ?? '';
  const hw = tags.highway ?? '';
  const hf = tags.healthcare ?? '';
  const rw = tags.railway ?? '';

  if (am === 'restaurant') return 'Restaurant';
  if (am === 'cafe') return 'Cafe';
  if (am === 'bar' || am === 'pub') return 'Bar';
  if (am === 'nightclub') return 'Nightclub';
  if (sh === 'convenience' || sh === 'kiosk') return 'Convenience Store';
  if (sh === 'supermarket' || sh === 'mall') return 'Supermarket';
  if (am === 'pharmacy' || hf === 'pharmacy') return 'Pharmacy';
  if (am === 'hospital' || hf === 'hospital' || hf === 'clinic') return 'Hospital';
  if (am === 'library') return 'Library';
  if (rw === 'station' || pt === 'station') return 'Metro Station';
  if (hw === 'bus_stop' || pt === 'stop_position') return 'Bus Stop';
  if (le === 'park' || le === 'garden') return 'Park';
  if (le === 'pitch') return 'Sports Pitch';
  if (le === 'sports_centre' || le === 'stadium') return 'Sports Centre';
  if (le === 'fitness_centre' || le === 'gym') return 'Gym';
  if (am === 'university' || am === 'college') return 'University';
  if (am === 'place_of_worship') return 'Church';
  return null;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const p1 = (lat1 * Math.PI) / 180;
  const p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180;
  const dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function extractGeometry(el: any): { polygon: number[][]; cLat: number; cLng: number; flat: boolean } | null {
  if (el.type === 'node') {
    const d = 0.00005;
    const lat = el.lat;
    const lng = el.lon;
    return {
      polygon: [
        [lng - d, lat - d], [lng + d, lat - d],
        [lng + d, lat + d], [lng - d, lat + d],
        [lng - d, lat - d],
      ],
      cLat: lat,
      cLng: lng,
      flat: true,
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchOverpass(query: string, retries = 5): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const url = OVERPASS_MIRRORS[mirrorIdx % OVERPASS_MIRRORS.length];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'AcolyteLiving3DMap/1.0',
          Accept: 'application/json',
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(45_000),
      });
      if (res.ok) return await res.json();
      if (res.status === 429) {
        console.warn(`    429 rate-limited on ${url}, switching mirror + waiting 30s...`);
        mirrorIdx++;
        await sleep(30_000);
        continue;
      }
      console.warn(`    HTTP ${res.status} on ${url}, retry ${i + 1}/${retries}...`);
      mirrorIdx++;
    } catch (e: any) {
      console.warn(`    Fetch error (${e.message}), retry ${i + 1}/${retries}...`);
      mirrorIdx++;
    }
    await sleep(3000 * (i + 1));
  }
  throw new Error('Overpass unreachable after retries');
}

async function runForCity(country: string, city: string) {
  const cityDir = path.join(ROOT, 'public', 'data', country, city);
  const preferredPropertiesPath = path.join(cityDir, 'properties.json');
  const legacyPropertiesPath = path.join(ROOT, 'public', 'data', `${city}-properties.json`);
  const propertiesPath = fs.existsSync(preferredPropertiesPath)
    ? preferredPropertiesPath
    : legacyPropertiesPath;
  const outputPath = path.join(cityDir, 'amenities.json');
  fs.mkdirSync(cityDir, { recursive: true });

  if (!fs.existsSync(propertiesPath)) {
    console.error(`Missing properties file: ${propertiesPath}`);
    process.exit(1);
  }

  const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
  console.log(`\nFound ${properties.length} ${country}/${city} properties.`);

  const cache: Record<string, any> = fs.existsSync(outputPath)
    ? JSON.parse(fs.readFileSync(outputPath, 'utf-8'))
    : {};

  const todo = properties.filter((p: any) => !cache[p.id]);
  console.log(`Cached: ${properties.length - todo.length} | To fetch: ${todo.length}\n`);

  const radiusDeg = 0.003; // ~300m
  const assignMeters = 500;

  for (let i = 0; i < todo.length; i++) {
    const p = todo[i];
    const pct = (((properties.length - todo.length + i + 1) / properties.length) * 100).toFixed(1);
    console.log(`[${pct}%] ${i + 1}/${todo.length}: ${p.name} (${p.id})`);

    const bbox = `${p.lat - radiusDeg},${p.lng - radiusDeg},${p.lat + radiusDeg},${p.lng + radiusDeg}`;

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
      const res = await fetchOverpass(query);
      const elements = res.elements ?? [];
      console.log(`  -> ${elements.length} raw elements`);

      const seen = new Set<string>();
      const features: any[] = [];
      const summary: Record<string, number> = {};

      for (const el of elements) {
        const tags = el.tags ?? {};
        const cat = getCategory(tags);
        if (!cat) continue;

        const geo = extractGeometry(el);
        if (!geo) continue;

        const dist = haversine(p.lat, p.lng, geo.cLat, geo.cLng);
        if (dist > assignMeters) continue;

        const key = `${el.type}/${el.id}`;
        if (seen.has(key)) continue;
        seen.add(key);

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
            name: tags.name || cat,
            category: cat,
            height,
            base_height: 0,
            distance_m: Math.round(dist),
            osm_id: `${el.type}/${el.id}`,
          },
          geometry: { type: 'Polygon', coordinates: [geo.polygon] },
        });

        summary[cat] = (summary[cat] ?? 0) + 1;
      }

      console.log(`  -> ${features.length} usable amenities within ${assignMeters}m`);

      cache[p.id] = { name: p.name, features, summary };
      fs.writeFileSync(outputPath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (e: any) {
      console.error(`  Error for ${p.name}: ${e.message}`);
    }
  }

  const totalFeatures = Object.values(cache).reduce(
    (sum: number, v: any) => sum + (v.features?.length ?? 0), 0
  );
  const sizeMB = (fs.statSync(outputPath).size / 1024 / 1024).toFixed(2);
  console.log(`\nDone. ${Object.keys(cache).length} properties cached, ${totalFeatures} amenities, ${sizeMB} MB.`);
}

async function main() {
  const pairs = resolvePairs();
  for (const [city, country] of pairs) {
    console.log(`\n=== ${country}/${city} ===`);
    await runForCity(country, city);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
