import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { persistenceMiddleware } from './middleware/persistence';
import { errorMiddleware } from './middleware/error';
import { createPreferencesSlice } from './preferences';
import { Store, StoreState, ErrorState } from './types';
import { createErrorState } from './middleware/error';

// Default state values
const defaultUIState: StoreState['ui'] = {
  isLoading: false,
  error: null,
  success: false,
};

const defaultOrbState: StoreState['orb'] = {
  animationState: 'idle',
  interactionMode: 'passive',
  animationSpeed: 1,
};

const defaultSessionState: StoreState['session'] = {
  context: {},
  isActive: false,
  lastActive: null,
  metadata: {},
};

// Create store with all slices and actions
const createStore = () => {
  return create<Store>()(
    devtools(
      errorMiddleware(
        persistenceMiddleware(
          (...args) => ({
            ...createPreferencesSlice(...args),
            
            // UI slice
            ui: defaultUIState,
            setLoading: (isLoading: boolean) =>
              args[0]((state) => ({ ui: { ...state.ui, isLoading } })),
            setError: (error: Partial<ErrorState> | null) =>
              args[0]((state) => ({
                ui: {
                  ...state.ui,
                  error: error === null ? null : {
                    type: error.type || 'unknown',
                    message: error.message || 'An unknown error occurred',
                    timestamp: error.timestamp || Date.now(),
                    context: error.context || {},
                    retryCount: error.retryCount || 0,
                    recoverable: error.recoverable ?? true,
                    retryAction: error.retryAction || (() => {}),
                    clearAction: error.clearAction || (() => {}),
                  }
                }
              })),
            setSuccess: (success: boolean) =>
              args[0]((state) => ({ ui: { ...state.ui, success } })),
            
            // Error handling
            clearError: () =>
              args[0]((state) => ({ ui: { ...state.ui, error: null } })),
            retryLastAction: () =>
              args[0]((state) => {
                if (state.ui.error?.retryAction) {
                  state.ui.error.retryAction();
                }
                return state;
              }),
            resetErrorState: () =>
              args[0](() => ({ ui: defaultUIState })),
            
            // Orb slice
            orb: defaultOrbState,
            setOrbAnimationState: (animationState) =>
              args[0]((state) => ({ orb: { ...state.orb, animationState } })),
            setOrbInteractionMode: (interactionMode) =>
              args[0]((state) => ({ orb: { ...state.orb, interactionMode } })),
            setOrbAnimationSpeed: (animationSpeed) =>
              args[0]((state) => ({ orb: { ...state.orb, animationSpeed } })),
            
            // Session slice
            session: defaultSessionState,
            updateContext: (context) =>
              args[0]((state) => ({
                session: { ...state.session, context }
              })),
            clearContext: () =>
              args[0]((state) => ({
                session: { ...state.session, context: {} }
              })),
            setSessionActive: (isActive) =>
              args[0]((state) => ({
                session: {
                  ...state.session,
                  isActive,
                  lastActive: isActive ? Date.now() : state.session.lastActive
                }
              })),
            updateSessionMetadata: (metadata) =>
              args[0]((state) => ({
                session: { ...state.session, metadata }
              })),
          })
        )
      )
    )
  );
};

export const useStore = createStore();
