import { useStore } from '..';
import { PreferencesState } from '../preferences';

export const usePreferences = () => {
  const preferences = useStore((state) => state.preferences);
  const setTheme = useStore((state) => state.setTheme);
  const setFontSize = useStore((state) => state.setFontSize);
  const setAutoSave = useStore((state) => state.setAutoSave);
  const setNotifications = useStore((state) => state.setNotifications);

  return {
    preferences,
    setTheme,
    setFontSize,
    setAutoSave,
    setNotifications,
  };
};