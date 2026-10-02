import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const CACHE_JSON = path.join(ROOT, 'public', 'data', 'london_amenities.json');
const PROPERTIES_JSON = path.join(ROOT, 'public', 'data', 'all-properties.json');

const categories = [
  'Supermarket', 'Convenience Store', 'Restaurant', 'Cafe', 'Bar', 'Pub', 'Nightclub',
  'Bus Stop', 'Tram Stop', 'Metro Station', 'Train Station', 'Park', 'Gym', 'Library',
  'Pharmacy', 'Hospital', 'Church', 'University'
];

function randomCoordinate(baseLat: number, baseLng: number, maxRadiusDeg: number) {
  const r = maxRadiusDeg * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  return [baseLat + r * Math.cos(theta), baseLng + r * Math.sin(theta)] as [number, number];
}

function main() {
  console.log('📦 Loading properties...');
  const propertiesAll = JSON.parse(fs.readFileSync(PROPERTIES_JSON, 'utf-8'));
  const londonProps = propertiesAll.filter((p: any) => p.lat < 52.5);

  const cacheOut: any = {};
  
  for (const p of londonProps) {
    const features: any[] = [];
    const summary: Record<string, number> = {};
    
    // Generate 5-15 random amenities for each building 
    const count = 5 + Math.floor(Math.random() * 10);
    
    for (let i = 0; i < count; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const [aLat, aLng] = randomCoordinate(p.lat, p.lng, 0.003); // ~300m radius
      
      const height = 5 + Math.floor(Math.random() * 15);
      const d = 0.0001; // size of the amenity building footprint

      const polygon = [
        [aLng - d, aLat - d], [aLng + d, aLat - d],
        [aLng + d, aLat + d], [aLng - d, aLat + d],
        [aLng - d, aLat - d]
      ];

      features.push({
        type: 'Feature',
        properties: {
          name: `${cat} near ${p.name.split(' ')[0]}`,
          category: cat,
          height: height,
          base_height: 0,
          distance_m: Math.floor(Math.random() * 400),
          osm_id: 'mock_' + Math.floor(Math.random() * 1000000)
        },
        geometry: {
          type: 'Polygon',
          coordinates: [polygon]
        }
      });

      summary[cat] = (summary[cat] || 0) + 1;
    }

    cacheOut[p.id] = {
      name: p.name,
      features: features,
      summary: summary
    };
  }

  fs.writeFileSync(CACHE_JSON, JSON.stringify(cacheOut, null, 2), 'utf-8');
  console.log(`✅ Generated local mock amenities for ${londonProps.length} properties!`);
}

main();
