import React, { forwardRef, useEffect, useRef } from 'react';
import { useAccessibility } from '@/components/providers/AccessibilityProvider';
import { generateAriaId } from '@/utils/aria';

export interface WithAriaProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  'aria-selected'?: boolean;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  role?: string;
}

export function withAria<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  defaultRole?: string
) {
  return forwardRef<HTMLElement, P & WithAriaProps>((props, ref) => {
    const {
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledby,
      'aria-describedby': ariaDescribedby,
      'aria-controls': ariaControls,
      'aria-expanded': ariaExpanded,
      'aria-selected': ariaSelected,
      'aria-current': ariaCurrent,
      'aria-live': ariaLive,
      'aria-atomic': ariaAtomic,
      role = defaultRole,
      ...rest
    } = props;

    const { setLabel, removeLabel, setDescription, removeDescription } = useAccessibility();
    const componentId = useRef(generateAriaId('component')).current;
    const labelId = useRef(generateAriaId('label')).current;
    const descriptionId = useRef(generateAriaId('description')).current;

    useEffect(() => {
      if (ariaLabel) {
        setLabel(labelId, ariaLabel);
        return () => removeLabel(labelId);
      }
    }, [ariaLabel, labelId, setLabel, removeLabel]);

    useEffect(() => {
      if (props['aria-describedby']) {
        setDescription(descriptionId, props['aria-describedby']);
        return () => removeDescription(descriptionId);
      }
    }, [props['aria-describedby'], descriptionId, setDescription, removeDescription]);

    const ariaProps: WithAriaProps = {
      role,
      'aria-labelledby': ariaLabel ? labelId : ariaLabelledby,
      'aria-describedby': props['aria-describedby'] ? descriptionId : ariaDescribedby,
      'aria-controls': ariaControls,
      'aria-expanded': ariaExpanded,
      'aria-selected': ariaSelected,
      'aria-current': ariaCurrent,
      'aria-live': ariaLive,
      'aria-atomic': ariaAtomic,
    };

    return (
      <WrappedComponent
        {...(rest as P)}
        {...ariaProps}
        ref={ref}
        id={componentId}
      />
    );
  });
}

// Example usage:
// const AccessibleButton = withAria(Button, 'button');
// const AccessibleDialog = withAria(Dialog, 'dialog');
