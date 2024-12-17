import { useCallback, useEffect } from 'react';
import { useStore } from '@/store';
import type { SessionState } from '../types';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useSession = () => {
  const store = useStore();
  const { session } = store;

  // Update session activity
  useEffect(() => {
    const handleActivity = () => {
      if (!session.isActive) {
        store.setSessionActive(true);
      }
      store.updateSessionMetadata({
        updatedAt: Date.now(),
      });
    };

    // Monitor user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // Check session timeout periodically
    const checkTimeout = setInterval(() => {
      if (session.lastActive) {
        const inactiveTime = Date.now() - session.lastActive;
        if (inactiveTime > SESSION_TIMEOUT && session.isActive) {
          store.setSessionActive(false);
          store.clearContext();
        }
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      clearInterval(checkTimeout);
    };
  }, [session.isActive, session.lastActive, store]);

  const updateContext = useCallback(
    (context: Record<string, unknown>) => {
      if (session.isActive) {
        store.updateContext(context);
        store.updateSessionMetadata({
          updatedAt: Date.now(),
        });
      }
    },
    [session.isActive, store]
  );

  const clearContext = useCallback(() => {
    store.clearContext();
    store.updateSessionMetadata({
      updatedAt: Date.now(),
    });
  }, [store]);

  return {
    context: session.context,
    isActive: session.isActive,
    lastActive: session.lastActive,
    metadata: session.metadata,
    updateContext,
    clearContext,
  };
};
