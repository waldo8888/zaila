import { useStore } from '..';
import { Store } from '../types';

export const useStoreSelector = <T>(selector: (state: Store) => T): T => {
  return useStore(selector);
};

// Export all selectors and action hooks
export * from './selectors';

// Export legacy hooks for backward compatibility
export * from './usePreferences';
export * from './useOrb';
export { useUI } from './useUI';
export { useSession } from './useSession';
