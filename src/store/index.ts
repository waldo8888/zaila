import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type Store, type StoreState, type ErrorState, type SessionState } from './types';
import { errorMiddleware } from './middleware/error';

const initialState: StoreState = {
  ui: {
    isLoading: false,
    error: {
      type: null,
      message: null,
      timestamp: null,
      context: null,
      retryCount: 0,
      recoverable: true,
    },
    success: false,
  },
  orb: {
    animationState: 'idle',
    interactionMode: 'passive',
  },
  session: {
    context: {},
    lastActive: null,
    isActive: false,
    metadata: {
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    },
  },
};

const createStore = errorMiddleware<Store>((set, get) => {
  const store: Store = {
    ...initialState,

    // UI Actions
    setLoading: (isLoading: boolean) =>
      set((state) => ({
        ui: { ...state.ui, isLoading },
      })),

    setError: (error: Partial<ErrorState> | null) =>
      set((state) => ({
        ui: {
          ...state.ui,
          error: error ? { ...state.ui.error, ...error } : initialState.ui.error,
        },
        orb: {
          ...state.orb,
          animationState: error ? 'error' : 'idle',
        },
      })),

    setSuccess: (success: boolean) =>
      set((state) => ({
        ui: { ...state.ui, success },
        orb: {
          ...state.orb,
          animationState: success ? 'success' : 'idle',
        },
      })),

    // Error Actions
    clearError: () =>
      set((state) => ({
        ui: {
          ...state.ui,
          error: initialState.ui.error,
        },
        orb: {
          ...state.orb,
          animationState: 'idle',
        },
      })),

    retryLastAction: () => {
      const state = get();
      const currentError = state.ui.error;
      
      set((state) => ({
        ui: {
          ...state.ui,
          error: {
            ...currentError,
            retryCount: currentError.retryCount + 1,
          },
        },
        orb: {
          ...state.orb,
          animationState: 'processing',
        },
      }));
    },

    resetErrorState: () =>
      set((state) => ({
        ui: {
          ...state.ui,
          error: initialState.ui.error,
        },
      })),

    // Orb Actions
    setOrbAnimationState: (animationState: Store['orb']['animationState']) =>
      set((state) => ({
        orb: { ...state.orb, animationState },
      })),

    setOrbInteractionMode: (interactionMode: Store['orb']['interactionMode']) =>
      set((state) => ({
        orb: { ...state.orb, interactionMode },
      })),

    // Session Actions
    updateContext: (context: Record<string, unknown>) =>
      set((state) => ({
        session: {
          ...state.session,
          context: { ...state.session.context, ...context },
          lastActive: Date.now(),
        },
      })),

    clearContext: () =>
      set((state) => ({
        session: {
          ...state.session,
          context: {},
          lastActive: Date.now(),
        },
      })),

    setSessionActive: (isActive: boolean) =>
      set((state) => ({
        session: {
          ...state.session,
          isActive,
          lastActive: Date.now(),
        },
      })),

    updateSessionMetadata: (metadata: Partial<SessionState['metadata']>) =>
      set((state) => ({
        session: {
          ...state.session,
          metadata: {
            ...state.session.metadata,
            ...metadata,
            updatedAt: Date.now(),
          },
        },
      })),
  };

  return store;
});

export const useStore = create(devtools(createStore));
