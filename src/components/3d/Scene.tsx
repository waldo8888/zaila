'use client'

import { Canvas } from './Canvas'
import { Suspense, memo } from 'react'
import { Orb } from './Orb'
import Lights from './Lights'
import { OrbStateManager } from './OrbStateManager'
import { useOrbState } from '@/store/hooks'

// Memoize static components
const MemoizedLights = memo(Lights)

const OrbWithState = () => {
  const { animationState } = useOrbState();
  return <Orb state={animationState} />;
};

export default function Scene() {
  return (
    <div className="w-full h-full">
      <Canvas>
        <color attach="background" args={['#000815']} />
        <Suspense fallback={null}>
          <MemoizedLights />
          <OrbStateManager>
            <OrbWithState />
          </OrbStateManager>
        </Suspense>
      </Canvas>
    </div>
  )
}
