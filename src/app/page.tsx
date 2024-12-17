'use client'

import { useCallback } from 'react'
import { useUIState, useUIActions } from '@/store/hooks'
import SceneContainer from '../components/3d/SceneContainer'
import Layout from '../components/ui/Layout'
import WelcomeMessage from '../components/ui/WelcomeMessage'
import InputArea from '../components/ui/InputArea'
import StatusIndicator from '../components/ui/StatusIndicator'

export default function Home() {
  const { isLoading } = useUIState()
  const { setLoading, setError, setSuccess } = useUIActions()

  const handleSubmitAction = useCallback(async (text: string) => {
    if (isLoading) return

    try {
      setLoading(true)
      console.log('Message submitted:', text)
      // TODO: Implement message handling
      throw new Error('Message handling not yet implemented')
    } catch (error) {
      console.error('Error submitting message:', error)
      setError({
        type: 'system',
        message: 'Message handling not yet implemented',
        timestamp: Date.now(),
        context: { error: error instanceof Error ? error.message : String(error) },
        retryCount: 0,
        recoverable: true,
        retryAction: () => handleSubmitAction(text),
        clearAction: () => setError(null)
      })
    } finally {
      setLoading(false)
    }
  }, [isLoading, setLoading, setError])

  const handleVoiceInputAction = useCallback(async () => {
    if (isLoading) return

    try {
      setLoading(true)
      console.log('Voice input requested')
      // TODO: Implement voice input
      throw new Error('Voice input not yet implemented')
    } catch (error) {
      console.error('Error activating voice input:', error)
      setError({
        type: 'system',
        message: 'Voice input not yet implemented',
        timestamp: Date.now(),
        context: { error: error instanceof Error ? error.message : String(error) },
        retryCount: 0,
        recoverable: true,
        retryAction: () => handleVoiceInputAction(),
        clearAction: () => setError(null)
      })
    } finally {
      setLoading(false)
    }
  }, [isLoading, setLoading, setError])

  return (
    <main className="relative w-full min-h-screen">
      {/* 3D Scene Background */}
      <SceneContainer className="fixed inset-0 z-0" />

      {/* Main Content */}
      <Layout>
        <div className="
          relative z-10 
          w-full max-w-2xl mx-auto
          flex flex-col items-center
          space-y-8 sm:space-y-12
        ">
          {/* Welcome Message */}
          <WelcomeMessage />

          {/* Input Area */}
          <InputArea
            submitAction={handleSubmitAction}
            voiceInputAction={handleVoiceInputAction}
            className="w-full"
          />

          {/* Status Indicator */}
          <StatusIndicator className="absolute bottom-4 left-1/2 transform -translate-x-1/2" />
        </div>
      </Layout>
    </main>
  )
}
