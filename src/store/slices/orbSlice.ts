import { StateCreator } from 'zustand';
import { Store } from '../types';
import { OrbState, OrbAnimationState, OrbInteractionMode, ParticleSystemConfig, OrbSlice, QualityLevel, PerformanceMetrics } from './types';

const initialState: OrbState = {
  isAnimating: false,
  interactionMode: 'none',
  animationState: 'idle',
  transitionProgress: 0,
  previousState: null,
  transitionDuration: 1000,
  animationSpeed: 1,
  particleSystem: {
    maxParticles: 1000,
    particleSize: 0.1,
    glowIntensity: 1.0,
    enabled: true,
    emissionRate: 10,
    particleSpeed: 1,
    particleColor: '#ffffff'
  },
  qualityLevel: 'HIGH',
  performanceMetrics: {
    fps: 60,
    memory: 0,
    renderTime: 0
  }
};

export const createOrbSlice: StateCreator<Store, [], [], OrbSlice> = (set) => ({
  orb: initialState,
  
  setAnimating: (isAnimating: boolean) => 
    set((state) => ({ orb: { ...state.orb, isAnimating } })),
    
  setInteractionMode: (interactionMode: OrbInteractionMode) =>
    set((state) => ({ orb: { ...state.orb, interactionMode } })),
    
  setAnimationState: (animationState: OrbAnimationState) =>
    set((state) => ({ orb: { ...state.orb, animationState } })),
    
  setTransitionProgress: (transitionProgress: number) =>
    set((state) => ({ orb: { ...state.orb, transitionProgress } })),
    
  setPreviousState: (previousState: OrbAnimationState | null) =>
    set((state) => ({ orb: { ...state.orb, previousState } })),
    
  setTransitionDuration: (transitionDuration: number) =>
    set((state) => ({ orb: { ...state.orb, transitionDuration } })),
    
  setAnimationSpeed: (animationSpeed: number) =>
    set((state) => ({ orb: { ...state.orb, animationSpeed } })),
    
  setParticleSystem: (config: Partial<ParticleSystemConfig>) =>
    set((state) => ({ 
      orb: { 
        ...state.orb, 
        particleSystem: { ...state.orb.particleSystem, ...config }
      } 
    })),

  setQualityLevel: (qualityLevel: QualityLevel) =>
    set((state) => ({ orb: { ...state.orb, qualityLevel } })),

  updatePerformanceMetrics: (metrics: PerformanceMetrics) =>
    set((state) => ({ 
      orb: { 
        ...state.orb, 
        performanceMetrics: { ...state.orb.performanceMetrics, ...metrics }
      } 
    }))
});
