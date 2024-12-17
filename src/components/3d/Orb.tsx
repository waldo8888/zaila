'use client'

import { Sphere } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useOrbAnimation } from '../../hooks/useOrbAnimation'
import { type OrbState } from '../../types/orb'
import { useEffect, useRef } from 'react'
import { type Mesh } from 'three'

interface OrbProps {
  state?: OrbState
}

const Orb = ({ state = 'idle' }: OrbProps) => {
  const meshRef = useRef<Mesh>(null)
  const { position, rotation, scale, color, emissive, emissiveIntensity } = useOrbAnimation(state)

  // Enable matrix auto updates for animations
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.matrixAutoUpdate = true
    }
  }, [])

  // Update mesh on each frame
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(position)
      meshRef.current.rotation.copy(rotation)
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 64]}
      frustumCulled
      castShadow
      receiveShadow
    >
      <meshPhysicalMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        clearcoat={1}
        clearcoatRoughness={0}
        metalness={0.9}
        roughness={0.1}
        transmission={0.98}
        thickness={0.5}
        transparent
        opacity={0.95}
        toneMapped={true}
        flatShading={false}
        envMapIntensity={2}
      />
    </Sphere>
  )
}

export default Orb
