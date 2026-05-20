'use client';

import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap, GeoJSONSource } from 'maplibre-gl';
import { getCategoryColor } from '@/components/ui/PropertyPanel';

interface AmenityMarkersProps {
  map: MapLibreMap;
  selectedId: string | null;  // selected accommodation id
  selectedCategories: string[];
}

const SOURCE_ID = 'local-amenities-source';
const LAYER_ID  = 'local-amenities-layer';

export default function AmenityMarkers({ map, selectedId, selectedCategories }: AmenityMarkersProps) {
  const isInitialised = useRef(false);

  // ── Initialise source + layer once ──────────────────────────────────────
  useEffect(() => {
    if (isInitialised.current) return;
    isInitialised.current = true;

    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
    });

    const categories = [
      'Supermarket', 'Convenience Store', 'Restaurant', 'Cafe', 'Bar', 'Pub', 'Nightclub',
      'Bus Stop', 'Tram Stop', 'Metro Station', 'Train Station', 'Park', 'Sports Pitch', 'Gym', 'Library',
      'Pharmacy', 'Hospital', 'Church',
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchExpression: any[] = ['match', ['get', 'category']];
    categories.forEach((cat) => {
      matchExpression.push(cat);
      matchExpression.push(getCategoryColor(cat));
    });
    matchExpression.push('#94a3b8');

    map.addLayer({
      id: LAYER_ID,
      type: 'fill-extrusion',
      source: SOURCE_ID,
      paint: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'fill-extrusion-color': matchExpression as any,
        'fill-extrusion-height': ['+', ['coalesce', ['get', 'height'], 10], 0.2],
        'fill-extrusion-base':   ['+', ['coalesce', ['get', 'base_height'], 0], 0.1],
        'fill-extrusion-opacity': 0.96,
      },
    });
  }, [map]);

  // ── Fetch + show amenities when an accommodation is selected ─────────────
  useEffect(() => {
    if (!map.getSource(SOURCE_ID)) return;
    const source = map.getSource(SOURCE_ID) as GeoJSONSource;

    if (!selectedId) {
      source.setData({ type: 'FeatureCollection', features: [] });
      return;
    }

    fetch(`/api/amenities/${selectedId}`)
      .then((res) => res.json())
      .then((data) => {
        source.setData(
          data?.features
            ? { type: 'FeatureCollection', features: data.features }
            : { type: 'FeatureCollection', features: [] }
        );
      })
      .catch((err) => {
        console.error('Failed to fetch amenities for map layer:', err);
        source.setData({ type: 'FeatureCollection', features: [] });
      });
  }, [map, selectedId]);

  useEffect(() => {
    if (!map.getLayer(LAYER_ID)) return;

    if (selectedCategories.length === 0) {
      map.setFilter(LAYER_ID, null);
      return;
    }

    map.setFilter(LAYER_ID, ['in', ['get', 'category'], ['literal', selectedCategories]]);
  }, [map, selectedCategories]);

  return null;
}
