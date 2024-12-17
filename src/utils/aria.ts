import { useCallback, useEffect, useRef, useState } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';

export type AriaLiveRegionProps = {
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
};

export type AriaExpandableProps = {
  'aria-expanded': boolean;
  'aria-controls': string;
  'aria-haspopup'?: boolean;
};

export type AriaSelectableProps = {
  'aria-selected': boolean;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | true | false;
};

export const useAriaAnnounce = () => {
  const { announce } = useAccessibility();
  const announceRef = useRef<HTMLDivElement>(null);

  const announceMessage = useCallback((message: string) => {
    if (announceRef.current) {
      announceRef.current.setAttribute('aria-live', 'polite');
      announce(message);
    }
  }, [announce]);

  return {
    announceRef,
    announceMessage
  };
};

export const useAriaExpanded = (
  controlId: string,
  initialState = false
): [AriaExpandableProps, (expanded: boolean) => void] => {
  const [expanded, setExpanded] = useState(initialState);

  const props: AriaExpandableProps = {
    'aria-expanded': expanded,
    'aria-controls': controlId,
    'aria-haspopup': true
  };

  return [props, setExpanded];
};

export const useAriaSelectable = (
  initialState = false,
  type: AriaSelectableProps['aria-current'] = false
): [AriaSelectableProps, (selected: boolean) => void] => {
  const [selected, setSelected] = useState(initialState);

  const props: AriaSelectableProps = {
    'aria-selected': selected,
    'aria-current': type && selected ? type : undefined
  };

  return [props, setSelected];
};

export const useAriaRelationship = (
  type: 'controls' | 'owns' | 'labelledby' | 'describedby',
  targetId: string
) => {
  return {
    [`aria-${type}`]: targetId
  };
};

// Helper function to generate unique IDs for ARIA relationships
export const generateAriaId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Helper to manage dynamic ARIA properties
export const useDynamicAria = (
  element: HTMLElement | null,
  attributes: Record<string, string | boolean | undefined>
) => {
  useEffect(() => {
    if (!element) return;

    Object.entries(attributes).forEach(([key, value]) => {
      if (value === undefined) {
        element.removeAttribute(key);
      } else {
        element.setAttribute(key, value.toString());
      }
    });

    return () => {
      Object.keys(attributes).forEach(key => {
        element.removeAttribute(key);
      });
    };
  }, [element, ...Object.values(attributes)]);
};
