'use client';

import React, { createContext, useContext, useCallback, useRef, useState } from 'react';
import { create } from 'zustand';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusMessage {
  id: string;
  text: string;
  type: 'status' | 'error' | 'progress' | 'success';
  politeness: 'polite' | 'assertive';
  timestamp: number;
}

interface AccessibilityState {
  announcements: StatusMessage[];
  addAnnouncement: (message: Omit<StatusMessage, 'id' | 'timestamp'>) => void;
  removeAnnouncement: (id: string) => void;
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
    set((state) => ({
      announcements: [
        ...state.announcements,
        {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
        },
      ],
    })),
  removeAnnouncement: (id) =>
    set((state) => ({
      announcements: state.announcements.filter((msg) => msg.id !== id),
    })),
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
  announce: (message: string, type?: 'status' | 'error' | 'progress' | 'success') => void;
  announceError: (message: string) => void;
  announceProgress: (message: string) => void;
  announceSuccess: (message: string) => void;
  setLabel: (id: string, label: string) => void;
  removeLabel: (id: string) => void;
  setDescription: (id: string, description: string) => void;
  removeDescription: (id: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAccessibilityStore();
  const [visualKey, setVisualKey] = useState(0);
  
  const announce = useCallback((
    message: string,
    type: 'status' | 'error' | 'progress' | 'success' = 'status'
  ) => {
    const politeness = type === 'error' ? 'assertive' : 'polite';
    store.addAnnouncement({ text: message, type, politeness });
    setVisualKey(prev => prev + 1);
    setTimeout(() => {
      store.clearAnnouncements();
    }, 5000);
  }, [store]);

  const announceError = useCallback((message: string) => {
    announce(message, 'error');
  }, [announce]);

  const announceProgress = useCallback((message: string) => {
    announce(message, 'progress');
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(message, 'success');
  }, [announce]);

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

  return (
    <AccessibilityContext.Provider 
      value={{ 
        announce,
        announceError,
        announceProgress,
        announceSuccess,
        setLabel,
        removeLabel,
        setDescription,
        removeDescription
      }}
    >
      {children}

      {/* Live regions for screen reader announcements */}
      {store.announcements.map((announcement) => (
        <div
          key={announcement.id}
          role={announcement.type === 'error' ? 'alert' : 'status'}
          aria-live={announcement.politeness}
          aria-atomic="true"
          className="sr-only"
        >
          {announcement.text}
        </div>
      ))}

      {/* Visual announcements for sighted users */}
      <AnimatePresence mode="wait">
        {store.announcements.length > 0 && (
          <motion.div
            key={visualKey}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="
              fixed bottom-4 right-4
              px-4 py-2
              bg-gray-800
              text-white
              rounded-lg
              shadow-lg
              z-50
            "
          >
            {store.announcements[store.announcements.length - 1].text}
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
