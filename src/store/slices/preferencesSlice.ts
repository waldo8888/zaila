import { StateCreator } from 'zustand';
import { RootState } from '../types';
import { PreferencesState } from './types';

const DEFAULT_PREFERENCES_STATE: PreferencesState = {
  theme: 'light',
  fontSize: 14,
  autoSave: true,
  notifications: true,
};

export const createPreferencesSlice: StateCreator<RootState, [], [], PreferencesSlice> = (set) => ({
  preferences: DEFAULT_PREFERENCES_STATE,

  setTheme: (theme) =>
    set((state) => ({
      preferences: { ...state.preferences, theme }
    })),

  setFontSize: (fontSize) =>
    set((state) => ({
      preferences: { ...state.preferences, fontSize }
    })),

  setAutoSave: (autoSave) =>
    set((state) => ({
      preferences: { ...state.preferences, autoSave }
    })),

  setNotifications: (notifications) =>
    set((state) => ({
      preferences: { ...state.preferences, notifications }
    })),
});

export interface PreferencesSlice {
  preferences: PreferencesState;
  setTheme: (theme: PreferencesState['theme']) => void;
  setFontSize: (fontSize: number) => void;
  setAutoSave: (autoSave: boolean) => void;
  setNotifications: (notifications: boolean) => void;
}
