import { StateCreator } from 'zustand';
import { Store } from './types';

export interface PreferencesState {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  notifications: boolean;
}

export interface PreferencesSlice {
  preferences: PreferencesState;
  setTheme: (theme: PreferencesState['theme']) => void;
  setFontSize: (size: number) => void;
  setAutoSave: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
}

const DEFAULT_PREFERENCES: PreferencesState = {
  theme: 'light',
  fontSize: 14,
  autoSave: true,
  notifications: true,
};

export const createPreferencesSlice: StateCreator<Store, [], [], PreferencesSlice> = (set) => ({
  preferences: DEFAULT_PREFERENCES,
  
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