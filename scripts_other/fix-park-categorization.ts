#!/usr/bin/env node
/**
 * fix-park-categorization.ts
 *
 * Fixes the inflated "Park" count in manchester_amenities.json and london_amenities.json.
 *
 * Problem:
 *   - leisure=pitch (individual sports pitches) were categorised as "Park"
 *   - Unnamed pitches all fell back to name="Parks", creating dozens of duplicates
 *
 * Fix:
 *   - Any feature whose name is exactly "Parks" (the category fallback) AND whose
 *     osm_id suggests it is a small pitch node gets reclassified as "Sports Pitch"
 *   - More precisely: we look at the geometry area — tiny polygons (< ~50m radius) 
 *     that are named "Parks" are almost certainly pitches, not parks
 *   - Named parks (Cathedral Gardens, Angel Meadow, etc.) are kept as-is
 *   - Recalculate summary counts after reclassification
 *
 * Run:  npx tsx scripts/fix-park-categorization.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT       = path.join(__dirname, '..');

const FILES = [
  path.join(ROOT, 'public', 'data', 'manchester_amenities.json'),
  path.join(ROOT, 'public', 'data', 'london_amenities.json'),
];

// If a "Park" feature has this fallback name it almost certainly is NOT a real park
const FALLBACK_PARK_NAME = 'Parks';

/**
 * Approximate bounding-box diagonal in metres for a polygon.
 * We use this as a rough proxy for feature area.
 */
function bboxDiagonalMetres(coords: number[][]): number {
  if (!coords || coords.length < 2) return 0;
  const lons = coords.map(c => c[0]);
  const lats = coords.map(c => c[1]);
  const minLon = Math.min(...lons), maxLon = Math.max(...lons);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  // Rough conversion at ~53°N: 1° lat ≈ 111km, 1° lon ≈ 66km
  const dLat = (maxLat - minLat) * 111_000;
  const dLon = (maxLon - minLon) * 66_000;
  return Math.sqrt(dLat * dLat + dLon * dLon);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.log(`  ⚠️  Not found, skipping: ${filePath}`);
    return;
  }

  console.log(`\n📂 Processing ${path.basename(filePath)}…`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  let reclassified = 0;
  let propertiesFixed = 0;

  for (const [propId, entry] of Object.entries(data)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features: any[] = entry.features ?? [];
    let changed = false;

    for (const feature of features) {
      const props = feature.properties ?? {};
      if (props.category !== 'Park') continue;
      if (props.name !== FALLBACK_PARK_NAME) continue; // Keep named parks (Cathedral Gardens etc.)

      // Check geometry size — real parks tend to be large polygons
      const coords: number[][] = feature.geometry?.coordinates?.[0] ?? [];
      const diagonal = bboxDiagonalMetres(coords);

      // If the bounding box is tiny (< 80m diagonal) it's almost certainly a pitch node/way
      // Real parks are typically > 100m across
      if (diagonal < 80) {
        props.category = 'Sports Pitch';
        props.name     = 'Sports Pitch';
        reclassified++;
        changed = true;
      } else {
        // Large unnamed green space — rename to "Green Space" to be honest
        props.name = 'Green Space';
        changed = true;
      }
    }

    if (changed) {
      // Recalculate summary
      const summary: Record<string, number> = {};
      for (const feature of features) {
        const cat = feature.properties?.category;
        if (cat) summary[cat] = (summary[cat] ?? 0) + 1;
      }
      entry.summary = summary;
      propertiesFixed++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  const sizeMB = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);
  console.log(`  ✅ ${propertiesFixed} properties updated, ${reclassified} features reclassified → Sports Pitch`);
  console.log(`  📦 File size: ${sizeMB} MB`);
}

// ── Show before/after for a sample property ──────────────────────────────────
function showSample(filePath: string, name: string) {
  if (!fs.existsSync(filePath)) return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any> = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  for (const entry of Object.values(data)) {
    if (entry.name?.toLowerCase().includes(name.toLowerCase())) {
      console.log(`\n  Sample — ${entry.name} summary after fix:`);
      console.log('  ', JSON.stringify(entry.summary));
      return;
    }
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
for (const file of FILES) {
  fixFile(file);
}

// Show Ashton House after fix
showSample(FILES[0], 'ashton house');

console.log('\n🎉 Done. Deploy to Vercel to see updated counts.');
