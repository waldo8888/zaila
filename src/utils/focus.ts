import { create } from 'zustand';

interface FocusState {
  history: HTMLElement[];
  addToHistory: (element: HTMLElement) => void;
  removeFromHistory: () => HTMLElement | undefined;
  clearHistory: () => void;
}

const useFocusStore = create<FocusState>((set, get) => ({
  history: [],
  addToHistory: (element) =>
    set((state) => ({ history: [...state.history, element] })),
  removeFromHistory: () => {
    const currentState = get();
    const lastElement = currentState.history[currentState.history.length - 1];
    set((state) => ({ history: state.history.slice(0, -1) }));
    return lastElement;
  },
  clearHistory: () => set({ history: [] }),
}));

export const useFocusManager = () => {
  const store = useFocusStore();

  const saveFocus = (element: HTMLElement) => {
    store.addToHistory(element);
  };

  const restoreFocus = () => {
    const previousElement = store.removeFromHistory();
    if (previousElement && document.body.contains(previousElement)) {
      previousElement.focus();
    } else {
      // Fallback to a sensible default if the previous element is no longer available
      const mainContent = document.querySelector('[role="main"]');
      if (mainContent instanceof HTMLElement) {
        mainContent.focus();
      }
    }
  };

  const clearFocusHistory = () => {
    store.clearHistory();
  };

  return {
    saveFocus,
    restoreFocus,
    clearFocusHistory,
  };
};

export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(elements);
};

export const trapFocus = (
  event: KeyboardEvent,
  container: HTMLElement,
  onEscape?: () => void
) => {
  if (event.key === 'Escape' && onEscape) {
    event.preventDefault();
    onEscape();
    return;
  }

  if (event.key !== 'Tab') {
    return;
  }

  const focusableElements = getFocusableElements(container);
  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (!container.contains(activeElement)) {
    event.preventDefault();
    firstElement.focus();
    return;
  }

  if (event.shiftKey) {
    if (activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    }
  } else {
    if (activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
};
