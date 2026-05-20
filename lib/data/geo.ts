import type { Property } from '@/types/property';

interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Haversine formula — returns distance in km between two lat/lng points.
 */
export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const x =
    sinLat * sinLat +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Returns the nearest property to a given lat/lng point.
 */
export function findNearest(point: LatLng, properties: Property[]): Property | null {
  if (properties.length === 0) return null;
  let nearest = properties[0];
  let minDist = haversineKm(point, nearest);
  for (let i = 1; i < properties.length; i++) {
    const d = haversineKm(point, properties[i]);
    if (d < minDist) {
      minDist = d;
      nearest = properties[i];
    }
  }
  return nearest;
}

/**
 * Returns properties within `radiusKm` km of a point.
 */
export function propertiesWithinRadius(
  point: LatLng,
  properties: Property[],
  radiusKm: number
): Property[] {
  return properties.filter((p) => haversineKm(point, p) <= radiusKm);
}
