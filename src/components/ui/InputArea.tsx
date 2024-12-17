'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import Tooltip from './Tooltip'
import { useAccessibility } from '../providers/AccessibilityProvider'

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const { announce } = useAccessibility()

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return
    
    try {
      setIsSubmitting(true)
      announce('Sending message...', 'polite')
      await submitAction(input)
      setInput('')
      announce('Message sent successfully', 'polite')
    } catch (error) {
      announce('Failed to send message. Please try again.', 'assertive')
    } finally {
      setIsSubmitting(false)
    }
  }, [input, submitAction, isSubmitting, announce])

  const handleVoiceInput = useCallback(async () => {
    try {
      announce('Starting voice input...', 'polite')
      await voiceInputAction()
    } catch (error) {
      announce('Failed to start voice input. Please try again.', 'assertive')
    }
  }, [voiceInputAction, announce])

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
      className={`relative ${className}`}
      role="search"
      aria-label="Message input"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          flex items-center gap-2
          bg-white/10 backdrop-blur-lg
          rounded-xl p-2
          shadow-lg
          focus-within:ring-2 focus-within:ring-white/20
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
            disabled={isSubmitting}
            className="
              flex-1
              bg-transparent
              text-white
              placeholder-white/50
              px-4 py-2
              rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-white/20
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            aria-label="Message input"
            aria-disabled={isSubmitting}
            aria-describedby="input-help"
          />

          <span id="input-help" className="sr-only">
            Type your message and press enter to send. Use slash key to focus this input.
          </span>

          <Tooltip content="Use voice input (⌘V)" position="top">
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isSubmitting}
              className="
                p-2 rounded-lg
                hover:bg-white/10
                transition-colors
                focus:outline-none
                focus:ring-2 focus:ring-white/20
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
              aria-label="Use voice input"
              aria-disabled={isSubmitting}
            >
              <MicrophoneIcon className="w-6 h-6 text-white" />
            </button>
          </Tooltip>

          <Tooltip content="Send message (⌘↵)" position="top">
            <button
              type="submit"
              disabled={!input.trim() || isSubmitting}
              className="
                p-2 rounded-lg
                hover:bg-white/10
                transition-colors
                focus:outline-none
                focus:ring-2 focus:ring-white/20
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
              aria-label="Send message"
              aria-disabled={!input.trim() || isSubmitting}
            >
              <PaperAirplaneIcon className="w-6 h-6 text-white" />
            </button>
          </Tooltip>
        </form>
      </motion.div>
    </div>
  )
}
