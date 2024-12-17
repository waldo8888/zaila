import { useUIActions } from '@/store/hooks';
import { type ErrorState } from '../store/types';
import { useStore } from '../store';

/**
 * Utility function to handle async operations with UI state management
 * @param operation The async operation to execute
 * @param options Configuration options for UI state handling
 */
export const withUIState = async <T,>(
  operation: () => Promise<T>,
  options: {
    successMessage?: boolean;
    hideLoading?: boolean;
  } = {}
) => {
  const { setLoading, setError, setSuccess } = useUIActions();
  const { successMessage = true, hideLoading = false } = options;

  try {
    if (!hideLoading) {
      setLoading(true);
    }
    const result = await operation();
    if (successMessage) {
      setSuccess(true);
    }
    return result;
  } catch (error) {
    handleError(error);
    throw error;
  } finally {
    if (!hideLoading) {
      setLoading(false);
    }
  }
};

export const handleError = (error: unknown) => {
  const errorState: Partial<ErrorState> = {
    type: 'system',
    message: error instanceof Error ? error.message : 'An unknown error occurred',
    timestamp: Date.now(),
  };
  useStore.getState().setError(errorState);
};
