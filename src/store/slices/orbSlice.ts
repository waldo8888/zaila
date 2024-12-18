import { StateCreator } from 'zustand';
import { Store } from '../types';
import { OrbState, OrbAnimationState, OrbInteractionMode, ParticleSystemConfig, OrbSlice } from './types';

const DEFAULT_PARTICLE_CONFIG: ParticleSystemConfig = {
  enabled: true,
  emissionRate: 50,
  particleLifetime: 2,
  particleSize: 0.1,
  particleSpeed: 1,
  particleColor: '#ffffff',
  maxParticles: 5000,
  glowIntensity: 1.0,
  qualityLevel: 'HIGH'
};

const DEFAULT_ORB_STATE: OrbState = {
  isAnimating: false,
  interactionMode: 'none',
  animationState: 'idle',
  transitionDuration: 0.3,
  transitionProgress: 0,
  previousState: null,
  particleSystem: DEFAULT_PARTICLE_CONFIG,
  animationSpeed: 1,
  transitionConfig: {
    duration: 800,
    easing: 'easeInOut'
  },
  transitionStartTime: null
};

export const createOrbSlice: StateCreator<Store, [], [], OrbSlice> = (set) => ({
  orb: DEFAULT_ORB_STATE,
  
  setAnimating: (isAnimating: boolean) => 
    set((state) => ({ 
      orb: { ...state.orb, isAnimating } 
    })),

  setInteractionMode: (mode: OrbInteractionMode) => 
    set((state) => ({ 
      orb: { ...state.orb, interactionMode: mode } 
    })),

  setAnimationState: (animState: OrbAnimationState) => {
    const particleSystem = {
      ...DEFAULT_PARTICLE_CONFIG,
      enabled: animState === 'loading',
      emissionRate: animState === 'loading' ? 100 : 50,
      particleColor: animState === 'loading' ? '#64B5F6' : '#ffffff',
    };

    set((state) => ({ 
      orb: { 
        ...state.orb, 
        animationState: animState,
        particleSystem
      } 
    }));
  },

  setTransitionProgress: (progress: number) => 
    set((state) => ({ 
      orb: { ...state.orb, transitionProgress: progress } 
    })),

  setPreviousState: (prevState: OrbAnimationState | null) => 
    set((state) => ({ 
      orb: { ...state.orb, previousState: prevState } 
    })),

  setTransitionDuration: (duration: number) => 
    set((state) => ({ 
      orb: { ...state.orb, transitionDuration: duration } 
    })),

  setAnimationSpeed: (animationSpeed: number) => 
    set((state) => ({ 
      orb: { ...state.orb, animationSpeed } 
    })),

  setParticleSystem: (config: Partial<ParticleSystemConfig>) => 
    set((state) => ({ 
      orb: { 
        ...state.orb, 
        particleSystem: {
          ...state.orb.particleSystem,
          ...config
        }
      } 
    }))
});
