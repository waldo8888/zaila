import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createOrbSlice } from './slices/orbSlice';
import { createUISlice } from './slices/uiSlice';
import { createSessionSlice } from './slices/sessionSlice';
import { createPreferencesSlice } from './slices/preferencesSlice';
import type { Store } from './types';

export const useStore = create<Store>()(
  devtools(
    (...a) => ({
      ...createUISlice(...a),
      ...createOrbSlice(...a),
      ...createSessionSlice(...a),
      ...createPreferencesSlice(...a),
    }),
    { name: 'Zaila Store' }
  )
);
