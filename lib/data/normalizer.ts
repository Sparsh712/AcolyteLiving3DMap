import type { Property } from '@/types/property';

function parseImagePaths(raw: { media_updated_images?: string[] | null; media_image_paths?: string | null }): string[] {
  if (Array.isArray(raw.media_updated_images) && raw.media_updated_images.length > 0) {
    return raw.media_updated_images.slice(0, 5);
  }

  if (!raw.media_image_paths) return [];
  const matches = String(raw.media_image_paths).match(/https?:\/\/[^"}]+|image\/[^"}]+/g) ?? [];
  return matches.slice(0, 5);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeHouse(raw: any): Property | null {
  const lat = parseFloat(raw.lat);
  const lng = parseFloat(raw.lng);
  const price = parseFloat(raw.rent_amount_value);

  // Skip entries with invalid coordinates or price
  if (isNaN(lat) || isNaN(lng) || isNaN(price)) return null;

  return {
    id: String(raw.house_id),
    name: raw.title?.trim() || 'Unknown Property',
    lat,
    lng,
    price,
    currency: raw.rent_amount_abbr || 'GBP',
    address: raw.address?.trim() || '',
    university: raw.school_name?.trim() || '',
    distance: parseFloat(raw.school_distance) || 0,
    rating: raw.review_avg_score ? parseFloat(raw.review_avg_score) : null,
    about: raw.about?.trim() || '',
    images: parseImagePaths(raw),
    houseUrl: raw.house_url || '',
    operator: raw.supplier_name?.trim() || '',
    beds: parseInt(raw.bed_num, 10) || 0,
    floors: parseInt(raw.total_floor, 10) || 0,
    roomTypes: extractRoomTypes(raw.room_types),
  };
}

function extractRoomTypes(roomTypesStr: string | undefined): string {
  if (!roomTypesStr) return '';
  try {
    // In some properties data, room_types is a stringified array wrapped in a stringified object structure.
    // Example: "{\"{\\\"name\\\":\\\"En-suite\\\",\\\"count\\\":1,\\\"price\\\":267,\\\"lease_unit\\\":\\\"WEEK\\\",\\\"rent_amount\\\":{\\\"amount\\\":267,\\\"currency\\\":\\\"GBP\\\"}}\"}"
    // But sometimes it might be just normal JSON.
    const arr = JSON.parse(roomTypesStr);
    if (!Array.isArray(arr)) return '';
    // if elements are stringified objects, parse them
    return arr
      .map((item: string | any) => {
        try {
          const obj = typeof item === 'string' ? JSON.parse(item) : item;
          return obj.name || '';
        } catch {
          return '';
        }
      })
      .filter(Boolean)
      .join(', ');
  } catch (e) {
    return '';
  }
}

/**
 * Fallback rectangular footprint when no OSM polygon is available.
 * At Manchester ~53.5°N: 1 m ≈ 8.983e-6° lat, 1 m ≈ 1.51e-5° lng.
 */
function buildFallbackFootprint(lat: number, lng: number, halfM: number): GeoJSON.Polygon {
  const dLat = halfM * 8.983e-6;
  const dLng = halfM * 1.51e-5;
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

interface BuildingRecord {
  geometry: GeoJSON.Polygon;
  height: number;
  osmId: number;
  name?: string;
}

type BuildingCache = Record<string, BuildingRecord>;

// Approximate visual overhang so colored property extrusions fully cover base buildings.
// Tuned for typical exploration zoom levels (~15-16) to look like ~4-5 px expansion.
const PROPERTY_FOOTPRINT_BUFFER_METERS = 6;

function ringCentroid(ring: GeoJSON.Position[]): { lat: number; lng: number } {
  if (ring.length === 0) return { lat: 0, lng: 0 };
  const usable = ring.length > 1 ? ring.slice(0, -1) : ring;
  const sum = usable.reduce(
    (acc, coord) => {
      acc.lng += coord[0];
      acc.lat += coord[1];
      return acc;
    },
    { lat: 0, lng: 0 }
  );
  return {
    lng: sum.lng / usable.length,
    lat: sum.lat / usable.length,
  };
}

function inflateRingByMeters(
  ring: GeoJSON.Position[],
  center: { lat: number; lng: number },
  bufferMeters: number,
): GeoJSON.Position[] {
  const metersPerDegLat = 111_320;
  const metersPerDegLng = 111_320 * Math.cos((center.lat * Math.PI) / 180);

  const usable = ring.length > 1 ? ring.slice(0, -1) : ring;
  const inflated = usable.map(([lng, lat]) => {
    const dx = (lng - center.lng) * metersPerDegLng;
    const dy = (lat - center.lat) * metersPerDegLat;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 0.001) return [lng, lat] as GeoJSON.Position;

    const scale = (dist + bufferMeters) / dist;
    const outLng = center.lng + (dx * scale) / metersPerDegLng;
    const outLat = center.lat + (dy * scale) / metersPerDegLat;
    return [outLng, outLat] as GeoJSON.Position;
  });

  if (inflated.length > 0) {
    inflated.push(inflated[0]);
  }

  return inflated;
}

function inflatePolygonByMeters(polygon: GeoJSON.Polygon, bufferMeters: number): GeoJSON.Polygon {
  if (!polygon.coordinates.length) return polygon;

  const outer = polygon.coordinates[0];
  const center = ringCentroid(outer);

  return {
    type: 'Polygon',
    coordinates: polygon.coordinates.map((ring) => inflateRingByMeters(ring, center, bufferMeters)),
  };
}

// Lazily loaded OSM building data per city (client-safe: only used in browser via fetch)
let manchesterBuildingCache: BuildingCache | null = null;
let londonBuildingCache: BuildingCache | null = null;
let coventryBuildingCache: BuildingCache | null = null;
let nottinghamBuildingCache: BuildingCache | null = null;

function getPropertyCity(property: Property): 'Manchester' | 'London' | 'Coventry' | 'Nottingham' {
  const houseUrl = property.houseUrl?.toLowerCase() ?? '';
  if (houseUrl.includes('/nottingham/')) return 'Nottingham';
  if (houseUrl.includes('/coventry/')) return 'Coventry';
  if (houseUrl.includes('/london/')) return 'London';
  if (property.lat > 52.7 && property.lng > -2.0) return 'Nottingham';
  return property.lat > 52.5 ? 'Manchester' : 'London';
}

async function loadBuildingCache(url: string): Promise<BuildingCache> {
  try {
    const res = await fetch(url);
    if (!res.ok) return {};
    return (await res.json()) as BuildingCache;
  } catch {
    return {};
  }
}

async function getManchesterBuildingCache(): Promise<BuildingCache> {
  if (manchesterBuildingCache) return manchesterBuildingCache;
  manchesterBuildingCache = await loadBuildingCache('/data/manchester-property-buildings.json');
  return manchesterBuildingCache;
}

async function getLondonBuildingCache(): Promise<BuildingCache> {
  if (londonBuildingCache) return londonBuildingCache;
  londonBuildingCache = await loadBuildingCache('/data/london-property-buildings.json');
  return londonBuildingCache;
}

async function getCoventryBuildingCache(): Promise<BuildingCache> {
  if (coventryBuildingCache) return coventryBuildingCache;
  coventryBuildingCache = await loadBuildingCache('/data/coventry-property-buildings.json');
  return coventryBuildingCache;
}

async function getNottinghamBuildingCache(): Promise<BuildingCache> {
  if (nottinghamBuildingCache) return nottinghamBuildingCache;
  nottinghamBuildingCache = await loadBuildingCache('/data/nottingham-property-buildings.json');
  return nottinghamBuildingCache;
}

/**
 * Convert a Property[] to a GeoJSON FeatureCollection using real OSM building
 * footprints where available, falling back to a rectangular approximation.
 * Returns a Promise because it may need to fetch the buildings file.
 */
export async function propertiesToGeoJSON(
  properties: Property[],
): Promise<GeoJSON.FeatureCollection> {
  const [manchesterBuildings, londonBuildings, coventryBuildings, nottinghamBuildings] = await Promise.all([
    getManchesterBuildingCache(),
    getLondonBuildingCache(),
    getCoventryBuildingCache(),
    getNottinghamBuildingCache(),
  ]);

  const features: GeoJSON.Feature[] = properties.map((p) => {
    const city = getPropertyCity(p);
    const cityBuildings = city === 'London'
      ? londonBuildings
      : city === 'Coventry'
        ? coventryBuildings
        : city === 'Nottingham'
          ? nottinghamBuildings
          : manchesterBuildings;
    const osm = cityBuildings[p.id];

    const geometryBase: GeoJSON.Polygon = osm
      ? osm.geometry
      : buildFallbackFootprint(
          p.lat, p.lng,
          p.beds && p.beds > 200 ? 22 : p.beds && p.beds > 50 ? 16 : 12,
        );

    const geometry = inflatePolygonByMeters(geometryBase, PROPERTY_FOOTPRINT_BUFFER_METERS);

    const height = osm
      ? osm.height
      : p.floors && p.floors > 0
        ? p.floors * 3.5
        : p.price > 280 ? 35 : p.price > 200 ? 21 : 14;

    return {
      type: 'Feature',
      geometry,
      properties: {
        id: p.id,
        name: p.name,
        price: p.price,
        currency: p.currency,
        address: p.address,
        university: p.university,
        distance: p.distance,
        rating: p.rating,
        about: p.about,
        images: JSON.stringify(p.images),
        houseUrl: p.houseUrl,
        operator: p.operator,
        beds: p.beds,
        floors: p.floors,
        roomTypes: p.roomTypes,
        height,
        centLat: p.lat,
        centLng: p.lng,
      },
    };
  });

  return { type: 'FeatureCollection', features };
}
