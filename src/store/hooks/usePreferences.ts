import { useStore } from '..';
import { PreferenceState } from '../types';

export const usePreferences = () => {
  const preferences = useStore((state) => state.preferences);
  const setTheme = useStore((state) => state.setTheme);
  const setAnimationsEnabled = useStore((state) => state.setAnimationsEnabled);
  const setSoundEnabled = useStore((state) => state.setSoundEnabled);
  const setLanguage = useStore((state) => state.setLanguage);
  const setAccessibilityOption = useStore((state) => state.setAccessibilityOption);
  const setNotificationOption = useStore((state) => state.setNotificationOption);
  const resetPreferences = useStore((state) => state.resetPreferences);

  return {
    preferences,
    setTheme,
    setAnimationsEnabled,
    setSoundEnabled,
    setLanguage,
    setAccessibilityOption,
    setNotificationOption,
    resetPreferences,
    
    // Convenience getters
    theme: preferences.theme,
    animationsEnabled: preferences.animationsEnabled,
    soundEnabled: preferences.soundEnabled,
    language: preferences.language,
    accessibility: preferences.accessibility,
    notifications: preferences.notifications,
  };
};
