'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MicrophoneIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    await submitAction(input)
    setInput('')
  }, [input, submitAction])

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          flex items-center gap-2
          bg-white/10 backdrop-blur-lg
          rounded-xl p-2
          shadow-lg
        "
      >
        <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="
              flex-1
              bg-transparent
              text-white
              placeholder-white/50
              px-4 py-2
              rounded-lg
              focus:outline-none
              focus:ring-2 focus:ring-white/20
            "
          />

          <button
            type="button"
            onClick={voiceInputAction}
            className="
              p-2 rounded-lg
              hover:bg-white/10
              transition-colors
              focus:outline-none
              focus:ring-2 focus:ring-white/20
            "
          >
            <MicrophoneIcon className="w-6 h-6 text-white" />
          </button>

          <button
            type="submit"
            disabled={!input.trim()}
            className="
              p-2 rounded-lg
              hover:bg-white/10
              transition-colors
              focus:outline-none
              focus:ring-2 focus:ring-white/20
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <PaperAirplaneIcon className="w-6 h-6 text-white" />
          </button>
        </form>
      </motion.div>
    </div>
  )
}
