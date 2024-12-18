'use client'

import React, { useEffect, useRef } from 'react';
import { useOrbState, useOrbActions } from '@/store/hooks/useOrb';
import { OrbState, OrbAnimationState } from '@/store/types';
import { ANIMATION_DURATION } from '@/utils/animation';

interface OrbStateManagerProps {
  children: React.ReactNode;
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

        // Reset to idle after success or error
        if (animationState === 'success' || animationState === 'error') {
          const resetTimer = setTimeout(() => {
            setAnimationState('idle');
          }, 2000);
          return () => clearTimeout(resetTimer);
        }
      }
    };

    // Start transition if we have a previous state
    if (previousState && previousState !== animationState) {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }
      
      // Set transition duration based on state change
      const duration = ANIMATION_DURATION.normal;
      setTransitionDuration(duration);
      
      // Start the transition
      startTimeRef.current = undefined;
      transitionRef.current = requestAnimationFrame(handleStateTransition);
    }

    return () => {
      if (transitionRef.current) {
        cancelAnimationFrame(transitionRef.current);
      }
    };
  }, [
    animationState,
    previousState,
    transitionDuration,
    setTransitionProgress,
    setPreviousState,
    setAnimationState,
    setTransitionDuration
  ]);

  // Handle interaction mode changes
  useEffect(() => {
    if (interactionMode === 'active') {
      const currentState = animationState || 'idle';
      setPreviousState(currentState);
      setAnimationState('active');
    } else if (interactionMode === 'passive' && animationState === 'active') {
      setPreviousState('active');
      setAnimationState('idle');
    }
  }, [interactionMode, animationState, setAnimationState, setPreviousState]);

  return <>{children}</>;
};
