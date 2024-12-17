import { useRef } from 'react'
import { Vector3, Euler } from 'three'
import { type OrbState } from '../types/orb'

const getStateConfig = (state: OrbState) => {
  switch (state) {
    case 'processing':
      return {
        scale: 1.1,
        color: '#4a90e2',
        emissive: '#7ab5ff',
        emissiveIntensity: 0.8
      }
    case 'success':
      return {
        scale: 1.2,
        color: '#50c878',
        emissive: '#90eeb1',
        emissiveIntensity: 1.0
      }
    case 'error':
      return {
        scale: 0.9,
        color: '#ff4444',
        emissive: '#ff8888',
        emissiveIntensity: 1.0
      }
    default:
      return {
        scale: 1.0,
        color: '#4a90e2',
        emissive: '#7ab5ff',
        emissiveIntensity: 0.5
      }
  }
}

export const useOrbAnimation = (state: OrbState) => {
  const positionRef = useRef(new Vector3())
  const rotationRef = useRef(new Euler())
  const config = getStateConfig(state)

  return {
    position: positionRef.current,
    rotation: rotationRef.current,
    scale: config.scale,
    color: config.color,
    emissive: config.emissive,
    emissiveIntensity: config.emissiveIntensity
  }
}
