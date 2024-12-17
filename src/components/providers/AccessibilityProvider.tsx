'use client'

import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibilityState {
  announcements: string[];
  addAnnouncement: (message: string) => void;
  clearAnnouncements: () => void;
  ariaLabels: Map<string, string>;
  setAriaLabel: (id: string, label: string) => void;
  removeAriaLabel: (id: string) => void;
  ariaDescriptions: Map<string, string>;
  setAriaDescription: (id: string, description: string) => void;
  removeAriaDescription: (id: string) => void;
}

const useAccessibilityStore = create<AccessibilityState>((set) => ({
  announcements: [],
  addAnnouncement: (message) => 
    set((state) => ({ announcements: [...state.announcements, message] })),
  clearAnnouncements: () => set({ announcements: [] }),
  ariaLabels: new Map(),
  setAriaLabel: (id, label) =>
    set((state) => {
      const newLabels = new Map(state.ariaLabels);
      newLabels.set(id, label);
      return { ariaLabels: newLabels };
    }),
  removeAriaLabel: (id) =>
    set((state) => {
      const newLabels = new Map(state.ariaLabels);
      newLabels.delete(id);
      return { ariaLabels: newLabels };
    }),
  ariaDescriptions: new Map(),
  setAriaDescription: (id, description) =>
    set((state) => {
      const newDescriptions = new Map(state.ariaDescriptions);
      newDescriptions.set(id, description);
      return { ariaDescriptions: newDescriptions };
    }),
  removeAriaDescription: (id) =>
    set((state) => {
      const newDescriptions = new Map(state.ariaDescriptions);
      newDescriptions.delete(id);
      return { ariaDescriptions: newDescriptions };
    }),
}));

interface AccessibilityContextType {
  announce: (message: string) => void;
  setLabel: (id: string, label: string) => void;
  removeLabel: (id: string) => void;
  setDescription: (id: string, description: string) => void;
  removeDescription: (id: string) => void;
  setFocusTarget: (id: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAccessibilityStore();
  const [liveRegionKey, setLiveRegionKey] = useState(0);
  
  const announce = useCallback((message: string) => {
    store.addAnnouncement(message);
    setLiveRegionKey(prev => prev + 1);
    setTimeout(() => store.clearAnnouncements(), 3000);
  }, [store]);

  const setLabel = useCallback((id: string, label: string) => {
    store.setAriaLabel(id, label);
  }, [store]);

  const removeLabel = useCallback((id: string) => {
    store.removeAriaLabel(id);
  }, [store]);

  const setDescription = useCallback((id: string, description: string) => {
    store.setAriaDescription(id, description);
  }, [store]);

  const removeDescription = useCallback((id: string) => {
    store.removeAriaDescription(id);
  }, [store]);

  const setFocusTarget = useCallback((id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.focus()
    }
  }, [])

  return (
    <AccessibilityContext.Provider 
      value={{ 
        announce, 
        setLabel, 
        removeLabel, 
        setDescription, 
        removeDescription,
        setFocusTarget
      }}
    >
      {children}
      <div
        key={liveRegionKey}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {store.announcements.join(' ')}
      </div>

      {/* Visual announcement for sighted users */}
      <AnimatePresence>
        {store.announcements.length > 0 && (
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
            {store.announcements.join(' ')}
          </motion.div>
        )}
      </AnimatePresence>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
