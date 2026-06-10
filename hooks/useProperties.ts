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
  { country: 'au', city: 'melbourne', legacySlug: 'melbourne' },
  { country: 'au', city: 'sydney', legacySlug: 'sydney' },
  { country: 'au', city: 'brisbane', legacySlug: 'brisbane' },
  { country: 'au', city: 'perth', legacySlug: 'perth' },
  { country: 'au', city: 'canberra', legacySlug: 'canberra' },
  { country: 'au', city: 'adelaide', legacySlug: 'adelaide' },
  { country: 'au', city: 'gold-coast', legacySlug: 'gold-coast' },
  { country: 'au', city: 'newcastle', legacySlug: 'newcastle' },
  // US Cities
  { country: 'us', city: 'boston', legacySlug: 'boston' },
  { country: 'us', city: 'los-angeles', legacySlug: 'los-angeles' },
  { country: 'us', city: 'tempe', legacySlug: 'tempe' },
  { country: 'us', city: 'richardson', legacySlug: 'richardson' },
  { country: 'us', city: 'urbana-champaign', legacySlug: 'urbana-champaign' },
  { country: 'us', city: 'pittsburgh', legacySlug: 'pittsburgh' },
  { country: 'us', city: 'west-lafayette', legacySlug: 'west-lafayette' },
  { country: 'us', city: 'berkeley', legacySlug: 'berkeley' },
  { country: 'us', city: 'ann-arbor', legacySlug: 'ann-arbor' },
  { country: 'us', city: 'college-station', legacySlug: 'college-station' },
  { country: 'us', city: 'atlanta', legacySlug: 'atlanta' },
  { country: 'us', city: 'philadelphia', legacySlug: 'philadelphia' },
  { country: 'us', city: 'san-diego', legacySlug: 'san-diego' },
  { country: 'us', city: 'raleigh', legacySlug: 'raleigh' },
  { country: 'us', city: 'buffalo', legacySlug: 'buffalo' },
  { country: 'us', city: 'arlington', legacySlug: 'arlington' },
  { country: 'us', city: 'new-york', legacySlug: 'new-york' },
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
