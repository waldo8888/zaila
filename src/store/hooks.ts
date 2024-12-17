import { useStore } from './index';
import type { StoreState, OrbState } from './types';

// Type-safe selector hooks for UI state
export const useUIState = () => useStore((state) => state.ui);
export const useLoading = () => useStore((state) => state.ui.isLoading);
export const useError = () => useStore((state) => state.ui.error);
export const useSuccess = () => useStore((state) => state.ui.success);

// Type-safe selector hooks for Orb state
export const useOrbState = () => useStore((state) => state.orb);
export const useOrbAnimationState = () => 
  useStore((state) => state.orb.animationState);
export const useOrbInteractionMode = () =>
  useStore((state) => state.orb.interactionMode);

// Type-safe selector hooks for Session state
export const useSessionState = () => useStore((state) => state.session);
export const useSessionContext = () => useStore((state) => state.session.context);

// Type-safe action hooks
export const useUIActions = () => ({
  setLoading: useStore((state) => state.setLoading),
  setError: useStore((state) => state.setError),
  setSuccess: useStore((state) => state.setSuccess),
  clearError: useStore((state) => state.clearError),
  retryLastAction: useStore((state) => state.retryLastAction),
  resetErrorState: useStore((state) => state.resetErrorState),
});

export const useOrbActions = () => {
  const store = useStore();
  return {
    setAnimationState: (state: OrbState['animationState']) => 
      store.setOrbAnimationState(state),
    setInteractionMode: (mode: OrbState['interactionMode']) =>
      store.setOrbInteractionMode(mode),
  };
};

export const useSessionActions = () => {
  const store = useStore();
  return {
    updateContext: store.updateContext,
    clearContext: store.clearContext,
    setSessionActive: store.setSessionActive,
    updateSessionMetadata: store.updateSessionMetadata,
  };
};
