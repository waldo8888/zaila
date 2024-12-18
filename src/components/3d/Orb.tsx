'use client'

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOrbState } from '@/store/hooks/useOrb';
import { OrbState } from '@/store/types';
import { BufferGeometry, Float32BufferAttribute, Points, ShaderMaterial, Color, AdditiveBlending } from 'three';
import { OrbParticleSystem } from './OrbParticleSystem';

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
`;

// Fragment Shader
const fragmentShader = `
  uniform float uAlpha;
  
  varying vec3 vPosition;
  varying vec3 vColor;

  void main() {
      // Create a circular point
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      float alpha = smoothstep(0.5, 0.4, dist) * uAlpha;

      gl_FragColor = vec4(vColor, alpha);
  }
`;

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
  state?: OrbState['animationState'];
}

function getStateConfig(state: OrbState['animationState']): OrbConfig {
  switch (state) {
    case 'processing':
      return {
        baseColor: '#64B5F6',
        emissiveColor: '#2196F3',
        speed: 2.0,
        noiseStrength: 0.2,
        noiseFrequency: 2.0,
        radius: 1.2,
        alpha: 0.8,
      };
    case 'success':
      return {
        baseColor: '#81C784',
        emissiveColor: '#4CAF50',
        speed: 1.0,
        noiseStrength: 0.1,
        noiseFrequency: 1.0,
        radius: 1.0,
        alpha: 1.0,
      };
    case 'error':
      return {
        baseColor: '#E57373',
        emissiveColor: '#F44336',
        speed: 1.5,
        noiseStrength: 0.3,
        noiseFrequency: 3.0,
        radius: 1.1,
        alpha: 0.9,
      };
    case 'active':
      return {
        baseColor: '#FFB74D',
        emissiveColor: '#FF9800',
        speed: 1.2,
        noiseStrength: 0.15,
        noiseFrequency: 1.5,
        radius: 1.1,
        alpha: 0.9,
      };
    case 'inactive':
      return {
        baseColor: '#B0BEC5',
        emissiveColor: '#78909C',
        speed: 0.5,
        noiseStrength: 0.05,
        noiseFrequency: 0.5,
        radius: 0.9,
        alpha: 0.7,
      };
    case 'idle':
    default:
      return {
        baseColor: '#90CAF9',
        emissiveColor: '#42A5F5',
        speed: 0.8,
        noiseStrength: 0.1,
        noiseFrequency: 1.0,
        radius: 1.0,
        alpha: 0.8,
      };
  }
}

export const Orb: React.FC<OrbProps> = ({ state = 'idle' }) => {
  const orbRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const orbState = useOrbState();
  const config = getStateConfig(state);

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const angles = [];
    const color = new Color(config.baseColor);

    // Create points distributed on a sphere
    const numPoints = 2000;
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = Math.sin(phi) * Math.cos(theta);
      const y = Math.sin(phi) * Math.sin(theta);
      const z = Math.cos(phi);

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b);
      sizes.push(2 + Math.random() * 2);
      angles.push(Math.random() * Math.PI * 2);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('angle', new Float32BufferAttribute(angles, 1));

    return geometry;
  }, [config.baseColor]);

  // Create material with uniforms
  const material = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: config.radius },
        uSpeed: { value: config.speed },
        uNoiseStrength: { value: config.noiseStrength },
        uNoiseFrequency: { value: config.noiseFrequency },
        uAlpha: { value: config.alpha },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    });
  }, [config]);

  // Animation loop
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group>
      <points ref={orbRef}>
        <primitive object={geometry} attach="geometry" />
        <primitive ref={materialRef} object={material} attach="material" />
      </points>
      <OrbParticleSystem config={orbState.particleSystem} />
    </group>
  );
};
