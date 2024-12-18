import { StateCreator } from 'zustand';
import { Store, OrbSlice } from '../types';
import { OrbState, OrbAnimationState, OrbInteractionMode, ParticleSystemConfig } from './types';

const DEFAULT_PARTICLE_CONFIG: ParticleSystemConfig = {
  enabled: false,
  emissionRate: 50,
  particleLifetime: 2,
  particleSize: 2,
  particleSpeed: 0.5,
  particleColor: '#ffffff',
  maxParticles: 1000,
};

const DEFAULT_ORB_STATE: OrbState = {
  isAnimating: false,
  interactionMode: 'passive',
  animationState: 'idle',
  transitionDuration: 0.5,
  transitionProgress: 0,
  previousState: null,
  particleSystem: DEFAULT_PARTICLE_CONFIG,
};

export const createOrbSlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  OrbSlice
> = (set, get, store) => ({
  orb: DEFAULT_ORB_STATE,

  setAnimating: (isAnimating: boolean) =>
    set((state) => ({
      orb: { ...state.orb, isAnimating }
    })),

  setInteractionMode: (interactionMode: OrbInteractionMode) =>
    set((state) => ({
      orb: { ...state.orb, interactionMode }
    })),

  setAnimationState: (animationState: OrbAnimationState) => {
    const particleSystem = {
      ...DEFAULT_PARTICLE_CONFIG,
      enabled: animationState === 'processing',
      emissionRate: animationState === 'processing' ? 100 : 50,
      particleColor: animationState === 'processing' ? '#64B5F6' : '#ffffff',
    };

    set((state) => ({
      orb: {
        ...state.orb,
        animationState,
        particleSystem,
      }
    }));
  },

  setTransitionProgress: (transitionProgress: number) =>
    set((state) => ({
      orb: { ...state.orb, transitionProgress }
    })),

  setPreviousState: (previousState: OrbAnimationState | null) =>
    set((state) => ({
      orb: { ...state.orb, previousState }
    })),

  setTransitionDuration: (transitionDuration: number) =>
    set((state) => ({
      orb: { ...state.orb, transitionDuration }
    })),

  updateParticleSystem: (config: Partial<ParticleSystemConfig>) =>
    set((state) => ({
      orb: {
        ...state.orb,
        particleSystem: {
          ...state.orb.particleSystem,
          ...config,
        }
      }
    })),
});
