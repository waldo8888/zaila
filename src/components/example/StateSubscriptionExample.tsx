import React from 'react';
import { useUI, useOrb, useSession } from '@/store/hooks';

export const StateSubscriptionExample: React.FC = () => {
  // Subscribe to specific state slices
  const { isLoading, error, setLoading, setError } = useUI();
  const { animationState, setOrbAnimationState } = useOrb();
  const { context, updateContext } = useSession();

  // Example handlers
  const handleLoadingToggle = () => {
    setLoading(!isLoading);
  };

  const handleOrbAnimation = () => {
    setOrbAnimationState(animationState === 'idle' ? 'processing' : 'idle');
  };

  const handleContextUpdate = () => {
    updateContext({ lastInteraction: new Date().toISOString() });
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <h3 className="font-bold mb-2">UI State</h3>
        <div className="space-x-2">
          <button
            onClick={handleLoadingToggle}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Toggle Loading
          </button>
          <span>{isLoading ? 'Loading...' : 'Ready'}</span>
          {error && <span className="text-red-500">Error: {error}</span>}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2">Orb State</h3>
        <div className="space-x-2">
          <button
            onClick={handleOrbAnimation}
            className="px-4 py-2 bg-purple-500 text-white rounded"
          >
            Toggle Animation
          </button>
          <span>Current: {animationState}</span>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2">Session State</h3>
        <div className="space-x-2">
          <button
            onClick={handleContextUpdate}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Update Context
          </button>
          <pre className="mt-2 p-2 bg-gray-100 rounded">
            {JSON.stringify(context, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
