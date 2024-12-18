export type QualityLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type PerformanceMetrics = {
  fps: number;
  memory: number;
  renderTime: number;
};

export const QUALITY_LEVELS = {
  LOW: {
    particleCount: 100,
    particleSize: 2,
    glowIntensity: 0.5
  },
  MEDIUM: {
    particleCount: 500,
    particleSize: 3,
    glowIntensity: 0.8
  },
  HIGH: {
    particleCount: 1000,
    particleSize: 4,
    glowIntensity: 1.0
  }
} as const;

export const PERFORMANCE_THRESHOLDS = {
  LOW: {
    fps: 30
  },
  MEDIUM: {
    fps: 45
  },
  HIGH: {
    fps: 60
  }
} as const;
