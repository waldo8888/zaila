import { useStore } from '../index';
import type { Store } from '../types';

/**
 * Custom hook for selecting specific parts of the store state
 * @param selector Selector function to pick specific state
 * @returns Selected state
 */
export function useStoreSelector<T>(selector: (state: Store) => T): T {
  return useStore(selector);
}
