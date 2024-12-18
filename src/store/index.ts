import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createUISlice } from './slices/uiSlice';
import { createOrbSlice } from './slices/orbSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createPreferencesSlice } from './slices/preferencesSlice';
import type { Store } from './types';

// Create store with all slices
export const useStore = create<Store>()(
  devtools(
    (...a) => {
      const uiSlice = createUISlice(...a);
      const orbSlice = createOrbSlice(...a);
      const sessionSlice = createSessionSlice(...a);
      const preferencesSlice = createPreferencesSlice(...a);

      return {
        ...uiSlice,
        ...orbSlice,
        ...sessionSlice,
        ...preferencesSlice,
      };
    },
    { name: 'Zaila Store' }
  )
);

// Export store hooks
export * from './hooks';
