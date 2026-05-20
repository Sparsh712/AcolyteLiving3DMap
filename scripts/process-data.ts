#!/usr/bin/env node
/**
 * Data Processing Script
 * Run with: npx tsx scripts/process-data.ts
 *
 * Converts raw city exports into compact property, amenities, and
 * building-footprint JSON files used by the 3D map.
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
  about: string | null;
  media_updated_images: string[] | null;
  media_image_paths?: string | null;
  house_url: string;
  total_floor: string;
  bed_num: string;
  supplier_name?: string;
  room_types?: string;
  near_by_location_json?: string | null;
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
  operator: string;
  floors: number;
  beds: number;
  roomTypes: string;
}

interface CityConfig {
  name: string;
  inputFile: string;
  outputProperties: string;
  outputAmenities?: string;
  outputBuildings?: string;
}

interface NearByItem {
  title?: string;
  name?: string;
  distance?: number;
  location?: {
    lat?: number;
    lng?: number;
  };
}

interface NearByGroup {
  name?: string;
  type?: string;
  items?: NearByItem[];
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
  geometry: GeoJSON.Polygon;
}

interface BuildingRecord {
  geometry: GeoJSON.Polygon;
  height: number;
  osmId: number;
  name?: string;
}

type BuildingCache = Record<string, BuildingRecord>;

const cityConfigs: CityConfig[] = [
  {
    name: 'Manchester',
    inputFile: 'Manchester All Data.json',
    outputProperties: 'manchester-properties.json',
  },
  {
    name: 'Coventry',
    inputFile: 'coventry_properties_data.json',
    outputProperties: 'coventry-properties.json',
  },
  {
    name: 'Nottingham',
    inputFile: 'nottingham_Properties_Data (1).json',
    outputProperties: 'nottingham-properties.json',
  },
];

const TYPE_TO_CATEGORY: Record<string, string | null> = {
  bus_station: 'Bus Stop',
  train_station: 'Train Station',
  tram_stop: 'Tram Stop',
  metro_station: 'Metro Station',
  subway_station: 'Metro Station',
  supermarket: 'Supermarket',
  convenience_store: 'Convenience Store',
  shopping_mall: 'Convenience Store',
  shopping_center: 'Convenience Store',
  restaurant: 'Restaurant',
  cafe: 'Cafe',
  bar: 'Bar',
  pub: 'Pub',
  nightclub: 'Nightclub',
  gym: 'Gym',
  fitness: 'Gym',
  park: 'Park',
  library: 'Library',
  pharmacy: 'Pharmacy',
  hospital: 'Hospital',
  church: 'Church',
  school: 'Library',
  bank: null,
  airport: null,
};

function parseRoomTypes(roomTypesStr?: string): string {
  if (!roomTypesStr) return '';
  try {
    const arr = JSON.parse(roomTypesStr);
    if (!Array.isArray(arr)) return '';
    return arr
      .map((item: string | Record<string, unknown>) => {
        try {
          const obj = typeof item === 'string' ? JSON.parse(item) : item;
          return typeof obj?.name === 'string' ? obj.name : '';
        } catch {
          return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  } catch {
    return '';
  }
}

function parseImagePaths(house: RawHouse): string[] {
  if (Array.isArray(house.media_updated_images) && house.media_updated_images.length > 0) {
    return house.media_updated_images.slice(0, 5);
  }

  if (!house.media_image_paths) return [];
  const raw = String(house.media_image_paths);
  const matches = raw.match(/https?:\/\/[^"}]+|image\/[^"}]+/g) ?? [];
  return matches.slice(0, 5);
}

function parseNearByLocation(raw?: string | null): NearByGroup[] {
  if (!raw) return [];
  const attempts = [raw, raw.replace(/\\"/g, '"')];

  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt) as unknown;
      return normalizeNearByParsed(parsed);
    } catch {
      continue;
    }
  }

  return [];
}

function normalizeNearByParsed(parsed: unknown): NearByGroup[] {
  if (!parsed) return [];
  if (Array.isArray(parsed)) {
    return parsed.filter((entry): entry is NearByGroup => isNearByGroup(entry));
  }

  if (typeof parsed === 'object') {
    if (isNearByGroup(parsed)) return [parsed];

    const record = parsed as Record<string, unknown>;
    const groups: NearByGroup[] = [];

    for (const value of Object.values(record)) {
      if (isNearByGroup(value)) {
        groups.push(value);
        continue;
      }
      if (typeof value === 'string') {
        try {
          const nested = JSON.parse(value);
          if (isNearByGroup(nested)) groups.push(nested);
        } catch {
          // ignore
        }
      }
    }

    for (const key of Object.keys(record)) {
      try {
        const nested = JSON.parse(key);
        if (isNearByGroup(nested)) groups.push(nested);
      } catch {
        // ignore
      }
    }

    return groups;
  }

  return [];
}

function isNearByGroup(value: unknown): value is NearByGroup {
  if (!value || typeof value !== 'object') return false;
  const record = value as Record<string, unknown>;
  return 'items' in record || 'type' in record || 'name' in record;
}

function mapNearbyCategory(group: NearByGroup): string | null {
  const type = (group.type ?? '').toLowerCase().replace(/\s+/g, '_');
  if (type in TYPE_TO_CATEGORY) return TYPE_TO_CATEGORY[type] ?? null;

  const name = (group.name ?? '').toLowerCase();
  if (name.includes('cafe')) return 'Cafe';
  if (name.includes('restaurant')) return 'Restaurant';
  if (name.includes('supermarket')) return 'Supermarket';
  if (name.includes('gym') || name.includes('fitness')) return 'Gym';
  if (name.includes('bus')) return 'Bus Stop';
  if (name.includes('train')) return 'Train Station';
  if (name.includes('park')) return 'Park';
  return null;
}

function createSquarePolygon(lat: number, lng: number, sizeMeters = 8): GeoJSON.Polygon {
  const metersPerDegLat = 111_320;
  const metersPerDegLng = 111_320 * Math.cos((lat * Math.PI) / 180);
  const dLat = (sizeMeters / 2) / metersPerDegLat;
  const dLng = (sizeMeters / 2) / metersPerDegLng;

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

function buildAmenityFeatures(groups: NearByGroup[]): AmenityFeature[] {
  const features: AmenityFeature[] = [];
  let counter = 0;

  for (const group of groups) {
    const category = mapNearbyCategory(group);
    if (!category) continue;

    const items = Array.isArray(group.items) ? group.items : [];
    for (const item of items) {
      const lat = item.location?.lat;
      const lng = item.location?.lng;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) continue;

      const name = item.title || item.name || group.name || 'Amenity';
      features.push({
        type: 'Feature',
        properties: {
          name,
          category,
          height: 6,
          base_height: 0,
          distance_m: item.distance,
          osm_id: `nearby-${counter++}`,
        },
        geometry: createSquarePolygon(lat as number, lng as number),
      });
    }
  }

  return features;
}

/**
 * Fallback rectangular footprint when no OSM polygon is available.
 * At Coventry ~52.4°N: 1 m ≈ 8.983e-6° lat, 1 m ≈ 1.49e-5° lng.
 */
function buildFallbackFootprint(lat: number, lng: number, halfM: number): GeoJSON.Polygon {
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

function estimateHeight(property: CleanProperty): number {
  if (property.floors && property.floors > 0) return property.floors * 3.5;
  if (property.price > 280) return 35;
  if (property.price > 200) return 21;
  return 14;
}

function main() {
  console.log('Reading raw JSON files...');

  const outDir = join(ROOT, 'public', 'data');
  mkdirSync(outDir, { recursive: true });

  for (const config of cityConfigs) {
    console.log(`\nProcessing ${config.name}...`);
    const rawPath = join(ROOT, config.inputFile);

    let raw: { data?: { houses?: RawHouse[] } } | null = null;
    try {
      raw = JSON.parse(readFileSync(rawPath, 'utf-8'));
    } catch (e) {
      console.error(`  Failed to read or parse ${config.inputFile}:`, e);
      continue;
    }

    const houses: RawHouse[] = raw?.data?.houses ?? [];
    console.log(`  Found ${houses.length} raw entries.`);

    const properties: CleanProperty[] = [];
    const amenities: Record<string, { name: string; features: AmenityFeature[] }> = {};
    let skipped = 0;

    for (const h of houses) {
      const lat = parseFloat(h.lat);
      const lng = parseFloat(h.lng);
      const price = parseFloat(h.rent_amount_value);

      if (isNaN(lat) || isNaN(lng) || isNaN(price)) {
        skipped++;
        continue;
      }

      const property: CleanProperty = {
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
        images: parseImagePaths(h),
        houseUrl: h.house_url || '',
        operator: h.supplier_name?.trim() || '',
        floors: parseInt(h.total_floor, 10) || 0,
        beds: parseInt(h.bed_num, 10) || 0,
        roomTypes: parseRoomTypes(h.room_types),
      };

      properties.push(property);

      if (config.outputAmenities && h.near_by_location_json) {
        const groups = parseNearByLocation(h.near_by_location_json);
        const features = buildAmenityFeatures(groups);
        if (features.length > 0) {
          amenities[property.id] = {
            name: property.name,
            features,
          };
        }
      }
    }

    console.log(`  Processed: ${properties.length} | Skipped (bad coords): ${skipped}`);

    const propertiesOut = join(outDir, config.outputProperties);
    writeFileSync(propertiesOut, JSON.stringify(properties, null, 2));
    const sizeKB = (Buffer.byteLength(JSON.stringify(properties)) / 1024).toFixed(1);
    console.log(`  Wrote ${config.outputProperties} (${sizeKB} KB)`);

    if (config.outputAmenities) {
      const amenitiesOut = join(outDir, config.outputAmenities);
      writeFileSync(amenitiesOut, JSON.stringify(amenities, null, 2));
      console.log(`  Wrote ${config.outputAmenities}`);
    }

    if (config.outputBuildings) {
      const buildingCache: BuildingCache = {};
      for (const property of properties) {
        const halfM = property.beds && property.beds > 200 ? 22 : property.beds && property.beds > 50 ? 16 : 12;
        buildingCache[property.id] = {
          geometry: buildFallbackFootprint(property.lat, property.lng, halfM),
          height: estimateHeight(property),
          osmId: 0,
          name: property.name,
        };
      }
      const buildingsOut = join(outDir, config.outputBuildings);
      writeFileSync(buildingsOut, JSON.stringify(buildingCache, null, 2));
      console.log(`  Wrote ${config.outputBuildings}`);
    }

    const unis = [...new Set(properties.map((p) => p.university).filter(Boolean))].sort();
    console.log(`  Universities (${unis.length}): ${unis.join(', ')}`);
  }
}

main();
