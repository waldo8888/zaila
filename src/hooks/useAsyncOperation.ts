/**
 * Custom hook for handling async operations with error management
 */

import { useState, useCallback } from 'react';
import { useUIActions } from '@/store/hooks';
import { ErrorState, ErrorType } from '@/store/slices/types';
import { createError } from '@/utils/errors';

interface AsyncOperationOptions<T> {
  onSuccess?: (result: T) => void;
  onError?: (error: unknown) => void;
  errorType?: ErrorType;
  errorMessage?: string;
  recoverable?: boolean;
  showLoading?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
}

export function useAsyncOperation<T>() {
  const { setLoading, setError, setSuccess } = useUIActions();
  const [isProcessing, setIsProcessing] = useState(false);

  const execute = useCallback(
    async (
      operation: () => Promise<T>,
      {
        onSuccess,
        onError,
        errorType = 'unknown',
        errorMessage,
        recoverable = true,
        showLoading = true,
        showSuccess = true,
        successMessage,
      }: AsyncOperationOptions<T> = {}
    ) => {
      if (isProcessing) return;

      try {
        setIsProcessing(true);
        if (showLoading) {
          setLoading(true);
        }

        const result = await operation();

        if (showSuccess && successMessage) {
          setSuccess(true);
          // Handle success message separately if needed
        } else if (showSuccess) {
          setSuccess(true);
        }

        onSuccess?.(result);
        return result;
      } catch (error) {
        const errorState = createError(errorType, errorMessage || getErrorMessage(error), {
          context: { originalError: error },
          recoverable,
          retryAction: () => execute(operation, {
            onSuccess,
            onError,
            errorType,
            errorMessage,
            recoverable,
            showLoading,
            showSuccess,
            successMessage,
          }),
        });

        setError(errorState);
        onError?.(error);
        return undefined;
      } finally {
        setIsProcessing(false);
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [setLoading, setError, setSuccess, isProcessing]
  );

  return {
    execute,
    isProcessing,
  };
}

// Helper to extract error message from various error types
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
