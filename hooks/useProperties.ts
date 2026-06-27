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
  { country: 'uk', city: 'manchester' },
  { country: 'uk', city: 'london' },
  { country: 'uk', city: 'coventry' },
  { country: 'uk', city: 'nottingham' },
  { country: 'uk', city: 'birmingham' },
  { country: 'us', city: 'birmingham' },
  { country: 'uk', city: 'aberdeen' },
  { country: 'uk', city: 'bath' },
  { country: 'uk', city: 'belfast' },
  { country: 'uk', city: 'brighton' },
  { country: 'uk', city: 'bristol' },
  { country: 'uk', city: 'canterbury' },
  { country: 'uk', city: 'cardiff' },
  { country: 'uk', city: 'colchester' },
  { country: 'uk', city: 'dundee' },
  { country: 'uk', city: 'durham' },
  { country: 'us', city: 'durham' },
  { country: 'uk', city: 'edinburgh' },
  { country: 'uk', city: 'exeter' },
  { country: 'uk', city: 'glasgow' },
  { country: 'uk', city: 'guildford' },
  { country: 'uk', city: 'lancaster' },
  { country: 'uk', city: 'leeds' },
  { country: 'uk', city: 'liverpool' },
  { country: 'uk', city: 'loughborough' },
  { country: 'uk', city: 'norwich' },
  { country: 'uk', city: 'portsmouth' },
  { country: 'uk', city: 'reading' },
  { country: 'uk', city: 'sheffield' },
  { country: 'uk', city: 'southampton' },
  { country: 'uk', city: 'st-andrews' },
  { country: 'uk', city: 'swansea' },
  { country: 'uk', city: 'york' },
  { country: 'uk', city: 'hertfordshire' },
  { country: 'uk', city: 'leicestershire' },
  { country: 'uk', city: 'newcastle' },
  { country: 'au', city: 'melbourne' },
  { country: 'au', city: 'sydney' },
  { country: 'au', city: 'brisbane' },
  { country: 'au', city: 'perth' },
  { country: 'au', city: 'canberra' },
  { country: 'au', city: 'adelaide' },
  { country: 'au', city: 'gold-coast' },
  { country: 'au', city: 'newcastle' },
  // US Cities
  { country: 'us', city: 'boston' },
  { country: 'us', city: 'los-angeles' },
  { country: 'us', city: 'tempe' },
  { country: 'us', city: 'richardson' },
  { country: 'us', city: 'urbana-champaign' },
  { country: 'us', city: 'pittsburgh' },
  { country: 'us', city: 'west-lafayette' },
  { country: 'us', city: 'berkeley' },
  { country: 'us', city: 'ann-arbor' },
  { country: 'us', city: 'college-station' },
  { country: 'us', city: 'atlanta' },
  { country: 'us', city: 'philadelphia' },
  { country: 'us', city: 'san-diego' },
  { country: 'us', city: 'raleigh' },
  { country: 'us', city: 'buffalo' },
  { country: 'us', city: 'arlington' },
  { country: 'us', city: 'new-york' },
  { country: 'us', city: 'chicago' },
  // DE (Germany) Cities
  { country: 'de', city: 'munchen' },
  { country: 'de', city: 'aachen' },
  { country: 'de', city: 'berlin' },
  { country: 'de', city: 'stuttgart' },
  { country: 'de', city: 'bonn' },
  { country: 'de', city: 'freiburg' },
  { country: 'de', city: 'hamburg' },
  { country: 'de', city: 'frankfurt-am-main' },
  { country: 'de', city: 'darmstadt' },
  { country: 'de', city: 'mannheim' },
  { country: 'de', city: 'hannover' },
  { country: 'de', city: 'koln' },
  { country: 'de', city: 'dortmund' },
  { country: 'de', city: 'essen' },
  { country: 'de', city: 'potsdam' },
  // FR (France) Cities
  { country: 'fr', city: 'fontainebleau' },
  { country: 'fr', city: 'cergy' },
  { country: 'fr', city: 'lille' },
  { country: 'fr', city: 'reims' },
  { country: 'fr', city: 'bordeaux' },
  { country: 'fr', city: 'paris' },
  { country: 'fr', city: 'lyon' },
  { country: 'fr', city: 'grenoble' },
  { country: 'fr', city: 'toulouse' },
  { country: 'fr', city: 'nantes' },
  { country: 'fr', city: 'nancy' },
  // ES (Spain) Cities
  { country: 'es', city: 'madrid' },
  { country: 'es', city: 'barcelona' },
  { country: 'es', city: 'pamplona' },
  // CA (Canada) Cities
  { country: 'ca', city: 'burnaby' },
  { country: 'ca', city: 'calgary' },
  { country: 'ca', city: 'edmonton' },
  { country: 'ca', city: 'hamilton' },
  { country: 'ca', city: 'kitchener' },
  { country: 'ca', city: 'london' },
  { country: 'ca', city: 'montreal' },
  { country: 'ca', city: 'oakville' },
  { country: 'ca', city: 'ottawa' },
  { country: 'ca', city: 'toronto' },
  { country: 'ca', city: 'vancouver' },
  { country: 'ca', city: 'waterloo' },
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
