import { useCallback } from 'react';
import { useStore } from '../store';
import { Store } from '../types';
import {
  OrbState,
  OrbAnimationState,
  OrbInteractionMode,
  SessionState,
  UIState,
  PreferencesState,
  ErrorState
} from '../slices/types';

// UI Selectors
export const useUIState = () => useStore((state: Store) => state.ui);
export const useLoading = () => useStore((state: Store) => state.ui.isLoading);
export const useError = () => useStore((state: Store) => state.ui.error);
export const useSuccess = () => useStore((state: Store) => state.ui.success);
export const useHistory = () => useStore((state: Store) => state.ui.history);
export const useHistoryIndex = () => useStore((state: Store) => state.ui.historyIndex);

export const useUIActions = () => {
  const {
    setLoading,
    setError,
    setSuccess,
    clearError,
    retryLastAction,
    resetErrorState,
    addHistoryEntry,
    clearHistory,
    undoLastAction,
    redoLastAction
  } = useStore();

  return {
    setLoading,
    setError,
    setSuccess,
    clearError,
    retryLastAction,
    resetErrorState,
    addHistoryEntry,
    clearHistory,
    undoLastAction,
    redoLastAction
  };
};

// Orb Selectors
export const useOrbState = () => useStore((state: Store) => state.orb);
export const useOrbAnimationState = () => useStore((state: Store) => state.orb.animationState);
export const useOrbInteractionMode = () => useStore((state: Store) => state.orb.interactionMode);
export const useOrbAnimationSpeed = () => useStore((state: Store) => state.orb.animationSpeed);

export const useOrbActions = () => {
  const {
    setAnimating,
    setAnimationState,
    setInteractionMode,
    setParticleSystem,
    setAnimationSpeed
  } = useStore();

  return {
    setAnimating,
    setAnimationState,
    setInteractionMode,
    setParticleSystem,
    setAnimationSpeed
  };
};

// Session Selectors
export const useSessionState = () => useStore((state: Store) => state.session);
export const useSessionContext = () => useStore((state: Store) => state.session.context);
export const useSessionActive = () => useStore((state: Store) => state.session.isActive);
export const useLastActivity = () => useStore((state: Store) => state.session.lastActivity);

export const useSessionActions = () => {
  const {
    setSessionActive,
    updateSessionContext,
    updateSessionMetadata
  } = useStore();

  return {
    setSessionActive,
    updateSessionContext,
    updateSessionMetadata
  };
};

// Preferences Selectors
export const usePreferencesState = () => useStore((state: Store) => state.preferences);
export const useTheme = () => useStore((state: Store) => state.preferences.theme);
export const useFontSize = () => useStore((state: Store) => state.preferences.fontSize);
export const useAutoSave = () => useStore((state: Store) => state.preferences.autoSave);
export const useNotifications = () => useStore((state: Store) => state.preferences.notifications);

export const usePreferencesActions = () => {
  const {
    setTheme,
    setFontSize,
    setAutoSave,
    setNotifications
  } = useStore();

  return {
    setTheme,
    setFontSize,
    setAutoSave,
    setNotifications
  };
};
