'use client'

import { Environment } from '@react-three/drei'
import { Canvas } from './Canvas'
import { Suspense, memo } from 'react'
import Orb from './Orb'
import Lights from './Lights'
import { OrbStateManager } from './OrbStateManager'
import { useOrbState } from '@/store/hooks'

// Memoize static components
const MemoizedLights = memo(Lights)
const MemoizedEnvironment = memo(Environment)

const OrbWithState = () => {
  const { animationState } = useOrbState();
  return <Orb state={animationState} />;
};

export default function Scene() {
  return (
    <div className="relative w-full h-screen">
      <OrbStateManager>
        <Canvas>
          <color attach="background" args={['#000815']} />
          <Suspense fallback={null}>
            <MemoizedEnvironment preset="city" />
          </Suspense>
          <MemoizedLights />
          <Suspense fallback={null}>
            <OrbWithState />
          </Suspense>
        </Canvas>
      </OrbStateManager>
    </div>
  )
}
