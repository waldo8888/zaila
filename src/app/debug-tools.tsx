'use client';

import { DebugPanel } from '@/components/debug/DebugPanel';

export function DebugTools() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return <DebugPanel />;
}
