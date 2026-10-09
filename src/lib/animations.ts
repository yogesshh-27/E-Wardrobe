/**
 * E-Wardrobe Design System — Animation Tokens and Utilities
 * 
 * Strict Guidelines:
 * - Hover interactions: 150–250 ms
 * - Standard reveals: 400–600 ms
 * - Hero animations: 500–900 ms
 * - Page transitions: 200–350 ms
 * - Stagger delay: 60–100 ms
 * - Hardware acceleration: transform and opacity only
 * - Full accessibility: prefers-reduced-motion support
 */

import type { Transition, Variants } from 'framer-motion';

// Easing curves
export const EASINGS = {
  // Smooth natural deceleration for entry
  outQuart: [0.165, 0.84, 0.44, 1] as const,
  // Editorial luxury bezier
  luxury: [0.16, 1, 0.3, 1] as const,
  // Balanced UI curve
  standard: [0.22, 1, 0.36, 1] as const,
  // Snappy spring-like curve
  snappy: [0.25, 1, 0.5, 1] as const,
};

// Durations (in seconds)
export const DURATIONS = {
  hover: 0.2, // 200ms
  fast: 0.18, // 180ms
  pageTransition: 0.28, // 280ms
  reveal: 0.5, // 500ms
  hero: 0.8, // 800ms
  stagger: 0.08, // 80ms
};

// Transitions
export const springTransition: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
  mass: 0.8,
};

export const gentleSpringTransition: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 24,
  mass: 1,
};

export const standardTransition: Transition = {
  duration: DURATIONS.reveal,
  ease: EASINGS.luxury,
};

export const heroTransition: Transition = {
  duration: DURATIONS.hero,
  ease: EASINGS.luxury,
};

export const pageTransition: Transition = {
  duration: DURATIONS.pageTransition,
  ease: EASINGS.standard,
};

// Scroll Reveal Variants
export const fadeUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.reveal,
      ease: EASINGS.luxury,
      delay: customDelay,
    },
  }),
};

export const fadeDownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.reveal,
      ease: EASINGS.luxury,
      delay: customDelay,
    },
  }),
};

export const fadeInVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    transition: {
      duration: DURATIONS.reveal,
      ease: EASINGS.standard,
      delay: customDelay,
    },
  }),
};

export const scaleInVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
  },
  visible: (customDelay: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: DURATIONS.reveal,
      ease: EASINGS.luxury,
      delay: customDelay,
    },
  }),
};

// Stagger Container Variants
export const staggerContainerVariants: Variants = {
  hidden: {
    opacity: 1,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: DURATIONS.stagger,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.reveal,
      ease: EASINGS.luxury,
    },
  },
};

// Interactive Hover & Tap Micro-interactions
export const interactiveHover = {
  scale: 1.025,
  transition: { duration: DURATIONS.hover, ease: EASINGS.standard },
};

export const interactiveTap = {
  scale: 0.975,
  transition: { duration: 0.1, ease: 'easeOut' },
};

export const cardHover = {
  y: -6,
  transition: { duration: 0.24, ease: EASINGS.luxury },
};

// Mask & Clip-Path Reveal Variants
export const maskRevealVariants: Variants = {
  hidden: {
    clipPath: 'inset(12% 0% 12% 0% round 24px)',
    opacity: 0,
    scale: 0.98,
  },
  visible: {
    clipPath: 'inset(0% 0% 0% 0% round 24px)',
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: EASINGS.luxury,
    },
  },
};
