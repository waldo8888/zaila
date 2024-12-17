/**
 * Core state types for the application
 */

import { StateCreator } from 'zustand';
import { ErrorState, ErrorType, UIState, OrbState, SessionState, PreferencesState } from './slices/types';

// Root State Type
export interface RootState {
  ui: UIState;
  orb: OrbState;
  session: SessionState;
  preferences: PreferencesState;
}

// Slice Types
export interface UISlice {
  ui: UIState;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ErrorState | null) => void;
  setSuccess: (success: boolean) => void;
  clearError: () => void;
}

export interface OrbSlice {
  orb: OrbState;
  setAnimating: (isAnimating: boolean) => void;
  setInteractionMode: (mode: OrbState['interactionMode']) => void;
}

export interface SessionSlice {
  session: SessionState;
  setActive: (isActive: boolean) => void;
  updateContext: (context: Record<string, unknown>) => void;
  clearSession: () => void;
}

export interface PreferencesSlice {
  preferences: PreferencesState;
  setTheme: (theme: PreferencesState['theme']) => void;
  setFontSize: (fontSize: number) => void;
  setAutoSave: (autoSave: boolean) => void;
  setNotifications: (notifications: boolean) => void;
}

// Store State Type
export type StoreState = RootState;
export type Store = UISlice & OrbSlice & SessionSlice & PreferencesSlice;

// Re-export common types
export type { ErrorState, ErrorType };
