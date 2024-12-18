import { ParticleSystemConfig, TransitionConfig } from './types';

export type OrbAnimationState = 'idle' | 'active' | 'success' | 'error' | 'inactive' | 'loading';
export type OrbInteractionMode = 'none' | 'hover' | 'click' | 'drag';

export interface OrbState {
  animationState: OrbAnimationState;
  isAnimating: boolean;
  interactionMode: OrbInteractionMode;
  transitionProgress: number;
  previousState: OrbAnimationState | null;
  transitionDuration: number;
  particleSystem: ParticleSystemConfig;
  animationSpeed: number;
  transitionConfig: TransitionConfig;
  transitionStartTime: number | null;
}
