'use client'

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useOrbState, useOrbActions } from '@/store/hooks/useOrb';
import { OrbState, OrbAnimationState } from '@/store/types';
import { Orb } from './Orb';

interface OrbStateManagerProps {
  children?: React.ReactNode;
}

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  HIGH: { fps: 55, particleCount: 5000 },
  MEDIUM: { fps: 40, particleCount: 3000 },
  LOW: { fps: 30, particleCount: 1500 }
} as const;

// Quality levels
const QUALITY_LEVELS = {
  HIGH: {
    particleCount: 5000,
    glowIntensity: 1.0,
    particleSize: 0.1
  },
  MEDIUM: {
    particleCount: 3000,
    glowIntensity: 0.7,
    particleSize: 0.15
  },
  LOW: {
    particleCount: 1500,
    glowIntensity: 0.5,
    particleSize: 0.2
  }
} as const;

export const OrbStateManager: React.FC<OrbStateManagerProps> = ({ children }) => {
  const { 
    animationState, 
    interactionMode,
    transitionProgress,
    previousState,
    transitionDuration 
  } = useOrbState();
  
  const { 
    setAnimationState, 
    setInteractionMode,
    setTransitionProgress,
    setPreviousState,
    setTransitionDuration,
    setParticleSystem
  } = useOrbActions();

  const transitionRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>();
  const rafIdRef = useRef<number>();
  const fpsRef = useRef<number[]>([]);
  const qualityLevelRef = useRef<keyof typeof QUALITY_LEVELS>('HIGH');

  // Memoize state configuration
  const stateConfig = useMemo(() => ({
    idle: { duration: 800, easing: 'easeInOut' },
    processing: { duration: 600, easing: 'easeOut' },
    success: { duration: 400, easing: 'easeOut' },
    error: { duration: 500, easing: 'easeInOut' },
    active: { duration: 600, easing: 'easeOut' },
    inactive: { duration: 800, easing: 'easeInOut' }
  } as const), []);

  // Performance monitoring
  const updatePerformanceMetrics = useCallback((deltaTime: number) => {
    const currentFPS = 1000 / deltaTime;
    fpsRef.current.push(currentFPS);
    
    // Keep last 60 frames for average
    if (fpsRef.current.length > 60) {
      fpsRef.current.shift();
    }

    // Calculate average FPS
    const avgFPS = fpsRef.current.reduce((a, b) => a + b) / fpsRef.current.length;

    // Determine quality level based on FPS
    let newQualityLevel: keyof typeof QUALITY_LEVELS = qualityLevelRef.current;

    if (avgFPS < PERFORMANCE_THRESHOLDS.LOW.fps) {
      newQualityLevel = 'LOW';
    } else if (avgFPS < PERFORMANCE_THRESHOLDS.MEDIUM.fps) {
      newQualityLevel = 'MEDIUM';
    } else if (avgFPS >= PERFORMANCE_THRESHOLDS.HIGH.fps) {
      newQualityLevel = 'HIGH';
    }

    // Update quality if changed
    if (newQualityLevel !== qualityLevelRef.current) {
      qualityLevelRef.current = newQualityLevel;
      const quality = QUALITY_LEVELS[newQualityLevel];
      
      setParticleSystem({
        maxParticles: quality.particleCount,
        particleSize: quality.particleSize
      });
    }
  }, [setParticleSystem]);

  // Optimized animation frame handler
  const handleAnimationFrame = useCallback((timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
      lastFrameTimeRef.current = timestamp;
    }

    // Calculate delta time for smooth animations
    const deltaTime = timestamp - (lastFrameTimeRef.current || timestamp);
    lastFrameTimeRef.current = timestamp;

    // Update performance metrics
    updatePerformanceMetrics(deltaTime);

    // Calculate progress with time smoothing
    const elapsed = timestamp - startTimeRef.current;
    const targetDuration = stateConfig[animationState as OrbAnimationState]?.duration || transitionDuration * 1000;
    const smoothProgress = Math.min(elapsed / targetDuration, 1);

    // Only update if progress changed significantly
    if (Math.abs(smoothProgress - transitionProgress) > 0.001) {
      setTransitionProgress(smoothProgress);
    }

    if (smoothProgress < 1) {
      rafIdRef.current = requestAnimationFrame(handleAnimationFrame);
    } else {
      // Clean up
      setPreviousState(null);
      setTransitionProgress(0);
      startTimeRef.current = undefined;
      lastFrameTimeRef.current = undefined;
    }
  }, [animationState, transitionDuration, transitionProgress, setTransitionProgress, setPreviousState, updatePerformanceMetrics]);

  // Handle animation state transitions
  useEffect(() => {
    if (!animationState) return;

    // Cancel any existing animation
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Start new animation
    rafIdRef.current = requestAnimationFrame(handleAnimationFrame);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [animationState, handleAnimationFrame]);

  return (
    <group>
      <Orb state={animationState} />
      {children}
    </group>
  );
};
