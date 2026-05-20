'use client';

import CustomSelect, { type SelectOption } from '@/components/ui/CustomSelect';

type CityFilter = '' | 'Manchester' | 'London';

interface FilterBarProps {
  cityFilter: CityFilter;
  onCityChange: (city: CityFilter) => void;
  universityFilter: string;
  onUniversityChange: (uni: string) => void;
  universities: string[];
}

export default function FilterBar({
  cityFilter,
  onCityChange,
  universityFilter,
  onUniversityChange,
  universities,
}: FilterBarProps) {
  const cityOptions: SelectOption[] = [
    { value: 'Manchester', label: 'Manchester' },
    { value: 'London', label: 'London' },
  ];
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

      {/* City filter first */}
      <CustomSelect
        id="city-filter"
        options={cityOptions}
        value={cityFilter}
        onChange={(value) => onCityChange(value as CityFilter)}
        placeholder="Choose City"
        minWidth={150}
        maxWidth={180}
      />

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

