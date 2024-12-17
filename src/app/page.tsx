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
