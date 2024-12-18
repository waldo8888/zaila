/**
 * Preference types and validation
 */

import { Theme, FontSize } from './theme';

export interface PreferencesState {
  theme: Theme;
  fontSize: FontSize;
  autoSave: boolean;
  notifications: boolean;
  accessibility: {
    reduceMotion: boolean;
    highContrast: boolean;
    screenReader: boolean;
  };
  version: number;
}

export const DEFAULT_PREFERENCES: PreferencesState = {
  theme: 'system',
  fontSize: 'medium',
  autoSave: true,
  notifications: true,
  accessibility: {
    reduceMotion: false,
    highContrast: false,
    screenReader: false,
  },
  version: 1,
};

/**
 * Validates the preferences object structure and types
 */
export function validatePreferences(preferences: unknown): preferences is PreferencesState {
  if (!preferences || typeof preferences !== 'object') {
    return false;
  }

  const validThemes: Theme[] = ['light', 'dark', 'system'];
  const validFontSizes: FontSize[] = ['small', 'medium', 'large'];

  const p = preferences as PreferencesState;

  return (
    typeof p.theme === 'string' &&
    validThemes.includes(p.theme) &&
    typeof p.fontSize === 'string' &&
    validFontSizes.includes(p.fontSize) &&
    typeof p.autoSave === 'boolean' &&
    typeof p.notifications === 'boolean' &&
    (p.accessibility === undefined || (
      typeof p.accessibility === 'object' &&
      (p.accessibility.reduceMotion === undefined || typeof p.accessibility.reduceMotion === 'boolean') &&
      (p.accessibility.highContrast === undefined || typeof p.accessibility.highContrast === 'boolean') &&
      (p.accessibility.screenReader === undefined || typeof p.accessibility.screenReader === 'boolean')
    )) &&
    (p.version === undefined || typeof p.version === 'number')
  );
}

/**
 * Migrates preferences from older versions to current version
 */
export function migratePreferences(preferences: Partial<PreferencesState>): PreferencesState {
  const current = { ...DEFAULT_PREFERENCES };

  // Apply valid preferences
  if (validatePreferences(preferences)) {
    Object.assign(current, preferences);
  }

  // Ensure version is updated
  current.version = DEFAULT_PREFERENCES.version;
  
  return current;
}
