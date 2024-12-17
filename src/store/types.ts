/**
 * Core state types for the application
 */

// Error types
export type ErrorType = 
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'server'
  | 'client'
  | 'unknown';

export interface ErrorState {
  type: ErrorType;
  message: string;
  timestamp: number;
  context: Record<string, unknown>;
  retryCount: number;
  recoverable: boolean;
  retryAction: () => void;
  clearAction: () => void;
}

// UI State types
export interface UIState {
  isLoading: boolean;
  error: ErrorState | null;
  success: boolean;
}

// Orb State types
export interface OrbState {
  animationState: 'idle' | 'processing' | 'success' | 'error';
  interactionMode: 'active' | 'passive';
  animationSpeed: number;
}

// Session State types
export interface SessionState {
  context: Record<string, unknown>;
  isActive: boolean;
  lastActive: number | null;
  metadata: Record<string, unknown>;
}

// Combined store state type
export interface StoreState {
  ui: UIState;
  orb: OrbState;
  session: SessionState;
}

// Store actions type
export interface StoreActions {
  // UI actions
  setLoading: (isLoading: boolean) => void;
  setError: (error: Partial<ErrorState> | null) => void;
  setSuccess: (success: boolean) => void;
  
  // Error handling actions
  clearError: () => void;
  retryLastAction: () => void;
  resetErrorState: () => void;
  
  // Orb actions
  setOrbAnimationState: (state: OrbState['animationState']) => void;
  setOrbInteractionMode: (mode: OrbState['interactionMode']) => void;
  setOrbAnimationSpeed: (speed: number) => void;
  
  // Session actions
  updateContext: (context: Record<string, unknown>) => void;
  clearContext: () => void;
  setSessionActive: (isActive: boolean) => void;
  updateSessionMetadata: (metadata: Record<string, unknown>) => void;
}

// Combined store type
export type Store = StoreState & StoreActions;
