'use client'

import { useRef } from 'react'
import { AmbientLight, DirectionalLight, PointLight } from 'three'

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={0.5}
      />
    </>
  )
}
