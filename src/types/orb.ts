export type OrbState = 'idle' | 'processing' | 'success' | 'error'

export interface OrbStateConfig {
  color: string
  emissive: string
  emissiveIntensity: number
  scale: number
  rotationSpeed: number
  pulseSpeed: number
  pulseIntensity: number
}

export const orbStateConfigs: Record<OrbState, OrbStateConfig> = {
  idle: {
    color: '#4338ca',
    emissive: '#4338ca',
    emissiveIntensity: 0.3,
    scale: 1,
    rotationSpeed: 0.3,
    pulseSpeed: 2,
    pulseIntensity: 0.15
  },
  processing: {
    color: '#818cf8',
    emissive: '#818cf8',
    emissiveIntensity: 1.0,
    scale: 1.1,
    rotationSpeed: 3,
    pulseSpeed: 5,
    pulseIntensity: 0.35
  },
  success: {
    color: '#22c55e',
    emissive: '#4ade80',
    emissiveIntensity: 1.5,
    scale: 1.3,
    rotationSpeed: 1,
    pulseSpeed: 4,
    pulseIntensity: 0.4
  },
  error: {
    color: '#ef4444',
    emissive: '#fca5a5',
    emissiveIntensity: 2.0,
    scale: 0.8,
    rotationSpeed: -1,
    pulseSpeed: 8,
    pulseIntensity: 0.5
  }
}
