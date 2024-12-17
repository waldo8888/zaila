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
  | 'unknown'
  | null;

export interface ErrorState {
  type: ErrorType;
  message: string | null;
  timestamp: number | null;
  context: Record<string, unknown> | null;
  retryCount: number;
  recoverable: boolean;
  retryAction?: () => void;
  clearAction?: () => void;
}

// UI State types
export interface UIState {
  isLoading: boolean;
  error: ErrorState;
  success: boolean;
}

// Orb State types
export interface OrbState {
  animationState: 'idle' | 'processing' | 'success' | 'error';
  interactionMode: 'active' | 'passive';
}

// Session State types
export interface SessionState {
  context: Record<string, unknown>;
  lastActive: number | null;
  isActive: boolean;
  metadata: {
    version: number;
    createdAt: number;
    updatedAt: number;
  };
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
  
  // Session actions
  updateContext: (context: Record<string, unknown>) => void;
  clearContext: () => void;
  setSessionActive: (isActive: boolean) => void;
  updateSessionMetadata: (metadata: Partial<SessionState['metadata']>) => void;
}

// Combined store type
export type Store = StoreState & StoreActions;
