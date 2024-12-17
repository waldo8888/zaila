import { useCallback } from 'react';
import { useStore } from '@/store';
import { type ErrorType, type ErrorState } from '../types';
import { createErrorState } from '../middleware/error';

export const useUI = () => {
  const store = useStore();

  const setError = useCallback(
    (
      type: ErrorType,
      message: string,
      context?: Record<string, unknown>,
      recoverable = true
    ) => {
      store.setError(createErrorState(type, message, context, recoverable));
    },
    [store]
  );

  const handleAsyncOperation = useCallback(
    async <T,>(
      operation: () => Promise<T>,
      {
        loadingMessage = 'Processing...',
        successMessage = 'Operation completed successfully',
        errorMessage = 'An error occurred',
        errorType = 'unknown' as ErrorType,
        context = {},
        recoverable = true,
      } = {}
    ): Promise<T | undefined> => {
      try {
        store.setLoading(true);
        store.setError(null);
        
        const result = await operation();
        
        store.setSuccess(true);
        return result;
      } catch (error) {
        const message = error instanceof Error ? error.message : errorMessage;
        setError(errorType, message, { ...context, error }, recoverable);
        return undefined;
      } finally {
        store.setLoading(false);
      }
    },
    [store, setError]
  );

  return {
    isLoading: store.ui.isLoading,
    error: store.ui.error,
    success: store.ui.success,
    setLoading: store.setLoading,
    setError,
    setSuccess: store.setSuccess,
    clearError: store.clearError,
    retryLastAction: store.retryLastAction,
    resetErrorState: store.resetErrorState,
    handleAsyncOperation,
  };
};
