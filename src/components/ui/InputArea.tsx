'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import Tooltip from './Tooltip'
import { useAccessibility } from '../providers/AccessibilityProvider'
import { useUIState, useUIActions, useSessionActions } from '@/store/hooks'

interface InputAreaProps {
  className?: string
  placeholder?: string
  submitAction: (input: string) => Promise<void>
  voiceInputAction: () => Promise<void>
}

export default function InputArea({
  className = "",
  placeholder = "Type your message...",
  submitAction,
  voiceInputAction
}: InputAreaProps) {
  const [input, setInput] = useState('')
  const { isLoading } = useUIState()
  const { setError } = useUIActions()
  const { updateContext } = useSessionActions()
  const inputRef = useRef<HTMLInputElement>(null)
  const { announce } = useAccessibility()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    try {
      updateContext({ lastInput: input.trim() })
      announce('Sending message...', 'polite')
      await submitAction(input.trim())
      setInput('')
      announce('Message sent successfully', 'polite')
    } catch (error) {
      console.error('Error submitting message:', error)
      setError({
        type: 'client',
        message: 'Failed to send message',
        context: { error: error instanceof Error ? error.message : String(error) }
      })
      announce('Error sending message', 'assertive')
    }
  }, [input, isLoading, submitAction, announce, setError, updateContext])

  const handleVoiceInput = useCallback(async () => {
    if (isLoading) return

    try {
      announce('Starting voice input...', 'polite')
      await voiceInputAction()
      announce('Voice input activated', 'polite')
    } catch (error) {
      console.error('Error activating voice input:', error)
      setError({
        type: 'client',
        message: 'Failed to activate voice input',
        context: { error: error instanceof Error ? error.message : String(error) }
      })
      announce('Error activating voice input', 'assertive')
    }
  }, [voiceInputAction, announce, isLoading, setError])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Cmd/Ctrl + Enter to submit
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e)
    }
  }, [handleSubmit])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div 
      className={`
        relative
        max-w-2xl mx-auto
        ${className}
      `}
      role="search"
      aria-label="Message input"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          flex items-center gap-2
          bg-gradient-to-b from-white/10 to-white/5
          backdrop-blur-lg
          rounded-2xl
          p-3 sm:p-4
          shadow-lg
          ring-1 ring-white/10
          focus-within:ring-2 focus-within:ring-white/20
          transition-all duration-200
        "
      >
        <form 
          onSubmit={handleSubmit} 
          className="flex-1 flex items-center gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="
              flex-1
              bg-transparent
              text-white placeholder-white/50
              text-lg
              py-2 px-3
              rounded-xl
              outline-none
              disabled:opacity-50
              transition-opacity duration-200
            "
            aria-label="Message input field"
          />

          <Tooltip content="Send message (Cmd/Ctrl + Enter)">
            <motion.button
              type="submit"
              disabled={!input.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                p-3
                rounded-xl
                bg-white/10
                hover:bg-white/20
                disabled:opacity-50
                disabled:hover:bg-white/10
                transition-colors duration-200
              "
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="w-6 h-6 text-white" />
            </motion.button>
          </Tooltip>
        </form>

        <div className="flex-shrink-0 pl-2 border-l border-white/10">
          <Tooltip content="Voice input">
            <motion.button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="
                p-3
                rounded-xl
                bg-white/10
                hover:bg-white/20
                disabled:opacity-50
                disabled:hover:bg-white/10
                transition-colors duration-200
              "
              aria-label="Activate voice input"
            >
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </motion.button>
          </Tooltip>
        </div>
      </motion.div>

      {/* Keyboard shortcut hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="
          absolute -bottom-8
          left-1/2 transform -translate-x-1/2
          text-sm text-white/40
          pointer-events-none
          select-none
        "
      >
        Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white/60">Tab</kbd> to navigate
      </motion.div>
    </div>
  )
}
