'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@/store';
import { useOrbState, useOrbActions } from '@/store/hooks';
import { getStateHistory, clearStateHistory } from '@/store/middleware/debug';
import { OrbAnimationState, type OrbState } from '../../store/types';
import { Stats } from '@react-three/drei';

interface DebugPanelProps {
  className?: string;
}

interface PerformanceStats {
  fps: number;
  renderTime: number;
  triangles: number;
  memory: number;
  qualityLevel: string;
}

// Performance monitoring hook
function usePerformanceMonitor() {
  const [stats, setStats] = useState<PerformanceStats>({
    fps: 0,
    renderTime: 0,
    triangles: 0,
    memory: 0,
    qualityLevel: 'HIGH'
  });
  const frameRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const updateStats = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      const fps = Math.round(1000 / deltaTime);
      
      // Get memory usage if available
      const memory = (performance as any).memory 
        ? Math.round((performance as any).memory.usedJSHeapSize / 1048576) 
        : 0;

      setStats(prev => ({
        ...prev,
        fps: fps,
        renderTime: Math.round(deltaTime * 100) / 100,
        memory
      }));

      lastTimeRef.current = currentTime;
      frameRef.current = requestAnimationFrame(updateStats);
    };

    frameRef.current = requestAnimationFrame(updateStats);
    return () => cancelAnimationFrame(frameRef.current);
  }, []);

  return stats;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [history, setHistory] = useState(getStateHistory());
  const store = useStore();
  const { animationState, interactionMode, animationSpeed } = useOrbState();
  const { setAnimationState, setInteractionMode, setAnimationSpeed } = useOrbActions();
  const stats = usePerformanceMonitor();

  useEffect(() => {
    const interval = setInterval(() => {
      if (activeTab === 'history') {
        setHistory(getStateHistory());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTab]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const renderStateTree = (obj: any, depth = 0) => {
    if (typeof obj !== 'object' || obj === null) {
      return <span className="text-blue-500">{JSON.stringify(obj)}</span>;
    }

    return (
      <div style={{ marginLeft: `${depth * 20}px` }}>
        {Object.entries(obj).map(([key, value]) => (
          <div key={key}>
            <span className="text-purple-500">{key}:</span>{' '}
            {renderStateTree(value, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  const renderHistory = () => {
    return history.map((entry, index) => (
      <div
        key={entry.timestamp}
        className="mb-4 p-4 bg-gray-800 rounded-lg"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-green-400">{entry.action}</span>
          <span className="text-gray-400">
            {new Date(entry.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm text-gray-400 mb-1">Previous State</h4>
            {renderStateTree(entry.previousState)}
          </div>
          <div>
            <h4 className="text-sm text-gray-400 mb-1">Next State</h4>
            {renderStateTree(entry.nextState)}
          </div>
        </div>
      </div>
    ));
  };

  const states: OrbAnimationState[] = ['idle', 'loading', 'success', 'error', 'active', 'inactive'];

  return (
    <div
      className={`fixed bottom-4 right-4 bg-gray-900 text-white rounded-lg shadow-lg ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -top-10 right-0 px-4 py-2 bg-gray-800 rounded-t-lg"
      >
        {isOpen ? 'Close Debug' : 'Open Debug'}
      </button>
      
      {isOpen && (
        <div className="w-96 max-h-[600px] overflow-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">Debug Panel</h3>
            <div className="space-x-2">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-3 py-1 rounded ${
                  activeTab === 'current'
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                Current
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded ${
                  activeTab === 'history'
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                History
              </button>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-sm font-medium mb-2">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">FPS:</span>{' '}
                <span className={`${stats.fps < 30 ? 'text-red-400' : stats.fps < 45 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {stats.fps}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Frame Time:</span>{' '}
                <span>{stats.renderTime}ms</span>
              </div>
              <div>
                <span className="text-gray-400">Memory:</span>{' '}
                <span>{stats.memory}MB</span>
              </div>
              <div>
                <span className="text-gray-400">Quality:</span>{' '}
                <span className="text-blue-400">{stats.qualityLevel}</span>
              </div>
            </div>
          </div>

          {/* Existing Debug Controls */}
          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-sm text-gray-400 mb-2">Orb Controls</h4>
            <div className="grid grid-cols-2 gap-2">
              {states.map((state) => (
                <button
                  key={state}
                  onClick={() => setAnimationState(state)}
                  className={`px-3 py-2 rounded ${
                    animationState === state
                      ? 'bg-blue-500'
                      : 'bg-gray-700'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
            <div className="mt-2">
              <button
                onClick={() =>
                  setInteractionMode(
                    interactionMode === 'none' ? 'hover' : 'none'
                  )
                }
                className={`w-full px-3 py-2 rounded ${
                  interactionMode === 'hover'
                    ? 'bg-green-500'
                    : 'bg-gray-700'
                }`}
              >
                {interactionMode === 'hover' ? 'Interactive Mode' : 'Static Mode'}
              </button>
            </div>
            <div className="mt-2">
              <h4 className="text-sm text-gray-400 mb-1">Animation Speed</h4>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-gray-400 mt-1">
                Speed: {animationSpeed.toFixed(1)}x
              </div>
            </div>
          </div>

          {activeTab === 'current' ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Current State</h4>
                {renderStateTree(store)}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm text-gray-400">State History</h4>
                <button
                  onClick={clearStateHistory}
                  className="px-3 py-1 bg-red-500 rounded text-sm"
                >
                  Clear
                </button>
              </div>
              {renderHistory()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
