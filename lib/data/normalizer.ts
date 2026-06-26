import type { Property } from '@/types/property';

function parseImagePaths(raw: { media_updated_images?: string[] | null; media_image_paths?: string | null }): string[] {
  if (Array.isArray(raw.media_updated_images) && raw.media_updated_images.length > 0) {
    return raw.media_updated_images.slice(0, 5);
  }

  if (!raw.media_image_paths) return [];
  const matches = String(raw.media_image_paths).match(/https?:\/\/[^"}]+|image\/[^"}]+/g) ?? [];
  return matches.map(normalizeImageRef).filter(Boolean).slice(0, 5);
}

function normalizeImageRef(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const url = new URL(trimmed);
      const parts = url.pathname.split('/').filter(Boolean);
      return parts.length > 0 ? parts[parts.length - 1] : trimmed;
    } catch {
      return trimmed;
    }
  }

  return trimmed.replace(/^\/+/, '');
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

function normalizeHouseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      return new URL(trimmed).pathname.replace(/^\/+/, '');
    } catch {
      return trimmed.replace(/^\/+/, '');
    }
  }
  return trimmed.replace(/^\/+/, '');
}

function extractCountrySlug(houseUrl: string): string | null {
  const normalized = normalizeHouseUrl(houseUrl.toLowerCase());
  const match = normalized.match(/(^|\/)(uk|us|au|de|es|fr|ca)\//);
  return match?.[2] ?? null;
}

function extractCitySlug(houseUrl: string): string | null {
  const normalized = normalizeHouseUrl(houseUrl.toLowerCase());
  if (!normalized) return null;
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length === 0) return null;

  const countryIndex = parts.findIndex((part) => part === 'uk' || part === 'us' || part === 'au' || part === 'de' || part === 'es' || part === 'fr' || part === 'ca');
  if (countryIndex >= 0 && parts[countryIndex + 1]) {
    return parts[countryIndex + 1];
  }

  return parts[0] ?? null;
}

function getPropertyCountrySlug(property: Property): string {
  const slug = extractCountrySlug(property.houseUrl ?? '');
  if (slug) return slug;

  return '';
}

function getPropertyCitySlug(property: Property): string {
  const slug = extractCitySlug(property.houseUrl ?? '');
  if (slug) return slug;

  return '';
}

// Lazily loaded OSM building data per city (client-safe: only used in browser via fetch)
const buildingCacheByKey = new Map<string, BuildingCache>();
const buildingCachePromises = new Map<string, Promise<BuildingCache>>();

async function loadBuildingCache(urls: string[]): Promise<BuildingCache> {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      return (await res.json()) as BuildingCache;
    } catch {
      continue;
    }
  }
  return {};
}

async function getBuildingCache(country: string, city: string): Promise<BuildingCache> {
  const key = `${country}/${city}`;
  if (buildingCacheByKey.has(key)) return buildingCacheByKey.get(key)!;

  const pending = buildingCachePromises.get(key);
  if (pending) return pending;

  const urls = [
    `/data/${country}/${city}/property-buildings.json`,
    `/data/${city}-property-buildings.json`,
  ];

  const promise = loadBuildingCache(urls).then((cache) => {
    buildingCacheByKey.set(key, cache);
    buildingCachePromises.delete(key);
    return cache;
  });

  buildingCachePromises.set(key, promise);
  return promise;
}

/**
 * Convert a Property[] to a GeoJSON FeatureCollection using real OSM building
 * footprints where available, falling back to a rectangular approximation.
 * Returns a Promise because it may need to fetch the buildings file.
 */
export async function propertiesToGeoJSON(
  properties: Property[],
): Promise<GeoJSON.FeatureCollection> {
  const uniqueKeys = new Map<string, { country: string; city: string }>();
  for (const property of properties) {
    const country = getPropertyCountrySlug(property);
    const city = getPropertyCitySlug(property);
    uniqueKeys.set(`${country}/${city}`, { country, city });
  }

  const keyEntries = [...uniqueKeys.entries()];
  const caches = await Promise.all(
    keyEntries.map(([, value]) => getBuildingCache(value.country, value.city))
  );
  const cacheByKey = new Map<string, BuildingCache>();
  keyEntries.forEach(([key], index) => {
    cacheByKey.set(key, caches[index]);
  });

  const features: GeoJSON.Feature[] = properties.map((p) => {
    const key = `${getPropertyCountrySlug(p)}/${getPropertyCitySlug(p)}`;
    const cityBuildings = cacheByKey.get(key) ?? {};
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
