'use client'

import { useCallback } from 'react'
import SceneContainer from '../components/3d/SceneContainer'
import Layout from '../components/ui/Layout'
import WelcomeMessage from '../components/ui/WelcomeMessage'
import InputArea from '../components/ui/InputArea'
import StatusIndicator from '../components/ui/StatusIndicator'

export default function Home() {
  const handleSubmitAction = useCallback(async (text: string) => {
    console.log('Message submitted:', text)
    // TODO: Implement message handling
  }, [])

  const handleVoiceInputAction = useCallback(async () => {
    console.log('Voice input requested')
    // TODO: Implement voice input
  }, [])

  return (
    <main className="relative">
      {/* 3D Scene Background */}
      <SceneContainer className="z-0" />

      {/* Main Content */}
      <Layout>
        <div className="relative z-10 space-y-12">
          {/* Welcome Message */}
          <WelcomeMessage />

          {/* Input Area */}
          <div className="w-full max-w-3xl mx-auto px-4">
            <InputArea
              submitAction={handleSubmitAction}
              voiceInputAction={handleVoiceInputAction}
            />
          </div>
        </div>
      </Layout>

      {/* Status Indicators */}
      <StatusIndicator />
    </main>
  )
}
