'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store';
import { useOrbState, useOrbActions } from '@/store/hooks';
import { getStateHistory, clearStateHistory } from '@/store/middleware/debug';

interface DebugPanelProps {
  className?: string;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  const [history, setHistory] = useState(getStateHistory());
  const store = useStore();
  const orbState = useOrbState();
  const { setAnimationState, setInteractionMode } = useOrbActions();

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

          <div className="mb-4 p-4 bg-gray-800 rounded-lg">
            <h4 className="text-sm text-gray-400 mb-2">Orb Controls</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setAnimationState('idle')}
                className={`px-3 py-2 rounded ${
                  orbState.animationState === 'idle'
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                Idle
              </button>
              <button
                onClick={() => setAnimationState('processing')}
                className={`px-3 py-2 rounded ${
                  orbState.animationState === 'processing'
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setAnimationState('success')}
                className={`px-3 py-2 rounded ${
                  orbState.animationState === 'success'
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                Success
              </button>
              <button
                onClick={() => setAnimationState('error')}
                className={`px-3 py-2 rounded ${
                  orbState.animationState === 'error'
                    ? 'bg-blue-500'
                    : 'bg-gray-700'
                }`}
              >
                Error
              </button>
            </div>
            <div className="mt-2">
              <button
                onClick={() => setInteractionMode(
                  orbState.interactionMode === 'active' ? 'passive' : 'active'
                )}
                className={`w-full px-3 py-2 rounded ${
                  orbState.interactionMode === 'active'
                    ? 'bg-green-500'
                    : 'bg-gray-700'
                }`}
              >
                {orbState.interactionMode === 'active' ? 'Active Mode' : 'Passive Mode'}
              </button>
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
