'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { Map as MapLibreMap, MapMouseEvent } from 'maplibre-gl';

import { useProperties } from '@/hooks/useProperties';
import { useMapInteraction } from '@/hooks/useMapInteraction';
import type { Property } from '@/types/property';
import { COVENTRY_CENTER, LONDON_CENTER, MANCHESTER_CENTER, NOTTINGHAM_CENTER } from '@/lib/maplibre/mapConfig';

// SSR-safe dynamic imports for anything that uses `window`
const MapView          = dynamic(() => import('@/components/map/MapView'),          { ssr: false });
const PropertyMarkers  = dynamic(() => import('@/components/map/PropertyMarkers'),  { ssr: false });
const AmenityMarkers   = dynamic(() => import('@/components/map/AmenityMarkers'),   { ssr: false });
const UniversityMarkers = dynamic(() => import('@/components/map/UniversityMarkers'), { ssr: false });

import PropertyPanel from '@/components/ui/PropertyPanel';
import FilterBar     from '@/components/ui/FilterBar';
import CustomSelect, { type SelectOption } from '@/components/ui/CustomSelect';

type CityFilter = '' | 'Manchester' | 'London' | 'Coventry' | 'Nottingham';

function getPropertyCity(property: Property): Exclude<CityFilter, ''> {
  const houseUrl = property.houseUrl?.toLowerCase() ?? '';
  if (houseUrl.includes('/nottingham/')) return 'Nottingham';
  if (houseUrl.includes('/coventry/')) return 'Coventry';
  if (houseUrl.includes('/london/')) return 'London';
  if (houseUrl.includes('/manchester/')) return 'Manchester';

  // Fallback by latitude when URL city segment is missing.
  if (property.lat > 52.7 && property.lng > -2.0) return 'Nottingham';
  return property.lat > 52.5 ? 'Manchester' : 'London';
}

export default function HomePage() {
  // ── Data ────────────────────────────────────────────────────────────────
  const { properties, loading, error } = useProperties();
  const propertiesRef = useRef<Property[]>([]);

  // ── Map instance ────────────────────────────────────────────────────────
  const [map, setMap] = useState<MapLibreMap | null>(null);
  const mapReady = useRef(false);

  // ── Selection / nearest ─────────────────────────────────────────────────
  const [selected, setSelected]             = useState<Property | null>(null);
  const [nearest,  setNearest]              = useState<Property | null>(null);
  const [selectedUniversity, setSelectedUni] = useState<string | null>(null);
  const [selectedAmenityCategories, setSelectedAmenityCategories] = useState<string[]>([]);
  const [cityFilter, setCityFilter] = useState<CityFilter>('');

  // ── Filters ─────────────────────────────────────────────────────────────
  const [priceRange, setPriceRange] = useState<[number, number]>([100, 1100]);
  const [uniFilter,  setUniFilter]  = useState('');

  const cityProperties = useMemo(() => {
    if (!cityFilter) return [];
    return properties.filter((p) => getPropertyCity(p) === cityFilter);
  }, [cityFilter, properties]);

  useEffect(() => {
    propertiesRef.current = cityProperties;
  }, [cityProperties]);

  const universities = useMemo(
    () => [...new Set(cityProperties.map((p) => p.university).filter(Boolean))].sort(),
    [cityProperties]
  );

  const selectedUniversityPriceBounds = useMemo(() => {
    if (!selectedUniversity) {
      return { min: 100, max: 1100 };
    }

    const uniPrices = cityProperties
      .filter((p) => p.university === selectedUniversity)
      .map((p) => p.price)
      .filter((price) => Number.isFinite(price));

    if (uniPrices.length === 0) {
      return { min: 100, max: 1100 };
    }

    return {
      min: Math.min(...uniPrices),
      max: Math.max(...uniPrices),
    };
  }, [cityProperties, selectedUniversity]);

  const selectedUniversityPriceStep = useMemo(() => {
    const span = selectedUniversityPriceBounds.max - selectedUniversityPriceBounds.min;
    if (span <= 120) return 5;
    if (span <= 320) return 10;
    return 25;
  }, [selectedUniversityPriceBounds.max, selectedUniversityPriceBounds.min]);

  useEffect(() => {
    if (!selectedUniversity) {
      return;
    }

    setPriceRange([
      selectedUniversityPriceBounds.min,
      selectedUniversityPriceBounds.max,
    ]);
  }, [selectedUniversity, selectedUniversityPriceBounds.max, selectedUniversityPriceBounds.min]);

  // ── Map read state ────────────────────────────────────────────────────────
  const [zoom,      setZoom]      = useState(14);
  const [bearing,   setBearing]   = useState(-10);

  const smoothEaseInOut = useCallback((t: number) => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }, []);

  const smoothEaseOut = useCallback((t: number) => {
    return 1 - Math.pow(1 - t, 4);
  }, []);

  const propertyAnimationTokenRef = useRef(0);

  const continuePropertyRotation = useCallback((token: number, step = 24, duration = 7000) => {
    if (!map) return;
    if (token !== propertyAnimationTokenRef.current) return;

    map.rotateTo(map.getBearing() + step, {
      duration,
      essential: true,
      easing: (t: number) => t,
    });

    map.once('moveend', () => {
      continuePropertyRotation(token, step, duration);
    });
  }, [map]);

  const animatePropertyShowcase = useCallback((property: Property) => {
    if (!map) return;

    const animationToken = ++propertyAnimationTokenRef.current;
    map.stop();

    map.flyTo({
      center: [property.lng, property.lat],
      zoom: 16.7,
      pitch: 66,
      bearing: map.getBearing() ?? -10,
      duration: 2200,
      speed: 0.75,
      curve: 1.45,
      essential: true,
      easing: smoothEaseOut,
    });

    map.once('moveend', () => {
      if (animationToken !== propertyAnimationTokenRef.current) return;

      map.easeTo({
        center: [property.lng, property.lat],
        zoom: 16.3,
        pitch: 64,
        duration: 1800,
        essential: true,
        easing: smoothEaseInOut,
      });

      map.once('moveend', () => {
        if (animationToken !== propertyAnimationTokenRef.current) return;
        continuePropertyRotation(animationToken);
      });
    });
  }, [continuePropertyRotation, map, smoothEaseInOut, smoothEaseOut]);

  useEffect(() => {
    if (!map) return;

    const onPointerDown = () => {
      propertyAnimationTokenRef.current += 1;
      map.stop();
    };

    map.getContainer().ownerDocument.addEventListener('pointerdown', onPointerDown);
    return () => {
      map.getContainer().ownerDocument.removeEventListener('pointerdown', onPointerDown);
    };
  }, [map]);

  useEffect(() => {
    // Reset amenity category filters when switching the selected property.
    setSelectedAmenityCategories([]);
  }, [selected?.id]);

  // ── Map ready ───────────────────────────────────────────────────────────
  const { attachHandlers } = useMapInteraction({
    onSelect: setSelected,
    onNearest: setNearest,
    propertiesRef,
  });

  const handleMapReady = useCallback(
    (m: MapLibreMap) => {
      if (mapReady.current) return;
      mapReady.current = true;
      setMap(m);

      attachHandlers(m);

      const updateStats = () => {
        setZoom(m.getZoom());
        setBearing(m.getBearing());
      };
      m.on('move', updateStats);
      updateStats();
    },
    [attachHandlers]
  );

  // ── University marker click ──────────────────────────────────────────────
  const handleSelectUniversity = useCallback(
    (university: string, lat: number, lng: number) => {
      setSelectedUni(university);
      setSelected(null);
      map?.stop();
      map?.flyTo({
        center: [lng, lat],
        zoom: 15.2,
        pitch: 60,
        bearing: -8,
        duration: 2600,
        speed: 0.7,
        curve: 1.55,
        essential: true,
        easing: smoothEaseInOut,
      });
    },
    [map, smoothEaseInOut]
  );

  const focusSelectedUniversity = useCallback(() => {
    if (!map || !selectedUniversity) return false;
    const uniProps = cityProperties.filter((p) => p.university === selectedUniversity);
    if (uniProps.length === 0) return false;

    const avgLat = uniProps.reduce((sum, p) => sum + p.lat, 0) / uniProps.length;
    const avgLng = uniProps.reduce((sum, p) => sum + p.lng, 0) / uniProps.length;

    map.stop();
    map.flyTo({
      center: [avgLng, avgLat],
      zoom: 15.2,
      pitch: 60,
      bearing: -8,
      duration: 1800,
      essential: true,
      easing: smoothEaseInOut,
    });
    return true;
  }, [cityProperties, map, selectedUniversity, smoothEaseInOut]);

  const handleCityChange = useCallback((city: CityFilter) => {
    setCityFilter(city);
    setUniFilter('');
    setSelectedUni(null);
    setSelected(null);

    if (!map) return;

    if (!city) {
      map.stop();
      map.flyTo({
        center: [0, 20],
        zoom: 1.6,
        pitch: 0,
        bearing: 0,
        duration: 1800,
        essential: true,
        easing: smoothEaseInOut,
      });
      return;
    }

    map.stop();
    const targetCenter = city === 'London'
      ? LONDON_CENTER
      : city === 'Coventry'
        ? COVENTRY_CENTER
        : city === 'Nottingham'
          ? NOTTINGHAM_CENTER
          : MANCHESTER_CENTER;
    map.flyTo({
      center: targetCenter,
      zoom: city === 'London' ? 12.8 : 13.4,
      pitch: 58,
      bearing: -30,
      duration: 1800,
      essential: true,
      easing: smoothEaseInOut,
    });
  }, [map, smoothEaseInOut]);

  const resetToCityView = useCallback(() => {
    if (!map) return;

    if (!cityFilter) {
      map.stop();
      map.flyTo({
        center: [0, 20],
        zoom: 1.6,
        pitch: 0,
        bearing: 0,
        duration: 1800,
        essential: true,
        easing: smoothEaseInOut,
      });
      return;
    }

    const targetCenter = cityFilter === 'London'
      ? LONDON_CENTER
      : cityFilter === 'Coventry'
        ? COVENTRY_CENTER
        : cityFilter === 'Nottingham'
          ? NOTTINGHAM_CENTER
          : MANCHESTER_CENTER;
    const targetZoom = cityFilter === 'London' ? 12.8 : 13.4;

    map.stop();
    map.flyTo({
      center: targetCenter,
      zoom: targetZoom,
      pitch: 58,
      bearing: -30,
      duration: 1800,
      essential: true,
      easing: smoothEaseInOut,
    });
  }, [cityFilter, map, smoothEaseInOut]);

  // Clicking the map canvas (not on a marker) deselects university
  useEffect(() => {
    if (!map) return;
    const handleCanvasClick = (e: MapMouseEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e.originalEvent as any)._isMarkerHit) {
        return;
      }
      propertyAnimationTokenRef.current += 1;
      map.stop();
      setSelected(null);
      setSelectedUni(null);
    };
    map.on('click', handleCanvasClick);
    return () => { map.off('click', handleCanvasClick); };
  }, [map]);

  // ── Visible property count (for filter bar) ─────────────────────────────
  const visibleCount = useMemo(() => {
    const activeUni = selectedUniversity || uniFilter;
    const shouldApplyPriceFilter = Boolean(selectedUniversity);
    return cityProperties.filter(
      (p) =>
        (!shouldApplyPriceFilter || (p.price >= priceRange[0] && p.price <= priceRange[1])) &&
        (!activeUni || p.university === activeUni)
    ).length;
  }, [cityProperties, priceRange, uniFilter, selectedUniversity]);

  // ── Legend ──────────────────────────────────────────────────────────────
  const legendItems = [
    { color: '#4ade80', label: '< £200' },
    { color: '#fbbf24', label: '£200–£280' },
    { color: '#f87171', label: '> £280' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', background: '#0f1117' }}>

      {/* ── Map ─────────────────────────────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <MapView onMapReady={handleMapReady} />

        {/* University markers — always visible once data loaded */}
        {map && (
          <UniversityMarkers
            map={map}
            properties={cityProperties}
            selectedUniversity={selectedUniversity}
            onSelectUniversity={handleSelectUniversity}
          />
        )}

        {/* Accommodation pins — only rendered when a university is selected */}
        {map && (
          <PropertyMarkers
            map={map}
            properties={cityProperties}
            selectedId={selected?.id ?? null}
            nearestId={nearest?.id ?? null}
            priceRange={priceRange}
            universityFilter={uniFilter}
            selectedUniversity={selectedUniversity}
          />
        )}

        {/* Amenity building highlights — only when an accommodation is selected */}
        {map && (
          <AmenityMarkers
            map={map}
            selectedId={selected?.id ?? null}
            selectedCategories={selectedAmenityCategories}
          />
        )}
      </div>

      {/* ── University breadcrumb banner ─────────────────────────────── */}
      {selectedUniversity && (() => {
        const allUniAccommodations = properties
          .filter((p) => getPropertyCity(p) === cityFilter)
          .filter((p) => p.university === selectedUniversity)
          .sort((a, b) => a.price - b.price);

        const uniAccommodations = allUniAccommodations
          .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
          .sort((a, b) => a.price - b.price);

        return (
          <div style={{
            position: 'fixed',
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 18px',
            borderRadius: 14,
            background: 'rgba(13,14,22,0.92)',
            border: '1px solid rgba(167,139,250,0.3)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 8px 40px rgba(124,58,237,0.25)',
            width: 'min(1040px, calc(100vw - 24px))',
            flexWrap: 'wrap',
            overflow: 'visible',
          }}>
            <span style={{ fontSize: 20 }}>🎓</span>
            <div style={{ minWidth: 0, flex: '1 1 260px', maxWidth: 360 }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: 14, color: '#a78bfa',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
                {selectedUniversity}
              </div>
              <div style={{ fontSize: 11, color: '#8b95a8' }}>
                {uniAccommodations.length}/{allUniAccommodations.length} shown
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

            {/* Price filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <label style={{ fontSize: 12, color: '#8b95a8', whiteSpace: 'nowrap' }}>
                £{priceRange[0]}–£{priceRange[1]}/wk
              </label>
              <input
                type="range"
                min={selectedUniversityPriceBounds.min}
                max={selectedUniversityPriceBounds.max}
                step={selectedUniversityPriceStep}
                value={priceRange[0]}
                onChange={(e) => {
                  const nextMin = +e.target.value;
                  setPriceRange([Math.min(nextMin, priceRange[1]), priceRange[1]]);
                }}
                style={{ width: 72, accentColor: '#7c3aed', cursor: 'pointer' }}
                aria-label="Minimum price"
                disabled={selectedUniversityPriceBounds.min === selectedUniversityPriceBounds.max}
              />
              <input
                type="range"
                min={selectedUniversityPriceBounds.min}
                max={selectedUniversityPriceBounds.max}
                step={selectedUniversityPriceStep}
                value={priceRange[1]}
                onChange={(e) => {
                  const nextMax = +e.target.value;
                  setPriceRange([priceRange[0], Math.max(nextMax, priceRange[0])]);
                }}
                style={{ width: 72, accentColor: '#7c3aed', cursor: 'pointer' }}
                aria-label="Maximum price"
                disabled={selectedUniversityPriceBounds.min === selectedUniversityPriceBounds.max}
              />
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 32, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

            {/* Accommodation picker — price-coloured dots */}
            <div style={{ minWidth: 0, flex: '1 1 220px', maxWidth: 320 }}>
              <CustomSelect
                id="accommodation-picker"
                options={uniAccommodations.map((p): SelectOption => ({
                  value: p.id,
                  label: p.name,
                  sublabel: `£${p.price}/wk · ${p.beds} bed${p.beds !== 1 ? 's' : ''}`,
                  accent: p.price < 200 ? '#4ade80' : p.price < 280 ? '#fbbf24' : '#f87171',
                }))}
                value={selected?.id ?? ''}
                onChange={(id) => {
                  if (!id) {
                    if (selected) {
                      setSelected(null);
                      focusSelectedUniversity();
                      return;
                    }

                    setSelected(null);
                    setSelectedUni(null);
                    resetToCityView();
                    return;
                  }
                  const prop = uniAccommodations.find((p) => p.id === id);
                  if (!prop) return;
                  setSelected(prop);
                  animatePropertyShowcase(prop);
                }}
                placeholder="Pick an accommodation…"
                minWidth={140}
                maxWidth={320}
                openDirection="down"
              />
            </div>

            <button
              onClick={() => {
                if (selected) {
                  setSelected(null);
                  focusSelectedUniversity();
                  return;
                }

                setSelectedUni(null);
                setSelected(null);
                resetToCityView();
              }}
              aria-label="Clear university selection"
              style={{
                marginLeft: 4,
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: '#8b95a8', fontSize: 14, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >✕</button>
          </div>
        );
      })()}

      {/* ── Filter Bar (top centre — only when no university selected) ── */}
      {!loading && !selectedUniversity && (
        <FilterBar
          cityFilter={cityFilter}
          onCityChange={handleCityChange}
          universityFilter={uniFilter}
          onUniversityChange={(uni) => {
            if (!uni) { setUniFilter(''); return; }
            const uniProps = cityProperties.filter((p) => p.university === uni);
            if (uniProps.length > 0) {
              const avgLat = uniProps.reduce((s, p) => s + p.lat, 0) / uniProps.length;
              const avgLng = uniProps.reduce((s, p) => s + p.lng, 0) / uniProps.length;
              handleSelectUniversity(uni, avgLat, avgLng);
            }
          }}
          universities={universities}
        />
      )}

      {/* ── Property Panel (right slide-in) ─────────────────────────── */}
      <PropertyPanel
        property={selected}
        selectedAmenityCategories={selectedAmenityCategories}
        onAmenityFilterChange={setSelectedAmenityCategories}
        onClose={() => setSelected(null)}
      />

      {/* ── Loading overlay ─────────────────────────────────────────── */}
      {loading && (
        <div style={overlayStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: 'fly-bounce 1s ease-in-out infinite', display: 'inline-block' }}>✈</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 22, color: '#e8eaf0', marginBottom: 8 }}>
              Student Housing Explorer
            </div>
            <div style={{ fontSize: 14, color: '#8b95a8' }}>Loading properties…</div>
          </div>
        </div>
      )}

      {/* ── Error overlay ───────────────────────────────────────────── */}
      {error && (
        <div style={overlayStyle}>
          <div style={{ textAlign: 'center', color: '#f87171' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚠️</div>
            <div>Failed to load properties</div>
            <div style={{ fontSize: 12, marginTop: 8, color: '#8b95a8' }}>{error}</div>
          </div>
        </div>
      )}

      {/* ── Price legend (bottom-right) ──────────────────────────────── */}
      {selectedUniversity && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          right: 16,
          zIndex: 100,
          padding: '8px 12px',
          borderRadius: 10,
          background: 'rgba(13,14,22,0.8)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 5,
        }}>
          <div style={{ fontSize: 10, color: '#8b95a8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
            Price / week
          </div>
          {legendItems.map((item) => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#b0b8c8' }}>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(10,11,18,0.92)',
  zIndex: 500,
  backdropFilter: 'blur(8px)',
};
