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
      announce('Sending message...')
      await submitAction(input.trim())
      setInput('')
      announce('Message sent successfully')
    } catch (error) {
      console.error('Error submitting message:', error)
      setError({
        type: 'client',
        message: 'Failed to send message',
        context: { error: error instanceof Error ? error.message : String(error) }
      })
      announce('Error sending message')
    }
  }, [input, isLoading, submitAction, announce, setError, updateContext])

  const handleVoiceInput = useCallback(async () => {
    if (isLoading) return

    try {
      announce('Starting voice input...')
      await voiceInputAction()
      announce('Voice input activated')
    } catch (error) {
      console.error('Error activating voice input:', error)
      setError({
        type: 'client',
        message: 'Failed to activate voice input',
        context: { error: error instanceof Error ? error.message : String(error) }
      })
      announce('Error activating voice input')
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
          border border-white/10
        "
      >
        <form 
          onSubmit={handleSubmit}
          className="flex-1 flex items-center gap-2"
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
              text-white
              placeholder-white/50
              focus:outline-none
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            aria-label="Message input field"
          />
          
          <Tooltip content="Send message (Cmd/Ctrl + Enter)">
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="
                p-2
                text-white/80 hover:text-white
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </Tooltip>
        </form>

        <div className="flex items-center">
          <div className="w-px h-6 bg-white/10 mx-2" role="separator" />
          
          <Tooltip content="Voice input">
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isLoading}
              className="
                p-2
                text-white/80 hover:text-white
                disabled:opacity-50
                disabled:cursor-not-allowed
                transition-colors
              "
              aria-label="Activate voice input"
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
          </Tooltip>
        </div>
      </motion.div>
    </div>
  )
}
