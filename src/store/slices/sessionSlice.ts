import { StateCreator } from 'zustand';
import { Store } from '../types';
import { SessionState, SessionSlice } from './types';

const DEFAULT_SESSION_STATE: SessionState = {
  isActive: false,
  lastActivity: Date.now(),
  context: {},
  metadata: {}
};

export const createSessionSlice: StateCreator<Store, [], [], SessionSlice> = (set) => ({
  session: DEFAULT_SESSION_STATE,

  setSessionActive: (isActive: boolean) =>
    set((state) => ({
      session: {
        ...state.session,
        isActive,
        lastActivity: Date.now()
      }
    })),

  updateSessionContext: (context: Record<string, unknown>) =>
    set((state) => ({
      session: {
        ...state.session,
        context: {
          ...state.session.context,
          ...context
        }
      }
    })),

  updateSessionMetadata: (metadata: Record<string, unknown>) =>
    set((state) => ({
      session: {
        ...state.session,
        metadata: {
          ...(state.session.metadata || {}),
          ...metadata
        }
      }
    }))
});
