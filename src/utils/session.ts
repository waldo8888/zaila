import { useSessionState, useSessionActions } from '@/store/hooks';

export interface SessionContextValue {
  key: string;
  value: unknown;
}

/**
 * Hook to manage session context
 */
export const useSessionContext = () => {
  const { context } = useSessionState();
  const { updateContext, clearContext } = useSessionActions();

  const setContextValue = (key: string, value: unknown) => {
    updateContext({ [key]: value });
  };

  const getContextValue = <T>(key: string): T | undefined => {
    return context[key] as T;
  };

  const removeContextValue = (key: string) => {
    const newContext = { ...context };
    delete newContext[key];
    updateContext(newContext);
  };

  const clearAllContext = () => {
    clearContext();
  };

  return {
    context,
    setContextValue,
    getContextValue,
    removeContextValue,
    clearAllContext,
  };
};

/**
 * Type guard to check if a value exists in context
 */
export const hasContextValue = <T>(
  context: Record<string, unknown>,
  key: string
): context is Record<string, T> => {
  return key in context;
};
