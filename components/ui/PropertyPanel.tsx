'use client';

import { useEffect, useRef, useState } from 'react';
import type { Property } from '@/types/property';
import { getImageUrl } from '@/lib/maplibre/mapConfig';

interface PropertyPanelProps {
  property: Property | null;
  selectedAmenityCategories: string[];
  onAmenityFilterChange: (categories: string[]) => void;
  onClose: () => void;
}

export default function PropertyPanel({
  property,
  selectedAmenityCategories,
  onAmenityFilterChange,
  onClose,
}: PropertyPanelProps) {
  const [imgIdx, setImgIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const [amenitiesLoading, setAmenitiesLoading] = useState(false);
  const [amenitiesSummary, setAmenitiesSummary] = useState<Record<string, number> | null>(null);
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (property) {
      if (prevId.current !== property.id) {
        setImgIdx(0);
        setAmenitiesSummary(null);
        setAmenitiesLoading(true);

        fetch(`/api/amenities/${property.id}`)
          .then(res => res.json())
          .then(data => {
            if (data.summary && Object.keys(data.summary).length > 0) {
              setAmenitiesSummary(data.summary);
            } else {
              setAmenitiesSummary(null);
            }
          })
          .catch(() => setAmenitiesSummary(null))
          .finally(() => setAmenitiesLoading(false));
      }
      setVisible(true);
      prevId.current = property.id;
    } else {
      setVisible(false);
    }
  }, [property]);

  const p = property;
  // Map image filenames through the CDN helper (already full URLs are passed through unchanged)
  const images = p?.images?.map((f) => getImageUrl(f, 'full')) ?? [];

  const stars = p?.rating ? Math.round(p.rating) : 0;
  const listingUrl = p ? buildListingUrl(p) : '';

  return (
    <div
      id="property-panel"
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: 'var(--panel-width)',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
        transform: visible ? 'translateX(0)' : 'translateX(105%)',
        background: 'rgba(13,14,22,0.96)',
        borderLeft: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.5)',
        overflowY: 'auto',
      }}
      aria-label="Property details"
    >
      {p && (
        <>
          {/* ── Image Carousel ──────────────────────────────── */}
          <div style={{ position: 'relative', height: 220, flexShrink: 0, background: '#111' }}>
            {images.length > 0 ? (
              <img
                key={images[imgIdx]}
                src={images[imgIdx]}
                alt={p.name}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.25s ease' }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  const nextIdx = imgIdx + 1;
                  if (nextIdx < images.length) {
                    setImgIdx(nextIdx);
                  } else if (!target.src.includes('window.svg')) {
                    target.src = '/window.svg';
                  }
                }}
              />
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', color: 'rgba(255,255,255,0.2)', fontSize: 14,
              }}>
                No image available
              </div>
            )}

            {/* Carousel dots */}
            {images.length > 1 && (
              <div style={{ position: 'absolute', bottom: 10, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 6 }}>
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    aria-label={`Image ${i + 1}`}
                    style={{
                      width: i === imgIdx ? 20 : 6, height: 6, borderRadius: 3,
                      background: i === imgIdx ? '#a78bfa' : 'rgba(255,255,255,0.4)',
                      border: 'none', cursor: 'pointer',
                      transition: 'width 0.2s ease, background 0.2s ease',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Prev/next arrows */}
            {images.length > 1 && (
              <>
                <button onClick={() => setImgIdx((imgIdx - 1 + images.length) % images.length)}
                  aria-label="Previous image"
                  style={arrowBtnStyle('left')}>‹</button>
                <button onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                  aria-label="Next image"
                  style={arrowBtnStyle('right')}>›</button>
              </>
            )}

            {/* Close button */}
            <button
              id="panel-close"
              onClick={onClose}
              aria-label="Close panel"
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff', fontSize: 16, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* ── Content ─────────────────────────────────────── */}
          <div style={{ padding: '20px 20px 32px', display: 'flex', flexDirection: 'column', gap: 16, flex: 1 }}>

            {/* Price badge + rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                background: priceGradient(p.price),
                color: '#fff', fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: 18, padding: '4px 14px',
                borderRadius: 20, letterSpacing: '-0.3px',
              }}>
                £{p.price}<span style={{ fontSize: 12, opacity: 0.8 }}>/wk</span>
              </span>
              {p.rating && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: 13 }}>
                  {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                  <span style={{ color: '#8b95a8', marginLeft: 4 }}>{p.rating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Name */}
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20, lineHeight: 1.2, color: '#e8eaf0' }}>
              {p.name}
            </h2>

            {/* University pill */}
            {p.university && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>🎓</span>
                <div>
                  <div style={{ fontSize: 12, color: '#8b95a8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>University</div>
                  <div style={{ fontSize: 13, color: '#a78bfa', fontWeight: 500 }}>{p.university}</div>
                  <div style={{ fontSize: 12, color: '#8b95a8' }}>{p.distance} miles away</div>
                </div>
              </div>
            )}

            {/* Address */}
            {p.address && (
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, marginTop: 1 }}>📍</span>
                <span style={{ fontSize: 13, color: '#8b95a8', lineHeight: 1.5 }}>{p.address}</span>
              </div>
            )}

            {/* Property Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: 'rgba(255,255,255,0.04)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
              {p.operator && <div><div style={detailLabelStyle}>Operator</div><div style={detailValueStyle}>{p.operator}</div></div>}
              {p.roomTypes && <div><div style={detailLabelStyle}>Room Types</div><div style={detailValueStyle}>{p.roomTypes}</div></div>}
              {p.beds !== undefined && p.beds > 0 && <div><div style={detailLabelStyle}>Beds</div><div style={detailValueStyle}>{p.beds}</div></div>}
              {p.floors !== undefined && p.floors > 0 && <div><div style={detailLabelStyle}>Floors</div><div style={detailValueStyle}>{p.floors}</div></div>}
            </div>

            {/* Divider */}
            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />

            {/* About */}
            {p.about && (
              <div>
                <div style={{ fontSize: 12, color: '#8b95a8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>About</div>
                <p style={{ fontSize: 13, color: '#b0b8c8', lineHeight: 1.7, maxHeight: 140, overflowY: 'auto', paddingRight: 4 }}>
                  {p.about}
                </p>
              </div>
            )}

            {/* Amenities Section */}
            <div>
              <div style={{ fontSize: 12, color: '#8b95a8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Nearby Amenities (1km)</div>
              {amenitiesLoading ? (
                <div style={{ fontSize: 13, color: '#8b95a8', fontStyle: 'italic' }}>Loading amenities...</div>
              ) : amenitiesSummary ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 180, overflowY: 'auto', paddingRight: 4 }}>
                  <button
                    type="button"
                    onClick={() => onAmenityFilterChange([])}
                    style={{
                      background: selectedAmenityCategories.length === 0 ? 'rgba(148,163,184,0.28)' : 'rgba(148,163,184,0.12)',
                      border: `1px solid ${selectedAmenityCategories.length === 0 ? 'rgba(148,163,184,0.8)' : 'rgba(148,163,184,0.4)'}`,
                      color: '#e8eaf0',
                      padding: '4px 12px',
                      borderRadius: 16,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                    aria-pressed={selectedAmenityCategories.length === 0}
                    title="Show all amenities"
                  >
                    All
                  </button>
                  {Object.entries(amenitiesSummary).sort((a, b) => b[1] - a[1]).map(([category, count]) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        const hasActiveFilter = selectedAmenityCategories.length > 0;
                        const isSelected = !hasActiveFilter || selectedAmenityCategories.includes(category);

                        if (!hasActiveFilter) {
                          onAmenityFilterChange([category]);
                          return;
                        }

                        if (isSelected) {
                          onAmenityFilterChange(selectedAmenityCategories.filter((c) => c !== category));
                          return;
                        }

                        onAmenityFilterChange([...selectedAmenityCategories, category]);
                      }}
                      style={{
                        background:
                          selectedAmenityCategories.length === 0 || selectedAmenityCategories.includes(category)
                            ? getCategoryColor(category) + '22'
                            : 'rgba(148,163,184,0.1)',
                        border:
                          selectedAmenityCategories.length === 0 || selectedAmenityCategories.includes(category)
                            ? `1px solid ${getCategoryColor(category)}55`
                            : '1px solid rgba(148,163,184,0.3)',
                        color: '#e8eaf0',
                        padding: '4px 12px',
                        borderRadius: 16,
                        fontSize: 12,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        fontWeight: 500,
                        cursor: 'pointer',
                        opacity:
                          selectedAmenityCategories.length === 0 || selectedAmenityCategories.includes(category)
                            ? 1
                            : 0.65,
                      }}
                      aria-pressed={selectedAmenityCategories.length === 0 || selectedAmenityCategories.includes(category)}
                      title="Toggle amenity category"
                    >
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: getCategoryColor(category), boxShadow: `0 0 8px ${getCategoryColor(category)}` }} />
                      {count} {category}{count > 1 && !category.endsWith('s') && !category.endsWith('y') ? 's' : ''}{category.endsWith('y') && count > 1 ? 'ies' : ''}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#8b95a8', fontStyle: 'italic' }}>No local amenities found.</div>
              )}
            </div>

            {/* View listing CTA */}
            {p.id && (
              <a
                id="view-listing-btn"
                href={listingUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block', textAlign: 'center', marginTop: 'auto',
                  padding: '12px 24px', borderRadius: 12, fontWeight: 600,
                  fontSize: 14, textDecoration: 'none', color: '#fff',
                  background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                  boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 28px rgba(124,58,237,0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(124,58,237,0.4)';
                }}
              >
                View Full Listing →
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function priceGradient(price: number) {
  if (price < 200) return 'linear-gradient(135deg, #16a34a, #4ade80)';
  if (price < 280) return 'linear-gradient(135deg, #b45309, #fbbf24)';
  return 'linear-gradient(135deg, #b91c1c, #f87171)';
}

function arrowBtnStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%', transform: 'translateY(-50%)',
    [side]: 12,
    width: 32, height: 32,
    borderRadius: '50%',
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    fontSize: 20, lineHeight: 1,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  };
}

const detailLabelStyle = { fontSize: 11, color: '#8b95a8', textTransform: 'uppercase' as const, letterSpacing: '0.05em', marginBottom: 2 };
const detailValueStyle = { fontSize: 13, color: '#e8eaf0', fontWeight: 500 };

function getPropertyCitySlug(property: Property): 'manchester' | 'london' | 'coventry' | 'nottingham' {
  const houseUrl = property.houseUrl?.toLowerCase() ?? '';
  if (houseUrl.includes('/nottingham/')) return 'nottingham';
  if (houseUrl.includes('/coventry/')) return 'coventry';
  if (houseUrl.includes('/london/')) return 'london';
  if (houseUrl.includes('/manchester/')) return 'manchester';
  if (property.lat > 52.7 && property.lng > -2.0) return 'nottingham';
  return property.lat > 52.5 ? 'manchester' : 'london';
}

function buildListingUrl(property: Property): string {
  const raw = property.houseUrl?.trim() ?? '';
  if (raw) {
    const normalized = raw.replace(/detail-apartments-/i, 'apartments-');
    if (/^https?:\/\//i.test(normalized)) return normalized;
    return `https://acolyteliving.com/properties/${normalized.replace(/^\/+/, '')}`;
  }

  const city = getPropertyCitySlug(property);
  return `https://acolyteliving.com/properties/uk/${city}/apartments-${property.id}`;
}

export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    'Supermarket': '#22c55e',
    'Convenience Store': '#4ade80',
    'Restaurant': '#ef4444',
    'Cafe': '#f97316',
    'Bar': '#8b5cf6',
    'Pub': '#7c3aed',
    'Nightclub': '#a855f7',
    'Bus Stop': '#3b82f6',
    'Tram Stop': '#0ea5e9',
    'Metro Station': '#2563eb',
    'Train Station': '#1d4ed8',
    'Park': '#10b981',
    'Sports Pitch': '#84cc16',
    'Gym': '#f59e0b',
    'Library': '#06b6d4',
    'Pharmacy': '#ec4899',
    'Hospital': '#e11d48',
    'Church': '#6366f1',
  };
  return colors[category] || '#94a3b8';
}

