import { StateCreator } from 'zustand';
import { RootState } from '../types';
import { SessionState } from './types';

const DEFAULT_SESSION_STATE: SessionState = {
  isActive: false,
  lastActivity: Date.now(),
  context: {},
};

export interface SessionSlice {
  session: SessionState;
  setActive: (isActive: boolean) => void;
  updateContext: (context: Record<string, unknown>) => void;
  clearSession: () => void;
}

export const createSessionSlice: StateCreator<RootState, [], [], SessionSlice> = (set) => ({
  session: DEFAULT_SESSION_STATE,

  setActive: (isActive: boolean) =>
    set((state: RootState) => ({
      session: {
        ...state.session,
        isActive,
        lastActivity: Date.now(),
      },
    })),

  updateContext: (context: Record<string, unknown>) =>
    set((state: RootState) => ({
      session: {
        ...state.session,
        context: {
          ...state.session.context,
          ...context,
        },
        lastActivity: Date.now(),
      },
    })),

  clearSession: () =>
    set(() => ({
      session: DEFAULT_SESSION_STATE,
    })),
});
