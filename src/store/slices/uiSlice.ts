import { StateCreator } from 'zustand';
import { RootState } from '../types';
import { UIState, ErrorState } from './types';

const DEFAULT_UI_STATE: UIState = {
  isLoading: false,
  error: null,
  success: false,
};

export interface UISlice {
  ui: UIState;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ErrorState | null) => void;
  setSuccess: (success: boolean) => void;
  clearError: () => void;
}

export const createUISlice: StateCreator<RootState, [], [], UISlice> = (set) => ({
  ui: DEFAULT_UI_STATE,

  setLoading: (isLoading: boolean) =>
    set((state: RootState) => ({
      ui: {
        ...state.ui,
        isLoading,
      },
    })),

  setError: (error: ErrorState | null) =>
    set((state: RootState) => ({
      ui: {
        ...state.ui,
        error,
        success: false,
      },
    })),

  setSuccess: (success: boolean) =>
    set((state: RootState) => ({
      ui: {
        ...state.ui,
        success,
        error: null,
      },
    })),

  clearError: () =>
    set((state: RootState) => ({
      ui: {
        ...state.ui,
        error: null,
      },
    })),
});