import React from 'react';
import { useLoading } from '@/store/hooks';

export const LoadingSpinner: React.FC = () => {
  const isLoading = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent animate-spin"></div>
        <div className="mt-4 text-white text-center">Loading...</div>
      </div>
    </div>
  );
};
