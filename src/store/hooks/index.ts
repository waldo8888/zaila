import { useStore } from '..';
import { Store } from '../types';

export const useStoreSelector = <T>(selector: (state: Store) => T): T => {
  return useStore(selector);
};

export * from './usePreferences';
export * from './useOrb';
export { useUI } from './useUI';
export { useSession } from './useSession';
