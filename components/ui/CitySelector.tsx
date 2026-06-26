'use client';

import type { Map as MapLibreMap } from 'maplibre-gl';

export type City = 'Manchester';

const MANCHESTER_CENTER: [number, number] = [-2.2426, 53.4808];

interface CitySelectorProps {
  map: MapLibreMap | null;
  activeCity: City;
  onCityChange: (city: City) => void;
}

const CITY_VIEWS: Record<City, { center: [number, number]; zoom: number; pitch: number; bearing: number }> = {
  Manchester: { center: MANCHESTER_CENTER, zoom: 14,   pitch: 55, bearing: -10 },
};

export default function CitySelector({ map, activeCity, onCityChange }: CitySelectorProps) {
  const handleSelect = (city: City) => {
    if ((city as string) === (activeCity as string)) return;
    onCityChange(city);
    if (map) {
      const view = CITY_VIEWS[city];
      map.flyTo({
        center: view.center,
        zoom: view.zoom,
        pitch: view.pitch,
        bearing: view.bearing,
        duration: 2200,
        essential: true,
      });
    }
  };

  const cities: City[] = ['Manchester'];

  return (
    <div
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 200,
        display: 'flex',
        background: 'rgba(13,14,22,0.88)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 12,
        backdropFilter: 'blur(14px)',
        padding: 4,
        gap: 4,
        boxShadow: '0 4px 24px rgba(0,0,0,0.45)',
      }}
    >
      {cities.map((city) => {
        const active = city === activeCity;
        return (
          <button
            key={city}
            onClick={() => handleSelect(city)}
            style={{
              padding: '7px 20px',
              borderRadius: 9,
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.03em',
              transition: 'all 0.2s ease',
              background: active
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : 'transparent',
              color: active ? '#ffffff' : '#8b95a8',
              boxShadow: active ? '0 2px 12px rgba(99,102,241,0.45)' : 'none',
            }}
          >
            {city}
          </button>
        );
      })}
    </div>
  );
}
