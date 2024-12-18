import { StateCreator } from 'zustand';
import { Store, UISlice } from '../types';
import { UIState, ErrorState } from './types';

const DEFAULT_UI_STATE: UIState = {
  isLoading: false,
  error: null,
  success: false,
  trackHistory: true,
  history: [],
  historyIndex: -1,
};

export const createUISlice: StateCreator<
  Store,
  [],
  [['zustand/devtools', never]],
  UISlice
> = (set, get, store) => ({
  ui: DEFAULT_UI_STATE,

  setLoading: (isLoading: boolean) =>
    set((state) => ({
      ui: { ...state.ui, isLoading }
    })),

  setError: (error: ErrorState | null) =>
    set((state) => ({
      ui: { ...state.ui, error }
    })),

  setSuccess: (success: boolean | string) =>
    set((state) => ({
      ui: { ...state.ui, success }
    })),

  clearError: () =>
    set((state) => ({
      ui: { ...state.ui, error: null }
    })),

  clearSuccess: () =>
    set((state) => ({
      ui: { ...state.ui, success: false }
    })),
});
