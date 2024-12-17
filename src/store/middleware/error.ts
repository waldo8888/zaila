import { type StateCreator } from 'zustand';
import { type Store, type ErrorState, type ErrorType } from '../types';

interface LastAction {
  type: string;
  payload: unknown;
  timestamp: number;
}

let lastAction: LastAction | null = null;

const createDefaultErrorState = (): ErrorState => ({
  type: null,
  message: null,
  timestamp: null,
  context: null,
  retryCount: 0,
  recoverable: true,
});

export const errorMiddleware = <T extends Store>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  const wrappedSet: typeof set = (...args) => {
    try {
      // Record the action being attempted
      const actionType = (api.getState as any)?._action || 'anonymous';
      lastAction = {
        type: actionType,
        payload: args[0],
        timestamp: Date.now(),
      };

      return set(...args);
    } catch (error) {
      console.error('Error in state update:', error);
      
      // Update error state
      const errorState: ErrorState = {
        type: 'system',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: Date.now(),
        context: {
          action: lastAction?.type,
          payload: lastAction?.payload,
        },
        retryCount: 0,
        recoverable: true,
      };

      set(
        {
          ui: {
            ...(get() as Store).ui,
            error: errorState,
          },
          orb: {
            ...(get() as Store).orb,
            animationState: 'error',
          },
        } as Partial<T>
      );

      throw error; // Re-throw for debugging purposes
    }
  };

  const storeWithError = config(
    (partial, replace) => {
      // Intercept state updates
      const nextState = typeof partial === 'function' ? partial(get()) : partial;
      
      // Handle error state changes
      if ('ui' in nextState && 'error' in nextState.ui) {
        const error = nextState.ui.error;
        if (error && error.type) {
          // Add timestamp if not present
          if (!error.timestamp) {
            error.timestamp = Date.now();
          }

          // Add retry action if recoverable
          if (error.recoverable && !error.retryAction) {
            error.retryAction = () => {
              const store = get() as Store;
              store.retryLastAction();
            };
          }

          // Add clear action
          if (!error.clearAction) {
            error.clearAction = () => {
              const store = get() as Store;
              store.clearError();
            };
          }

          // Log error for debugging
          console.error('Error occurred:', {
            type: error.type,
            message: error.message,
            context: error.context,
            timestamp: new Date(error.timestamp).toISOString(),
            retryCount: error.retryCount,
          });
        }
      }

      set(partial, replace);
    },
    get,
    api
  );

  return {
    ...storeWithError,
    clearError: () =>
      set(
        {
          ui: {
            ...(get() as Store).ui,
            error: createDefaultErrorState(),
          },
          orb: {
            ...(get() as Store).orb,
            animationState: 'idle',
          },
        } as Partial<T>
      ),
    retryLastAction: () => {
      if (!lastAction) return;

      const currentState = get() as Store;
      const currentError = currentState.ui.error;

      set(
        {
          ui: {
            ...currentState.ui,
            error: {
              ...currentError,
              retryCount: currentError.retryCount + 1,
            },
          },
        } as Partial<T>
      );

      // Attempt to replay the last action
      try {
        set(lastAction.payload as Partial<T>);
      } catch (error) {
        console.error('Error retrying action:', error);
      }
    },
    resetErrorState: () =>
      set(
        {
          ui: {
            ...(get() as Store).ui,
            error: createDefaultErrorState(),
          },
        } as Partial<T>
      ),
  };
};

export const createErrorState = (
  type: ErrorType,
  message: string,
  context?: Record<string, unknown>,
  recoverable: boolean = true
): Partial<ErrorState> => ({
  type,
  message,
  context: context || null,
  timestamp: Date.now(),
  retryCount: 0,
  recoverable,
});
