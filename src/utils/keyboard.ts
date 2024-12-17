import { useEffect } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';

export type KeyboardShortcut = {
  key: string;
  description: string;
  action: () => void;
  modifier?: 'ctrl' | 'meta' | 'shift' | 'alt' | 'none';
  preventDefault?: boolean;
  excludeElements?: string[];
};

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const { announce } = useAccessibility();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if we're in an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      for (const shortcut of shortcuts) {
        const modifierMatch =
          (shortcut.modifier === 'ctrl' && e.ctrlKey) ||
          (shortcut.modifier === 'meta' && e.metaKey) ||
          (shortcut.modifier === 'shift' && e.shiftKey) ||
          (shortcut.modifier === 'alt' && e.altKey) ||
          (shortcut.modifier === 'none' && !e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey);

        if (e.key === shortcut.key && modifierMatch) {
          // Check if the current element is in the exclude list
          if (shortcut.excludeElements?.includes((e.target as HTMLElement).tagName)) {
            continue;
          }

          if (shortcut.preventDefault) {
            e.preventDefault();
          }
          shortcut.action();
          announce(`Executed: ${shortcut.description}`);
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, announce]);
};

export const useFocusTrap = (ref: React.RefObject<HTMLElement>, active: boolean) => {
  useEffect(() => {
    if (!active || !ref.current) return;

    const element = ref.current;
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    element.addEventListener('keydown', handleFocusTrap);
    return () => element.removeEventListener('keydown', handleFocusTrap);
  }, [active, ref]);
};

export const useArrowNavigation = (
  ref: React.RefObject<HTMLElement>,
  active: boolean,
  options: {
    vertical?: boolean;
    horizontal?: boolean;
    loop?: boolean;
    itemSelector: string;
  }
) => {
  useEffect(() => {
    if (!active || !ref.current) return;

    const element = ref.current;
    const handleArrowKeys = (e: KeyboardEvent) => {
      const items = Array.from(element.querySelectorAll(options.itemSelector)) as HTMLElement[];
      if (!items.length) return;

      const currentIndex = items.findIndex((item) => item === document.activeElement);
      if (currentIndex === -1) return;

      const getNextIndex = (current: number, delta: number) => {
        if (options.loop) {
          return (current + delta + items.length) % items.length;
        }
        return Math.max(0, Math.min(items.length - 1, current + delta));
      };

      if (options.vertical && e.key === 'ArrowDown') {
        e.preventDefault();
        items[getNextIndex(currentIndex, 1)].focus();
      } else if (options.vertical && e.key === 'ArrowUp') {
        e.preventDefault();
        items[getNextIndex(currentIndex, -1)].focus();
      } else if (options.horizontal && e.key === 'ArrowRight') {
        e.preventDefault();
        items[getNextIndex(currentIndex, 1)].focus();
      } else if (options.horizontal && e.key === 'ArrowLeft') {
        e.preventDefault();
        items[getNextIndex(currentIndex, -1)].focus();
      }
    };

    element.addEventListener('keydown', handleArrowKeys);
    return () => element.removeEventListener('keydown', handleArrowKeys);
  }, [active, ref, options]);
};
