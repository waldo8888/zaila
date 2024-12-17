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

      {/* Main container with responsive grid */}
      <div 
        className={`
          flex-1 container mx-auto px-4 sm:px-6 lg:px-8
          grid grid-cols-1 gap-8
          max-w-7xl w-full
          ${className}
        `}
      >
        {/* Content wrapper with proper spacing */}
        <div 
          id="main-content"
          className="
            relative
            flex flex-col items-center justify-center
            min-h-[calc(100vh-4rem)]
            py-8 sm:py-12 md:py-16
            space-y-8 sm:space-y-12
          "
        >
          {children}
        </div>
      </div>

      {/* Status region for announcements */}
      <div
        role="status"
        aria-live="polite"
        className="sr-only"
      >
        {/* Accessibility announcements will be injected here */}
      </div>
    </div>
  )
}
