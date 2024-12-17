import { persist, createJSONStorage, type PersistOptions, type StateStorage } from 'zustand/middleware';
import type { StoreState, Store, SessionState } from '../types';
import type { StateCreator } from 'zustand';

type ZailaPersistedState = Pick<StoreState, 'session'>;

const CURRENT_VERSION = 1;

const createInitialSession = (): SessionState => ({
  context: {},
  lastActive: Date.now(),
  isActive: true,
  metadata: {
    version: CURRENT_VERSION,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
});

const migratePersistedState = (persistedState: any, version: number): ZailaPersistedState => {
  if (version === 0) {
    // Migrate from version 0 to 1
    return {
      session: {
        ...createInitialSession(),
        context: persistedState?.session?.context || {},
      },
    };
  }
  return persistedState;
};

export const persistMiddleware = (
  config: StateCreator<Store, [], [['zustand/devtools', never]]>
): StateCreator<Store, [], [['zustand/devtools', never], ['zustand/persist', unknown]]> =>
  persist(config, {
    name: 'zaila-session',
    storage: createJSONStorage(() => sessionStorage) as StateStorage,
    partialize: (state: StoreState): ZailaPersistedState => ({
      session: {
        ...state.session,
        lastActive: Date.now(), // Update last active timestamp
      },
    }),
    version: CURRENT_VERSION,
    migrate: migratePersistedState,
    onRehydrateStorage: () => (state) => {
      if (state) {
        // Validate and update session on rehydration
        const now = Date.now();
        state.session = {
          ...state.session,
          isActive: true,
          lastActive: now,
          metadata: {
            ...state.session.metadata,
            updatedAt: now,
          },
        };
        console.log('Session state hydrated:', state.session);
      }
    },
  } as PersistOptions<Store, ZailaPersistedState>);
