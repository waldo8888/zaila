import { StateCreator } from 'zustand';
import { ErrorState, ErrorType, Store } from '../types';

export const createErrorState = (
  type: ErrorType,
  message: string,
  context: Record<string, unknown> = {},
  recoverable = true
): ErrorState => ({
  type,
  message,
  context,
  recoverable,
  timestamp: Date.now(),
});

export const errorMiddleware = <T extends Store>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  return config(
    (partial, replace) => {
      const nextState = typeof partial === 'function' ? partial(get()) : partial;

      // Handle errors in state updates
      try {
        set(nextState, replace);
      } catch (error) {
        const errorState = createErrorState(
          'unknown',
          error instanceof Error ? error.message : 'An unknown error occurred',
          { error },
          true
        );
        set({ ui: { ...get().ui, error: errorState } } as T);
      }
    },
    get,
    api
  );
};
