import { useStore } from '../store';
import { Store } from '../types';
import { 
  OrbState, 
  OrbSlice, 
  OrbAnimationState, 
  OrbInteractionMode, 
  ParticleSystemConfig, 
  QualityLevel, 
  PerformanceMetrics 
} from '../slices/types';
import { useCallback } from 'react';

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
    }, [store]),

    setQualityLevel: useCallback((level: QualityLevel) => {
      store.setQualityLevel(level);
    }, [store]),

    updatePerformanceMetrics: useCallback((metrics: PerformanceMetrics) => {
      store.updatePerformanceMetrics(metrics);
    }, [store])
  };

  return orbActions;
};

export const useOrbState = (): OrbState => {
  const store = useStore();
  return store.orb;
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
    setParticleSystem: store.setParticleSystem,
    setQualityLevel: store.setQualityLevel,
    updatePerformanceMetrics: store.updatePerformanceMetrics
  };
};

// Selector hooks for specific state values
export const useOrbAnimating = (): boolean => {
  const store = useStore();
  return store.orb.isAnimating;
};

export const useOrbInteractionMode = (): OrbInteractionMode => {
  const store = useStore();
  return store.orb.interactionMode;
};

export const useOrbAnimationState = (): OrbAnimationState | null => {
  const store = useStore();
  return store.orb.animationState;
};

export const useOrbTransitionProgress = (): number => {
  const store = useStore();
  return store.orb.transitionProgress;
};

export const useOrbPreviousState = (): OrbAnimationState | null => {
  const store = useStore();
  return store.orb.previousState;
};

export const useOrbTransitionDuration = (): number => {
  const store = useStore();
  return store.orb.transitionDuration;
};

export const useOrbAnimationSpeed = (): number => {
  const store = useStore();
  return store.orb.animationSpeed;
};

export const useOrbParticleSystem = (): ParticleSystemConfig => {
  const store = useStore();
  return store.orb.particleSystem;
};

export const useOrbQualityLevel = (): QualityLevel => {
  const store = useStore();
  return store.orb.qualityLevel;
};

export const useOrbPerformanceMetrics = (): PerformanceMetrics => {
  const store = useStore();
  return store.orb.performanceMetrics;
};
