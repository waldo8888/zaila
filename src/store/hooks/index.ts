import { useStore } from '..';
import { Store } from '../types';
import { useOrbActions, useOrbState } from './selectors';
import { usePreferences } from './usePreferences';
import { useOrb } from './useOrb';
import { useUI } from './useUI';
import { useSession } from './useSession';

export const useStoreSelector = <T>(selector: (state: Store) => T): T => {
  return useStore(selector);
};

// Export all hooks
export {
  useOrbActions,
  useOrbState,
  usePreferences,
  useOrb,
  useUI,
  useSession
};
