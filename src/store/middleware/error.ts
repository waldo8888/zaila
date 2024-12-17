import { type StateCreator } from 'zustand';
import { type Store, type ErrorState, type ErrorType } from '../types';

export const createErrorState = (
  type: ErrorType,
  message: string,
  context: Record<string, unknown> = {},
  recoverable = true
): ErrorState => ({
  type,
  message,
  timestamp: Date.now(),
  context,
  retryCount: 0,
  recoverable,
  retryAction: () => {},
  clearAction: () => {},
});

export const errorMiddleware = (
  config: StateCreator<Store, [], []>
): StateCreator<Store, [], []> => 
  (...args) => {
    const store = config(...args);
    const [set] = args;

    // Wrap state updates with error handling
    const wrappedSet: typeof set = (partial, replace) => {
      try {
        return set(partial, replace);
      } catch (error) {
        console.error('Error in state update:', error);
        
        // Update error state
        set({
          ui: {
            ...store.ui,
            error: createErrorState(
              'client',
              error instanceof Error ? error.message : 'Unknown error occurred',
              { error },
              true
            ),
          },
        });
        
        return store;
      }
    };

    return {
      ...store,
      setState: wrappedSet,
    };
  };
