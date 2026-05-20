export interface Property {
  id: string;
  name: string;
  lat: number;
  lng: number;
  price: number;
  currency: string;
  address: string;
  university: string;
  distance: number;       // miles to nearest university
  rating: number | null;  // 0–5
  about: string;
  images: string[];       // CDN filenames from media_updated_images
  houseUrl: string;       // relative URL like "uk/manchester/detail-apartments-..."
  operator?: string;
  beds?: number;
  floors?: number;
  roomTypes?: string;
}

export interface PropertyFeature extends GeoJSON.Feature {
  geometry: GeoJSON.Point;
  properties: Omit<Property, 'lat' | 'lng'>;
}
