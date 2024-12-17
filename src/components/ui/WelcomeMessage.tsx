'use client'

import { motion } from 'framer-motion'

interface WelcomeMessageProps {
  className?: string
}

export default function WelcomeMessage({ className = "" }: WelcomeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={`
        text-center space-y-6
        px-4 py-6 sm:py-8 md:py-10
        rounded-2xl
        bg-gradient-to-b from-black/20 to-black/10
        backdrop-blur-sm
        border border-white/10
        ${className}
      `}
      role="banner"
      aria-label="Welcome message"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="
          text-4xl md:text-5xl lg:text-6xl
          font-bold 
          bg-gradient-to-r from-white to-white/80
          bg-clip-text text-transparent
          tracking-tight
        "
        tabIndex={0}
      >
        Welcome to Zaila
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="
          text-lg md:text-xl
          text-white/90
          max-w-2xl mx-auto
          leading-relaxed
        "
        tabIndex={0}
      >
        Your intelligent AI companion, ready to assist and engage in meaningful conversations.
        Start by typing your message below or use voice input.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="
          flex items-center justify-center
          space-x-4 text-sm text-white/60
        "
        aria-label="Keyboard shortcuts"
      >
        <span>Press <kbd className="px-2 py-1 rounded bg-white/10">/</kbd> to focus input</span>
        <span>Press <kbd className="px-2 py-1 rounded bg-white/10">?</kbd> for help</span>
      </motion.div>
    </motion.div>
  )
}
