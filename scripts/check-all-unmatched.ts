import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import path from 'path';

interface Property {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  university: string;
}

interface Building {
  osmId: number;
}

const DATA_DIR = path.join('public', 'data');

function scanDirectory(dir: string): { country: string; city: string }[] {
  const results: { country: string; city: string }[] = [];
  if (!existsSync(dir)) return results;

  const countries = readdirSync(dir).filter(f => statSync(path.join(dir, f)).isDirectory());
  for (const country of countries) {
    const countryDir = path.join(dir, country);
    const cities = readdirSync(countryDir).filter(f => statSync(path.join(countryDir, f)).isDirectory());
    for (const city of cities) {
      results.push({ country, city });
    }
  }
  return results;
}

function main() {
  const citiesList = scanDirectory(DATA_DIR);
  let totalPropertiesGlobal = 0;
  let totalMatchedGlobal = 0;
  let totalUnmatchedGlobal = 0;

  const unmatchedJson: Record<string, Record<string, Property[]>> = {};

  console.log('==================================================');
  console.log('   UNMATCHED PROPERTIES REPORT (ALL CITIES)       ');
  console.log('==================================================');

  for (const { country, city } of citiesList) {
    const cityDir = path.join(DATA_DIR, country, city);
    const propertiesPath = path.join(cityDir, 'properties.json');
    const buildingsPath = path.join(cityDir, 'property-buildings.json');

    if (!existsSync(propertiesPath) || !existsSync(buildingsPath)) {
      continue;
    }

    let properties: Property[] = [];
    let buildings: Record<string, Building> = {};

    try {
      properties = JSON.parse(readFileSync(propertiesPath, 'utf-8'));
      buildings = JSON.parse(readFileSync(buildingsPath, 'utf-8'));
    } catch (e: any) {
      console.error(`Error reading ${country}/${city}: ${e.message}`);
      continue;
    }

    const unmatchedList: Property[] = [];
    properties.forEach(p => {
      const b = buildings[p.id];
      if (!b || b.osmId === 0) {
        unmatchedList.push(p);
      }
    });

    const total = properties.length;
    const unmatched = unmatchedList.length;
    const matched = total - unmatched;

    totalPropertiesGlobal += total;
    totalMatchedGlobal += matched;
    totalUnmatchedGlobal += unmatched;

    if (unmatched > 0) {
      if (!unmatchedJson[country]) {
        unmatchedJson[country] = {};
      }
      unmatchedJson[country][city] = unmatchedList;

      console.log(`\n📍 ${country.toUpperCase()}/${city.toUpperCase()} (${matched}/${total} matched)`);
      unmatchedList.forEach(p => {
        console.log(`  - [ID: ${p.id}] "${p.name}"`);
        console.log(`    Coords: (${p.lat}, ${p.lng})`);
        console.log(`    Address: ${p.address}`);
        console.log(`    University: ${p.university}`);
      });
    }
  }

  // Write unmatched properties JSON output
  const outputPath = 'unmatched-properties.json';
  try {
    const fs = require('fs'); // fallback import check
    const { writeFileSync } = require('fs');
    writeFileSync(outputPath, JSON.stringify(unmatchedJson, null, 2), 'utf-8');
    console.log(`\n💾 Saved unmatched properties JSON to: ${outputPath}`);
  } catch (e: any) {
    // Already imported writeFileSync at top of file
    const fs = require('fs');
    fs.writeFileSync(outputPath, JSON.stringify(unmatchedJson, null, 2), 'utf-8');
    console.log(`\n💾 Saved unmatched properties JSON to: ${outputPath}`);
  }

  console.log('\n==================================================');
  console.log('               GLOBAL SUMMARY                     ');
  console.log('==================================================');
  console.log(`Total properties analyzed : ${totalPropertiesGlobal}`);
  console.log(`Total matched to OSM      : ${totalMatchedGlobal} (${((totalMatchedGlobal/totalPropertiesGlobal)*100).toFixed(1)}%)`);
  console.log(`Total unmatched (fallback): ${totalUnmatchedGlobal} (${((totalUnmatchedGlobal/totalPropertiesGlobal)*100).toFixed(1)}%)`);
  console.log('==================================================');
}

main();
