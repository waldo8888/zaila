'use client'

import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { useOrbState, useOrbActions } from '@/store/hooks/useOrb';
import { OrbState, OrbAnimationState, TransitionConfig } from '@/store/slices/types';
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
    transitionDuration,
    qualityLevel
  } = useOrbState();
  
  const { 
    setAnimationState, 
    setInteractionMode,
    setTransitionProgress,
    setPreviousState,
    setTransitionDuration,
    setParticleSystem,
    setQualityLevel,
    updatePerformanceMetrics
  } = useOrbActions();

  const transitionRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const fpsRef = useRef<number[]>([]);
  const qualityLevelRef = useRef<keyof typeof QUALITY_LEVELS>('HIGH');

  // State configuration with proper typing
  const stateConfig = useMemo<Record<OrbAnimationState, TransitionConfig>>(() => ({
    idle: { duration: 800, easing: 'easeInOut' },
    loading: { duration: 600, easing: 'easeOut' },
    success: { duration: 400, easing: 'easeOut' },
    error: { duration: 500, easing: 'easeInOut' },
    active: { duration: 600, easing: 'easeOut' },
    inactive: { duration: 800, easing: 'easeInOut' }
  }), []);

  // Easing functions
  const easingFunctions = {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => 1 - Math.pow(1 - t, 2),
    easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  };

  const handleStateTransition = useCallback((currentTime: number) => {
    if (!startTimeRef.current || !transitionRef.current) return;

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / transitionDuration, 1);
    const easing = easingFunctions[stateConfig[animationState as OrbAnimationState].easing];
    const easedProgress = easing(progress);

    setTransitionProgress(easedProgress);

    if (progress >= 1) {
      startTimeRef.current = null;
      transitionRef.current = null;
      setPreviousState(null);
    } else {
      rafIdRef.current = requestAnimationFrame(handleStateTransition);
    }
  }, [animationState, transitionDuration, setTransitionProgress, setPreviousState, stateConfig]);

  useEffect(() => {
    if (previousState !== animationState && animationState) {
      startTimeRef.current = performance.now();
      transitionRef.current = performance.now();
      setTransitionDuration(stateConfig[animationState as OrbAnimationState].duration);
      rafIdRef.current = requestAnimationFrame(handleStateTransition);
    }

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [animationState, previousState, handleStateTransition, setTransitionDuration, stateConfig]);

  // Performance monitoring
  const calculatePerformanceMetrics = useCallback((deltaTime: number) => {
    const currentFPS = 1000 / deltaTime;
    fpsRef.current.push(currentFPS);
    
    // Keep last 60 frames for average
    if (fpsRef.current.length > 60) {
      fpsRef.current.shift();
    }

    // Calculate average FPS
    const avgFPS = fpsRef.current.reduce((a, b) => a + b) / fpsRef.current.length;

    // Get memory usage if available
    const memory = (performance as any).memory 
      ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
      : 0;

    // Update performance metrics in store
    updatePerformanceMetrics({
      fps: Math.round(avgFPS),
      memory,
      renderTime: Math.round(deltaTime * 100) / 100
    });

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
      
      setQualityLevel(newQualityLevel);
      setParticleSystem({
        maxParticles: quality.particleCount,
        particleSize: quality.particleSize,
        glowIntensity: quality.glowIntensity
      });
    }
  }, [setParticleSystem, setQualityLevel, updatePerformanceMetrics]);

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
    calculatePerformanceMetrics(deltaTime);

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
      startTimeRef.current = null;
      lastFrameTimeRef.current = null;
    }
  }, [animationState, transitionDuration, transitionProgress, setTransitionProgress, setPreviousState, calculatePerformanceMetrics]);

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
