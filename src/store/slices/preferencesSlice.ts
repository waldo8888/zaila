import { StateCreator } from 'zustand';
import { Store } from '../types';
import { PreferencesState, PreferencesSlice } from './types';

const DEFAULT_PREFERENCES_STATE: PreferencesState = {
  theme: 'light',
  fontSize: 16,
  autoSave: true,
  notifications: true,
};

export const createPreferencesSlice: StateCreator<Store, [], [], PreferencesSlice> = (set) => ({
  preferences: DEFAULT_PREFERENCES_STATE,

  setTheme: (theme: 'light' | 'dark') =>
    set((state) => ({
      preferences: { ...state.preferences, theme }
    })),

  setFontSize: (fontSize: number) =>
    set((state) => ({
      preferences: { ...state.preferences, fontSize }
    })),

  setAutoSave: (autoSave: boolean) =>
    set((state) => ({
      preferences: { ...state.preferences, autoSave }
    })),

  setNotifications: (notifications: boolean) =>
    set((state) => ({
      preferences: { ...state.preferences, notifications }
    }))
});
