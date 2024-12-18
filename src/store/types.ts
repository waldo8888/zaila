/**
 * Core state types for the application
 */

import { StateCreator } from 'zustand';
import { 
  UIState, 
  ErrorState, 
  ErrorType,
  OrbState, 
  OrbAnimationState, 
  OrbInteractionMode,
  SessionState,
  PreferencesState
} from './slices/types';

// Re-export types
export type { 
  UIState, 
  ErrorState, 
  ErrorType,
  OrbState, 
  OrbAnimationState, 
  OrbInteractionMode,
  SessionState,
  PreferencesState
};

// Slice Interfaces
export interface UISlice {
  ui: UIState;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ErrorState | null) => void;
  setSuccess: (success: boolean | string) => void;
  clearError: () => void;
}

export interface OrbSlice {
  orb: OrbState;
  setAnimating: (isAnimating: boolean) => void;
  setInteractionMode: (mode: OrbInteractionMode) => void;
  setAnimationState: (state: OrbAnimationState) => void;
  setTransitionProgress: (progress: number) => void;
  setPreviousState: (state: OrbAnimationState | null) => void;
  setTransitionDuration: (duration: number) => void;
}

export interface SessionSlice {
  session: SessionState;
}

export interface PreferencesSlice {
  preferences: PreferencesState;
}

// Combined Store Type
export type Store = UISlice & OrbSlice & SessionSlice & PreferencesSlice;
