import { StateCreator } from 'zustand';
import { RootState } from '../types';
import { OrbState } from './types';

const DEFAULT_ORB_STATE: OrbState = {
  isAnimating: false,
  interactionMode: 'idle',
};

export interface OrbSlice {
  orb: OrbState;
  setAnimating: (isAnimating: boolean) => void;
  setInteractionMode: (mode: OrbState['interactionMode']) => void;
}

export const createOrbSlice: StateCreator<RootState, [], [], OrbSlice> = (set) => ({
  orb: DEFAULT_ORB_STATE,

  setAnimating: (isAnimating: boolean) =>
    set((state: RootState) => ({
      orb: {
        ...state.orb,
        isAnimating,
      },
    })),

  setInteractionMode: (mode: OrbState['interactionMode']) =>
    set((state: RootState) => ({
      orb: {
        ...state.orb,
        interactionMode: mode,
      },
    })),
});
