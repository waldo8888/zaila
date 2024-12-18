import { renderHook, act } from '@testing-library/react';
import { useOrb } from '../useOrb';
import { useStore } from '../../store';
import { QualityLevel, PerformanceMetrics, ParticleSystemConfig } from '../../slices/types';

// Create persistent mock functions
const mockSetAnimating = jest.fn();
const mockSetInteractionMode = jest.fn();
const mockSetAnimationState = jest.fn();
const mockSetTransitionProgress = jest.fn();
const mockSetPreviousState = jest.fn();
const mockSetTransitionDuration = jest.fn();
const mockSetAnimationSpeed = jest.fn();
const mockSetParticleSystem = jest.fn();
const mockSetQualityLevel = jest.fn();
const mockUpdatePerformanceMetrics = jest.fn();

// Mock the store
jest.mock('../../store', () => ({
  useStore: jest.fn(() => ({
    orb: {
      isAnimating: false,
      interactionMode: 'none',
      animationState: 'idle',
      transitionProgress: 0,
      previousState: null,
      transitionDuration: 1000,
      animationSpeed: 1,
      particleSystem: {
        maxParticles: 1000,
        particleSize: 0.1,
        glowIntensity: 1.0,
        enabled: true,
        emissionRate: 10,
        particleSpeed: 1,
        particleColor: '#ffffff'
      },
      qualityLevel: 'HIGH',
      performanceMetrics: {
        fps: 60,
        memory: 0,
        renderTime: 0
      }
    },
    setAnimating: mockSetAnimating,
    setInteractionMode: mockSetInteractionMode,
    setAnimationState: mockSetAnimationState,
    setTransitionProgress: mockSetTransitionProgress,
    setPreviousState: mockSetPreviousState,
    setTransitionDuration: mockSetTransitionDuration,
    setAnimationSpeed: mockSetAnimationSpeed,
    setParticleSystem: mockSetParticleSystem,
    setQualityLevel: mockSetQualityLevel,
    updatePerformanceMetrics: mockUpdatePerformanceMetrics
  }))
}));

describe('useOrb Hook - Performance Optimization Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Quality Level Management', () => {
    it('should update quality level state', () => {
      const { result } = renderHook(() => useOrb());
      
      act(() => {
        result.current.setQualityLevel('MEDIUM');
      });

      expect(mockSetQualityLevel).toHaveBeenCalledWith('MEDIUM');
    });

    it('should update particle system when quality changes', () => {
      const { result } = renderHook(() => useOrb());
      const newConfig: Partial<ParticleSystemConfig> = {
        maxParticles: 500,
        particleSize: 0.05,
        glowIntensity: 0.5
      };
      
      act(() => {
        result.current.setParticleSystem(newConfig);
      });

      expect(mockSetParticleSystem).toHaveBeenCalledWith(newConfig);
    });
  });

  describe('Performance Metrics Management', () => {
    it('should update performance metrics', () => {
      const { result } = renderHook(() => useOrb());
      const newMetrics: PerformanceMetrics = {
        fps: 45,
        memory: 150,
        renderTime: 22
      };

      act(() => {
        result.current.updatePerformanceMetrics(newMetrics);
      });

      expect(mockUpdatePerformanceMetrics).toHaveBeenCalledWith(newMetrics);
    });

    it('should maintain current quality level when performance is good', () => {
      const { result } = renderHook(() => useOrb());
      const goodMetrics: PerformanceMetrics = {
        fps: 60,
        memory: 100,
        renderTime: 16.67
      };

      act(() => {
        result.current.updatePerformanceMetrics(goodMetrics);
      });

      expect(mockSetQualityLevel).not.toHaveBeenCalled();
    });
  });

  describe('Animation Speed Control', () => {
    it('should update animation speed', () => {
      const { result } = renderHook(() => useOrb());
      const newSpeed = 0.5;

      act(() => {
        result.current.setAnimationSpeed(newSpeed);
      });

      expect(mockSetAnimationSpeed).toHaveBeenCalledWith(newSpeed);
    });
  });
});
