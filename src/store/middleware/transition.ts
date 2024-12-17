import { StateCreator } from 'zustand';
import { Store } from '../types';
import { StateTransition, StateTransitionMap, TransitionEvent } from '../types/transitions';
import { UIState } from '../slices/types';
import { UISlice } from '../slices/ui';

/**
 * Default transition validation rules
 */
export const defaultTransitionRules: StateTransitionMap = {
  START_LOADING: (state) => !state.isLoading && !state.error,
  STOP_LOADING: (state) => state.isLoading,
  SET_ERROR: (state) => !state.error,
  CLEAR_ERROR: (state) => !!state.error,
  SET_SUCCESS: (state) => !state.error && !state.isLoading,
  CLEAR_SUCCESS: (state) => !!state.success,
  RESET_STATE: () => true,
};

/**
 * Creates a transition object
 */
export const createTransition = (
  event: TransitionEvent,
  from: Partial<UIState>,
  to: Partial<UIState>,
  metadata?: Record<string, unknown>
): StateTransition => ({
  event,
  from,
  to,
  timestamp: Date.now(),
  metadata,
});

/**
 * Validates if a transition is allowed
 */
export const validateTransition = (
  currentState: UIState,
  event: TransitionEvent,
  rules: StateTransitionMap = defaultTransitionRules
): boolean => {
  const validator = rules[event];
  return validator ? validator(currentState) : false;
};

/**
 * Middleware for handling state transitions
 */
export const transitionMiddleware = <T extends Store & UISlice>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  const wrapped = config(
    (...args) => {
      const prevState = get();
      set(...args);
      const nextState = get();

      // Only track UI state transitions
      if (prevState.ui !== nextState.ui) {
        const transition = createTransition(
          determineTransitionEvent(prevState.ui, nextState.ui),
          prevState.ui,
          nextState.ui
        );

        // Add transition to history if tracking is enabled
        if (nextState.ui.trackHistory) {
          get().addHistoryEntry(transition);
        }
      }
    },
    get,
    api
  );
  return wrapped;
};

/**
 * Determines the transition event based on state changes
 */
function determineTransitionEvent(
  prevState: UIState,
  nextState: UIState
): TransitionEvent {
  if (!prevState.isLoading && nextState.isLoading) return 'START_LOADING';
  if (prevState.isLoading && !nextState.isLoading) return 'STOP_LOADING';
  if (!prevState.error && nextState.error) return 'SET_ERROR';
  if (prevState.error && !nextState.error) return 'CLEAR_ERROR';
  if (!prevState.success && nextState.success) return 'SET_SUCCESS';
  if (prevState.success && !nextState.success) return 'CLEAR_SUCCESS';
  return 'RESET_STATE';
}
