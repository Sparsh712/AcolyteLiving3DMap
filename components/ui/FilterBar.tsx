'use client';

import CustomSelect, { type SelectOption } from '@/components/ui/CustomSelect';

type CountryFilter = string;
type CityFilter = string;

interface FilterBarProps {
  countryFilter: CountryFilter;
  onCountryChange: (country: CountryFilter) => void;
  countries: string[];
  cityFilter: CityFilter;
  onCityChange: (city: CityFilter) => void;
  cities: string[];
  universityFilter: string;
  onUniversityChange: (uni: string) => void;
  universities: string[];
}

export default function FilterBar({
  countryFilter,
  onCountryChange,
  countries,
  cityFilter,
  onCityChange,
  cities,
  universityFilter,
  onUniversityChange,
  universities,
}: FilterBarProps) {
  const countryOptions: SelectOption[] = countries.map((country) => ({
    value: country,
    label: country,
  }));
  const cityOptions: SelectOption[] = cities.map((city) => ({ value: city, label: city }));
  const uniOptions: SelectOption[] = universities.map((u) => ({ value: u, label: u }));

  return (
    <div
      id="filter-bar"
      style={{
        position: 'fixed',
        top: 16,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderRadius: 14,
        background: 'rgba(13,14,22,0.88)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
        flexWrap: 'wrap',
        maxWidth: 'calc(100vw - 32px)',
      }}
    >
      {/* Logo / Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 4 }}>
        <span style={{ fontSize: 20 }}>🏙️</span>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700, fontSize: 14, color: '#a78bfa',
          whiteSpace: 'nowrap',
        }}>
          Housing Explorer
        </span>
      </div>

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* Country filter first */}
      <CustomSelect
        id="country-filter"
        options={countryOptions}
        value={countryFilter}
        onChange={(value) => onCountryChange(value as CountryFilter)}
        placeholder="Choose Country"
        minWidth={150}
        maxWidth={180}
        searchable
      />

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* City filter */}
      <div
        style={{
          pointerEvents: countryFilter ? 'auto' : 'none',
          opacity: countryFilter ? 1 : 0.5,
        }}
      >
        <CustomSelect
          id="city-filter"
          options={cityOptions}
          value={cityFilter}
          onChange={(value) => onCityChange(value as CityFilter)}
          placeholder={countryFilter ? 'Choose City' : 'Choose Country First'}
          minWidth={150}
          maxWidth={180}
          searchable
        />
      </div>

      <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

      {/* University filter — custom dropdown */}
      <div
        style={{
          pointerEvents: cityFilter ? 'auto' : 'none',
          opacity: cityFilter ? 1 : 0.5,
        }}
      >
        <CustomSelect
          id="university-filter"
          options={uniOptions}
          value={universityFilter}
          onChange={onUniversityChange}
          placeholder={cityFilter ? 'All Universities' : 'Choose City First'}
          minWidth={180}
          maxWidth={240}
          searchable
        />
      </div>
    </div>
  );
}

