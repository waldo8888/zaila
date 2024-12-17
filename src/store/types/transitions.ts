import { UIState } from '../slices/types';

/**
 * Represents a state transition event
 */
export type TransitionEvent = 
  | 'START_LOADING'
  | 'STOP_LOADING'
  | 'SET_ERROR'
  | 'CLEAR_ERROR'
  | 'SET_SUCCESS'
  | 'CLEAR_SUCCESS'
  | 'RESET_STATE';

/**
 * Maps current state to allowed next states
 */
export type StateTransitionMap = {
  [K in TransitionEvent]: (state: UIState) => boolean;
};

/**
 * Represents a state transition
 */
export interface StateTransition {
  event: TransitionEvent;
  from: Partial<UIState>;
  to: Partial<UIState>;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

/**
 * History entry for state transitions
 */
export interface StateHistoryEntry {
  transition: StateTransition;
  snapshot: UIState;
  id: string;
}
