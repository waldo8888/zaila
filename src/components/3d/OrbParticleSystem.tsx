'use client'

import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, ShaderMaterial, BufferGeometry, BufferAttribute, Color, AdditiveBlending } from 'three';
import { ParticleSystemConfig } from '@/store/slices/types';

const vertexShader = `
  uniform float uTime;
  uniform float uLifetime;
  uniform float uSize;
  uniform float uSpeed;
  
  attribute float aStartTime;
  attribute vec3 aVelocity;
  attribute float aAlpha;
  
  varying float vAlpha;
  
  void main() {
    float age = mod(uTime - aStartTime, uLifetime);
    float normalizedAge = age / uLifetime;
    
    // Update position based on velocity and age
    vec3 pos = position + aVelocity * age * uSpeed;
    
    // Fade out particles as they age
    vAlpha = aAlpha * (1.0 - normalizedAge);
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * (300.0 / -mvPosition.z) * (1.0 - normalizedAge * 0.5);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  
  varying float vAlpha;
  
  void main() {
    // Circular particle shape
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float alpha = smoothstep(0.5, 0.4, dist) * vAlpha;
    
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface OrbParticleSystemProps {
  config: ParticleSystemConfig;
}

export const OrbParticleSystem: React.FC<OrbParticleSystemProps> = ({ config }) => {
  const pointsRef = useRef<Points>(null);
  const materialRef = useRef<ShaderMaterial>(null);
  const lastEmissionRef = useRef(0);
  const particleIndexRef = useRef(0);
  
  // Create particle system geometry
  const { geometry, velocities, startTimes, alphas } = useMemo(() => {
    const positions = new Float32Array(config.maxParticles * 3);
    const velocities = new Float32Array(config.maxParticles * 3);
    const startTimes = new Float32Array(config.maxParticles);
    const alphas = new Float32Array(config.maxParticles);
    
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new BufferAttribute(positions, 3));
    geometry.setAttribute('aVelocity', new BufferAttribute(velocities, 3));
    geometry.setAttribute('aStartTime', new BufferAttribute(startTimes, 1));
    geometry.setAttribute('aAlpha', new BufferAttribute(alphas, 1));
    
    return { geometry, velocities, startTimes, alphas };
  }, [config.maxParticles]);
  
  // Create shader material
  const material = useMemo(() => {
    const color = new Color(config.particleColor);
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uLifetime: { value: config.particleLifetime },
        uSize: { value: config.particleSize },
        uSpeed: { value: config.particleSpeed },
        uColor: { value: [color.r, color.g, color.b] }
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending
    });
  }, [config]);
  
  // Emit new particles
  const emitParticle = (time: number) => {
    if (!config.enabled || particleIndexRef.current >= config.maxParticles) return;
    
    const i = particleIndexRef.current;
    const positions = geometry.attributes.position.array as Float32Array;
    
    // Random position on sphere surface
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const x = Math.sin(phi) * Math.cos(theta);
    const y = Math.sin(phi) * Math.sin(theta);
    const z = Math.cos(phi);
    
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    
    // Random outward velocity
    velocities[i * 3] = x * (0.8 + Math.random() * 0.4);
    velocities[i * 3 + 1] = y * (0.8 + Math.random() * 0.4);
    velocities[i * 3 + 2] = z * (0.8 + Math.random() * 0.4);
    
    startTimes[i] = time;
    alphas[i] = 0.6 + Math.random() * 0.4;
    
    particleIndexRef.current++;
    
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.aVelocity.needsUpdate = true;
    geometry.attributes.aStartTime.needsUpdate = true;
    geometry.attributes.aAlpha.needsUpdate = true;
  };
  
  // Animation loop
  useFrame((state) => {
    if (!config.enabled || !materialRef.current) return;
    
    const time = state.clock.getElapsedTime();
    materialRef.current.uniforms.uTime.value = time;
    
    // Emit new particles based on emission rate
    const emissionInterval = 1 / config.emissionRate;
    while (time - lastEmissionRef.current > emissionInterval) {
      emitParticle(time);
      lastEmissionRef.current += emissionInterval;
    }
    
    // Reset particle index when all particles have exceeded their lifetime
    if (time - startTimes[0] > config.particleLifetime) {
      particleIndexRef.current = 0;
    }
  });
  
  // Update material uniforms when config changes
  useEffect(() => {
    if (!materialRef.current) return;
    
    const color = new Color(config.particleColor);
    materialRef.current.uniforms.uLifetime.value = config.particleLifetime;
    materialRef.current.uniforms.uSize.value = config.particleSize;
    materialRef.current.uniforms.uSpeed.value = config.particleSpeed;
    materialRef.current.uniforms.uColor.value = [color.r, color.g, color.b];
  }, [config]);
  
  if (!config.enabled) return null;
  
  return (
    <points ref={pointsRef}>
      <primitive object={geometry} attach="geometry" />
      <primitive ref={materialRef} object={material} attach="material" />
    </points>
  );
};
