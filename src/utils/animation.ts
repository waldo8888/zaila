/**
 * Animation constants and utilities for consistent animations across the app
 */

export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

export const ANIMATION_EASE = {
  // Custom easing functions for smooth animations
  smooth: [0.4, 0, 0.2, 1], // Smooth easeOut
  bounce: [0.68, -0.55, 0.265, 1.55], // Bouncy effect
  spring: [0.175, 0.885, 0.32, 1.275], // Natural spring
} as const;

// Common animation variants for consistent behavior
export const fadeAnimation = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUpAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDownAnimation = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const scaleAnimation = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

// Animation variants for different states
export const stateAnimationVariants = {
  idle: {
    scale: 1,
    opacity: 0.8,
    transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.smooth },
  },
  loading: {
    scale: 1.05,
    opacity: 1,
    transition: { duration: ANIMATION_DURATION.normal, ease: ANIMATION_EASE.spring },
  },
  success: {
    scale: 1,
    opacity: 1,
    transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.bounce },
  },
  error: {
    scale: 0.95,
    opacity: 0.9,
    transition: { duration: ANIMATION_DURATION.fast, ease: ANIMATION_EASE.smooth },
  },
};

// Type definitions for animation states
export type AnimationState = 'idle' | 'loading' | 'success' | 'error';
export type AnimationDuration = keyof typeof ANIMATION_DURATION;
export type AnimationEase = keyof typeof ANIMATION_EASE;

// Helper function to combine animation variants
export const combineAnimations = (
  baseAnimation: typeof fadeAnimation,
  stateAnimation: typeof stateAnimationVariants,
) => ({
  ...baseAnimation,
  animate: {
    ...baseAnimation.animate,
    ...stateAnimation,
  },
});
