import { useStore } from '../store';
import { Store, OrbState } from '../types';

export const useOrbState = (): OrbState => {
  const orb = useStore((state: Store) => state.orb);
  return orb;
};

export const useOrbActions = () => {
  const setAnimating = useStore((state: Store) => state.setAnimating);
  const setInteractionMode = useStore((state: Store) => state.setInteractionMode);
  const setAnimationState = useStore((state: Store) => state.setAnimationState);
  const setTransitionProgress = useStore((state: Store) => state.setTransitionProgress);
  const setPreviousState = useStore((state: Store) => state.setPreviousState);
  const setTransitionDuration = useStore((state: Store) => state.setTransitionDuration);

  return {
    setAnimating,
    setInteractionMode,
    setAnimationState,
    setTransitionProgress,
    setPreviousState,
    setTransitionDuration,
  };
};
