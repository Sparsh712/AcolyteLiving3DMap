'use client';

import { useState, useRef, useEffect, useId } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  accent?: string; // optional colour dot
}

interface CustomSelectProps {
  id?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Max height of the dropdown list in px */
  maxHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  /** Direction the menu opens */
  openDirection?: 'down' | 'up';
  searchable?: boolean;
}

export default function CustomSelect({
  id,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  maxHeight = 280,
  minWidth = 180,
  maxWidth = 300,
  openDirection = 'down',
  searchable = false,
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid = useId();

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = searchable
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : options;
  const hasTypedQuery = searchQuery.trim().length > 0;
  const hasClearableState = searchable && (hasTypedQuery || Boolean(value));
  const triggerValue = searchable
    ? (open || searchQuery ? searchQuery : selectedOption?.label ?? '')
    : (selectedOption?.label ?? '');

  function clearCurrentState() {
    if (!searchable) return;
    if (hasTypedQuery) {
      setSearchQuery('');
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
      return;
    }
    if (value) {
      onChange('');
      setOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      setHovered(null);
    }
  }, [open]);

  useEffect(() => {
    if (open && searchable) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open, searchable]);

  return (
    <div
      ref={containerRef}
      id={id ?? uid}
      style={{ position: 'relative', minWidth, maxWidth, userSelect: 'none' }}
    >
      {/* Trigger */}
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id ?? uid}-listbox`}
        onClick={() => {
          setOpen(true);
          if (searchable) inputRef.current?.focus();
        }}
        style={{
          width: '100%',
          minWidth: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '7px 8px 7px 12px',
          borderRadius: 10,
          background: open
            ? 'rgba(139,92,246,0.15)'
            : 'rgba(255,255,255,0.05)',
          border: open
            ? '1px solid rgba(139,92,246,0.55)'
            : '1px solid rgba(255,255,255,0.1)',
          color: selectedOption ? '#c4b5fd' : '#6b7280',
          fontSize: 13,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: selectedOption ? 600 : 400,
          cursor: 'pointer',
          outline: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'background 0.15s, border-color 0.15s, color 0.15s',
          boxShadow: open ? '0 0 0 3px rgba(139,92,246,0.18)' : 'none',
        }}
      >
        {searchable ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
            <input
              ref={inputRef}
              type="text"
              value={triggerValue}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setOpen(false);
                  inputRef.current?.blur();
                }
                if (e.key === 'Backspace' && searchQuery === '' && value) {
                  e.preventDefault();
                  onChange('');
                }
              }}
              placeholder={placeholder}
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                color: selectedOption ? '#c4b5fd' : '#e8eaf0',
                fontSize: 13,
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: selectedOption ? 600 : 400,
                cursor: 'pointer',
                padding: 0,
                margin: 0,
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
              }}
            />

            {hasClearableState && (
              <button
                type="button"
                aria-label={hasTypedQuery ? 'Clear typed text' : 'Clear selection'}
                onMouseDown={(e) => e.preventDefault()}
                onClick={(e) => {
                  e.stopPropagation();
                  clearCurrentState();
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.14)',
                  background: 'rgba(255,255,255,0.05)',
                  color: '#8b95a8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        ) : (
          <span style={{ display: 'block', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1 }}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        )}
        {/* Chevron */}
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="currentColor"
          style={{
            flexShrink: 0,
            opacity: 0.6,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
      </div>

      {/* Dropdown panel */}
      {open && (
        <div
          role="listbox"
          id={`${id ?? uid}-listbox`}
          style={{
            position: 'absolute',
            [openDirection === 'up' ? 'bottom' : 'top']: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            minWidth,
            maxWidth,
            zIndex: 1000,
            background: 'rgba(13,14,22,0.97)',
            border: '1px solid rgba(139,92,246,0.3)',
            borderRadius: 12,
            boxShadow: '0 16px 48px rgba(0,0,0,0.65), 0 0 0 1px rgba(139,92,246,0.1)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            overflowY: 'auto',
            maxHeight,
            padding: '4px',
            animation: 'dropdown-in 0.15s ease',
          }}
        >
          <style>{`
            @keyframes dropdown-in {
              from { opacity: 0; transform: translateY(-6px) scale(0.98); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
          `}</style>

          {/* Optional: clear / placeholder row */}
          {value && (
            <div
              role="option"
              aria-selected={false}
              onMouseEnter={() => setHovered('__clear__')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => { onChange(''); setOpen(false); }}
              onMouseDown={(e) => e.preventDefault()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '7px 10px',
                borderRadius: 8,
                fontSize: 12,
                color: '#6b7280',
                cursor: 'pointer',
                background: hovered === '__clear__' ? 'rgba(255,255,255,0.04)' : 'transparent',
                transition: 'background 0.1s',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 11 }}>✕</span>
              <span>Clear selection</span>
            </div>
          )}

          {filteredOptions.map((opt) => {
            const isSelected = opt.value === value;
            const isHovered = hovered === opt.value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setHovered(opt.value)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                onMouseDown={(e) => e.preventDefault()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  background: isSelected
                    ? 'rgba(139,92,246,0.2)'
                    : isHovered
                    ? 'rgba(255,255,255,0.05)'
                    : 'transparent',
                  border: isSelected
                    ? '1px solid rgba(139,92,246,0.35)'
                    : '1px solid transparent',
                  transition: 'background 0.1s, border-color 0.1s',
                  marginBottom: 1,
                }}
              >
                {/* Colour accent dot */}
                {opt.accent && (
                  <span style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: opt.accent, flexShrink: 0,
                  }} />
                )}

                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? '#c4b5fd' : '#d1d5db',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {opt.label}
                  </div>
                  {opt.sublabel && (
                    <div style={{
                      fontSize: 11,
                      color: '#6b7280',
                      marginTop: 1,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {opt.sublabel}
                    </div>
                  )}
                </div>

                {/* Tick */}
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M3 8l4 4 6-6" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            );
          })}

          {filteredOptions.length === 0 && (
            <div style={{ padding: '10px', textAlign: 'center', fontSize: 12, color: '#4b5563' }}>
              {searchQuery ? 'No matching options' : 'No options'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
