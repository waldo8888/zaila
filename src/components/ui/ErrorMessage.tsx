import React from 'react';
import { type ErrorState } from '@/store/types';
import { useUI } from '@/store/hooks';

interface ErrorMessageProps {
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ className = '' }) => {
  const error = useUI((state) => state.ui.error);

  if (!error.type || !error.message) {
    return null;
  }

  const errorTypeClasses = {
    network: 'bg-red-100 text-red-800',
    validation: 'bg-yellow-100 text-yellow-800',
    authentication: 'bg-orange-100 text-orange-800',
    authorization: 'bg-orange-100 text-orange-800',
    server: 'bg-red-100 text-red-800',
    client: 'bg-yellow-100 text-yellow-800',
    unknown: 'bg-gray-100 text-gray-800',
  }[error.type] || 'bg-red-100 text-red-800';

  return (
    <div className={`rounded-lg p-4 ${errorTypeClasses} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium">Error</h3>
          <div className="mt-2 text-sm">
            <p>{error.message}</p>
          </div>
          {error.recoverable && (
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                {error.retryAction && (
                  <button
                    type="button"
                    onClick={error.retryAction}
                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Retry
                  </button>
                )}
                {error.clearAction && (
                  <button
                    type="button"
                    onClick={error.clearAction}
                    className="ml-3 rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
