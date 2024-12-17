'use client'

import React, { createContext, useContext, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AccessibilityContextType {
  announce: (message: string, type?: 'assertive' | 'polite') => void
  setFocusTarget: (id: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  announce: () => {},
  setFocusTarget: () => {}
})

export const useAccessibility = () => useContext(AccessibilityContext)

interface AccessibilityProviderProps {
  children: React.ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [announcement, setAnnouncement] = useState('')
  const [announcementType, setAnnouncementType] = useState<'assertive' | 'polite'>('polite')

  const announce = useCallback((message: string, type: 'assertive' | 'polite' = 'polite') => {
    setAnnouncement(message)
    setAnnouncementType(type)
    // Clear announcement after 3 seconds
    setTimeout(() => setAnnouncement(''), 3000)
  }, [])

  const setFocusTarget = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.focus()
    }
  }, [])

  return (
    <AccessibilityContext.Provider value={{ announce, setFocusTarget }}>
      {children}
      
      {/* Live regions for screen reader announcements */}
      <div className="sr-only" aria-live="polite" role="status">
        {announcementType === 'polite' && announcement}
      </div>
      <div className="sr-only" aria-live="assertive" role="alert">
        {announcementType === 'assertive' && announcement}
      </div>

      {/* Visual announcement for sighted users */}
      <AnimatePresence>
        {announcement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="
              fixed bottom-4 left-1/2 -translate-x-1/2
              bg-black/80 text-white
              px-4 py-2 rounded-lg
              text-sm font-medium
              pointer-events-none
              z-50
            "
            role="status"
          >
            {announcement}
          </motion.div>
        )}
      </AnimatePresence>
    </AccessibilityContext.Provider>
  )
}
