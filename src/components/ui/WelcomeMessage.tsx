'use client'

import { motion } from 'framer-motion'

interface WelcomeMessageProps {
  title?: string
  subtitle?: string
  className?: string
}

export default function WelcomeMessage({
  title = "Welcome to Zaila",
  subtitle = "AI-powered operating system for enterprise automation",
  className = ""
}: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`text-center max-w-4xl mx-auto ${className}`}
    >
      <motion.h1
        className="
          text-3xl sm:text-4xl lg:text-5xl
          font-bold tracking-tight
          text-white
          mb-4
        "
      >
        {title}
      </motion.h1>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="
            text-lg sm:text-xl
            text-gray-300
            max-w-2xl mx-auto
          "
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
