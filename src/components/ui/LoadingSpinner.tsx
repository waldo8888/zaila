'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useLoading } from '@/store/hooks'
import { ANIMATION_DURATION, ANIMATION_EASE, fadeAnimation } from '@/utils/animation'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  className?: string
  overlay?: boolean
  label?: string
}

export const LoadingSpinner = ({ 
  size = 'medium', 
  className = '',
  overlay = false,
  label = 'Loading...'
}: LoadingSpinnerProps) => {
  const isLoading = useLoading()

  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4'
  }

  if (!isLoading) return null

  const spinnerContent = (
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
      role="status"
      aria-label={label}
    />
  )

  if (!overlay) {
    return (
      <motion.div
        {...fadeAnimation}
        transition={{ duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.smooth }}
        className={className}
      >
        {spinnerContent}
        <span className="sr-only">{label}</span>
      </motion.div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div 
        {...fadeAnimation}
        transition={{ duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.smooth }}
        className={`
          fixed inset-0
          flex items-center justify-center
          bg-black/50 backdrop-blur-sm
          z-50
          ${className}
        `}
      >
        {spinnerContent}
        <span className="sr-only">{label}</span>
      </motion.div>
    </AnimatePresence>
  )
}
