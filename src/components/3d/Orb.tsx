'use client'

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOrbState } from '@/store/hooks/useOrb';
import { OrbState } from '@/store/types';
import { BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, Color } from 'three'

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

interface OrbConfig {
  baseColor: string;
  emissiveColor: string;
  speed: number;
  noiseStrength: number;
  noiseFrequency: number;
  radius: number;
  alpha: number;
}

interface OrbProps {
  state?: OrbState['animationState']
}

const getStateConfig = (state: OrbState['animationState']): OrbConfig => {
  switch (state) {
    case 'idle':
      return {
        baseColor: '#4a90e2',
        emissiveColor: '#86c5f9',
        speed: 0.5,
        noiseStrength: 0.2,
        noiseFrequency: 1.5,
        radius: 1.0,
        alpha: 0.8
      };
    case 'processing':
      return {
        baseColor: '#f5a623',
        emissiveColor: '#fbd66d',
        speed: 1.2,
        noiseStrength: 0.4,
        noiseFrequency: 2.0,
        radius: 1.1,
        alpha: 0.9
      };
    case 'success':
      return {
        baseColor: '#7ed321',
        emissiveColor: '#b8e986',
        speed: 0.8,
        noiseStrength: 0.3,
        noiseFrequency: 1.8,
        radius: 1.2,
        alpha: 1.0
      };
    case 'error':
      return {
        baseColor: '#d0021b',
        emissiveColor: '#ff6b6b',
        speed: 1.5,
        noiseStrength: 0.5,
        noiseFrequency: 2.2,
        radius: 0.9,
        alpha: 0.7
      };
    case 'active':
      return {
        baseColor: '#9013fe',
        emissiveColor: '#bd10e0',
        speed: 1.0,
        noiseStrength: 0.35,
        noiseFrequency: 1.7,
        radius: 1.15,
        alpha: 0.95
      };
    case 'inactive':
    default:
      return {
        baseColor: '#4a4a4a',
        emissiveColor: '#9b9b9b',
        speed: 0.3,
        noiseStrength: 0.1,
        noiseFrequency: 1.0,
        radius: 0.8,
        alpha: 0.6
      };
  }
};

export default function Orb({ state = 'idle' }: OrbProps) {
  const pointsRef = useRef<Points>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const { 
    animationState, 
    previousState,
    transitionProgress 
  } = useOrbState()

  // Get configurations for current and previous states
  const currentConfig = getStateConfig(state || animationState)

  const previousConfig = previousState ? getStateConfig(previousState) : currentConfig

  // Interpolate between states
  const config = {
    speed: previousConfig.speed + (currentConfig.speed - previousConfig.speed) * transitionProgress,
    noiseStrength: previousConfig.noiseStrength + (currentConfig.noiseStrength - previousConfig.noiseStrength) * transitionProgress,
    noiseFrequency: previousConfig.noiseFrequency + (currentConfig.noiseFrequency - previousConfig.noiseFrequency) * transitionProgress,
    radius: previousConfig.radius + (currentConfig.radius - previousConfig.radius) * transitionProgress,
    alpha: previousConfig.alpha + (currentConfig.alpha - previousConfig.alpha) * transitionProgress,
  }

  // Create geometry with particles
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const positions = []
    const colors = []
    const sizes = []
    const angles = []

    const particleCount = 10000
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
      const r = radius * (0.8 + Math.random() * 0.4) // Vary radius slightly

      positions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors.push(color.r, color.g, color.b)

      // Random size
      sizes.push(0.03 + Math.random() * 0.05 * Math.random())

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
      // Update uniforms with interpolated values
      materialRef.current.uniforms.uTime.value += delta * config.speed
      materialRef.current.uniforms.uRadius.value = config.radius
      materialRef.current.uniforms.uSpeed.value = config.speed
      materialRef.current.uniforms.uNoiseStrength.value = config.noiseStrength
      materialRef.current.uniforms.uNoiseFrequency.value = config.noiseFrequency
      materialRef.current.uniforms.uAlpha.value = config.alpha
      
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
