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
      className={`text-center space-y-4 ${className}`}
      role="banner"
      aria-label="Welcome message"
    >
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="
          text-4xl md:text-5xl lg:text-6xl
          font-bold text-white
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
          text-white/80
          max-w-2xl mx-auto
          leading-relaxed
        "
        tabIndex={0}
      >
        Your AI companion for exploring and understanding the world around you.
        Ask me anything, and I'll help you find the answers you seek.
      </motion.p>
    </motion.div>
  )
}
