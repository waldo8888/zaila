import { useCallback } from 'react';
import { useStore } from '..';
import type { Store } from '../types';

// UI Selectors
export const selectIsLoading = (state: Store) => state.ui.isLoading;
export const selectError = (state: Store) => state.ui.error;
export const selectSuccess = (state: Store) => state.ui.success;

// Orb Selectors
export const selectIsAnimating = (state: Store) => state.orb.isAnimating;
export const selectInteractionMode = (state: Store) => state.orb.interactionMode;

// Session Selectors
export const selectIsActive = (state: Store) => state.session.isActive;
export const selectLastActivity = (state: Store) => state.session.lastActivity;
export const selectContext = (state: Store) => state.session.context;

// Preferences Selectors
export const selectTheme = (state: Store) => state.preferences.theme;
export const selectFontSize = (state: Store) => state.preferences.fontSize;
export const selectAutoSave = (state: Store) => state.preferences.autoSave;
export const selectNotifications = (state: Store) => state.preferences.notifications;

// Hook Selectors
export const useUIState = () => ({
  isLoading: useStore(selectIsLoading),
  error: useStore(selectError),
  success: useStore(selectSuccess),
});

export const useOrbState = () => ({
  isAnimating: useStore(selectIsAnimating),
  interactionMode: useStore(selectInteractionMode),
});

export const useSessionState = () => ({
  isActive: useStore(selectIsActive),
  lastActivity: useStore(selectLastActivity),
  context: useStore(selectContext),
});

export const usePreferencesState = () => ({
  theme: useStore(selectTheme),
  fontSize: useStore(selectFontSize),
  autoSave: useStore(selectAutoSave),
  notifications: useStore(selectNotifications),
});

// Action Hooks
export const useUIActions = () => {
  const store = useStore();
  return {
    setLoading: store.setLoading,
    setError: store.setError,
    setSuccess: store.setSuccess,
    clearError: store.clearError,
  };
};

export const useOrbActions = () => {
  const store = useStore();
  return {
    setAnimating: store.setAnimating,
    setInteractionMode: store.setInteractionMode,
  };
};

export const useSessionActions = () => {
  const store = useStore();
  return {
    setActive: store.setActive,
    updateContext: store.updateContext,
    clearSession: store.clearSession,
  };
};

export const usePreferencesActions = () => {
  const store = useStore();
  return {
    setTheme: store.setTheme,
    setFontSize: store.setFontSize,
    setAutoSave: store.setAutoSave,
    setNotifications: store.setNotifications,
  };
};
