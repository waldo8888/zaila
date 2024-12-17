import { StateCreator, StoreApi } from 'zustand';
import { StoreState } from '../types';

const STORAGE_KEY = 'zaila_preferences';
const STORAGE_VERSION = '1.0.0';

interface StorageData {
  version: string;
  preferences: StoreState['preferences'];
  timestamp: number;
}

export const persistenceMiddleware = <T extends StoreState>(
  config: StateCreator<T>
): StateCreator<T> => (set, get, api) => {
  // Load initial state from storage
  const loadFromStorage = (): Partial<StoreState['preferences']> => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return {};

      const data = JSON.parse(stored) as StorageData;
      
      // Version check - if version mismatch, don't load potentially incompatible data
      if (data.version !== STORAGE_VERSION) {
        console.warn('Storage version mismatch, using defaults');
        return {};
      }

      return data.preferences;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return {};
    }
  };

  // Save state to storage
  const saveToStorage = (state: T) => {
    try {
      const data: StorageData = {
        version: STORAGE_VERSION,
        preferences: state.preferences,
        timestamp: Date.now()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return config((state) => {
    const nextState = typeof state === 'function' ? state(get()) : state;
    if (nextState && 'preferences' in nextState) {
      saveToStorage({ ...get(), ...nextState });
    }
    return set(state);
  }, get, api);
};
