'use client';

import { useState, useEffect } from 'react';
import type { Property } from '@/types/property';

let cached: Property[] | null = null;

function isValidProperty(property: Property): boolean {
  return Number.isFinite(property.lat) && Number.isFinite(property.lng) && Number.isFinite(property.price);
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

    Promise.allSettled([
      fetch('/data/manchester-properties.json').then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Property[]>;
      }),
      fetch('/data/london-properties.json').then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Property[]>;
      }),
      fetch('/data/coventry-properties.json').then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Property[]>;
      }),
      fetch('/data/nottingham-properties.json').then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Property[]>;
      }),
    ])
      .then(([manchesterResult, londonResult, coventryResult, nottinghamResult]) => {
        const manchester = manchesterResult.status === 'fulfilled' ? manchesterResult.value : [];
        const london = londonResult.status === 'fulfilled' ? londonResult.value : [];
        const coventry = coventryResult.status === 'fulfilled' ? coventryResult.value : [];
        const nottingham = nottinghamResult.status === 'fulfilled' ? nottinghamResult.value : [];

        const merged = [...manchester, ...london, ...coventry, ...nottingham].filter(isValidProperty);
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
