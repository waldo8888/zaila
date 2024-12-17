import { StateCreator } from 'zustand';
import { ErrorState, ErrorType, Store } from '../types';
import { shouldPersistError } from '@/utils/errors';

const PERSISTED_ERROR_KEY = 'zaila_persisted_error';

const isBrowser = typeof window !== 'undefined';

export const createErrorState = (
  type: ErrorType,
  message: string,
  context: Record<string, unknown> = {},
  recoverable = true,
  retryAction?: () => void
): ErrorState => ({
  type,
  message,
  context,
  recoverable,
  retryAction,
  timestamp: Date.now(),
});

/**
 * Loads persisted error from storage if it exists and is still valid
 */
const loadPersistedError = (): ErrorState | null => {
  if (!isBrowser) return null;
  
  try {
    const stored = localStorage.getItem(PERSISTED_ERROR_KEY);
    if (!stored) return null;

    const error = JSON.parse(stored) as ErrorState;
    if (!shouldPersistError(error)) {
      localStorage.removeItem(PERSISTED_ERROR_KEY);
      return null;
    }

    return error;
  } catch {
    localStorage.removeItem(PERSISTED_ERROR_KEY);
    return null;
  }
};

/**
 * Persists error to storage if it meets persistence criteria
 */
const persistError = (error: ErrorState | null) => {
  if (!isBrowser) return;

  try {
    if (error && shouldPersistError(error)) {
      localStorage.setItem(PERSISTED_ERROR_KEY, JSON.stringify(error));
    } else {
      localStorage.removeItem(PERSISTED_ERROR_KEY);
    }
  } catch {
    // Ignore storage errors
  }
};

export const errorMiddleware = <T extends Store>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  // Load persisted error on initialization
  const persistedError = loadPersistedError();
  if (persistedError) {
    setTimeout(() => {
      set({ ui: { ...get().ui, error: persistedError } } as T);
    }, 0);
  }

  return config(
    (partial, replace) => {
      const nextState = typeof partial === 'function' ? partial(get()) : partial;

      // Handle errors in state updates
      try {
        set(nextState, replace);

        // Handle error persistence when error state changes
        const currentError = get().ui.error;
        persistError(currentError);

      } catch (error) {
        const errorState = createErrorState(
          'unknown',
          error instanceof Error ? error.message : 'An unknown error occurred',
          { error },
          true
        );
        set({ ui: { ...get().ui, error: errorState } } as T);
        persistError(errorState);
      }
    },
    get,
    api
  );
};
