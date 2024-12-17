import React from 'react';
import { type ErrorState } from '@/store/types';

interface ErrorMessageProps {
  className?: string;
  error: ErrorState;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ className = '', error }) => {
  if (!error.type || !error.message) {
    return null;
  }

  const errorTypeClasses: Record<NonNullable<ErrorState['type']>, string> = {
    network: 'bg-red-100 text-red-800',
    validation: 'bg-yellow-100 text-yellow-800',
    authentication: 'bg-orange-100 text-orange-800',
    authorization: 'bg-orange-100 text-orange-800',
    server: 'bg-red-100 text-red-800',
    client: 'bg-yellow-100 text-yellow-800',
    unknown: 'bg-gray-100 text-gray-800'
  };

  const errorClass = error.type ? errorTypeClasses[error.type] : errorTypeClasses.unknown;

  return (
    <div
      className={`
        ${errorClass}
        px-4 py-3 rounded-lg shadow-lg
        flex items-center gap-2
        ${className}
      `}
    >
      <span className="text-sm font-medium">
        {error.message}
      </span>
    </div>
  );
}
