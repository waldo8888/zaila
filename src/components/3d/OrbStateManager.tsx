'use client'

import React, { useEffect, useRef } from 'react';
import { useOrbState, useOrbActions } from '@/store/hooks/useOrb';
import { OrbState, OrbAnimationState } from '@/store/types';
import { Orb } from './Orb';

interface OrbStateManagerProps {
  children?: React.ReactNode;
}

export const OrbStateManager: React.FC<OrbStateManagerProps> = ({ children }) => {
  const { 
    animationState, 
    interactionMode,
    transitionProgress,
    previousState,
    transitionDuration 
  } = useOrbState();
  
  const { 
    setAnimationState, 
    setInteractionMode,
    setTransitionProgress,
    setPreviousState,
    setTransitionDuration
  } = useOrbActions();

  const transitionRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // Handle animation state transitions
  useEffect(() => {
    if (!animationState) return;

    const handleStateTransition = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (transitionDuration * 1000), 1);

      setTransitionProgress(progress);

      if (progress < 1) {
        transitionRef.current = requestAnimationFrame(handleStateTransition);
      } else {
        // Transition complete
        setPreviousState(null);
        setTransitionProgress(0);
        startTimeRef.current = undefined;
      }
    };

    // Start transition
    transitionRef.current = requestAnimationFrame(handleStateTransition);

    return () => {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }
    };
  }, [animationState, transitionDuration, setTransitionProgress, setPreviousState]);

  return (
    <group>
      <Orb state={animationState} />
      {children}
    </group>
  );
};
