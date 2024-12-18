import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createOrbSlice } from './slices/orbSlice';
import { createUISlice } from './slices/uiSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createPreferencesSlice } from './slices/preferencesSlice';
import type { Store } from './types';

// Create store with all slices
export const useStore = create<Store>()(
  devtools(
    (...a) => {
      const orbSlice = createOrbSlice(...a);
      const uiSlice = createUISlice(...a);
      const sessionSlice = createSessionSlice(...a);
      const preferencesSlice = createPreferencesSlice(...a);

      return {
        ...orbSlice,
        ...uiSlice,
        ...sessionSlice,
        ...preferencesSlice
      };
    },
    { name: 'Zaila Store' }
  )
);
