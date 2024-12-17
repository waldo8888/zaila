import { type StateCreator } from 'zustand';
import type { Store } from '../types';

interface DebugHistory {
  timestamp: number;
  action: string;
  previousState: Partial<Store>;
  nextState: Partial<Store>;
}

const MAX_HISTORY_LENGTH = 50;
let stateHistory: DebugHistory[] = [];

const addToHistory = (entry: DebugHistory) => {
  stateHistory = [entry, ...stateHistory.slice(0, MAX_HISTORY_LENGTH - 1)];
};

export const debugMiddleware = <T extends Store>(
  config: StateCreator<T, [], []>
): StateCreator<T, [], []> => (set, get, api) => {
  return config(
    (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => {
      if (process.env.NODE_ENV === 'development') {
        const previousState = get();
        const timestamp = Date.now();
        const actionName = (api.getState as any)?._action || 'anonymous';

        // Log state change
        console.group(`State Update: ${actionName}`);
        console.log('Previous State:', previousState);
        console.log('Update:', partial);
        console.log('Timestamp:', new Date(timestamp).toISOString());
        console.groupEnd();

        // Add to history
        const nextState =
          typeof partial === 'function'
            ? partial(previousState)
            : partial;
        
        addToHistory({
          timestamp,
          action: actionName,
          previousState,
          nextState: nextState as Partial<Store>,
        });
      }

      set(partial, replace);
    },
    get,
    api
  );
};

// Utility functions for accessing debug information
export const getStateHistory = () => stateHistory;

export const clearStateHistory = () => {
  stateHistory = [];
};
