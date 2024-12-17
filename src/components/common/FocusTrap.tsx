import React, { useEffect, useRef } from 'react';
import { trapFocus, useFocusManager } from '@/utils/focus';

interface FocusTrapProps {
  children: React.ReactNode;
  isActive: boolean;
  onEscape?: () => void;
  initialFocus?: boolean;
  restoreFocus?: boolean;
}

export default function FocusTrap({
  children,
  isActive,
  onEscape,
  initialFocus = true,
  restoreFocus = true,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { saveFocus, restoreFocus: restorePreviousFocus } = useFocusManager();

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !isActive) return;

    // Save the current focus state before trapping
    if (restoreFocus) {
      saveFocus(document.activeElement as HTMLElement);
    }

    // Set initial focus
    if (initialFocus) {
      const focusableElements = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      } else {
        container.focus();
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isActive) {
        trapFocus(event, container, onEscape);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (restoreFocus && isActive) {
        restorePreviousFocus();
      }
    };
  }, [isActive, onEscape, initialFocus, restoreFocus, saveFocus, restorePreviousFocus]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{ outline: 'none' }}
      data-focus-trap={isActive ? 'active' : 'inactive'}
    >
      {children}
    </div>
  );
}
