'use client';

import { useState, useEffect } from 'react';
import type { Property } from '@/types/property';

let cached: Property[] | null = null;

interface CitySource {
  country: string;
  city: string;
  legacySlug?: string;
}

const CITY_SOURCES: CitySource[] = [
  { country: 'uk', city: 'manchester', legacySlug: 'manchester' },
  { country: 'uk', city: 'london', legacySlug: 'london' },
  { country: 'uk', city: 'coventry', legacySlug: 'coventry' },
  { country: 'uk', city: 'nottingham', legacySlug: 'nottingham' },
  { country: 'uk', city: 'birmingham', legacySlug: 'birmingham' },  
  { country: 'us', city: 'birmingham', legacySlug: 'birmingham' },
  { country: 'uk', city: 'aberdeen', legacySlug: 'aberdeen' },
  { country: 'uk', city: 'bath', legacySlug: 'bath' },
  { country: 'uk', city: 'belfast', legacySlug: 'belfast' },
  { country: 'uk', city: 'brighton', legacySlug: 'brighton' },
  { country: 'uk', city: 'bristol', legacySlug: 'bristol' },
  { country: 'uk', city: 'canterbury', legacySlug: 'canterbury' },
  { country: 'uk', city: 'cardiff', legacySlug: 'cardiff' },
  { country: 'uk', city: 'colchester', legacySlug: 'colchester' },
  { country: 'uk', city: 'dundee', legacySlug: 'dundee' },
  { country: 'uk', city: 'durham', legacySlug: 'durham' },
  { country: 'us', city: 'durham', legacySlug: 'durham' },
  { country: 'uk', city: 'edinburgh', legacySlug: 'edinburgh' },
  { country: 'uk', city: 'exeter', legacySlug: 'exeter' },
  { country: 'uk', city: 'glasgow', legacySlug: 'glasgow' },
  { country: 'uk', city: 'guildford', legacySlug: 'guildford' },
  { country: 'uk', city: 'lancaster', legacySlug: 'lancaster' },
  { country: 'uk', city: 'leeds', legacySlug: 'leeds' },
  { country: 'uk', city: 'liverpool', legacySlug: 'liverpool' },
  { country: 'uk', city: 'loughborough', legacySlug: 'loughborough' },
  { country: 'uk', city: 'norwich', legacySlug: 'norwich' },
  { country: 'uk', city: 'portsmouth', legacySlug: 'portsmouth' },
  { country: 'uk', city: 'reading', legacySlug: 'reading' },
  { country: 'uk', city: 'sheffield', legacySlug: 'sheffield' },
  { country: 'uk', city: 'southampton', legacySlug: 'southampton' },
  { country: 'uk', city: 'st-andrews', legacySlug: 'st-andrews' },
  { country: 'uk', city: 'swansea', legacySlug: 'swansea' },
  { country: 'uk', city: 'york', legacySlug: 'york' },
];

function isValidProperty(property: Property): boolean {
  return Number.isFinite(property.lat) && Number.isFinite(property.lng) && Number.isFinite(property.price);
}

async function fetchJsonWithFallback<T>(primaryUrl: string, fallbackUrl?: string): Promise<T> {
  const primaryRes = await fetch(primaryUrl);
  if (primaryRes.ok) return (await primaryRes.json()) as T;

  if (fallbackUrl) {
    const fallbackRes = await fetch(fallbackUrl);
    if (fallbackRes.ok) return (await fallbackRes.json()) as T;
  }

  throw new Error(`HTTP ${primaryRes.status} for ${primaryUrl}`);
}

function fetchCityProperties(source: CitySource): Promise<Property[]> {
  const primary = `/data/${source.country}/${source.city}/properties.json`;
  const fallback = source.legacySlug ? `/data/${source.legacySlug}-properties.json` : undefined;
  return fetchJsonWithFallback<Property[]>(primary, fallback);
}

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(cached ?? []);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cached) {
      setProperties(cached);
      setLoading(false);
      return;
    }

    Promise.allSettled(CITY_SOURCES.map(fetchCityProperties))
      .then((results) => {
        const merged = results
          .flatMap((result) => (result.status === 'fulfilled' ? result.value : []))
          .filter(isValidProperty);
        cached = merged;
        setProperties(merged);
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  /** Unique list of university names for filter UI */
  const universities = [...new Set(properties.map((p) => p.university).filter(Boolean))].sort();

  return { properties, universities, loading, error };
}
