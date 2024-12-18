/**
 * Core state types for the application
 */

import { StateCreator } from 'zustand';
import { 
  OrbState, 
  OrbAnimationState, 
  OrbInteractionMode,
  ParticleSystemConfig,
  QualityLevel,
  PerformanceMetrics,
  TransitionConfig
} from './slices/types';

// Re-export types
export type { 
  OrbState, 
  OrbAnimationState, 
  OrbInteractionMode,
  ParticleSystemConfig,
  QualityLevel,
  PerformanceMetrics,
  TransitionConfig
};

// Orb Slice
export interface OrbSlice {
  orb: OrbState;
  setAnimating: (isAnimating: boolean) => void;
  setInteractionMode: (mode: OrbInteractionMode) => void;
  setAnimationState: (state: OrbAnimationState) => void;
  setTransitionProgress: (progress: number) => void;
  setPreviousState: (state: OrbAnimationState | null) => void;
  setTransitionDuration: (duration: number) => void;
  setAnimationSpeed: (speed: number) => void;
  setParticleSystem: (config: Partial<ParticleSystemConfig>) => void;
  setQualityLevel: (level: QualityLevel) => void;
  updatePerformanceMetrics: (metrics: PerformanceMetrics) => void;
}

// Combined Store Type
export interface Store extends OrbSlice {}

// Slice Creator Types
export type OrbSliceCreator = StateCreator<Store, [], [], OrbSlice>;
