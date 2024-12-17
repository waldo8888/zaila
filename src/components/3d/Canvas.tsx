'use client'

import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
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
        powerPreference: 'high-performance'
      }}
      dpr={[1, 2]} // Responsive pixel ratio
      performance={{
        min: 0.5 // Allow frame rate to drop to 30fps
      }}
    >
      <Preload all />
      {children}
    </ThreeCanvas>
  )
}
