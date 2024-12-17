import { type OrbState } from '@/store/types';
import { Vector3, Euler } from 'three';

interface OrbAnimation {
  position: Vector3;
  rotation: Euler;
  scale: Vector3;
  color: string;
  emissive: string;
  emissiveIntensity: number;
}

const defaultAnimation: OrbAnimation = {
  position: new Vector3(0, 0, 0),
  rotation: new Euler(0, 0, 0),
  scale: new Vector3(1, 1, 1),
  color: '#4a9eff',
  emissive: '#4a9eff',
  emissiveIntensity: 0.5,
};

export const getOrbAnimation = (state: OrbState['animationState']): OrbAnimation => {
  switch (state) {
    case 'idle':
      return {
        ...defaultAnimation,
        position: new Vector3(0, Math.sin(Date.now() * 0.001) * 0.1, 0),
        rotation: new Euler(0, Date.now() * 0.0005, 0),
      };

    case 'processing':
      return {
        ...defaultAnimation,
        scale: new Vector3(1.1, 1.1, 1.1),
        rotation: new Euler(0, Date.now() * 0.002, 0),
        emissiveIntensity: 0.8,
      };

    case 'success':
      return {
        ...defaultAnimation,
        color: '#22c55e',
        emissive: '#22c55e',
        emissiveIntensity: 1,
        scale: new Vector3(1.2, 1.2, 1.2),
      };

    case 'error':
      return {
        ...defaultAnimation,
        color: '#ef4444',
        emissive: '#ef4444',
        emissiveIntensity: 1,
        scale: new Vector3(0.8, 0.8, 0.8),
      };

    default:
      return defaultAnimation;
  }
};
