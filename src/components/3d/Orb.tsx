'use client'

import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useOrbState } from '@/store/hooks/useOrb';
import { OrbState, OrbAnimationState, TransitionConfig } from '@/store/slices/types';
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
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      float alpha = step(dist, 0.45); // Remove uAlpha dependency

      gl_FragColor = vec4(vColor, alpha);
  }
`;

interface OrbProps {
  state?: OrbAnimationState;
}

interface OrbConfig {
  baseColor: string;  
  emissiveColor: string;
  speed: number;
  noiseStrength: number;
  noiseFrequency: number;
  radius: number;
  alpha: number;
}

function getStateConfig(state: OrbAnimationState): OrbConfig {
  switch (state) {
    case 'loading':
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
        baseColor: '#AF69EE',
        emissiveColor: '#6F2DA8',
        speed: 0.8,
        noiseStrength: 0.1,
        noiseFrequency: 1.0,
        radius: 1.0,
        alpha: 0.8,
      };
  }
}

function interpolateConfig(fromConfig: OrbConfig, toConfig: OrbConfig, progress: number): OrbConfig {
  const lerpColor = (start: string, end: string, t: number) => {
    const startColor = new Color(start);
    const endColor = new Color(end);
    const result = new Color();
    result.r = startColor.r + (endColor.r - startColor.r) * t;
    result.g = startColor.g + (endColor.g - startColor.g) * t;
    result.b = startColor.b + (endColor.b - startColor.b) * t;
    return `#${result.getHexString()}`;
  };

  const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

  return {
    baseColor: lerpColor(fromConfig.baseColor, toConfig.baseColor, progress),
    emissiveColor: lerpColor(fromConfig.emissiveColor, toConfig.emissiveColor, progress),
    speed: lerp(fromConfig.speed, toConfig.speed, progress),
    noiseStrength: lerp(fromConfig.noiseStrength, toConfig.noiseStrength, progress),
    noiseFrequency: lerp(fromConfig.noiseFrequency, toConfig.noiseFrequency, progress),
    radius: lerp(fromConfig.radius, toConfig.radius, progress),
    alpha: lerp(fromConfig.alpha, toConfig.alpha, progress)
  };
}

export const Orb: React.FC<OrbProps> = ({ state = 'idle' }) => {
  const orbRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const orbState = useOrbState();
  const [previousState, setPreviousState] = useState<OrbAnimationState>(state);
  const [transitionProgress, setTransitionProgress] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (state !== previousState) {
      setPreviousState(state);
      setTransitionProgress(0);
    }
  }, [state, previousState]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (transitionProgress < 1) {
        setTransitionProgress(transitionProgress + 0.01);
      }
    }, 16);
    return () => clearInterval(intervalId);
  }, [transitionProgress]);

  const currentConfig = useMemo(() => {
    const targetConfig = getStateConfig(state);
    if (previousState && transitionProgress < 1) {
      const prevConfig = getStateConfig(previousState);
      return interpolateConfig(prevConfig, targetConfig, transitionProgress);
    }
    return targetConfig;
  }, [state, previousState, transitionProgress]);

  // Animation loop to change shape
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      materialRef.current.opacity = 1.0; // Maintain opacity
    }
    setTime(state.clock.getElapsedTime());
  });

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geometry = new BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const angles = [];
    const color = new Color(currentConfig.baseColor);

    // Create points distributed on a sphere
    const numPoints = 5000; // Reduced number of points
    for (let i = 0; i < numPoints; i++) {
      const theta = Math.random() * Math.PI * 4; // Reduced theta range
      const phi = Math.acos(2 * Math.random() - 1);
      
      // Individual particle movement
      const particleOffset = i * 0.001;
      const slowTime = time * 1.5; // Adjusted speed
      
      // Gentle floating motion (reduced range)
      const floatY = Math.sin(slowTime + particleOffset) * 0.05;
      const floatX = Math.cos(slowTime * 0.7 + particleOffset) * 0.05;
      
      // Smooth shape morphing (constrained range)
      const shapePhase = Math.sin(slowTime * 0.5 + particleOffset) * 0.2;
      const wavePhase = Math.sin(theta * 2 + slowTime * 0.3) * 0.15;
      
      // Base radius with controlled variations
      const radius = 0.8 + 
        Math.max(-0.2, Math.min(0.2, wavePhase + shapePhase)) +
        Math.sin(phi * 2 + slowTime * 0.2) * 0.05;

      // Calculate position with floating motion
      const x = (radius * Math.sin(phi) * Math.cos(theta)) + floatX;
      const y = (radius * Math.sin(phi) * Math.sin(theta)) + floatY;
      const z = radius * Math.cos(phi);

      positions.push(x, y, z);
      colors.push(color.r, color.g, color.b);
      
      // Gentle size pulsing with minimum size
      const sizeBase = 0.04; // Slightly larger base size
      const sizePulse = Math.sin(slowTime * 1.5 + particleOffset) * 0.09;
      const finalSize = Math.max(0.03, sizeBase + sizePulse + Math.random() * 0.15); // Adjusted size variation
      sizes.push(finalSize);
      
      // Smooth angle changes
      const angleBase = Math.sin(slowTime * 1.2 + particleOffset) * Math.PI;
      angles.push(angleBase);
    }

    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.setAttribute('size', new Float32BufferAttribute(sizes, 1));
    geometry.setAttribute('angle', new Float32BufferAttribute(angles, 1));

    return geometry;
  }, [currentConfig.baseColor, time]); // Add time as a dependency

  // Create material with uniforms
  const material = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uRadius: { value: currentConfig.radius },
        uSpeed: { value: currentConfig.speed },
        uNoiseStrength: { value: currentConfig.noiseStrength },
        uNoiseFrequency: { value: currentConfig.noiseFrequency },
      },
      transparent: true,
      depthWrite: true,
      depthTest: true,
      blending: AdditiveBlending,
      opacity: 1.0, // Set fixed opacity
    });
  }, [currentConfig]);

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
