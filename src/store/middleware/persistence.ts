import { StateCreator } from 'zustand';
import { Store } from '../types';

const STORAGE_KEY = 'app_state';

export const persistMiddleware = <T extends Store>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  // Load persisted state on initialization
  let persistedState: Partial<T> = {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      persistedState = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load persisted state:', error);
  }

  return config(
    (partial, replace) => {
      const nextState = typeof partial === 'function' ? partial(get()) : partial;
      set(nextState, replace);

      // Persist state after update
      try {
        const state = get();
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
          preferences: state.preferences,
          session: {
            context: state.session.context
          }
        }));
      } catch (error) {
        console.error('Failed to persist state:', error);
      }
    },
    get,
    api
  );
};