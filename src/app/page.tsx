'use client'

import Header from '../components/Header'
import Scene from '../components/3d/Scene'
import ControlPanel from '../components/ControlPanel'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16">
          <Header 
            title="Welcome to Zaila"
            subtitle="AI-powered operating system for enterprise automation"
          />
          <div className="max-w-4xl mx-auto mt-8">
            <ControlPanel />
          </div>
        </div>
      </div>
    </main>
  )
}
