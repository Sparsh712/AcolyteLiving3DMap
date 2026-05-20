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
  const smoothEaseOut = useCallback((t: number) => 1 - Math.pow(1 - t, 4), []);
  const smoothEaseInOut = useCallback((t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);
  const animationTokenRef = useRef(0);

  const continueRotation = useCallback((map: MapLibreMap, token: number) => {
    if (token !== animationTokenRef.current) return;
    map.rotateTo(map.getBearing() + 24, {
      duration: 7000,
      essential: true,
      easing: (t: number) => t,
    });

    map.once('moveend', () => {
      continueRotation(map, token);
    });
  }, []);

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

        if (found) {
          const lat = (feature.properties?.centLat as number | undefined) ?? found.lat;
          const lng = (feature.properties?.centLng as number | undefined) ?? found.lng;
          const animationToken = ++animationTokenRef.current;

          map.stop();
          map.flyTo({
            center: [lng, lat],
            zoom: Math.max(map.getZoom(), 16.3),
            pitch: 66,
            bearing: map.getBearing(),
            duration: 2200,
            speed: 0.78,
            curve: 1.4,
            essential: true,
            easing: smoothEaseOut,
          });

          map.once('moveend', () => {
            if (animationToken !== animationTokenRef.current) return;

            map.easeTo({
              center: [lng, lat],
              zoom: Math.max(map.getZoom() - 0.35, 15.7),
              pitch: 64,
              duration: 1800,
              essential: true,
              easing: smoothEaseInOut,
            });

            map.once('moveend', () => {
              if (animationToken !== animationTokenRef.current) return;
              continueRotation(map, animationToken);
            });
          });
        }
      });

      // ── Click canvas (not on circle) → deselect ─────────────────────────
      map.on('click', (e: MapMouseEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((e.originalEvent as any)._isMarkerHit) return;
        animationTokenRef.current += 1;
        map.stop();
        onSelect(null);
      });

      // Any pointer click should cancel cinematic rotation until next selection.
      const onPointerDown = () => {
        animationTokenRef.current += 1;
        map.stop();
      };
      const ownerDocument = map.getContainer().ownerDocument;
      ownerDocument.addEventListener('pointerdown', onPointerDown);
      map.on('remove', () => {
        ownerDocument.removeEventListener('pointerdown', onPointerDown);
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
    [continueRotation, onSelect, onNearest, propertiesRef, smoothEaseInOut, smoothEaseOut]
  );

  return { attachHandlers };
}
