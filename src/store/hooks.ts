import { useStore } from './store';
import { Store } from './types';
import { OrbState, SessionState, UIState, PreferencesState } from './slices/types';

// UI Hooks
export const useUIState = () => useStore((state: Store) => state.ui);
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

// Session Hooks
export const useSessionState = () => useStore((state: Store) => state.session);
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

// Orb Hooks
export const useOrbState = () => useStore((state: Store) => state.orb);
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

// Preferences Hooks
export const usePreferencesState = () => useStore((state: Store) => state.preferences);
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
