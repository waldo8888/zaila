'use client'

import { Canvas as ThreeCanvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { type PropsWithChildren } from 'react'

interface CanvasProps extends PropsWithChildren {
  className?: string
}

export const Canvas = ({ children, className = '' }: CanvasProps) => {
  return (
    <div className={`relative h-full w-full ${className}`}>
      <ThreeCanvas
        className="absolute inset-0"
        shadows
        dpr={[1, 2]} // Limit pixel ratio for better performance
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
          stencil: false,
          depth: true
        }}
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, 6]
        }}
        performance={{
          min: 0.5 // Allow frame rate to drop to 30 FPS before intervening
        }}
      >
        {children}
        <Preload all /> {/* Preload all assets */}
      </ThreeCanvas>
    </div>
  )
}
