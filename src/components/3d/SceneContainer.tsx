'use client'

import { useEffect, useRef, useState } from 'react'
import Scene from './Scene'

interface SceneContainerProps {
  className?: string
}

export default function SceneContainer({ className = '' }: SceneContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    // Initial size
    updateDimensions()

    // Add resize listener
    const observer = new ResizeObserver(updateDimensions)
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    // Cleanup
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`
        fixed inset-0
        overflow-hidden
        bg-gradient-to-b from-gray-900 to-gray-800
        ${className}
      `}
      style={{
        // Ensure container maintains aspect ratio
        aspectRatio: dimensions.width / dimensions.height,
      }}
      aria-hidden="true" // Scene is decorative
    >
      <div className="absolute inset-0">
        <Scene />
      </div>
    </div>
  )
}
