import { render, act } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { OrbStateManager } from '../OrbStateManager';
import { useStore } from '@/store/store';
import { PerformanceMetrics, OrbState, OrbSlice } from '@/store/slices/types';

// Mock RAF and performance.now
let rafCallbacks: Set<FrameRequestCallback> = new Set();
let lastFrameTime = 0;
let frameCount = 0;

const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  rafCallbacks.add(callback);
  return frameCount++;
});

const mockPerformanceNow = jest.fn();

// Helper to trigger animation frame manually
const triggerAnimationFrame = (time: number) => {
  const deltaTime = time - lastFrameTime || 16.67; // Default to 60 FPS if first frame
  lastFrameTime = time;
  
  // Update performance.now() for this frame
  mockPerformanceNow.mockReturnValue(time);
  
  rafCallbacks.forEach(callback => {
    // Call with frame state that matches Three.js behavior
    callback(time);
  });
};

// Mock store functions
const mockUpdatePerformanceMetrics = jest.fn();
const mockSetQualityLevel = jest.fn();
const mockSetParticleSystem = jest.fn();
const mockSetTransitionProgress = jest.fn();
const mockSetPreviousState = jest.fn();
const mockSetTransitionDuration = jest.fn();

// Mock store state
const mockOrbState: OrbState = {
  isAnimating: false,
  animationState: 'idle',
  interactionMode: 'none',
  transitionProgress: 0,
  previousState: null,
  transitionDuration: 800,
  animationSpeed: 1,
  transitionConfig: {
    duration: 800,
    easing: 'easeInOut'
  },
  transitionStartTime: null,
  particleSystem: {
    enabled: true,
    emissionRate: 100,
    particleLifetime: 2000,
    particleSpeed: 1,
    particleColor: '#ffffff',
    maxParticles: 5000,
    particleSize: 0.1,
    glowIntensity: 1.0
  },
  performanceMetrics: {
    fps: 60,
    memory: 0,
    renderTime: 16.67
  },
  qualityLevel: 'HIGH'
};

// Mock store actions
const mockOrbActions: OrbSlice = {
  orb: mockOrbState,
  setAnimating: jest.fn(),
  setInteractionMode: jest.fn(),
  setAnimationState: jest.fn(),
  setTransitionProgress: mockSetTransitionProgress,
  setPreviousState: mockSetPreviousState,
  setTransitionDuration: mockSetTransitionDuration,
  setAnimationSpeed: jest.fn(),
  setParticleSystem: mockSetParticleSystem,
  setQualityLevel: mockSetQualityLevel,
  updatePerformanceMetrics: mockUpdatePerformanceMetrics
};

// Mock hooks
jest.mock('@/store/hooks/useOrb', () => ({
  useOrbState: () => mockOrbState,
  useOrbActions: () => mockOrbActions
}));

// Mock Three.js hooks and components
jest.mock('@react-three/fiber', () => ({
  useFrame: jest.fn((callback) => {
    mockFrameCallback = callback;
  }),
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  __setFPS: (fps: number) => {
    currentFPS = fps;
  }
}));

// Mock Three.js components
jest.mock('@react-three/drei', () => ({
  group: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

// Mock Orb component to prevent infinite re-renders
jest.mock('../Orb', () => ({
  Orb: () => null
}));

let mockFrameCallback: ((state: any, delta: number) => void) | null = null;
let currentFPS = 60;

describe('OrbStateManager', () => {
  beforeAll(() => {
    // Setup RAF mock
    global.requestAnimationFrame = mockRequestAnimationFrame;

    // Create a complete Performance mock
    const mockPerformance = {
      now: mockPerformanceNow,
      timing: {
        navigationStart: 0,
        unloadEventStart: 0,
        unloadEventEnd: 0,
        redirectStart: 0,
        redirectEnd: 0,
        fetchStart: 0,
        domainLookupStart: 0,
        domainLookupEnd: 0,
        connectStart: 0,
        connectEnd: 0,
        secureConnectionStart: 0,
        requestStart: 0,
        responseStart: 0,
        responseEnd: 0,
        domLoading: 0,
        domInteractive: 0,
        domContentLoadedEventStart: 0,
        domContentLoadedEventEnd: 0,
        domComplete: 0,
        loadEventStart: 0,
        loadEventEnd: 0,
        toJSON: () => ({})
      } as PerformanceTiming,
      navigation: {
        type: 0,
        redirectCount: 0,
        TYPE_NAVIGATE: 0,
        TYPE_RELOAD: 1,
        TYPE_BACK_FORWARD: 2,
        TYPE_RESERVED: 255,
        toJSON: () => ({})
      } as PerformanceNavigation,
      memory: {
        jsHeapSizeLimit: 2172649472,
        totalJSHeapSize: 50331648,
        usedJSHeapSize: 50331648
      },
      timeOrigin: 0,
      onresourcetimingbufferfull: null,
      clearMarks: jest.fn(),
      clearMeasures: jest.fn(),
      clearResourceTimings: jest.fn(),
      getEntries: jest.fn(),
      getEntriesByName: jest.fn(),
      getEntriesByType: jest.fn(),
      mark: jest.fn(),
      measure: jest.fn(),
      setResourceTimingBufferSize: jest.fn(),
      toJSON: jest.fn(),
      eventCounts: new Map(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    };

    // Cast to unknown first to satisfy TypeScript
    global.performance = mockPerformance as unknown as Performance;
  });

  beforeEach(() => {
    // Reset mocks and state
    jest.clearAllMocks();
    rafCallbacks.clear();
    frameCount = 0;
    lastFrameTime = 0;
    mockPerformanceNow.mockReturnValue(0);
    
    // Mock performance.now() globally
    const originalPerformanceNow = global.performance.now;
    global.performance.now = mockPerformanceNow;
    
    return () => {
      global.performance.now = originalPerformanceNow;
    };
  });

  afterAll(() => {
    // Cleanup RAF mock
    global.requestAnimationFrame = undefined as any;
    global.performance = undefined as any;
  });

  describe('Frame Rate Management', () => {
    test('should detect low frame rates', () => {
      // Set initial state
      mockOrbState.qualityLevel = 'HIGH';

      render(
        <Canvas>
          <OrbStateManager />
        </Canvas>
      );

      // Simulate multiple frames with low FPS
      const lowFpsDelta = 1 / 20; // 20 FPS
      for (let i = 0; i < 10; i++) {
        const time = i * 50; // 50ms between frames = 20 FPS
        mockPerformanceNow.mockReturnValue(time);
        if (mockFrameCallback) {
          const mockState = {
            clock: {
              getElapsedTime: () => time / 1000,
              getDelta: () => lowFpsDelta
            },
            gl: {
              render: jest.fn()
            }
          };
          mockFrameCallback(mockState, lowFpsDelta);
        }
      }

      const lastCall = mockUpdatePerformanceMetrics.mock.calls[mockUpdatePerformanceMetrics.mock.calls.length - 1][0];
      
      // FPS should be low
      expect(lastCall.fps).toBeLessThanOrEqual(25);
      expect(lastCall.fps).toBeGreaterThanOrEqual(15);
    });
  });

  describe('Quality Adjustment', () => {
    test('should maintain quality when FPS is stable', () => {
      // Set initial state with high FPS
      mockOrbState.qualityLevel = 'HIGH';
      mockPerformanceNow.mockReturnValue(0);

      render(
        <Canvas>
          <OrbStateManager />
        </Canvas>
      );

      // Simulate stable high FPS frames
      const stableDelta = 1 / 60; // 60 FPS
      for (let i = 0; i < 10; i++) {
        const time = i * (1000/60);
        mockPerformanceNow.mockReturnValue(time);
        if (mockFrameCallback) {
          const mockState = {
            clock: {
              getElapsedTime: () => time / 1000,
              getDelta: () => stableDelta
            },
            gl: {
              render: jest.fn()
            }
          };
          mockFrameCallback(mockState, stableDelta);
        }
      }

      // Reset mock to clear any initial setup calls
      mockSetQualityLevel.mockClear();

      // Simulate more frames to check stability
      for (let i = 10; i < 20; i++) {
        const time = i * (1000/60);
        mockPerformanceNow.mockReturnValue(time);
        if (mockFrameCallback) {
          const mockState = {
            clock: {
              getElapsedTime: () => time / 1000,
              getDelta: () => stableDelta
            },
            gl: {
              render: jest.fn()
            }
          };
          mockFrameCallback(mockState, stableDelta);
        }
      }

      expect(mockSetQualityLevel).not.toHaveBeenCalled();
    });
  });

  describe('Memory Management', () => {
    test('should track memory usage', async () => {
      const mockMemory = {
        usedJSHeapSize: 50 * 1024 * 1024, // 50MB
        totalJSHeapSize: 100 * 1024 * 1024 // 100MB
      };

      // Mock performance.memory
      Object.defineProperty(global.performance, 'memory', {
        get: () => mockMemory
      });

      render(
        <Canvas>
          <OrbStateManager />
        </Canvas>
      );

      // Trigger a frame update to calculate memory
      if (mockFrameCallback) {
        const mockState = {
          clock: {
            getElapsedTime: () => 0,
            getDelta: () => 1/60
          },
          gl: {
            render: jest.fn()
          }
        };
        mockFrameCallback(mockState, 1/60);
      }

      // Verify memory metrics
      expect(mockUpdatePerformanceMetrics).toHaveBeenCalledWith(
        expect.objectContaining({
          memory: 50 // Expected memory usage in MB
        })
      );
    });
  });
});
