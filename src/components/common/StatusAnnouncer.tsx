'use client';

import React from 'react';
import { useAccessibility } from '../providers/AccessibilityProvider';
import LiveRegion from './LiveRegion';

interface StatusAnnouncerProps {
  messages: {
    status?: string;
    error?: string;
    progress?: string;
    success?: string;
  };
  clearAfter?: number;
}

export function StatusAnnouncer({ messages, clearAfter = 5000 }: StatusAnnouncerProps) {
  const { announce, announceError, announceProgress, announceSuccess } = useAccessibility();

  React.useEffect(() => {
    if (messages.error) {
      announceError(messages.error);
    } else if (messages.status) {
      announce(messages.status);
    } else if (messages.progress) {
      announceProgress(messages.progress);
    } else if (messages.success) {
      announceSuccess(messages.success);
    }
  }, [messages, announce, announceError, announceProgress, announceSuccess]);

  return (
    <>
      {messages.error && (
        <LiveRegion
          message={messages.error}
          politeness="assertive"
          clearAfter={clearAfter}
        />
      )}
      {messages.status && (
        <LiveRegion
          message={messages.status}
          politeness="polite"
          clearAfter={clearAfter}
        />
      )}
      {messages.progress && (
        <LiveRegion
          message={messages.progress}
          politeness="polite"
          clearAfter={clearAfter}
        />
      )}
      {messages.success && (
        <LiveRegion
          message={messages.success}
          politeness="polite"
          clearAfter={clearAfter}
        />
      )}
    </>
  );
}
