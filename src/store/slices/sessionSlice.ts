import { StateCreator } from 'zustand';
import { Store, SessionSlice } from '../types';
import { SessionState } from './types';

const DEFAULT_SESSION_STATE: SessionState = {
  isActive: false,
  lastActivity: Date.now(),
  context: {},
};

export const createSessionSlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  SessionSlice
> = (set, get, store) => ({
  session: DEFAULT_SESSION_STATE,

  setActive: (isActive: boolean) =>
    set((state) => ({
      session: { 
        ...state.session, 
        isActive,
        lastActivity: Date.now()
      }
    })),

  updateContext: (context: Record<string, unknown>) =>
    set((state) => ({
      session: { 
        ...state.session, 
        context,
        lastActivity: Date.now()
      }
    })),

  clearSession: () =>
    set(() => ({
      session: DEFAULT_SESSION_STATE
    })),
});
