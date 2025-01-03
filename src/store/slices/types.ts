/**
 * Core domain-specific state types
 */

// UI State Types
import { StateHistoryEntry, TransitionEvent } from '../types/transitions';
export type { StateHistoryEntry };

export type ErrorType = string;

export interface ErrorState {
  type: ErrorType;
  message: string;
  context?: Record<string, unknown>;
  recoverable: boolean;
  retryAction?: () => void;
  retryCount: number;
  timestamp: number;
}

export interface UIState {
  success: boolean;
  error: ErrorState | null;
  isLoading: boolean;
  trackHistory: boolean;
  history: StateHistoryEntry[];
  historyIndex: number;
}

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

// Orb State Types
export type QualityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderTime: number;
}

export interface ParticleSystemConfig {
  enabled: boolean;
  emissionRate: number;
  particleLifetime: number;
  particleSpeed: number;
  particleColor: string;
  maxParticles: number;
  particleSize: number;
  glowIntensity: number;
}

export interface TransitionConfig {
  duration: number;
  easing: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
}

export type OrbInteractionMode = 'none' | 'hover' | 'click' | 'drag';

export type OrbAnimationState = 'idle' | 'active' | 'success' | 'error' | 'inactive' | 'loading';

export interface OrbState {
  isAnimating: boolean;
  interactionMode: OrbInteractionMode;
  animationState: OrbAnimationState;
  transitionDuration: number;
  transitionProgress: number;
  previousState: OrbAnimationState | null;
  particleSystem: ParticleSystemConfig;
  animationSpeed: number;
  transitionConfig: TransitionConfig;
  transitionStartTime: number | null;
  qualityLevel: QualityLevel;
  performanceMetrics: PerformanceMetrics;
}

export interface OrbSlice {
  orb: OrbState;
  setAnimating: (isAnimating: boolean) => void;
  setInteractionMode: (mode: OrbInteractionMode) => void;
  setAnimationState: (state: OrbAnimationState) => void;
  setTransitionProgress: (progress: number) => void;
  setPreviousState: (state: OrbAnimationState | null) => void;
  setTransitionDuration: (duration: number) => void;
  setAnimationSpeed: (speed: number) => void;
  setParticleSystem: (config: Partial<ParticleSystemConfig>) => void;
  setQualityLevel: (level: QualityLevel) => void;
  updatePerformanceMetrics: (metrics: PerformanceMetrics) => void;
}

// Session State Types
export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  context: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface SessionSlice {
  session: SessionState;
  setSessionActive: (isActive: boolean) => void;
  updateSessionContext: (context: Record<string, unknown>) => void;
  updateSessionMetadata: (metadata: Record<string, unknown>) => void;
}

// Preferences State Types
export type Theme = 'light' | 'dark';
export type FontSize = number;

export interface PreferencesState {
  theme: Theme;
  fontSize: FontSize;
  autoSave: boolean;
  notifications: boolean;
}

export interface PreferencesSlice {
  preferences: PreferencesState;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  setAutoSave: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
}
