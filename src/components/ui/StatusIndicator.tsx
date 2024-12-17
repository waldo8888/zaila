'use client'

import { motion } from 'framer-motion'
import { LoadingSpinner } from './LoadingSpinner'
import { useUIState } from '@/store/hooks'
import type { ErrorState } from '@/store/types'

interface StatusIndicatorProps {
  className?: string
}

export default function StatusIndicator({ className = "" }: StatusIndicatorProps) {
  const { isLoading, error, success } = useUIState()

  // Helper to get error message
  const getErrorMessage = (error: ErrorState | null) => {
    if (!error) return '';
    return error.message || 'An unexpected error occurred';
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2
        flex flex-col items-center gap-4
        pointer-events-none
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="
            bg-gradient-to-b from-white/10 to-white/5
            backdrop-blur-lg
            rounded-2xl
            p-4
            shadow-lg
            ring-1 ring-white/10
            flex items-center gap-3
            pointer-events-auto
          "
        >
          <LoadingSpinner size="small" />
          <span className="text-white/90 text-sm">
            Processing your request...
          </span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="
            bg-gradient-to-b from-red-500/20 to-red-600/10
            backdrop-blur-lg
            rounded-2xl
            p-4
            shadow-lg
            ring-1 ring-red-500/20
            flex items-center gap-3
            pointer-events-auto
            max-w-md
          "
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-red-100 font-medium">Error</p>
            <p className="text-red-200/80 text-sm truncate">
              {getErrorMessage(error)}
            </p>
            {error.recoverable && (
              <div className="flex gap-2 mt-2">
                {error.retryAction && (
                  <button
                    onClick={error.retryAction}
                    className="text-xs text-red-200 hover:text-red-100 transition-colors"
                  >
                    Retry
                  </button>
                )}
                {error.clearAction && (
                  <button
                    onClick={error.clearAction}
                    className="text-xs text-red-200 hover:text-red-100 transition-colors"
                  >
                    Dismiss
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="
            bg-gradient-to-b from-emerald-500/20 to-emerald-600/10
            backdrop-blur-lg
            rounded-2xl
            p-4
            shadow-lg
            ring-1 ring-emerald-500/20
            flex items-center gap-3
            pointer-events-auto
            max-w-md
          "
        >
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-emerald-100 font-medium">Success</p>
            <p className="text-emerald-200/80 text-sm truncate">
              {typeof success === 'string' ? success : 'Operation completed successfully'}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
