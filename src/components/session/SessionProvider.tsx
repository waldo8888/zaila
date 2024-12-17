import React, { useEffect } from 'react';
import { useSession } from '@/store/hooks';
import { useOrb } from '@/store/hooks';

interface SessionProviderProps {
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const { context, isActive, lastActive } = useSession();
  const { setAnimationState, setInteractionMode } = useOrb();

  // Handle session state changes
  useEffect(() => {
    if (!isActive) {
      setAnimationState('idle');
      setInteractionMode('passive');
    } else if (context.isInteracting) {
      setAnimationState('processing');
      setInteractionMode('active');
    }
  }, [isActive, context.isInteracting, setAnimationState, setInteractionMode]);

  // Log session activity for debugging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Session state:', {
        isActive,
        lastActive: lastActive ? new Date(lastActive).toISOString() : null,
        context,
      });
    }
  }, [isActive, lastActive, context]);

  return <>{children}</>;
};
