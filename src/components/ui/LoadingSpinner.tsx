import React from 'react';
import { useLoading } from '@/store/hooks';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
}

export const LoadingSpinner = ({ size = 'medium', className = '' }: LoadingSpinnerProps) => {
  const isLoading = useLoading();
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  }

  if (!isLoading) return null;

  return (
    <div 
      className={`
        fixed inset-0
        flex items-center justify-center
        bg-black/50 z-50
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <div
        className={`
          relative
          rounded-full
          border-t-white
          border-r-transparent
          border-b-white/50
          border-l-transparent
          animate-spin
          ${sizeClasses[size]}
        `}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
};
