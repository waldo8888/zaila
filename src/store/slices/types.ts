/**
 * Core domain-specific state types
 */

// UI State Types
export interface UIState {
  isLoading: boolean;
  error: ErrorState | null;
  success: boolean;
}

export interface ErrorState {
  type: ErrorType;
  message: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
  timestamp: number;
}

export type ErrorType = 'validation' | 'network' | 'auth' | 'unknown';

// Orb State Types
export interface OrbState {
  isAnimating: boolean;
  interactionMode: OrbInteractionMode;
}

export type OrbInteractionMode = 'idle' | 'rotating' | 'zooming';

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
