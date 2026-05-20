'use client';

import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap, MapLayerMouseEvent } from 'maplibre-gl';
import type { Property } from '@/types/property';

export const UNI_SOURCE_ID   = 'universities-source';
export const UNI_CIRCLE_LAYER = 'universities-circle';
export const UNI_LABEL_LAYER  = 'universities-label';
export const UNI_HALO_LAYER   = 'universities-halo';

interface UniversityMarkersProps {
  map: MapLibreMap;
  properties: Property[];
  selectedUniversity: string | null;
  onSelectUniversity: (university: string, lat: number, lng: number) => void;
}

/** Compute one representative lat/lng per university (centroid of its properties) */
function buildUniversityGeoJSON(properties: Property[]): GeoJSON.FeatureCollection {
  const map: Record<string, { lat: number[]; lng: number[]; name: string }> = {};
  for (const p of properties) {
    if (!p.university) continue;
    if (!map[p.university]) map[p.university] = { lat: [], lng: [], name: p.university };
    map[p.university].lat.push(p.lat);
    map[p.university].lng.push(p.lng);
  }
  const features: GeoJSON.Feature[] = Object.entries(map).map(([uni, { lat, lng }]) => {
    const avgLat = lat.reduce((a, b) => a + b, 0) / lat.length;
    const avgLng = lng.reduce((a, b) => a + b, 0) / lng.length;
    return {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [avgLng, avgLat] },
      properties: { university: uni, count: lat.length },
    };
  });
  return { type: 'FeatureCollection', features };
}

export default function UniversityMarkers({
  map,
  properties,
  selectedUniversity,
  onSelectUniversity,
}: UniversityMarkersProps) {
  const initialised = useRef(false);

  // ── Initialise source + layers once ─────────────────────────────────────
  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;

    const geojson = buildUniversityGeoJSON(properties);

    map.addSource(UNI_SOURCE_ID, { type: 'geojson', data: geojson });

    // Outer glow / halo
    map.addLayer({
      id: UNI_HALO_LAYER,
      type: 'circle',
      source: UNI_SOURCE_ID,
      paint: {
        'circle-radius': 26,
        'circle-color': 'rgba(167,139,250,0.12)',
        'circle-stroke-width': 1.5,
        'circle-stroke-color': 'rgba(167,139,250,0.4)',
        'circle-blur': 0.5,
      },
    });

    // Inner circle
    map.addLayer({
      id: UNI_CIRCLE_LAYER,
      type: 'circle',
      source: UNI_SOURCE_ID,
      paint: {
        'circle-radius': [
          'case',
          ['==', ['get', 'university'], selectedUniversity ?? '__none__'], 18,
          14,
        ],
        'circle-color': [
          'case',
          ['==', ['get', 'university'], selectedUniversity ?? '__none__'],
          '#7c3aed',
          '#4f46e5',
        ],
        'circle-stroke-width': 2.5,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.95,
      },
    });

    // Label — always visible (university name)
    map.addLayer({
      id: UNI_LABEL_LAYER,
      type: 'symbol',
      source: UNI_SOURCE_ID,
      layout: {
        'text-field': ['get', 'university'],
        'text-size': 12,
        'text-offset': [0, 2.4],
        'text-anchor': 'top',
        'text-max-width': 12,
        'icon-allow-overlap': true,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#e8eaf0',
        'text-halo-color': 'rgba(0,0,0,0.85)',
        'text-halo-width': 2,
      },
    });

    // ── Click → select university ──────────────────────────────────────────
    map.on('click', UNI_CIRCLE_LAYER, (e: MapLayerMouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (e.originalEvent as any)._isMarkerHit = true;

      const feat = e.features?.[0];
      if (!feat) return;
      const uni = feat.properties?.university as string;
      const [lng, lat] = (feat.geometry as GeoJSON.Point).coordinates;
      onSelectUniversity(uni, lat, lng);
    });

    // Cursor changes
    map.on('mouseenter', UNI_CIRCLE_LAYER, () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', UNI_CIRCLE_LAYER, () => {
      map.getCanvas().style.cursor = '';
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, properties]);

  // ── Refresh source data when city/property set changes ──────────────────
  useEffect(() => {
    const source = map.getSource(UNI_SOURCE_ID) as import('maplibre-gl').GeoJSONSource | undefined;
    if (!source) return;
    source.setData(buildUniversityGeoJSON(properties));
  }, [map, properties]);

  // ── Filter to only selected university marker; show all when none selected ─
  useEffect(() => {
    if (!map.getLayer(UNI_CIRCLE_LAYER)) return;
    const filter = selectedUniversity
      ? ['==', ['get', 'university'], selectedUniversity]
      : ['has', 'university'];
    [UNI_HALO_LAYER, UNI_CIRCLE_LAYER, UNI_LABEL_LAYER].forEach((id) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (map.getLayer(id)) map.setFilter(id, filter as any);
    });
  }, [map, selectedUniversity]);

  return null;
}
