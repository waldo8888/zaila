import { useStore } from '../store';
import { Store } from '../types';
import { OrbState, OrbSlice } from '../slices/types';
import { useCallback } from 'react';
import { OrbAnimationState, OrbInteractionMode, ParticleSystemConfig } from '../types';

export const useOrb = (): OrbSlice => {
  const store = useStore();

  const orbActions: OrbSlice = {
    // State
    orb: store.orb,

    // Actions
    setAnimating: useCallback((isAnimating: boolean) => {
      store.setAnimating(isAnimating);
    }, [store]),

    setInteractionMode: useCallback((mode: OrbInteractionMode) => {
      store.setInteractionMode(mode);
    }, [store]),

    setAnimationState: useCallback((state: OrbAnimationState) => {
      store.setAnimationState(state);
    }, [store]),

    setTransitionProgress: useCallback((progress: number) => {
      store.setTransitionProgress(progress);
    }, [store]),

    setPreviousState: useCallback((state: OrbAnimationState | null) => {
      store.setPreviousState(state);
    }, [store]),

    setTransitionDuration: useCallback((duration: number) => {
      store.setTransitionDuration(duration);
    }, [store]),

    setAnimationSpeed: useCallback((speed: number) => {
      store.setAnimationSpeed(speed);
    }, [store]),

    setParticleSystem: useCallback((config: Partial<ParticleSystemConfig>) => {
      store.setParticleSystem(config);
    }, [store])
  };

  return orbActions;
};

export const useOrbState = (): OrbState => {
  const orb = useStore((state: Store) => state.orb);
  return orb;
};

export const useOrbActions = (): OrbSlice => {
  const store = useStore();
  
  return {
    // State
    orb: store.orb,

    // Actions
    setAnimating: store.setAnimating,
    setInteractionMode: store.setInteractionMode,
    setAnimationState: store.setAnimationState,
    setTransitionProgress: store.setTransitionProgress,
    setPreviousState: store.setPreviousState,
    setTransitionDuration: store.setTransitionDuration,
    setAnimationSpeed: store.setAnimationSpeed,
    setParticleSystem: store.setParticleSystem
  };
};
