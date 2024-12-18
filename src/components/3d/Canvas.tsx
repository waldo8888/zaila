'use client'

import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { Preload, Stats } from '@react-three/drei'
import { type PropsWithChildren } from 'react'

interface CanvasProps {
  children: React.ReactNode
}

export function Canvas({ children }: CanvasProps) {
  return (
    <ThreeCanvas
      camera={{
        position: [0, 0, 5],
        fov: 45,
        near: 0.1,
        far: 1000
      }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        precision: 'highp',
        logarithmicDepthBuffer: true,
        // Enable depth buffer
        depth: true,
        // Enable stencil buffer for advanced effects
        stencil: true
      }}
      dpr={[1, 2]} // Responsive pixel ratio
      performance={{
        min: 0.5, // Allow frame rate to drop to 30fps
        max: 1, // Cap at 60fps for efficiency
        debounce: 200 // Debounce resize events
      }}
      frameloop="demand" // Only render when needed
      linear // Linear color space for better performance
    >
      {process.env.NODE_ENV === 'development' && <Stats />}
      <Preload all />
      {children}
    </ThreeCanvas>
  )
}
