import { create } from 'zustand';
import { errorMiddleware } from './middleware/error';
import { persistMiddleware } from './middleware/persistence';
import { createUISlice } from './slices/uiSlice';
import { createOrbSlice } from './slices/orbSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createPreferencesSlice } from './slices/preferencesSlice';
import type { Store } from './types';

// Create store with middleware
const createStore = () =>
  create<Store>()(
    persistMiddleware(
      errorMiddleware(
        (...args) => ({
          ...createUISlice(...args),
          ...createOrbSlice(...args),
          ...createSessionSlice(...args),
          ...createPreferencesSlice(...args),
        })
      )
    )
  );

// Create and export store instance
export const useStore = createStore();

// Export store hooks
export * from './hooks';
