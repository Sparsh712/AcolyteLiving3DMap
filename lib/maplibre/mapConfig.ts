import type { CameraOptions, FitBoundsOptions } from 'maplibre-gl';


export const INITIAL_VIEW: CameraOptions & Pick<FitBoundsOptions, 'padding'> = {
  center: [0, 20],
  zoom: 1.6,
  pitch: 0,
  bearing: 0,
};

// Free styles — in priority order:
// 1. MapTiler (best quality, needs free API key in .env.local → NEXT_PUBLIC_MAPTILER_KEY)
// 2. Fallback: OSM-Bright via MapLibre's public tiles (no key required)
export const MAP_STYLE_URL =
  process.env.NEXT_PUBLIC_MAPTILER_KEY
    ? `https://api.maptiler.com/maps/basic-v2-dark/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
    : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

export const IMAGE_CDN_BASE = 'https://cdn.acolyteliving.com/images';
// Size variants are no longer path-based on the new CDN; all images use the same URL
export const IMAGE_SIZE = {
  thumb: '',
  full: '',
} as const;

function extractFilenameFromUrl(raw: string): string | null {
  try {
    const url = new URL(raw);
    const parts = url.pathname.split('/').filter(Boolean);
    return parts.length > 0 ? parts[parts.length - 1] : null;
  } catch {
    return null;
  }
}

export function getImageUrl(filename: string, _size?: keyof typeof IMAGE_SIZE): string {
  if (!filename) return '';

  if (/^https?:\/\//i.test(filename)) {
    const extracted = extractFilenameFromUrl(filename);
    if (extracted) return `${IMAGE_CDN_BASE}/${extracted}`;
    return filename;
  }

  const cleanPath = filename.replace(/^\/+/, '');

  // If the path already has a folder structure like "image/..." or "images/...",
  // serve it directly from the CDN root domain.
  if (cleanPath.startsWith('image/') || cleanPath.startsWith('images/')) {
    return `https://cdn.acolyteliving.com/${cleanPath}`;
  }

  // Fallback for flat filenames
  return `${IMAGE_CDN_BASE}/${cleanPath}`;
}
