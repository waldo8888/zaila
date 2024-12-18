import { StateCreator } from 'zustand';
import { Store } from '../types';
import { UIState, UISlice, ErrorState, StateHistoryEntry } from './types';

const DEFAULT_UI_STATE: UIState = {
  success: false,
  error: null,
  isLoading: false,
  trackHistory: true,
  history: [],
  historyIndex: -1,
};

export const createUISlice: StateCreator<Store, [], [], UISlice> = (set, get) => ({
  ui: DEFAULT_UI_STATE,

  setLoading: (isLoading: boolean) =>
    set((state) => ({
      ui: { ...state.ui, isLoading }
    })),

  setError: (error: ErrorState | null) =>
    set((state) => ({
      ui: { ...state.ui, error, success: false }
    })),

  setSuccess: (success: boolean) =>
    set((state) => ({
      ui: { ...state.ui, success, error: null }
    })),

  clearError: () =>
    set((state) => ({
      ui: { ...state.ui, error: null }
    })),

  retryLastAction: () => {
    const { ui } = get();
    if (ui.error?.retryAction) {
      ui.error.retryAction();
    }
  },

  resetErrorState: () =>
    set((state) => ({
      ui: { ...state.ui, error: null, success: false }
    })),

  addHistoryEntry: (entry: StateHistoryEntry) =>
    set((state) => ({
      ui: {
        ...state.ui,
        history: [...state.ui.history, entry],
        historyIndex: state.ui.historyIndex + 1
      }
    })),

  clearHistory: () =>
    set((state) => ({
      ui: { ...state.ui, history: [], historyIndex: -1 }
    })),

  undoLastAction: () => {
    const { ui } = get();
    if (ui.historyIndex > 0) {
      set((state) => ({
        ui: { ...state.ui, historyIndex: state.ui.historyIndex - 1 }
      }));
    }
  },

  redoLastAction: () => {
    const { ui } = get();
    if (ui.historyIndex < ui.history.length - 1) {
      set((state) => ({
        ui: { ...state.ui, historyIndex: state.ui.historyIndex + 1 }
      }));
    }
  },
});
