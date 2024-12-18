import { create } from 'zustand';
import { createOrbSlice } from './slices/orbSlice';
import { createUISlice } from './slices/ui';

export const createStore = create((...args) => ({
  ...createOrbSlice(...args),
  ...createUISlice(...args),
}));
