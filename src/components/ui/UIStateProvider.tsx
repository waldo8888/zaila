import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';

export const UIStateProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <>
      {children}
      <LoadingSpinner />
      <ErrorMessage />
      <SuccessMessage />
    </>
  );
};
