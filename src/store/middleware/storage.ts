import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import type { StateCreator } from 'zustand';
import type { Store } from '../types';
import { type PreferencesState, validatePreferences, migratePreferences, DEFAULT_PREFERENCES } from '../types/preferences';

// Storage version for migration handling
const STORAGE_VERSION = 1;

// Storage configuration
const STORAGE_NAME = 'zaila-storage';

/**
 * Custom storage implementation with validation and migration
 */
const createValidatedStorage = (): StateStorage => ({
  getItem: (name: string): string | null => {
    try {
      const value = localStorage.getItem(name);
      if (!value) return null;

      const parsed = JSON.parse(value);
      
      // Validate and migrate preferences
      if (parsed.state?.preferences) {
        const preferences = parsed.state.preferences;
        if (!validatePreferences(preferences)) {
          console.warn('Invalid preferences found in storage, using defaults');
          parsed.state.preferences = DEFAULT_PREFERENCES;
        } else {
          parsed.state.preferences = migratePreferences(preferences);
        }
      }

      return JSON.stringify(parsed);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  },

  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  },

  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  },
});

/**
 * Storage middleware configuration
 */
export const storageMiddleware = <T extends Store>(
  config: StateCreator<T, [['zustand/devtools', never]]>
) =>
  persist(config, {
    name: STORAGE_NAME,
    storage: createJSONStorage(() => createValidatedStorage()),
    partialize: (state: T) => ({
      preferences: state.preferences,
    }),
    version: STORAGE_VERSION,
    onRehydrateStorage: () => (state) => {
      if (state) {
        console.log('Storage rehydrated successfully');
      } else {
        console.warn('Failed to rehydrate storage');
      }
    },
  });
