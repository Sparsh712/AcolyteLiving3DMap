'use client';

import { useCallback, useRef } from 'react';
import type { Map as MapLibreMap, MapMouseEvent, MapLayerMouseEvent } from 'maplibre-gl';
import type { Property } from '@/types/property';
import { findNearest } from '@/lib/data/geo';

export const CIRCLE_LAYER = 'properties-circle';
export const LABEL_LAYER  = 'properties-label';
export const SOURCE_ID    = 'properties';

interface UseMapInteractionOptions {
  onSelect: (property: Property | null) => void;
  onNearest?: (property: Property | null) => void;
  propertiesRef: React.MutableRefObject<Property[]>;
}

export function useMapInteraction({
  onSelect,
  onNearest,
  propertiesRef,
}: UseMapInteractionOptions) {
  const hoveredIdRef = useRef<string | null>(null);

  const attachHandlers = useCallback(
    (map: MapLibreMap) => {
      // ── Click → select property ──────────────────────────────────────────
      map.on('click', CIRCLE_LAYER, (e: MapLayerMouseEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e.originalEvent as any)._isMarkerHit = true;
        
        const feature = e.features?.[0];
        if (!feature) return;

        const id = feature.properties?.id as string;
        const found = propertiesRef.current.find((p) => p.id === id) ?? null;
        onSelect(found);
      });

      // ── Click canvas (not on circle) → deselect ─────────────────────────
      map.on('click', (e: MapMouseEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((e.originalEvent as any)._isMarkerHit) return;
        onSelect(null);
      });

      // ── Hover → cursor + highlight ───────────────────────────────────────
      map.on('mouseenter', CIRCLE_LAYER, (e: MapLayerMouseEvent) => {
        map.getCanvas().style.cursor = 'pointer';
        const id = e.features?.[0]?.properties?.id as string | undefined;
        if (id && id !== hoveredIdRef.current) {
          if (hoveredIdRef.current) {
            map.setFeatureState({ source: SOURCE_ID, id: hoveredIdRef.current }, { hover: false });
          }
          hoveredIdRef.current = id;
          map.setFeatureState({ source: SOURCE_ID, id }, { hover: true });
        }
      });

      map.on('mouseleave', CIRCLE_LAYER, () => {
        map.getCanvas().style.cursor = '';
        if (hoveredIdRef.current) {
          map.setFeatureState({ source: SOURCE_ID, id: hoveredIdRef.current }, { hover: false });
          hoveredIdRef.current = null;
        }
      });

      // ── Move end → update nearest ────────────────────────────────────────
      if (onNearest) {
        map.on('moveend', () => {
          const c = map.getCenter();
          const nearest = findNearest({ lat: c.lat, lng: c.lng }, propertiesRef.current);
          onNearest(nearest);
        });
      }
    },
    [onSelect, onNearest, propertiesRef]
  );

  return { attachHandlers };
}
