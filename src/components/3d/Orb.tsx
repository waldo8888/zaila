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

  varying vec3 vPosition;
  varying vec3 vColor;

  void main() {
      vPosition = position;
      vColor = color;

      vec3 pos = position;
      float angle = uTime * uSpeed;

      // Rotate around Y axis
      pos.x = position.x * cos(angle) - position.z * sin(angle);
      pos.z = position.x * sin(angle) + position.z * cos(angle);

      // Add some noise movement
      float noiseFreq = uNoiseFrequency;
      float noiseAmp = uNoiseStrength;
      pos.x += sin(uTime * 2.0 + position.y * noiseFreq) * noiseAmp;
      pos.y += cos(uTime * 2.0 + position.x * noiseFreq) * noiseAmp;
      pos.z += sin(uTime * 2.0 + position.z * noiseFreq) * noiseAmp;

      vec4 mvPosition = modelViewMatrix * vec4(pos * uRadius, 1.0);
      gl_Position = projectionMatrix * mvPosition;

      // Size attenuation
      gl_PointSize = 2.5 * (1.0 - length(mvPosition.xyz) * 0.1);
  }
`

// Fragment Shader
const fragmentShader = `
  varying vec3 vPosition;
  varying vec3 vColor;

  void main() {
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      
      float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
      
      vec3 color = vColor;
      color += pow(1.0 - dist, 3.0) * 0.6;
      
      gl_FragColor = vec4(color, alpha);
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
        radius: 1.1
      }
    case 'success':
      return {
        baseColor: '#50c878',
        emissiveColor: '#90eeb1',
        speed: 0.4,
        noiseStrength: 0.02,
        noiseFrequency: 4.0,
        radius: 1.2
      }
    case 'error':
      return {
        baseColor: '#ff4444',
        emissiveColor: '#ff8888',
        speed: 1.2,
        noiseStrength: 0.06,
        noiseFrequency: 8.0,
        radius: 0.9
      }
    default:
      return {
        baseColor: '#4a90e2',
        emissiveColor: '#7ab5ff',
        speed: 0.3,
        noiseStrength: 0.02,
        noiseFrequency: 4.0,
        radius: 1.0
      }
  }
}

const Orb = ({ state = 'idle' }: OrbProps) => {
  const pointsRef = useRef<Points>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const timeRef = useRef(0)
  const { animationSpeed } = useOrbState()

  const config = getStateConfig(state)

  // Generate particles in a spherical distribution
  const geometry = useMemo(() => {
    const geo = new BufferGeometry()
    const particles = 12000
    const positions = []
    const colors = []
    const baseColor = new Color(config.baseColor)
    const emissiveColor = new Color(config.emissiveColor)
    
    for (let i = 0; i < particles; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = Math.pow(Math.random(), 0.5) // Adjusted distribution
      
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      
      positions.push(x, y, z)
      
      const mixRatio = radius
      const particleColor = baseColor.clone().lerp(emissiveColor, mixRatio)
      colors.push(particleColor.r, particleColor.g, particleColor.b)
    }
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3))
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3))
    return geo
  }, [config.baseColor, config.emissiveColor])

  // Create shader material
  const material = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: config.radius },
        uSpeed: { value: config.speed },
        uNoiseStrength: { value: config.noiseStrength },
        uNoiseFrequency: { value: config.noiseFrequency }
      },
      vertexColors: true,
      depthWrite: false,
    })
  }, [config])

  // Animation loop
  useFrame((_, delta) => {
    timeRef.current += delta * animationSpeed

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = timeRef.current
      materialRef.current.uniforms.uSpeed.value = config.speed * animationSpeed
      materialRef.current.uniforms.uNoiseStrength.value = config.noiseStrength
      materialRef.current.uniforms.uNoiseFrequency.value = config.noiseFrequency
      
      // Breathing effect
      const breathe = Math.sin(timeRef.current) * 0.1 + config.radius
      materialRef.current.uniforms.uRadius.value = breathe
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <primitive object={material} ref={materialRef} attach="material" />
    </points>
  )
}

export default Orb
