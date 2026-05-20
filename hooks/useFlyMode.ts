'use client';

import { useEffect, useRef, useCallback } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';

export interface FlyState {
  bearing: number;
  speed: number;
  active: boolean;
  roll: number;
  pitch: number;
}

interface UseFlyModeOptions {
  onStateChange?: (state: FlyState) => void;
}

const DEFAULT_FLY_SPEED = 55;
const MIN_FLY_SPEED = 30;
const MAX_FLY_SPEED = 200;
const MIN_ALT = 25;
const MAX_ALT = 900;
const TURN_RATE = 2.0;
const CLIMB_RATE = 55;
const MAX_BANK = 0.55;
const MAX_PITCH = 0.7;
const DEADZONE = 0.08;
const DEG_PER_UNIT = 1 / 111111;

function deadzoneCurve(v: number): number {
  const abs = Math.abs(v);
  if (abs < DEADZONE) return 0;
  const adjusted = (abs - DEADZONE) / (1 - DEADZONE);
  return Math.sign(v) * adjusted * adjusted;
}

export function useFlyMode(onStateChange?: UseFlyModeOptions['onStateChange']) {
  const stateRef = useRef<FlyState>({ bearing: 0, speed: DEFAULT_FLY_SPEED, active: false, roll: 0, pitch: 0 });
  const rafRef   = useRef<number>(0);
  const mapRef   = useRef<MapLibreMap | null>(null);
  
  // Real-time physics state mapped from git-city
  const posRef = useRef({ lng: 0, lat: 0, alt: 250 });
  const yawRef = useRef(0);
  const bankRef = useRef(0);
  const pitchRef = useRef(0);
  const timeRef = useRef(0);

  const keysRef  = useRef<Record<string, boolean>>({});
  const mouseRef = useRef({ x: 0, y: 0 });

  const setMap = useCallback((map: MapLibreMap | null) => {
    mapRef.current = map;
    if (map) {
      const center = map.getCenter();
      posRef.current = { lng: center.lng, lat: center.lat, alt: 400 };
      yawRef.current = map.getBearing() * (Math.PI / 180);
      stateRef.current.bearing = map.getBearing();
    }
  }, []);

  const tick = useCallback((time: number) => {
    if (!stateRef.current.active || !mapRef.current) return;

    if (timeRef.current === 0) timeRef.current = time;
    const delta = (time - timeRef.current) / 1000;
    timeRef.current = time;
    const dt = Math.min(delta, 0.05);

    const map   = mapRef.current;
    const k     = keysRef.current;
    const mx    = mouseRef.current.x;
    const my    = mouseRef.current.y;

    let turnInput = deadzoneCurve(mx);
    if (k['KeyA'] || k['ArrowLeft']) turnInput = -1;
    if (k['KeyD'] || k['ArrowRight']) turnInput = 1;

    yawRef.current -= turnInput * TURN_RATE * dt;

    let altInput = deadzoneCurve(my);
    if (k['KeyW'] || k['ArrowUp']) altInput = 1;
    if (k['KeyS'] || k['ArrowDown']) altInput = -1;

    let speedMult = 1;
    if (k['ShiftLeft'] || k['ShiftRight']) speedMult = 2;
    if (k['AltLeft'] || k['AltRight']) speedMult = 0.3;

    const actualSpeed = stateRef.current.speed * speedMult;
    const climbScale = Math.sqrt(actualSpeed / DEFAULT_FLY_SPEED);
    
    posRef.current.alt += altInput * CLIMB_RATE * climbScale * dt;
    posRef.current.alt = Math.max(MIN_ALT, Math.min(MAX_ALT, posRef.current.alt));

    // fwd vector logic
    // In maplibre, 0 bearing = North. North is +lat.
    // In git-city Yaw logic: yaw -= turnInput.
    const fwdLng = Math.sin(yawRef.current);
    const fwdLat = Math.cos(yawRef.current);

    posRef.current.lng += fwdLng * actualSpeed * dt * DEG_PER_UNIT;
    posRef.current.lat += fwdLat * actualSpeed * dt * DEG_PER_UNIT;

    const targetBank = -turnInput * MAX_BANK;
    bankRef.current += (targetBank - bankRef.current) * 5 * dt;

    const targetPitch = altInput * MAX_PITCH;
    pitchRef.current += (targetPitch - pitchRef.current) * 6 * dt;

    // Convert Alt to MapLibre Zoom
    // 25 -> 17, 900 -> 13
    const zoom = 17 - ((posRef.current.alt - MIN_ALT) / (MAX_ALT - MIN_ALT)) * 4;

    // Update MapLibre
    map.jumpTo({
      center: [posRef.current.lng, posRef.current.lat],
      bearing: (yawRef.current * 180) / Math.PI,
      zoom: zoom,
      pitch: 60 + (pitchRef.current * 180 / Math.PI) * 0.4
    });

    // Sync external state for HUD / Overlay
    stateRef.current.speed = actualSpeed / speedMult; // base speed
    stateRef.current.bearing = (yawRef.current * 180) / Math.PI;
    stateRef.current.roll = (bankRef.current * 180) / Math.PI;
    stateRef.current.pitch = (pitchRef.current * 180) / Math.PI;
    onStateChange?.({ ...stateRef.current });

    rafRef.current = requestAnimationFrame(tick);
  }, [onStateChange]);

  const toggleFlyMode = useCallback(() => {
    stateRef.current.active = !stateRef.current.active;
    onStateChange?.({ ...stateRef.current });
    
    if (stateRef.current.active) {
      // Intialize state to current camera position
      if (mapRef.current) {
        const center = mapRef.current.getCenter();
        posRef.current.lng = center.lng;
        posRef.current.lat = center.lat;
        yawRef.current = mapRef.current.getBearing() * (Math.PI / 180);
      }
      mouseRef.current = { x: 0, y: 0 };
      timeRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
      keysRef.current = {};
    }
  }, [onStateChange, tick]);

  useEffect(() => {
    if (stateRef.current.active) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (stateRef.current.active) {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!stateRef.current.active) return;
      if (e.deltaY < 0) {
        stateRef.current.speed = Math.min(stateRef.current.speed + 5, MAX_FLY_SPEED);
      } else {
        stateRef.current.speed = Math.max(stateRef.current.speed - 5, MIN_FLY_SPEED);
      }
      onStateChange?.({ ...stateRef.current });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFlyMode();
        return;
      }
      if (!stateRef.current.active) return;
      
      const flightKeys = ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'ShiftRight', 'AltLeft', 'AltRight'];
      if (flightKeys.includes(e.code)) {
        if (!e.code.includes('Shift') && !e.code.includes('Alt')) e.preventDefault();
        keysRef.current[e.code] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(rafRef.current);
    };
  }, [toggleFlyMode, onStateChange]);

  return {
    setMap,
    toggleFlyMode,
    isActive: () => stateRef.current.active,
    getSpeed: () => stateRef.current.speed,
  };
}
