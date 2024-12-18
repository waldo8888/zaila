/**
 * Core domain-specific state types
 */

// UI State Types
import { StateHistoryEntry } from '../types/transitions';

export type ErrorType = 'validation' | 'network' | 'auth' | 'system' | 'unknown';

export interface ErrorState {
  type: ErrorType;
  message: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
  retryAction?: () => void;
  timestamp: number;
  retryCount: number;
  clearAction?: () => void;
}

export interface UIState {
  isLoading: boolean;
  error: ErrorState | null;
  success: boolean | string;
  trackHistory: boolean;
  history: StateHistoryEntry[];
  historyIndex: number;
}

// Orb State Types
export interface OrbState {
  isAnimating: boolean;
  interactionMode: OrbInteractionMode;
  animationState: OrbAnimationState;
  transitionDuration: number;
  transitionProgress: number;
  previousState: OrbAnimationState | null;
}

export type OrbInteractionMode = 'passive' | 'active';

export type OrbAnimationState = 
  | 'idle' 
  | 'processing' 
  | 'success' 
  | 'error' 
  | 'active' 
  | 'inactive';

// Session State Types
export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  context: Record<string, unknown>;
}

// Preferences State Types
export interface PreferencesState {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  notifications: boolean;
}
