'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useOrbAnimation } from '../../hooks/useOrbAnimation'
import { type OrbState } from '../../types/orb'
import { BufferGeometry, Float32BufferAttribute, Points, Color, PointsMaterial, AdditiveBlending } from 'three'

interface OrbProps {
  state?: OrbState
}

const Orb = ({ state = 'idle' }: OrbProps) => {
  const pointsRef = useRef<Points>(null)
  const materialRef = useRef<PointsMaterial>(null)
  const { position, rotation, scale, color, emissive, emissiveIntensity } = useOrbAnimation(state)
  const timeRef = useRef(0)

  // Generate particle positions
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const particles = 5000
    const positions = []
    const colors = []
    const baseColor = new Color(color)
    const emissiveColor = new Color(emissive)
    
    for (let i = 0; i < particles; i++) {
      const phi = Math.random() * Math.PI * 2
      const costheta = Math.random() * 2 - 1
      const theta = Math.acos(costheta)
      
      const radius = 1 + (Math.random() - 0.5) * 0.1
      const x = Math.sin(theta) * Math.cos(phi) * radius
      const y = Math.sin(theta) * Math.sin(phi) * radius
      const z = Math.cos(theta) * radius
      
      positions.push(x, y, z)
      
      const mixRatio = Math.random() * emissiveIntensity
      const particleColor = baseColor.clone().lerp(emissiveColor, mixRatio)
      colors.push(particleColor.r, particleColor.g, particleColor.b)
    }
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
    return geo
  }, [color, emissive, emissiveIntensity])

  useFrame((_, delta) => {
    timeRef.current += delta

    if (pointsRef.current) {
      // Smooth rotation
      pointsRef.current.rotation.y += delta * 0.2
      
      // Breathing effect
      const breatheScale = 1 + Math.sin(timeRef.current * 2) * 0.05
      pointsRef.current.scale.setScalar(scale * breatheScale)
    }

    if (materialRef.current) {
      // Smooth color transition
      const targetColor = new Color(color)
      const targetEmissive = new Color(emissive)
      const currentColor = materialRef.current.color
      
      currentColor.lerp(targetColor, delta * 2)
      
      // Pulse opacity
      const pulseOpacity = 0.8 + Math.sin(timeRef.current * 2) * 0.1
      materialRef.current.opacity = pulseOpacity
    }
  })

  return (
    <points ref={pointsRef}>
      <primitive object={geometry} attach="geometry" />
      <pointsMaterial
        ref={materialRef}
        size={0.03}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
        vertexColors={true}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

export default Orb
