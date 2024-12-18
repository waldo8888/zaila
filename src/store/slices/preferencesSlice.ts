import { StateCreator } from 'zustand';
import { Store, PreferencesSlice } from '../types';
import { PreferencesState } from './types';

const DEFAULT_PREFERENCES_STATE: PreferencesState = {
  theme: 'light',
  fontSize: 14,
  autoSave: true,
  notifications: true,
};

export const createPreferencesSlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  PreferencesSlice
> = (set, get, store) => ({
  preferences: DEFAULT_PREFERENCES_STATE,

  setTheme: (theme: PreferencesState['theme']) =>
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
    })),
});
