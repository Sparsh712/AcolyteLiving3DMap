#!/usr/bin/env node
/**
 * Fetch OpenStreetMap building polygons for a city's properties.
 *
 * Run:
 *   npx tsx scripts/fetch-city-buildings.ts --country=uk --city=coventry
 *   npx tsx scripts/fetch-city-buildings.ts --city=uk/coventry
 *   npx tsx scripts/fetch-city-buildings.ts --pair=coventry,uk
 *   npx tsx scripts/fetch-city-buildings.ts --pairs='[["coventry","uk"],["birmingham","us"]]'
 *   npx tsx scripts/fetch-city-buildings.ts --input=./scripts/city-pairs.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
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
      const raw = readFileSync(inputPath, 'utf-8');
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

interface Property {
  id: string;
  lat: number;
  lng: number;
  floors?: number;
  beds?: number;
  name?: string;
}

interface OverpassElement {
  type: string;
  id: number;
  geometry: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

interface OverpassResponse {
  elements: OverpassElement[];
}

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

function estimateHeight(p: Property, tags: Record<string, string>): number {
  const osmLevels = parseInt(tags['building:levels'] ?? '', 10);
  if (osmLevels > 0) return osmLevels * 3.5;
  if (p.floors && p.floors > 0) return p.floors * 3.5;
  if (p.beds && p.beds > 200) return 42;
  if (p.beds && p.beds > 50) return 21;
  return 14;
}

function buildFallbackFootprint(lat: number, lng: number, halfM: number): { type: 'Polygon'; coordinates: number[][][] } {
  const dLat = halfM * 8.983e-6;
  const dLng = halfM * 1.49e-5;
  return {
    type: 'Polygon',
    coordinates: [[
      [lng - dLng, lat - dLat],
      [lng + dLng, lat - dLat],
      [lng + dLng, lat + dLat],
      [lng - dLng, lat + dLat],
      [lng - dLng, lat - dLat],
    ]],
  };
}

async function runForCity(country: string, city: string) {
  const cityDir = path.join(ROOT, 'public', 'data', country, city);
  const preferredPropertiesPath = path.join(cityDir, 'properties.json');
  const legacyPropertiesPath = path.join(ROOT, 'public', 'data', `${city}-properties.json`);
  const propertiesPath = existsSync(preferredPropertiesPath)
    ? preferredPropertiesPath
    : legacyPropertiesPath;
  const outputPath = path.join(cityDir, 'property-buildings.json');
  mkdirSync(cityDir, { recursive: true });

  let properties: Property[] = [];
  try {
    properties = JSON.parse(readFileSync(propertiesPath, 'utf-8')) as Property[];
  } catch (e) {
    console.error(`Failed to read ${propertiesPath}:`, e);
    process.exit(1);
  }

  if (properties.length === 0) {
    console.error('No properties found to match.');
    process.exit(1);
  }

  const sortedLats = [...properties].map((p) => p.lat).sort((a, b) => a - b);
  const sortedLngs = [...properties].map((p) => p.lng).sort((a, b) => a - b);
  const medianLat = sortedLats[Math.floor(sortedLats.length / 2)];
  const medianLng = sortedLngs[Math.floor(sortedLngs.length / 2)];

  const filteredProperties = properties.filter((p) => {
    const dLat = Math.abs(p.lat - medianLat);
    const dLng = Math.abs(p.lng - medianLng);
    return dLat < 0.5 && dLng < 0.5;
  });

  console.log(`  Filtered outliers: using ${filteredProperties.length} of ${properties.length} properties for bounding box.`);

  const bounds = filteredProperties.reduce(
    (acc, p) => {
      acc.minLat = Math.min(acc.minLat, p.lat);
      acc.maxLat = Math.max(acc.maxLat, p.lat);
      acc.minLng = Math.min(acc.minLng, p.lng);
      acc.maxLng = Math.max(acc.maxLng, p.lng);
      return acc;
    },
    { minLat: Infinity, maxLat: -Infinity, minLng: Infinity, maxLng: -Infinity }
  );

  const chunkSize = 50;
  const allElements: OverpassElement[] = [];

  for (let i = 0; i < properties.length; i += chunkSize) {
    const chunk = properties.slice(i, i + chunkSize);
    const bboxQueries = chunk.map((p) => {
      const pad = 0.0015; // ~150m radius
      const south = p.lat - pad;
      const west = p.lng - pad;
      const north = p.lat + pad;
      const east = p.lng + pad;
      return `way["building"](${south},${west},${north},${east});`;
    });

    const query = `
[out:json][timeout:90];
(
  ${bboxQueries.join('\n  ')}
);
out geom;
`.trim();

    console.log(`Querying Overpass for ${country}/${city} buildings (chunk ${Math.floor(i / chunkSize) + 1}/${Math.ceil(properties.length / chunkSize)})...`);
    const json = await fetchOverpass(query);
    if (json && json.elements) {
      allElements.push(...json.elements);
    }
    if (i + chunkSize < properties.length) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`  Got ${allElements.length} raw building elements.`);

  type Ring = number[][];
  const buildings: { ring: Ring; tags: Record<string, string>; id: number }[] = [];
  const seenIds = new Set<number>();

  for (const el of allElements) {
    if (el.type !== 'way' || !el.geometry?.length) continue;
    if (seenIds.has(el.id)) continue;
    seenIds.add(el.id);
    const ring: Ring = el.geometry.map((n) => [n.lon, n.lat]);
    buildings.push({ ring, tags: el.tags ?? {}, id: el.id });
  }
  console.log(`  Parsed ${buildings.length} unique building polygons.`);

  const result: Record<string, {
    geometry: { type: 'Polygon'; coordinates: number[][][] };
    height: number;
    osmId: number;
    name?: string;
  }> = {};

  let matched = 0;
  let unmatched = 0;
  let fallback = 0;

  for (const p of properties) {
    let found = buildings.find((b) => pointInPolygon(p.lat, p.lng, b.ring));

    if (!found) {
      let bestDist = Infinity;
      for (const b of buildings) {
        const cLng = b.ring.reduce((s, c) => s + c[0], 0) / b.ring.length;
        const cLat = b.ring.reduce((s, c) => s + c[1], 0) / b.ring.length;
        const dLat = (cLat - p.lat) * 111320;
        const dLng = (cLng - p.lng) * 111320 * Math.cos((p.lat * Math.PI) / 180);
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        if (dist < bestDist && dist < 120) {
          bestDist = dist;
          found = b;
        }
      }
    }

    if (found) {
      result[p.id] = {
        geometry: { type: 'Polygon', coordinates: [found.ring] },
        height: estimateHeight(p, found.tags),
        osmId: found.id,
        name: found.tags.name || p.name,
      };
      matched++;
    } else {
      unmatched++;
      const halfM = p.beds && p.beds > 200 ? 22 : p.beds && p.beds > 50 ? 16 : 12;
      result[p.id] = {
        geometry: buildFallbackFootprint(p.lat, p.lng, halfM),
        height: estimateHeight(p, {}),
        osmId: 0,
        name: p.name,
      };
      fallback++;
    }
  }

  console.log(`Matched: ${matched} | Unmatched: ${unmatched} | Fallback: ${fallback}`);
  writeFileSync(outputPath, JSON.stringify(result));
  const kb = (Buffer.byteLength(JSON.stringify(result)) / 1024).toFixed(1);
  console.log(`Wrote ${outputPath} (${kb} KB)`);
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

async function fetchOverpass(query: string, retries = 4): Promise<OverpassResponse | null> {
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
        console.warn(`  429 on ${url}, switching mirror...`);
        mirrorIdx++;
        continue;
      }
      console.warn(`  HTTP ${res.status} on ${url}, retry ${i + 1}/${retries}...`);
      mirrorIdx++;
    } catch (e: any) {
      console.warn(`  Fetch error (${e.message}), retry ${i + 1}/${retries}...`);
      mirrorIdx++;
    }
  }
  return null;
}
