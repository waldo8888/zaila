'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, Color } from 'three'
import { type OrbState } from '../../store/types'
import { useOrbState } from '../../store/hooks'

// Vertex Shader
const vertexShader = `
  uniform float uTime;
  uniform float uRadius;
  uniform float uSpeed;
  uniform float uNoiseStrength;
  uniform float uNoiseFrequency;
  uniform float uAlpha;

  attribute vec3 color;
  attribute float size;
  attribute float angle;

  varying vec3 vPosition;
  varying vec3 vColor;

  void main() {
      vPosition = position;
      vColor = color;

      vec3 pos = position;
      float angleOffset = uTime * uSpeed + angle;

      // Rotate around Y axis
      pos.x = position.x * cos(angleOffset) - position.z * sin(angleOffset);
      pos.z = position.x * sin(angleOffset) + position.z * cos(angleOffset);

      // Add some noise movement
      float noise = sin(angleOffset + pos.x * uNoiseFrequency) * 
                   cos(angleOffset + pos.z * uNoiseFrequency) * 
                   uNoiseStrength;
      
      pos += normalize(pos) * noise;

      // Scale by radius
      pos *= uRadius;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      gl_PointSize = size * (300.0 / -mvPosition.z);
  }
`

// Fragment Shader
const fragmentShader = `
  uniform float uAlpha;

  varying vec3 vColor;
  varying vec3 vPosition;

  void main() {
      // Create a circular point
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      if (dist > 0.5) discard;

      // Smooth edges
      float alpha = smoothstep(0.5, 0.4, dist) * uAlpha;

      // Output final color
      gl_FragColor = vec4(vColor, alpha);
  }
`

interface OrbProps {
  state?: OrbState['animationState']
}

const getStateConfig = (state: OrbState['animationState']) => {
  switch (state) {
    case 'processing':
      return {
        baseColor: '#4a90e2',
        emissiveColor: '#7ab5ff',
        speed: 0.8,
        noiseStrength: 0.04,
        noiseFrequency: 6.0,
        radius: 1.1,
        alpha: 1.0
      }
    case 'success':
      return {
        baseColor: '#50c878',
        emissiveColor: '#90eeb1',
        speed: 0.4,
        noiseStrength: 0.02,
        noiseFrequency: 4.0,
        radius: 1.2,
        alpha: 1.0
      }
    case 'error':
      return {
        baseColor: '#ff4444',
        emissiveColor: '#ff8888',
        speed: 1.2,
        noiseStrength: 0.06,
        noiseFrequency: 8.0,
        radius: 0.9,
        alpha: 1.0
      }
    default:
      return {
        baseColor: '#4a90e2',
        emissiveColor: '#7ab5ff',
        speed: 0.3,
        noiseStrength: 0.02,
        noiseFrequency: 4.0,
        radius: 1.0,
        alpha: 1.0
      }
  }
}

export default function Orb({ state = 'idle' }: OrbProps) {
  const pointsRef = useRef<Points>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const { animationState } = useOrbState()

  // Get configuration based on state
  const config = useMemo(() => getStateConfig(state || animationState), [state, animationState])

  // Create geometry with particles
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const positions = []
    const colors = []
    const sizes = []
    const angles = []

    const particleCount = 5000
    const radius = 1.5
    const colorPalette = [
      new Color('#ffffff'),
      new Color('#8ab4f8'),
      new Color('#c2e7ff'),
      new Color('#1a73e8')
    ]

    for (let i = 0; i < particleCount; i++) {
      // Position on sphere surface
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const r = radius * (0.9 + Math.random() * 0.2) // Vary radius slightly

      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors.push(color.r, color.g, color.b)

      // Random size
      sizes.push(0.02 + Math.random() * 0.03)

      // Random initial angle
      angles.push(Math.random() * Math.PI * 2)
    }

    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
    geo.setAttribute('size', new Float32BufferAttribute(sizes, 1))
    geo.setAttribute('angle', new Float32BufferAttribute(angles, 1))

    return geo
  }, [])

  // Animation
  useFrame((state, delta) => {
    if (pointsRef.current && materialRef.current) {
      // Update uniforms
      materialRef.current.uniforms.uTime.value += delta * config.speed
      
      // Gentle floating motion
      const time = state.clock.getElapsedTime()
      pointsRef.current.position.y = Math.sin(time * 0.5) * 0.1
      
      // Smooth rotation
      pointsRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={1}
        uniforms={{
          uTime: { value: 0 },
          uRadius: { value: config.radius },
          uSpeed: { value: config.speed },
          uNoiseStrength: { value: config.noiseStrength },
          uNoiseFrequency: { value: config.noiseFrequency },
          uAlpha: { value: config.alpha }
        }}
      />
    </points>
  )
}
