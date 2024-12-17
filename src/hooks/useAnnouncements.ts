import { useCallback } from 'react';
import { useAccessibility } from '../components/providers/AccessibilityProvider';

export function useStatusAnnouncement() {
  const { announce } = useAccessibility();
  return useCallback((message: string) => announce(message, 'status'), [announce]);
}

export function useErrorAnnouncement() {
  const { announceError } = useAccessibility();
  return announceError;
}

export function useProgressAnnouncement() {
  const { announceProgress } = useAccessibility();
  return announceProgress;
}

export function useSuccessAnnouncement() {
  const { announceSuccess } = useAccessibility();
  return announceSuccess;
}

export function useLoadingAnnouncement() {
  const { announceProgress } = useAccessibility();
  return useCallback(
    (isLoading: boolean, loadingMessage: string = 'Loading...', completedMessage: string = 'Loading complete') => {
      if (isLoading) {
        announceProgress(loadingMessage);
      } else {
        announceProgress(completedMessage);
      }
    },
    [announceProgress]
  );
}

export function useFormAnnouncement() {
  const { announceError, announceSuccess } = useAccessibility();
  
  return useCallback(
    (success: boolean, successMessage: string = 'Form submitted successfully', errorMessage: string = 'Form submission failed') => {
      if (success) {
        announceSuccess(successMessage);
      } else {
        announceError(errorMessage);
      }
    },
    [announceError, announceSuccess]
  );
}
