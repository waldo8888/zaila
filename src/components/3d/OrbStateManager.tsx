'use client'

import React, { useEffect } from 'react';
import { useOrbState, useOrbActions } from '@/store/hooks';
import { type OrbState } from '@/store/types';

interface OrbStateManagerProps {
  children: React.ReactNode;
}

export const OrbStateManager: React.FC<OrbStateManagerProps> = ({ children }) => {
  const { animationState, interactionMode } = useOrbState();
  const { setAnimationState, setInteractionMode } = useOrbActions();

  // Handle animation state transitions
  useEffect(() => {
    const handleStateTransition = () => {
      // Reset to idle after success or error state
      if (animationState === 'success' || animationState === 'error') {
        const timer = setTimeout(() => {
          setAnimationState('idle');
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    handleStateTransition();
  }, [animationState, setAnimationState]);

  // Handle interaction mode changes
  useEffect(() => {
    const handleInteractionChange = () => {
      // Add any specific logic for interaction mode changes
      if (interactionMode === 'active') {
        // Handle active mode initialization
      }
    };

    handleInteractionChange();
  }, [interactionMode]);

  return <>{children}</>;
};
