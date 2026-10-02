import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
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
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  height: number;
  osmId: number;
  name?: string;
}

interface AmenityFeature {
  type: 'Feature';
  properties: {
    name: string;
    category: string;
    height: number;
    base_height: number;
    distance_m?: number;
    osm_id: string | number;
  };
  geometry: any;
}

interface AmenityCacheItem {
  name: string;
  features: AmenityFeature[];
  summary: Record<string, number>;
}

const DATA_DIR = path.join('public', 'data');

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

  let globalTotal = 0;
  let globalMatched = 0;
  let globalContained = 0;
  let globalFallback = 0;
  
  let globalOffsetsSum = 0;
  let globalOffsetsCount = 0;

  // Global Amenity metrics
  const uniqueAmenitiesGlobal = new Map<string, { name: string; category: string }>();
  let globalPropertiesWithAmenities = 0;
  let globalAmenityReferences = 0;

  const cityReports: any[] = [];
  const outliers: any[] = [];

  for (const { country, city } of citiesList) {
    const cityDir = path.join(DATA_DIR, country, city);
    const propertiesPath = path.join(cityDir, 'properties.json');
    const buildingsPath = path.join(cityDir, 'property-buildings.json');
    const amenitiesPath = path.join(cityDir, 'amenities.json');

    if (!existsSync(propertiesPath) || !existsSync(buildingsPath)) {
      continue;
    }

    let properties: Property[] = [];
    let buildings: Record<string, Building> = {};
    let amenitiesCache: Record<string, AmenityCacheItem> = {};
    let hasAmenities = false;

    try {
      properties = JSON.parse(readFileSync(propertiesPath, 'utf-8'));
      buildings = JSON.parse(readFileSync(buildingsPath, 'utf-8'));
      
      if (existsSync(amenitiesPath)) {
        amenitiesCache = JSON.parse(readFileSync(amenitiesPath, 'utf-8'));
        hasAmenities = true;
      }
    } catch (e: any) {
      console.error(`Error reading ${country}/${city}: ${e.message}`);
      continue;
    }

    let cityTotal = properties.length;
    let cityMatched = 0;
    let cityContained = 0;
    let cityFallback = 0;
    let cityOffsetsSum = 0;
    let cityOffsetsCount = 0;

    for (const p of properties) {
      const b = buildings[p.id];
      if (!b || b.osmId === 0) {
        cityFallback++;
        globalFallback++;
        continue;
      }

      cityMatched++;
      globalMatched++;

      const ring = b.geometry.coordinates[0];
      if (ring && ring.length > 0) {
        // Check containment
        const contained = pointInPolygon(p.lat, p.lng, ring);
        if (contained) {
          cityContained++;
          globalContained++;
        }

        // Centroid distance calculation
        const cLng = ring.reduce((s, c) => s + c[0], 0) / ring.length;
        const cLat = ring.reduce((s, c) => s + c[1], 0) / ring.length;
        const dLat = (cLat - p.lat) * 111320;
        const dLng = (cLng - p.lng) * 111320 * Math.cos((p.lat * Math.PI) / 180);
        const distance = Math.sqrt(dLat * dLat + dLng * dLng);

        cityOffsetsSum += distance;
        cityOffsetsCount++;
        globalOffsetsSum += distance;
        globalOffsetsCount++;

        // Identify outliers (offset > 50 meters)
        if (distance > 50) {
          outliers.push({
            id: p.id,
            name: p.name,
            country: country.toUpperCase(),
            city: city.toUpperCase(),
            distance: parseFloat(distance.toFixed(1)),
            contained,
            address: p.address,
            coords: `(${p.lat}, ${p.lng})`,
            centroid: `(${cLat.toFixed(6)}, ${cLng.toFixed(6)})`
          });
        }
      }
    }

    // Process amenities for this city
    const uniqueAmenitiesInCity = new Map<string, { name: string; category: string }>();
    let cityPropertiesWithAmenities = 0;
    let cityAmenityReferences = 0;

    if (hasAmenities) {
      for (const propertyId of Object.keys(amenitiesCache)) {
        const item = amenitiesCache[propertyId];
        if (item && Array.isArray(item.features)) {
          cityPropertiesWithAmenities++;
          cityAmenityReferences += item.features.length;

          globalPropertiesWithAmenities++;
          globalAmenityReferences += item.features.length;

          for (const feature of item.features) {
            const osmId = feature.properties?.osm_id;
            const category = feature.properties?.category;
            const name = feature.properties?.name;
            if (osmId) {
              const key = String(osmId);
              const info = { name: name || category, category: category || 'unknown' };
              
              if (!uniqueAmenitiesInCity.has(key)) {
                uniqueAmenitiesInCity.set(key, info);
              }
              if (!uniqueAmenitiesGlobal.has(key)) {
                uniqueAmenitiesGlobal.set(key, info);
              }
            }
          }
        }
      }
    }

    const cityMatchRate = cityTotal > 0 ? (cityMatched / cityTotal) * 100 : 0;
    const cityContainmentRate = cityMatched > 0 ? (cityContained / cityMatched) * 100 : 0;
    const cityAvgOffset = cityOffsetsCount > 0 ? cityOffsetsSum / cityOffsetsCount : 0;
    const cityAvgAmenities = cityPropertiesWithAmenities > 0 ? cityAmenityReferences / cityPropertiesWithAmenities : 0;

    // Build category count for the city
    const cityCategoryCounts: Record<string, number> = {};
    for (const [_, info] of uniqueAmenitiesInCity) {
      cityCategoryCounts[info.category] = (cityCategoryCounts[info.category] ?? 0) + 1;
    }

    cityReports.push({
      country: country.toUpperCase(),
      city: city.toUpperCase(),
      total: cityTotal,
      matched: cityMatched,
      contained: cityContained,
      fallback: cityFallback,
      matchRate: parseFloat(cityMatchRate.toFixed(1)),
      containmentRate: parseFloat(cityContainmentRate.toFixed(1)),
      avgOffset: parseFloat(cityAvgOffset.toFixed(1)),
      
      // Amenities metrics
      hasAmenities,
      uniqueAmenities: uniqueAmenitiesInCity.size,
      avgAmenitiesPerProperty: parseFloat(cityAvgAmenities.toFixed(1)),
      categoryCounts: cityCategoryCounts
    });

    globalTotal += cityTotal;
  }

  // Sort city reports by match rate descending
  cityReports.sort((a, b) => b.matchRate - a.matchRate);
  // Sort outliers by offset distance descending
  outliers.sort((a, b) => b.distance - a.distance);

  const globalMatchRate = globalTotal > 0 ? (globalMatched / globalTotal) * 100 : 0;
  const globalContainmentRate = globalMatched > 0 ? (globalContained / globalMatched) * 100 : 0;
  const globalAvgOffset = globalOffsetsCount > 0 ? globalOffsetsSum / globalOffsetsCount : 0;
  const globalAvgAmenities = globalPropertiesWithAmenities > 0 ? globalAmenityReferences / globalPropertiesWithAmenities : 0;

  // Build global category counts
  const globalCategoryCounts: Record<string, number> = {};
  for (const [_, info] of uniqueAmenitiesGlobal) {
    globalCategoryCounts[info.category] = (globalCategoryCounts[info.category] ?? 0) + 1;
  }

  // Build Markdown report
  let report = `# 📊 3D Location Accuracy, Match & Amenity Coverage Report\n\n`;
  report += `This report details the geolocation accuracy of properties mapped to 3D buildings in OpenStreetMap (OSM), and quantifies the coverage and density of amenities cached for each accommodation.\n\n`;

  report += `## 🌐 Global Accuracy Summary (Properties)\n\n`;
  report += `| Metric | Value | Description |\n`;
  report += `| :--- | :--- | :--- |\n`;
  report += `| **Total Properties Mapped** | **${globalTotal}** | Total accommodations processed across all datasets |\n`;
  report += `| **OSM Footprint Match Rate** | **${globalMatchRate.toFixed(1)}%** | Properties successfully snapped to real OSM structures (${globalMatched}/${globalTotal}) |\n`;
  report += `| **Direct Containment Rate** | **${globalContainmentRate.toFixed(1)}%** | Matched markers lying directly inside their building footprints (${globalContained}/${globalMatched}) |\n`;
  report += `| **Fallback Footprint Rate** | **${(100 - globalMatchRate).toFixed(1)}%** | Properties utilizing estimated fallback boundary geometries |\n`;
  report += `| **Average Location Proximity Offset** | **${globalAvgOffset.toFixed(1)} m** | Average distance from marker pin to actual building centroid |\n\n`;

  report += `## 🏙️ Detailed City Breakdown (Properties & Accuracy)\n\n`;
  report += `| Country | City | Total | Matched | Contained | Fallbacks | Match Rate | Direct Containment | Avg Offset (m) |\n`;
  report += `| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |\n`;
  for (const r of cityReports) {
    report += `| ${r.country} | ${r.city} | ${r.total} | ${r.matched} | ${r.contained} | ${r.fallback} | ${r.matchRate}% | ${r.containmentRate}% | ${r.avgOffset} m |\n`;
  }
  report += `\n`;

  report += `## 🏪 Global Amenity Summary\n\n`;
  report += `Amenities are fetched directly from OpenStreetMap. Their locations and structural geometries are 100% accurate to OSM by definition. Below is an analysis of amenity coverage and density.\n\n`;
  report += `| Metric | Value | Description |\n`;
  report += `| :--- | :--- | :--- |\n`;
  report += `| **Total Unique Amenities Mapped** | **${uniqueAmenitiesGlobal.size}** | Unique physical amenity features cached across all cities |\n`;
  report += `| **Average Proximity Density** | **${globalAvgAmenities.toFixed(1)}** | Average number of amenities cached within walking distance of each property |\n`;
  report += `| **Total Proximity References** | **${globalAmenityReferences}** | Total associations between properties and nearby amenities |\n\n`;

  report += `### 🏷️ Global Amenity Category Distribution\n\n`;
  report += `| Category | Unique Features Count | Percentage |\n`;
  report += `| :--- | :---: | :---: |\n`;
  const sortedCategories = Object.entries(globalCategoryCounts).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sortedCategories) {
    const pct = uniqueAmenitiesGlobal.size > 0 ? (count / uniqueAmenitiesGlobal.size) * 100 : 0;
    report += `| ${cat} | ${count} | ${pct.toFixed(1)}% |\n`;
  }
  report += `\n`;

  report += `## 🏙️ Detailed City Breakdown (Amenities)\n\n`;
  report += `| Country | City | Unique Amenities | Avg Density (per Property) | Top Amenity Category |\n`;
  report += `| :--- | :--- | :---: | :---: | :--- |\n`;
  for (const r of cityReports) {
    if (!r.hasAmenities) {
      report += `| ${r.country} | ${r.city} | *No amenities cached* | *N/A* | *N/A* |\n`;
      continue;
    }
    const topCat = Object.entries(r.categoryCounts as Record<string, number>).sort((a, b) => b[1] - a[1])[0];
    const topCatStr = topCat ? `${topCat[0]} (${topCat[1]})` : 'None';
    report += `| ${r.country} | ${r.city} | ${r.uniqueAmenities} | ${r.avgAmenitiesPerProperty} | ${topCatStr} |\n`;
  }
  report += `\n`;

  report += `## ⚠️ Location Accuracy Outliers (>50 meters offset)\n\n`;
  report += `The following properties are successfully matched to an OSM building, but their geocoded coordinates have a physical distance offset of more than 50 meters from the building's centroid. These should be reviewed for coordinate accuracy.\n\n`;

  if (outliers.length === 0) {
    report += `*No severe outliers found. Excellent coordinate accuracy!*\n`;
  } else {
    report += `| Offset | Location | Property Name (ID) | Contained? | Coords vs Centroid | Address |\n`;
    report += `| :---: | :--- | :--- | :---: | :--- | :--- |\n`;
    for (const o of outliers) {
      report += `| **${o.distance} m** | ${o.country}/${o.city} | "${o.name}" (\`${o.id}\`) | ${o.contained ? '✅ Yes' : '❌ No'} | Pin: \`${o.coords}\`<br>OSM: \`${o.centroid}\` | ${o.address} |\n`;
    }
  }

  // Save outputs
  const markdownPath = 'location-accuracy-report.md';
  const jsonPath = 'location-accuracy-stats.json';

  writeFileSync(markdownPath, report, 'utf-8');
  writeFileSync(jsonPath, JSON.stringify({
    summary: {
      totalProperties: globalTotal,
      matchedToOsm: globalMatched,
      directContainment: globalContained,
      fallbackFootprints: globalFallback,
      globalMatchRate: parseFloat(globalMatchRate.toFixed(2)),
      globalContainmentRate: parseFloat(globalContainmentRate.toFixed(2)),
      globalAvgOffsetM: parseFloat(globalAvgOffset.toFixed(2)),
      
      // Amenities summary
      uniqueAmenities: uniqueAmenitiesGlobal.size,
      globalAvgAmenitiesPerProperty: parseFloat(globalAvgAmenities.toFixed(2)),
      globalAmenityReferences
    },
    cities: cityReports,
    outliers
  }, null, 2), 'utf-8');

  console.log('==================================================');
  console.log('      ACCURACY & MATCH ANALYSIS COMPLETE           ');
  console.log('==================================================');
  console.log(`  Analyzed Properties : ${globalTotal}`);
  console.log(`  OSM Match Rate      : ${globalMatchRate.toFixed(1)}%`);
  console.log(`  Direct Containment  : ${globalContainmentRate.toFixed(1)}%`);
  console.log(`  Average Offset      : ${globalAvgOffset.toFixed(1)} meters`);
  console.log('--------------------------------------------------');
  console.log(`  Unique Amenities    : ${uniqueAmenitiesGlobal.size}`);
  console.log(`  Average Density     : ${globalAvgAmenities.toFixed(1)} per property`);
  console.log('==================================================');
  console.log(`💾 Saved Markdown report to : ${markdownPath}`);
  console.log(`💾 Saved JSON stats to       : ${jsonPath}`);
}

main();
