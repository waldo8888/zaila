import React, { useEffect } from 'react';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { useSuccess, useUIActions } from '@/store/hooks';

export const SuccessMessage: React.FC = () => {
  const success = useSuccess();
  const { setSuccess } = useUIActions();

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, setSuccess]);

  if (!success) return null;

  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-green-50 p-4 rounded-lg shadow-lg z-50">
      <div className="flex-shrink-0">
        <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-green-800">Operation successful!</p>
      </div>
      <div className="ml-auto pl-3">
        <div className="-mx-1.5 -my-1.5">
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="inline-flex rounded-md bg-green-50 p-1.5 text-green-500 hover:bg-green-100"
          >
            <span className="sr-only">Dismiss</span>
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};
