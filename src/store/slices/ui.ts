/**
 * UI state management slice
 */

import { StateCreator } from 'zustand';
import { Store } from '../types';
import { createErrorState } from '../middleware/error';
import { ErrorState, ErrorType, UIState } from './types';
import { StateHistoryEntry, StateTransition } from '../types/transitions';
import { validateTransition } from '../middleware/transition';

export interface UISlice {
  ui: UIState;
  setLoading: (isLoading: boolean) => void;
  setError: (error: ErrorState | null) => void;
  setSuccess: (success: boolean | string) => void;
  clearError: () => void;
  retryLastAction: () => void;
  resetErrorState: () => void;
  // New history-related methods
  addHistoryEntry: (transition: StateTransition) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

const MAX_HISTORY_SIZE = 50;

export const createUISlice: StateCreator<Store, [], [], UISlice> = (set, get) => ({
  ui: {
    isLoading: false,
    error: null,
    success: false,
    trackHistory: true,
    history: [],
    historyIndex: -1,
  },

  setLoading: (isLoading) => {
    const state = get().ui;
    if (validateTransition(state, isLoading ? 'START_LOADING' : 'STOP_LOADING')) {
      set((state) => ({
        ui: { ...state.ui, isLoading },
      }));
    }
  },

  setError: (error) => {
    const state = get().ui;
    if (validateTransition(state, error ? 'SET_ERROR' : 'CLEAR_ERROR')) {
      set((state) => ({
        ui: { ...state.ui, error, success: false },
      }));
    }
  },

  setSuccess: (success) => {
    const state = get().ui;
    if (validateTransition(state, success ? 'SET_SUCCESS' : 'CLEAR_SUCCESS')) {
      set((state) => ({
        ui: {
          ...state.ui,
          success: typeof success === 'string' ? success : !!success,
          error: null,
        },
      }));
    }
  },

  clearError: () => {
    const state = get().ui;
    if (validateTransition(state, 'CLEAR_ERROR')) {
      set((state) => ({
        ui: { ...state.ui, error: null },
      }));
    }
  },

  retryLastAction: () => {
    const { error } = get().ui;
    if (error?.retryAction) {
      error.retryAction();
      set((state) => ({
        ui: { ...state.ui, error: null },
      }));
    }
  },

  resetErrorState: () => {
    const state = get().ui;
    if (validateTransition(state, 'RESET_STATE')) {
      set((state) => ({
        ui: {
          ...state.ui,
          error: null,
          success: false,
          isLoading: false,
        },
      }));
    }
  },

  // History management methods
  addHistoryEntry: (transition: StateTransition) =>
    set((state) => {
      const { history, historyIndex } = state.ui;
      const newHistory = [...history.slice(0, historyIndex + 1), {
        transition,
        snapshot: { ...state.ui },
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }].slice(-MAX_HISTORY_SIZE);

      return {
        ui: {
          ...state.ui,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        },
      };
    }),

  undo: () =>
    set((state) => {
      const { history, historyIndex } = state.ui;
      if (historyIndex > 0) {
        const prevEntry = history[historyIndex - 1];
        return {
          ui: {
            ...prevEntry.snapshot,
            history,
            historyIndex: historyIndex - 1,
          },
        };
      }
      return state;
    }),

  redo: () =>
    set((state) => {
      const { history, historyIndex } = state.ui;
      if (historyIndex < history.length - 1) {
        const nextEntry = history[historyIndex + 1];
        return {
          ui: {
            ...nextEntry.snapshot,
            history,
            historyIndex: historyIndex + 1,
          },
        };
      }
      return state;
    }),

  clearHistory: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        history: [],
        historyIndex: -1,
      },
    })),
});
