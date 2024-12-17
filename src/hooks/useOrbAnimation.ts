import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { Vector3, MathUtils, Euler, Color } from 'three'
import { type OrbState, orbStateConfigs } from '../types/orb'
import { useOrbState } from '@/store/hooks'

const FLOAT_SPEED = 0.5
const FLOAT_HEIGHT = 0.2
const FLOAT_SMOOTHNESS = 2
const TRANSITION_SPEED = 3 // Slower for smoother transitions
const COLOR_TRANSITION_SPEED = 4 // Separate speed for color transitions

export interface AnimationState {
  position: Vector3
  rotation: Euler
  scale: number
  color: string
  emissive: string
  emissiveIntensity: number
}

export const useOrbAnimation = (state: OrbState = 'idle') => {
  const { interactionMode } = useOrbState();
  const positionRef = useRef<Vector3>(new Vector3(0, 0, 0))
  const rotationRef = useRef<Euler>(new Euler(0, 0, 0))
  const timeRef = useRef(0)
  const currentScaleRef = useRef(1)
  const currentEmissiveIntensityRef = useRef(0.2)
  const currentColorRef = useRef('#4338ca')
  const currentEmissiveRef = useRef('#4338ca')
  const lastStateRef = useRef(state)
  const frameRef = useRef(0)

  // Handle interaction mode changes
  useEffect(() => {
    if (interactionMode === 'active') {
      currentEmissiveIntensityRef.current *= 1.5;
    }
  }, [interactionMode]);

  // Handle state changes
  useEffect(() => {
    if (state !== lastStateRef.current) {
      // Reset time on state change for consistent animation start
      timeRef.current = 0;
      lastStateRef.current = state;
    }
  }, [state]);

  useFrame((_, delta) => {
    // Increment frame counter
    frameRef.current++
    
    // Update time
    timeRef.current += delta
    const config = orbStateConfigs[state]
    
    // Enhanced floating motion with interaction influence
    const floatMultiplier = interactionMode === 'active' ? 1.5 : 1;
    const baseY = Math.sin(timeRef.current * FLOAT_SMOOTHNESS) * (FLOAT_HEIGHT * floatMultiplier)
    const stateY = state === 'error' ? -Math.abs(baseY) : baseY
    
    // Enhanced pulse effect with compound waves
    const primaryPulse = Math.sin(timeRef.current * config.pulseSpeed)
    const secondaryPulse = Math.sin(timeRef.current * config.pulseSpeed * 0.5) * 0.5
    
    let pulseEffect = 0
    switch (state) {
      case 'processing':
        // Processing uses a compound rotating pulse
        const processingPhase = timeRef.current * 2
        pulseEffect = (
          Math.sin(processingPhase) * 0.7 +
          Math.sin(processingPhase * 1.5) * 0.3
        ) * config.pulseIntensity
        break
      case 'success':
        // Success uses an expanding pulse that fades
        const fadeOut = Math.max(0, 1 - (timeRef.current % 1.5))
        pulseEffect = (
          Math.sin(timeRef.current * 3) * 0.7 +
          Math.sin(timeRef.current * 4) * 0.3
        ) * config.pulseIntensity * fadeOut
        break
      case 'error':
        // Error uses a sharp, urgent pulse
        const errorPhase = timeRef.current * 4
        pulseEffect = (
          Math.abs(Math.sin(errorPhase)) * 0.8 +
          Math.abs(Math.sin(errorPhase * 2)) * 0.2
        ) * config.pulseIntensity
        break
      default:
        // Idle uses a gentle breathing effect
        const idlePhase = timeRef.current
        pulseEffect = (
          Math.sin(idlePhase) * 0.6 +
          Math.sin(idlePhase * 0.5) * 0.4
        ) * config.pulseIntensity
    }

    // Apply pulse to scale with smooth interpolation
    const targetScale = config.scale * (1 + pulseEffect)
    currentScaleRef.current = MathUtils.lerp(
      currentScaleRef.current,
      targetScale,
      delta * TRANSITION_SPEED
    )

    // Apply pulse to emissive intensity with smooth interpolation
    const baseEmissive = config.emissiveIntensity * (interactionMode === 'active' ? 1.5 : 1)
    const emissivePulse = baseEmissive * (1 + pulseEffect * 0.5)
    currentEmissiveIntensityRef.current = MathUtils.lerp(
      currentEmissiveIntensityRef.current,
      emissivePulse,
      delta * TRANSITION_SPEED
    )

    // Smooth color transitions
    const lerpColor = (current: string, target: string) => {
      const currentColor = new Color(current)
      const targetColor = new Color(target)
      currentColor.lerp(targetColor, delta * COLOR_TRANSITION_SPEED)
      return '#' + currentColor.getHexString()
    }

    currentColorRef.current = lerpColor(currentColorRef.current, config.color)
    currentEmissiveRef.current = lerpColor(currentEmissiveRef.current, config.emissive)

    // Update position with smooth interpolation
    positionRef.current.setY(
      MathUtils.lerp(positionRef.current.y, stateY, delta * TRANSITION_SPEED)
    )

    // Update rotation with state-specific behavior
    const rotationMultiplier = interactionMode === 'active' ? 1.5 : 1
    if (config.rotationSpeed !== 0) {
      const rotationDelta = delta * config.rotationSpeed * rotationMultiplier
      rotationRef.current.y = (rotationRef.current.y + rotationDelta) % (Math.PI * 2)
      
      // Add state-specific rotation effects
      switch (state) {
        case 'processing':
          // Add wobble effect during processing
          const wobblePhase = timeRef.current * 2
          rotationRef.current.x = Math.sin(wobblePhase) * 0.15
          rotationRef.current.z = Math.cos(wobblePhase) * 0.15
          break
        case 'error':
          // Add shake effect during error
          const shakePhase = timeRef.current * 8
          rotationRef.current.x = Math.sin(shakePhase) * 0.1
          rotationRef.current.z = Math.cos(shakePhase) * 0.1
          break
        default:
          // Smooth return to neutral rotation
          rotationRef.current.x = MathUtils.lerp(rotationRef.current.x, 0, delta * TRANSITION_SPEED)
          rotationRef.current.z = MathUtils.lerp(rotationRef.current.z, 0, delta * TRANSITION_SPEED)
      }
    }
  })

  return {
    position: positionRef.current,
    rotation: rotationRef.current,
    scale: currentScaleRef.current,
    color: currentColorRef.current,
    emissive: currentEmissiveRef.current,
    emissiveIntensity: currentEmissiveIntensityRef.current
  }
}
