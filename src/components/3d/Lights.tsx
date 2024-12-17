'use client'

import { useHelper } from '@react-three/drei'
import { useRef } from 'react'
import { DirectionalLight, DirectionalLightHelper } from 'three'

export default function Lights() {
  const mainLightRef = useRef<DirectionalLight | null>(null)

  // Enable light helper in development
  if (process.env.NODE_ENV === 'development' && mainLightRef.current) {
    useHelper(mainLightRef as any, DirectionalLightHelper, 1, '#fff')
  }

  return (
    <>
      {/* Main directional light */}
      <directionalLight
        ref={mainLightRef}
        position={[5, 5, 5]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.001}
      />

      {/* Ambient light for base visibility */}
      <ambientLight intensity={0.3} color="#b4c6ef" />

      {/* Hemisphere light for natural sky/ground reflection */}
      <hemisphereLight
        intensity={0.4}
        color="#b4c6ef"
        groundColor="#4338ca"
      />
    </>
  )
}
