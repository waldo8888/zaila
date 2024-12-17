'use client'

import { motion } from 'framer-motion'
import { LoadingSpinner } from './LoadingSpinner'
import { ErrorMessage } from './ErrorMessage'
import { SuccessMessage } from './SuccessMessage'
import { useUIState } from '@/store/hooks'

interface StatusIndicatorProps {
  className?: string
}

export default function StatusIndicator({ className = "" }: StatusIndicatorProps) {
  const { isLoading, error, success } = useUIState()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`
        fixed bottom-8 right-8
        flex flex-col items-end gap-4
        ${className}
      `}
    >
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="
            bg-white/10 backdrop-blur-lg
            rounded-xl p-4
            shadow-lg
          "
        >
          <LoadingSpinner />
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <ErrorMessage error={error} />
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
        >
          <SuccessMessage />
        </motion.div>
      )}
    </motion.div>
  )
}
