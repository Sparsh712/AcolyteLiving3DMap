'use client';

interface HUDProps {
  flyActive: boolean;
  speed: number;
  nearestName: string | null;
  zoom: number;
  bearing: number;
  onToggleFly: () => void;
}

export default function HUD({ flyActive, speed, nearestName, zoom, bearing, onToggleFly }: HUDProps) {
  const speedLabel = flyActive ? speedToLabel(speed) : null;

  return (
    <div
      id="hud"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 20,
        zIndex: 150,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      {/* Fly mode toggle button */}
      <button
        id="fly-mode-btn"
        onClick={onToggleFly}
        title="Toggle fly mode (F)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 16px',
          borderRadius: 10,
          border: flyActive ? '1px solid rgba(124,58,237,0.6)' : '1px solid rgba(255,255,255,0.12)',
          background: flyActive ? 'rgba(124,58,237,0.3)' : 'rgba(13,14,22,0.8)',
          backdropFilter: 'blur(16px)',
          color: flyActive ? '#c4b5fd' : '#8b95a8',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: flyActive ? '0 0 20px rgba(124,58,237,0.4)' : 'none',
        }}
      >
        <span
          style={{
            fontSize: 18,
            display: 'inline-block',
            animation: flyActive ? 'fly-bounce 1s ease-in-out infinite' : 'none',
            transform: 'rotate(-15deg)',
          }}
        >
          ✈
        </span>
        {flyActive ? 'FLY MODE ON' : 'Fly Mode (F)'}
        {speedLabel && (
          <span style={{
            background: 'rgba(124,58,237,0.3)', borderRadius: 6,
            padding: '2px 6px', fontSize: 11, marginLeft: 4,
          }}>
            {speedLabel}
          </span>
        )}
      </button>

      {/* Stats pill */}
      <div style={{
        display: 'flex',
        gap: 12,
        padding: '6px 14px',
        borderRadius: 8,
        background: 'rgba(13,14,22,0.75)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(12px)',
        fontSize: 12,
        color: '#8b95a8',
        fontVariantNumeric: 'tabular-nums',
      }}>
        <span>Z <strong style={{ color: '#e8eaf0' }}>{zoom.toFixed(1)}</strong></span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span>⬡ <strong style={{ color: '#e8eaf0' }}>{Math.round(bearing)}°</strong></span>
      </div>

      {/* Nearest property */}
      {nearestName && (
        <div style={{
          maxWidth: 240,
          padding: '6px 12px',
          borderRadius: 8,
          background: 'rgba(13,14,22,0.75)',
          border: '1px solid rgba(167,139,250,0.2)',
          backdropFilter: 'blur(12px)',
          fontSize: 12,
          color: '#a78bfa',
          animation: 'fade-in 0.3s ease',
        }}>
          📍 Nearest: <strong style={{ color: '#e8eaf0' }}>{nearestName}</strong>
        </div>
      )}

      {/* Keyboard hint */}
      {flyActive && (
        <div style={{
          padding: '6px 12px',
          borderRadius: 8,
          background: 'rgba(13,14,22,0.65)',
          border: '1px solid rgba(255,255,255,0.06)',
          fontSize: 11,
          color: '#8b95a8',
          lineHeight: 1.8,
          animation: 'fade-in 0.3s ease',
        }}>
          WASD / ↑↓←→ to fly · +/– speed · F to exit
        </div>
      )}
    </div>
  );
}

function speedToLabel(speed: number): string {
  if (speed < 0.00001) return '1× slow';
  if (speed < 0.00002) return '2× cruise';
  if (speed < 0.00004) return '3× fast';
  if (speed < 0.00008) return '4× turbo';
  return '5× warp';
}
