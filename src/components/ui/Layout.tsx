'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAccessibility } from '../providers/AccessibilityProvider'

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

export default function Layout({ children, className = "" }: LayoutProps) {
  const { announce } = useAccessibility()

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input field with / key
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault()
        const input = document.querySelector('input[type="text"]') as HTMLInputElement
        if (input) {
          input.focus()
          announce('Input field focused')
        }
      }

      // Announce help when pressing ?
      if (e.key === '?' && !e.shiftKey) {
        e.preventDefault()
        announce('Available shortcuts: Press slash to focus input, question mark for help')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [announce])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="
          sr-only focus:not-sr-only
          fixed top-0 left-0 z-50
          bg-black text-white
          px-4 py-2 m-2
          focus:outline-none focus:ring-2 focus:ring-white
          rounded-lg
        "
      >
        Skip to main content
      </a>

      {/* Header region */}
      <header
        role="banner"
        className="relative z-10"
        aria-label="Site header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="sr-only">Zaila</h1>
        </div>
      </header>

      {/* Main content */}
      <motion.main
        id="main-content"
        role="main"
        aria-label="Main content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className={`
          flex-1
          relative z-0
          ${className}
        `}
        tabIndex={-1}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </motion.main>

      {/* Status region for announcements */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {/* Dynamic announcements will be inserted here */}
      </div>

      {/* Navigation region for keyboard shortcuts */}
      <nav
        role="navigation"
        aria-label="Keyboard shortcuts"
        className="sr-only"
      >
        <ul>
          <li>Press slash (/) to focus the input field</li>
          <li>Press question mark (?) for help</li>
          <li>Press tab to navigate between interactive elements</li>
          <li>Press enter or space to activate buttons</li>
        </ul>
      </nav>
    </div>
  )
}
