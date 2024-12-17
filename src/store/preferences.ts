import { StateCreator } from 'zustand';
import { PreferenceState, StoreState } from './types';

const DEFAULT_PREFERENCES: PreferenceState = {
  theme: 'system',
  animationsEnabled: true,
  soundEnabled: true,
  language: 'en',
  accessibility: {
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium'
  },
  notifications: {
    enabled: true,
    sound: true,
    desktop: false
  }
};

export interface PreferenceSlice {
  preferences: PreferenceState;
  setTheme: (theme: PreferenceState['theme']) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setLanguage: (language: string) => void;
  setAccessibilityOption: (option: keyof PreferenceState['accessibility'], value: boolean | string) => void;
  setNotificationOption: (option: keyof PreferenceState['notifications'], value: boolean) => void;
  resetPreferences: () => void;
}

export const createPreferenceSlice: StateCreator<
  StoreState,
  [],
  [],
  PreferenceSlice
> = (set) => ({
  preferences: DEFAULT_PREFERENCES,

  setTheme: (theme) =>
    set((state) => ({
      preferences: { ...state.preferences, theme }
    })),

  setAnimationsEnabled: (enabled) =>
    set((state) => ({
      preferences: { ...state.preferences, animationsEnabled: enabled }
    })),

  setSoundEnabled: (enabled) =>
    set((state) => ({
      preferences: { ...state.preferences, soundEnabled: enabled }
    })),

  setLanguage: (language) =>
    set((state) => ({
      preferences: { ...state.preferences, language }
    })),

  setAccessibilityOption: (option, value) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        accessibility: {
          ...state.preferences.accessibility,
          [option]: value
        }
      }
    })),

  setNotificationOption: (option, value) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        notifications: {
          ...state.preferences.notifications,
          [option]: value
        }
      }
    })),

  resetPreferences: () =>
    set(() => ({
      preferences: DEFAULT_PREFERENCES
    }))
});
