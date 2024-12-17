'use client';

import React, { useEffect, useRef } from 'react';

export type LiveRegionProps = {
  message: string;
  politeness?: 'polite' | 'assertive';
  'aria-atomic'?: boolean;
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  clearAfter?: number;
  className?: string;
};

export default function LiveRegion({
  message,
  politeness = 'polite',
  'aria-atomic': atomic = true,
  'aria-relevant': relevant = 'text',
  clearAfter = 5000,
  className = 'sr-only',
}: LiveRegionProps) {
  const [currentMessage, setCurrentMessage] = React.useState(message);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setCurrentMessage(message);

    if (clearAfter && message) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setCurrentMessage('');
      }, clearAfter);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [message, clearAfter]);

  // Don't render anything if there's no message
  if (!currentMessage) return null;

  return (
    <div
      role={politeness === 'assertive' ? 'alert' : 'status'}
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
    >
      {currentMessage}
    </div>
  );
}
