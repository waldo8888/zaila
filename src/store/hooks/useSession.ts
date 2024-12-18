import { useCallback, useEffect } from 'react';
import { useStore } from '@/store';
import type { SessionState } from '../types';

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

export const useSession = () => {
  const store = useStore();
  const { session } = store;

  const setActive = useCallback((isActive: boolean) => {
    store.setSessionActive(isActive);
  }, [store]);

  const updateContext = useCallback((context: Record<string, unknown>) => {
    store.updateSessionContext(context);
  }, [store]);

  const updateMetadata = useCallback((metadata: Record<string, unknown>) => {
    store.updateSessionMetadata(metadata);
  }, [store]);

  const getLastActivity = useCallback(() => {
    return session.lastActivity;
  }, [session]);

  const isExpired = useCallback((timeout: number) => {
    const now = Date.now();
    const lastActivity = session.lastActivity;
    return now - lastActivity > timeout;
  }, [session]);

  const getContext = useCallback(() => {
    return session.context;
  }, [session]);

  const getMetadata = useCallback(() => {
    return session.metadata;
  }, [session]);

  const clearContext = useCallback(() => {
    store.updateSessionContext({});
  }, [store]);

  const clearMetadata = useCallback(() => {
    store.updateSessionMetadata({});
  }, [store]);

  // Update session activity
  useEffect(() => {
    const handleActivity = () => {
      if (!session.isActive) {
        setActive(true);
      }
      updateMetadata({
        updatedAt: Date.now(),
      });
    };

    window.addEventListener('click', handleActivity);

    // Check session timeout periodically
    const checkTimeout = setInterval(() => {
      if (session.lastActivity) {
        const inactiveTime = Date.now() - session.lastActivity;
        if (inactiveTime > SESSION_TIMEOUT && session.isActive) {
          setActive(false);
          clearContext();
        }
      }
    }, 60000); // Check every minute

    return () => {
      window.removeEventListener('click', handleActivity);
      clearInterval(checkTimeout);
    };
  }, [session.isActive, session.lastActivity, setActive, updateMetadata, clearContext, store]);

  return {
    // State getters
    isActive: session.isActive,
    lastActivity: session.lastActivity,
    context: session.context,
    metadata: session.metadata,

    // Actions
    setActive,
    updateContext,
    updateMetadata,
    clearContext,
    clearMetadata,

    // Helper methods
    getLastActivity,
    isExpired,
    getContext,
    getMetadata
  };
};
