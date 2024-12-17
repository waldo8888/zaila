'use client'

import { useAppStore } from '@/store/useAppStore'

export default function ControlPanel() {
  const { isOrbitActive, setOrbitActive, orbitSpeed, setOrbitSpeed } = useAppStore()

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <label htmlFor="orbit-toggle" className="text-sm font-medium text-gray-200">
          Orbit Animation
        </label>
        <button
          id="orbit-toggle"
          onClick={() => setOrbitActive(!isOrbitActive)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full
            ${isOrbitActive ? 'bg-indigo-600' : 'bg-gray-700'}
            transition-colors duration-200
          `}
          role="switch"
          aria-checked={isOrbitActive}
        >
          <span className="sr-only">Toggle orbit animation</span>
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isOrbitActive ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>
      <div className="space-y-2">
        <label htmlFor="speed-slider" className="text-sm font-medium text-gray-200">
          Animation Speed: {orbitSpeed.toFixed(1)}
        </label>
        <input
          id="speed-slider"
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={orbitSpeed}
          onChange={(e) => setOrbitSpeed(parseFloat(e.target.value))}
          className="w-full"
          aria-label="Adjust animation speed"
        />
      </div>
    </div>
  )
}
