#!/usr/bin/env node
/**
 * Fetches real OSM building polygons for each Manchester accommodation property.
 * Queries the Overpass API for all buildings in the Manchester bbox, then does
 * point-in-polygon matching to find the exact building each property sits in.
 *
 * Run with: npx tsx scripts/fetch-property-buildings.ts
 * Output: public/data/manchester-property-buildings.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);
const ROOT       = join(__dirname, '..');

// ── Load Manchester properties ──────────────────────────────────────────────
interface Property {
  id: string; lat: number; lng: number; floors: number; beds: number;
  university: string;
}

const MANCHESTER_UNIS = new Set([
  'Manchester Metropolitan University',
  'University of Manchester',
  'Alliance Manchester Business School',
  'University of Salford',
  'The Manchester College Shena Simon Campus',
  'BPP University Manchester Campus',
  'The Manchester College - City Campus',
]);

const allProps: Property[] = JSON.parse(
  readFileSync(join(ROOT, 'public/data/manchester-properties.json'), 'utf-8')
);
const props = allProps.filter((p) => MANCHESTER_UNIS.has(p.university));
console.log(`Matching ${props.length} Manchester properties to OSM buildings…`);

// ── Overpass query — all buildings in Manchester bbox ───────────────────────
// Bbox: south, west, north, east
const S = 53.430, W = -2.310, N = 53.510, E = -2.200;
const query = `
[out:json][timeout:60];
(
  way["building"](${S},${W},${N},${E});
);
out geom;
`.trim();

// ── Point-in-polygon (ray casting) ─────────────────────────────────────────
function pointInPolygon(lat: number, lng: number, ring: number[][]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (
      (yi > lat) !== (yj > lat) &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
    ) {
      inside = !inside;
    }
  }
  return inside;
}

// ── Fetch + process ─────────────────────────────────────────────────────────
interface OverpassElement {
  type: string;
  id: number;
  geometry: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

async function main() {
  console.log('Querying Overpass API…');
  const res = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!res.ok) throw new Error(`Overpass HTTP ${res.status}`);
  const json: OverpassResponse = await res.json();
  console.log(`  Got ${json.elements.length} building ways from Overpass.`);

  // Convert Overpass ways → rings of [lng, lat]
  type Ring = number[][];
  const buildings: { ring: Ring; tags: Record<string, string>; id: number }[] = [];
  for (const el of json.elements) {
    if (el.type !== 'way' || !el.geometry?.length) continue;
    const ring: Ring = el.geometry.map((n) => [n.lon, n.lat]);
    buildings.push({ ring, tags: el.tags ?? {}, id: el.id });
  }
  console.log(`  Parsed ${buildings.length} building polygons.`);

  // ── Match each property to a building ──────────────────────────────────
  const result: Record<string, {
    geometry: { type: 'Polygon'; coordinates: number[][][] };
    height: number;
    osmId: number;
    name?: string;
  }> = {};

  let matched = 0, unmatched = 0;

  for (const p of props) {
    let found = buildings.find((b) => pointInPolygon(p.lat, p.lng, b.ring));

    if (!found) {
      // Fallback: nearest building centroid within 50 m
      let bestDist = Infinity;
      for (const b of buildings) {
        const cLng = b.ring.reduce((s, c) => s + c[0], 0) / b.ring.length;
        const cLat = b.ring.reduce((s, c) => s + c[1], 0) / b.ring.length;
        const dLat = (cLat - p.lat) * 111320;
        const dLng = (cLng - p.lng) * 111320 * Math.cos((p.lat * Math.PI) / 180);
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        if (dist < bestDist && dist < 50) {
          bestDist = dist;
          found = b;
        }
      }
    }

    if (found) {
      // Height: OSM levels > property floors > fallback
      const osmLevels = parseInt(found.tags['building:levels'] ?? '', 10);
      const height =
        osmLevels > 0   ? osmLevels * 3.5 :
        p.floors  > 0   ? p.floors  * 3.5 :
        p.beds    > 200 ? 42 :
        p.beds    > 50  ? 21 : 14;

      result[p.id] = {
        geometry: { type: 'Polygon', coordinates: [found.ring] },
        height,
        osmId: found.id,
        name: found.tags.name,
      };
      matched++;
    } else {
      unmatched++;
      console.log(`  ⚠ No building found for: ${p.id} @ (${p.lat}, ${p.lng})`);
    }
  }

  console.log(`\nMatched: ${matched}  |  Unmatched (will use fallback box): ${unmatched}`);

  const outPath = join(ROOT, 'public/data/manchester-property-buildings.json');
  writeFileSync(outPath, JSON.stringify(result));
  const kb = (Buffer.byteLength(JSON.stringify(result)) / 1024).toFixed(1);
  console.log(`✅ Written to public/data/manchester-property-buildings.json (${kb} KB)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
