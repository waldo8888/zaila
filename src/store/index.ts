import { create, type StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';
import { type Store, type StoreState, type ErrorState, type SessionState, type OrbState } from './types';
import { errorMiddleware } from './middleware/error';
import { persistMiddleware } from './middleware/persist';

const initialState: StoreState = {
  ui: {
    isLoading: false,
    error: null,
    success: false,
  },
  orb: {
    animationState: 'idle',
    interactionMode: 'passive',
    animationSpeed: 1.0,
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

const createStore = persistMiddleware(
  errorMiddleware<Store>((set, get) => {
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
            error: error === null ? null : {
              type: error.type || 'unknown',
              message: error.message || 'An unexpected error occurred',
              timestamp: error.timestamp || Date.now(),
              context: error.context || {},
              retryCount: error.retryCount || 0,
              recoverable: error.recoverable ?? true,
              retryAction: error.retryAction || (() => {}),
              clearAction: error.clearAction || (() => {})
            }
          },
        })),

      setSuccess: (success: boolean) =>
        set((state) => ({
          ui: { ...state.ui, success },
        })),

      // Error Actions
      clearError: () =>
        set((state) => ({
          ui: { ...state.ui, error: null },
        })),

      retryLastAction: () => {
        const state = get();
        const currentError = state.ui.error;
        if (currentError && currentError.retryAction) {
          set((state) => ({
            ui: {
              ...state.ui,
              error: {
                ...currentError,
                retryCount: currentError.retryCount + 1,
              },
            },
          }));
          currentError.retryAction();
        }
      },

      resetErrorState: () =>
        set((state) => ({
          ui: { ...state.ui, error: null },
        })),

      // Orb Actions
      setOrbAnimationState: (animationState: OrbState['animationState']) =>
        set((state) => ({
          orb: { ...state.orb, animationState },
        })),

      setOrbInteractionMode: (interactionMode: OrbState['interactionMode']) =>
        set((state) => ({
          orb: { ...state.orb, interactionMode },
        })),

      setOrbAnimationSpeed: (animationSpeed: number) =>
        set((state) => ({
          orb: { ...state.orb, animationSpeed },
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

      updateSessionMetadata: (metadata: Record<string, unknown>) =>
        set((state) => ({
          session: {
            ...state.session,
            metadata: { ...state.session.metadata, ...metadata },
          },
        })),
    };

    return store;
  }) as StateCreator<Store, [], [["zustand/devtools", never]]>
);

export const useStore = create<Store>()(
  devtools(
    createStore,
    {
      name: 'ZailaStore',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);
