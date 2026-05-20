'use client';

import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import type { Property } from '@/types/property';
import { propertiesToGeoJSON } from '@/lib/data/normalizer';
import { SOURCE_ID, CIRCLE_LAYER, LABEL_LAYER } from '@/hooks/useMapInteraction';

interface PropertyMarkersProps {
  map: MapLibreMap;
  properties: Property[];
  selectedId: string | null;
  nearestId: string | null;
  priceRange: [number, number];
  universityFilter: string;
  selectedUniversity: string | null;
}

/** Price → colour */
const priceColor = [
  'case',
  ['<', ['get', 'price'], 200], '#4ade80',
  ['<', ['get', 'price'], 280], '#fbbf24',
  '#f87171',
] as const;

export default function PropertyMarkers({
  map,
  properties,
  selectedId,
  nearestId,
  priceRange,
  universityFilter,
  selectedUniversity,
}: PropertyMarkersProps) {
  const isInitialised = useRef(false);

  // ── Initialise source + layers once ─────────────────────────────────────
  useEffect(() => {
    if (isInitialised.current) return;
    isInitialised.current = true;

    // Add source with empty data first, then populate once buildings are loaded
    map.addSource(SOURCE_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features: [] },
      promoteId: 'id',
    });

    propertiesToGeoJSON(properties).then((geojson) => {
      const src = map.getSource(SOURCE_ID) as import('maplibre-gl').GeoJSONSource | undefined;
      src?.setData(geojson);
    });

    // ── 3D extrusion block — colour by price tier ──────────────────────────
    map.addLayer({
      id: CIRCLE_LAYER,          // keep same ID so useMapInteraction click handler works
      type: 'fill-extrusion',
      source: SOURCE_ID,
      layout: { visibility: 'none' },  // hidden until university selected
      paint: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'fill-extrusion-color': priceColor as any,
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': 0,
        // Opaque walls prevent seeing back-faces through the front facade.
        'fill-extrusion-opacity': 1,
      },
    });

    // ── Selected / nearest highlight ring (thin extrusion on top) ──────────
    map.addLayer({
      id: 'properties-glow',
      type: 'fill-extrusion',
      source: SOURCE_ID,
      layout: { visibility: 'none' },
      paint: {
        'fill-extrusion-color': [
          'case',
          ['==', ['get', 'id'], selectedId ?? '__none__'], '#818cf8',
          '#a78bfa',
        ],
        'fill-extrusion-height': [
          'case',
          ['==', ['get', 'id'], selectedId ?? '__none__'],
          ['+', ['get', 'height'], 6],
          ['==', ['get', 'id'], nearestId ?? '__none__'],
          ['+', ['get', 'height'], 3],
          0,
        ],
        'fill-extrusion-base': [
          'case',
          ['==', ['get', 'id'], selectedId ?? '__none__'], ['get', 'height'],
          ['==', ['get', 'id'], nearestId  ?? '__none__'], ['get', 'height'],
          0,
        ],
        'fill-extrusion-opacity': 1,
      },
    });

    // ── Name label — only at very high zoom ────────────────────────────────
    map.addLayer({
      id: LABEL_LAYER,
      type: 'symbol',
      source: SOURCE_ID,
      minzoom: 16,
      layout: {
        visibility: 'none',
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-offset': [0, 0],
        'text-anchor': 'center',
        'text-max-width': 10,
        'text-allow-overlap': false,
      },
      paint: {
        'text-color': '#e8eaf0',
        'text-halo-color': 'rgba(0,0,0,0.8)',
        'text-halo-width': 1.5,
      },
    });

    // ── Price badge — mid zoom ─────────────────────────────────────────────
    map.addLayer({
      id: 'properties-price',
      type: 'symbol',
      source: SOURCE_ID,
      minzoom: 14,
      maxzoom: 16,
      layout: {
        visibility: 'none',
        'text-field': ['concat', '£', ['get', 'price']],
        'text-size': 10,
        'text-offset': [0, 0],
        'text-anchor': 'center',
      },
      paint: {
        'text-color': '#fbbf24',
        'text-halo-color': 'rgba(0,0,0,0.8)',
        'text-halo-width': 1.2,
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  // ── Refresh source data when city/property set changes ──────────────────
  useEffect(() => {
    let cancelled = false;
    propertiesToGeoJSON(properties).then((geojson) => {
      if (cancelled) return;
      const src = map.getSource(SOURCE_ID) as import('maplibre-gl').GeoJSONSource | undefined;
      src?.setData(geojson);
    });

    return () => {
      cancelled = true;
    };
  }, [map, properties]);

  // ── Show/hide layers when a university is selected or filtered ───────────
  useEffect(() => {
    const vis = (selectedUniversity || universityFilter) ? 'visible' : 'none';
    [CIRCLE_LAYER, 'properties-glow', LABEL_LAYER, 'properties-price'].forEach((id) => {
      if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', vis);
    });
  }, [map, selectedUniversity, universityFilter]);

  // ── Update glow when selection / nearest changes ─────────────────────────
  useEffect(() => {
    if (!map.getLayer('properties-glow')) return;
    const sel = selectedId  ?? '__none__';
    const nrst = nearestId ?? '__none__';

    map.setPaintProperty('properties-glow', 'fill-extrusion-color', [
      'case',
      ['==', ['get', 'id'], sel], '#818cf8',
      '#a78bfa',
    ]);
    map.setPaintProperty('properties-glow', 'fill-extrusion-height', [
      'case',
      ['==', ['get', 'id'], sel],  ['+', ['get', 'height'], 6],
      ['==', ['get', 'id'], nrst], ['+', ['get', 'height'], 3],
      0,
    ]);
    map.setPaintProperty('properties-glow', 'fill-extrusion-base', [
      'case',
      ['==', ['get', 'id'], sel],  ['get', 'height'],
      ['==', ['get', 'id'], nrst], ['get', 'height'],
      0,
    ]);
  }, [map, selectedId, nearestId]);

  // ── Apply price + university filters ────────────────────────────────────
  useEffect(() => {
    if (!map.getLayer(CIRCLE_LAYER)) return;
    const activeUni = selectedUniversity || universityFilter;
    const filter: unknown[] = ['all'];
    if (selectedUniversity) {
      filter.push(['>=', ['get', 'price'], priceRange[0]]);
      filter.push(['<=', ['get', 'price'], priceRange[1]]);
    }
    if (activeUni) filter.push(['==', ['get', 'university'], activeUni]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [CIRCLE_LAYER, LABEL_LAYER, 'properties-price', 'properties-glow'].forEach((id) => {
      if (map.getLayer(id)) map.setFilter(id, filter as any);
    });
  }, [map, priceRange, universityFilter, selectedUniversity]);

  return null;
}
