import { StateCreator, StoreApi } from 'zustand';
import { Store, StoreState } from '../types';

const STORAGE_KEY = 'zaila_preferences';
const STORAGE_VERSION = '1.0.0';

interface StorageData {
  version: string;
  preferences: StoreState['preferences'];
  timestamp: number;
}

export const persistenceMiddleware = (
  config: StateCreator<Store, [], []>
): StateCreator<Store, [], []> => 
  (set, get, api) => {
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
    const saveToStorage = (state: Store) => {
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

    // Initialize store with persistence
    const store = config((partial, replace) => {
      const state = get();
      const nextState = typeof partial === 'function' ? partial(state) : partial;
      
      // Only save if preferences were modified
      if (nextState && 'preferences' in nextState) {
        saveToStorage({ ...state, ...nextState });
      }
      
      set(partial, replace);
    }, get, api);

    // Load initial state
    const initialPreferences = loadFromStorage();
    if (Object.keys(initialPreferences).length > 0) {
      set({ preferences: initialPreferences } as Partial<Store>);
    }

    return store;
  };