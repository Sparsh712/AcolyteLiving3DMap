#!/usr/bin/env node
/**
 * Data Processing Script
 * Run with: npx tsx scripts/process-data.ts
 *
 * Reads the raw 20MB Manchester All Data.json and extracts a lean
 * manifest of ~50KB to public/data/manchester-properties.json.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

interface RawHouse {
  house_id: string;
  title: string;
  lat: string;
  lng: string;
  rent_amount_value: string;
  rent_amount_abbr: string;
  address: string;
  school_name: string;
  school_distance: string;
  review_avg_score: string | null;
  about: string;
  media_updated_images: string[] | null;
  house_url: string;
  total_floor: string;
  bed_num: string;
}

interface CleanProperty {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  currency: string;
  address: string;
  university: string;
  distance: number;
  rating: number | null;
  about: string;
  images: string[];
  houseUrl: string;
  floors: number;
  beds: number;
}

function main() {
  console.log('📦 Reading raw JSON files...');
  
  const filesToProcess = ['Manchester All Data.json'];
  const properties: CleanProperty[] = [];
  let totalSkipped = 0;

  for (const file of filesToProcess) {
    console.log(`\nProcessing ${file}...`);
    const rawPath = join(ROOT, file);
    
    try {
      const raw = JSON.parse(readFileSync(rawPath, 'utf-8'));
      const houses: RawHouse[] = raw?.data?.houses ?? [];
      console.log(`   Found ${houses.length} raw entries in ${file}.`);

      let skipped = 0;

      for (const h of houses) {
        const lat = parseFloat(h.lat);
        const lng = parseFloat(h.lng);
        const price = parseFloat(h.rent_amount_value);

        if (isNaN(lat) || isNaN(lng) || isNaN(price)) {
          skipped++;
          continue;
        }

        properties.push({
          id: String(h.house_id),
          name: h.title?.trim() || 'Unknown Property',
          lat,
          lng,
          price,
          currency: h.rent_amount_abbr || 'GBP',
          address: h.address?.trim() || '',
          university: h.school_name?.trim() || '',
          distance: parseFloat(h.school_distance) || 0,
          rating: h.review_avg_score ? parseFloat(h.review_avg_score) : null,
          about: h.about?.trim() || '',
          images: Array.isArray(h.media_updated_images)
            ? h.media_updated_images.slice(0, 5)
            : [],
          houseUrl: h.house_url || '',
          floors: parseInt(h.total_floor, 10) || 0,
          beds: parseInt(h.bed_num, 10) || 0,
        });
      }

      console.log(`   Processed: ${houses.length - skipped} | Skipped (bad coords): ${skipped}`);
      totalSkipped += skipped;
    } catch (e) {
      console.error(`   Failed to read or parse ${file}:`, e);
    }
  }

  console.log(`\n=========================================`);
  console.log(`📦 Final Data Export`);

  const outDir = join(ROOT, 'public', 'data');
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, 'manchester-properties.json');
  writeFileSync(outPath, JSON.stringify(properties, null, 2));

  const sizeMB = (Buffer.byteLength(JSON.stringify(properties)) / 1024).toFixed(1);
  console.log(`✅ Written to public/data/manchester-properties.json (${sizeMB} KB)`);

  // Print a price summary
  if (properties.length > 0) {
    const prices = properties.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
    console.log(`   Price range: £${min}–£${max}/wk | Avg: £${avg}/wk`);
  }

  // List unique universities
  const unis = [...new Set(properties.map((p) => p.university).filter(Boolean))];
  console.log(`   Universities (${unis.length}):`);
  unis.forEach((u) => console.log(`     • ${u}`));
}

main();
