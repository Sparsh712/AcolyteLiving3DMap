'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { INITIAL_VIEW, MAP_STYLE_URL } from '@/lib/maplibre/mapConfig';

export interface MapViewHandle {
  getMap: () => MapLibreMap | null;
}

interface MapViewProps {
  onMapReady?: (map: MapLibreMap) => void;
}

const MapView = forwardRef<MapViewHandle, MapViewProps>(function MapView(
  { onMapReady },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);

  useImperativeHandle(ref, () => ({
    getMap: () => mapRef.current,
  }));

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    import('maplibre-gl').then(({ Map, NavigationControl }) => {
      const map: MapLibreMap = new Map({
        container: containerRef.current!,
        style: MAP_STYLE_URL,
        center: INITIAL_VIEW.center as [number, number],
        zoom: INITIAL_VIEW.zoom as number,
        pitch: INITIAL_VIEW.pitch as number,
        bearing: INITIAL_VIEW.bearing as number,
      });

      mapRef.current = map;

      map.addControl(new NavigationControl({ showCompass: true }), 'bottom-right');

      map.on('load', () => {

        // ── Remove default buildings (important) ──
        const layers = map.getStyle().layers;
        layers.forEach((layer) => {
          if (
            layer.type === 'fill-extrusion' ||
            layer.id.toLowerCase().includes('building')
          ) {
            try { map.removeLayer(layer.id); } catch {}
          }
        });

        // ── Fog for cinematic depth ──
        // Note: map.setFog is a Mapbox GL JS feature and is not supported in MapLibre GL JS.
        /*
        map.setFog({
          color: '#020617',
          'high-color': '#020617',
          'horizon-blend': 0.15,
          'space-color': '#000000',
          'star-intensity': 0.8,
        });
        */

        // ── Lighting ──
        if (map.setLight) {
          map.setLight({
            anchor: 'viewport',
            color: '#cbd5f5',
            intensity: 0.25,
            position: [1.5, 200, 30],
          });
        }

        // Skip cyberpunk window texture creation for bright map style

        // ── Add buildings ──
        try {
          const style = map.getStyle();
          const sources = Object.keys(style?.sources ?? {});

          const buildingSource =
            sources.find((s) =>
              ['openmaptiles', 'maptiler_planet', 'openfreemap', 'vectorTiles'].includes(s)
            ) ?? sources[0];

          if (buildingSource) {
            map.addLayer(
              {
                id: '3d-buildings',
                source: buildingSource,
                'source-layer': 'building',
                type: 'fill-extrusion',
                minzoom: 13,
                paint: {
                  'fill-extrusion-color': '#1e293b',

                  'fill-extrusion-height': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    13,
                    0,
                    13.05,
                    [
                      'coalesce',
                      ['get', 'render_height'],
                      ['get', 'height'],
                      20
                    ],
                  ],

                  'fill-extrusion-base': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],
                    13,
                    0,
                    13.05,
                    [
                      'coalesce',
                      ['get', 'render_min_height'],
                      ['get', 'min_height'],
                      0,
                    ],
                  ],

                  'fill-extrusion-opacity': 1,
                },
              },
              findFirstLabelLayer(map)
            );
          }
        } catch {}

        // ── Reduce label bleed-through on 3D facades ──
        // Some basemap symbol labels can visually appear through extrusion walls at high pitch.
        // Hide only basemap symbol layers while pitched; restore them when camera is flatter.
        const baseSymbolLayerIds = (map.getStyle()?.layers ?? [])
          .filter((layer) => layer.type === 'symbol')
          .map((layer) => layer.id)
          .filter((id) => !id.startsWith('universities-') && !id.startsWith('properties-'));

        const updateBasemapLabelsForPitch = () => {
          const hideLabels = map.getPitch() >= 45;
          for (const id of baseSymbolLayerIds) {
            if (!map.getLayer(id)) continue;
            map.setLayoutProperty(id, 'visibility', hideLabels ? 'none' : 'visible');
          }
        };

        map.on('pitch', updateBasemapLabelsForPitch);
        updateBasemapLabelsForPitch();

        onMapReady?.(map);
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    />
  );
});

export default MapView;

// Helper
function findFirstLabelLayer(map: MapLibreMap): string | undefined {
  const layers = map.getStyle()?.layers ?? [];
  for (const layer of layers) {
    if (
      layer.type === 'symbol' &&
      (layer as { layout?: { 'text-field'?: unknown } }).layout?.['text-field']
    ) {
      return layer.id;
    }
  }
  return undefined;
}