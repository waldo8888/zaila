import { StateCreator } from 'zustand';
import { Store, OrbSlice } from '../types';
import { OrbState, OrbAnimationState, OrbInteractionMode } from './types';

const DEFAULT_ORB_STATE: OrbState = {
  isAnimating: false,
  interactionMode: 'passive',
  animationState: 'idle',
  transitionDuration: 0.5,
  transitionProgress: 0,
  previousState: null,
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

  setAnimationState: (animationState: OrbAnimationState) =>
    set((state) => ({
      orb: { ...state.orb, animationState }
    })),

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
});
