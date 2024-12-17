import { useStore } from './index';
import type { StoreState } from './types';

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
});

export const useOrbActions = () => ({
  setAnimationState: useStore((state) => state.setOrbAnimationState),
  setInteractionMode: useStore((state) => state.setOrbInteractionMode),
});

export const useSessionActions = () => ({
  updateContext: useStore((state) => state.updateContext),
  clearContext: useStore((state) => state.clearContext),
});
