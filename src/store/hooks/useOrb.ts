import { useStoreSelector } from './useStoreSelector';
import type { Store } from '../types';

export const useOrb = () => {
  const orb = useStoreSelector((state: Store) => state.orb);
  const setOrbAnimationState = useStoreSelector((state: Store) => state.setOrbAnimationState);
  const setOrbInteractionMode = useStoreSelector((state: Store) => state.setOrbInteractionMode);

  return {
    ...orb,
    setOrbAnimationState,
    setOrbInteractionMode,
  };
};
