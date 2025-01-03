'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from './LoadingSpinner'
import { useUIState, useUIActions } from '@/store/hooks'
import type { ErrorState } from '@/store/types'
import { useEffect } from 'react'
import { 
  ANIMATION_DURATION, 
  ANIMATION_EASE, 
  slideUpAnimation, 
  stateAnimationVariants 
} from '@/utils/animation'
import { formatErrorMessage } from '@/utils/errors'

interface StatusIndicatorProps {
  className?: string;
  autoHideSuccess?: boolean;
  autoHideDelay?: number;
}

export default function StatusIndicator({ 
  className = "",
  autoHideSuccess = true,
  autoHideDelay = 3000,
}: StatusIndicatorProps) {
  const { isLoading, error, success } = useUIState()
  const { clearError, setSuccess, retryLastAction } = useUIActions()

  // Auto-hide success message
  useEffect(() => {
    if (success && autoHideSuccess) {
      const timer = setTimeout(() => {
        setSuccess(false)
      }, autoHideDelay)
      return () => clearTimeout(timer)
    }
  }, [success, setSuccess, autoHideSuccess, autoHideDelay])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.smooth }}
      className={`
        fixed bottom-8 left-1/2 -translate-x-1/2
        flex flex-col items-center gap-4
        pointer-events-none
        ${className}
      `}
      role="status"
      aria-live="polite"
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            {...slideUpAnimation}
            transition={{ 
              ...stateAnimationVariants.loading.transition,
              duration: ANIMATION_DURATION.normal 
            }}
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
            {...slideUpAnimation}
            transition={{ 
              ...stateAnimationVariants.error.transition,
              duration: ANIMATION_DURATION.normal 
            }}
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
                {formatErrorMessage(error)}
              </p>
              {error.recoverable && (
                <div className="flex gap-2 mt-2">
                  {error.retryAction && (
                    <button
                      onClick={() => retryLastAction()}
                      className="
                        text-xs text-red-200 hover:text-red-100 
                        transition-colors flex items-center gap-1
                      "
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                      </svg>
                      Retry
                    </button>
                  )}
                  <button
                    onClick={() => clearError()}
                    className="text-xs text-red-200 hover:text-red-100 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            {...slideUpAnimation}
            transition={{ 
              ...stateAnimationVariants.success.transition,
              duration: ANIMATION_DURATION.normal 
            }}
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
      </AnimatePresence>
    </motion.div>
  )
}
