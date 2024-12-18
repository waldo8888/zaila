/**
 * Core state types for the application
 */

import { StateCreator } from 'zustand';
import { 
  UIState, 
  ErrorState, 
  ErrorType,
  SessionState,
  PreferencesState,
  ParticleSystemConfig,
  TransitionConfig
} from './slices/types';

import { 
  OrbState, 
  OrbAnimationState, 
  OrbInteractionMode 
} from './slices/orb.types';

import { StateHistoryEntry } from './types/transitions';

// Re-export types
export type { 
  UIState, 
  ErrorState, 
  ErrorType,
  OrbState, 
  OrbAnimationState, 
  OrbInteractionMode,
  SessionState,
  PreferencesState,
  ParticleSystemConfig,
  StateHistoryEntry,
  TransitionConfig
};

// Slice Interfaces
export interface UISlice {
  ui: UIState;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ErrorState | null) => void;
  setSuccess: (success: boolean) => void;
  clearError: () => void;
  retryLastAction: () => void;
  resetErrorState: () => void;
  addHistoryEntry: (entry: StateHistoryEntry) => void;
  clearHistory: () => void;
  undoLastAction: () => void;
  redoLastAction: () => void;
}

export interface OrbSlice {
  orb: OrbState;
  setAnimating: (isAnimating: boolean) => void;
  setInteractionMode: (mode: OrbInteractionMode) => void;
  setAnimationState: (state: OrbAnimationState) => void;
  setTransitionProgress: (progress: number) => void;
  setPreviousState: (state: OrbAnimationState | null) => void;
  setTransitionDuration: (duration: number) => void;
  setParticleSystem: (config: Partial<ParticleSystemConfig>) => void;
  setAnimationSpeed: (speed: number) => void;
}

export interface SessionSlice {
  session: SessionState;
  setSessionActive: (isActive: boolean) => void;
  updateSessionContext: (context: Record<string, unknown>) => void;
  updateSessionMetadata: (metadata: Record<string, unknown>) => void;
}

export interface PreferencesSlice {
  preferences: PreferencesState;
  setTheme: (theme: 'light' | 'dark') => void;
  setFontSize: (size: number) => void;
  setAutoSave: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
}

// Combined Store Type
export type Store = UISlice & OrbSlice & SessionSlice & PreferencesSlice;

// Slice Creator Types
export type UISliceCreator = StateCreator<Store, [], [], UISlice>;
export type OrbSliceCreator = StateCreator<Store, [], [], OrbSlice>;
export type SessionSliceCreator = StateCreator<Store, [], [], SessionSlice>;
export type PreferencesSliceCreator = StateCreator<Store, [], [], PreferencesSlice>;
