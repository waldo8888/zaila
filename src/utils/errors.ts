/**
 * Error handling utilities and types for centralized error management
 */

import { type ErrorState, type ErrorType } from '@/store/slices/types';
import { useStore } from '@/store';

// Error categories with user-friendly messages
export const ERROR_MESSAGES: Record<Exclude<ErrorType, 'unknown'>, { default: string } & Record<string, string>> = {
  validation: {
    default: 'Please check your input and try again',
    required: 'This field is required',
    invalid: 'Invalid input format',
  },
  network: {
    default: 'Network error occurred',
    timeout: 'Request timed out',
    offline: 'You appear to be offline',
  },
  auth: {
    default: 'Authentication error',
    expired: 'Your session has expired',
    unauthorized: 'You are not authorized',
  },
  system: {
    default: 'System error occurred',
    maintenance: 'System is under maintenance',
    unavailable: 'Service is temporarily unavailable',
  },
} as const;

// Error persistence configuration
export const ERROR_PERSISTENCE = {
  // Error types that should persist across page reloads
  persistentTypes: ['auth', 'system'] as ErrorType[],
  // Maximum age for persisted errors (24 hours)
  maxAge: 24 * 60 * 60 * 1000,
};

/**
 * Creates a standardized error state object
 */
export const createError = (
  type: ErrorType,
  message: string,
  options: {
    context?: Record<string, unknown>;
    recoverable?: boolean;
    retryAction?: () => void;
  } = {}
): ErrorState => {
  const { context, recoverable = true, retryAction } = options;

  return {
    type,
    message,
    context,
    recoverable,
    retryAction,
    timestamp: Date.now(),
  };
};

/**
 * Determines if an error should be persisted
 */
export const shouldPersistError = (error: ErrorState): boolean => {
  const isPersistentType = ERROR_PERSISTENCE.persistentTypes.includes(error.type);
  const isWithinMaxAge = Date.now() - error.timestamp < ERROR_PERSISTENCE.maxAge;
  return isPersistentType && isWithinMaxAge;
};

/**
 * Formats error message for display
 */
export const formatErrorMessage = (error: ErrorState): string => {
  if (error.type === 'unknown') {
    return error.message || 'An unexpected error occurred';
  }
  return error.message || ERROR_MESSAGES[error.type]?.default || 'An error occurred';
};

/**
 * Hook for handling async operations with error management
 */
export const useErrorHandler = () => {
  const store = useStore();

  const handleError = (
    error: unknown,
    options: {
      type?: ErrorType;
      context?: Record<string, unknown>;
      recoverable?: boolean;
      retryAction?: () => void;
    } = {}
  ) => {
    const {
      type = 'unknown',
      context = {},
      recoverable = true,
      retryAction,
    } = options;

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    const errorState = createError(type, errorMessage, {
      context: { ...context, originalError: error },
      recoverable,
      retryAction,
    });

    store.setError(errorState);
    return errorState;
  };

  return {
    handleError,
    clearError: store.clearError,
  };
};
