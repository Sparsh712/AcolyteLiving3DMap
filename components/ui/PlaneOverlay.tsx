'use client';

import { useEffect, useState } from 'react';

interface PlaneOverlayProps {
  active: boolean;
  roll?: number;
  pitch?: number;
}

export default function PlaneOverlay({ active, roll = 0, pitch = 0 }: PlaneOverlayProps) {
  if (!active) return null;

  return (
    <div 
      style={{
        position: 'absolute',
        bottom: '25%', // Adjust height to hover over the map naturally
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 400, // Below strict overlays but above map
        pointerEvents: 'none',
        perspective: '800px'
      }}
    >
      <div
        style={{
          width: '120px',
          height: '120px',
          transform: `translateY(${pitch}px) rotateZ(${roll}deg) rotateX(${pitch > 0 ? 15 : pitch < 0 ? -15 : 0}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transformStyle: 'preserve-3d',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.6))'
        }}
      >
        {/* Futuristic sleek jet SVG */}
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
          {/* Engine glow */}
          <ellipse cx="50" cy="85" rx="8" ry="15" fill="url(#engineGlow)" />
          {/* Main body / Wings */}
          <path d="M50 10 L85 80 L50 65 L15 80 Z" fill="url(#planeGradient)" stroke="#8b5cf6" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Cockpit */}
          <path d="M50 35 L55 55 L45 55 Z" fill="#38bdf8" opacity="0.9" />
          
          <defs>
            <linearGradient id="planeGradient" x1="50" y1="10" x2="50" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#1e1b4b" stopOpacity="0.9" />
              <stop offset="1" stopColor="#0f172a" stopOpacity="0.9" />
            </linearGradient>
            <radialGradient id="engineGlow" cx="50" cy="85" r="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38bdf8" stopOpacity="0.9" />
              <stop offset="0.5" stopColor="#8b5cf6" stopOpacity="0.5" />
              <stop offset="1" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
