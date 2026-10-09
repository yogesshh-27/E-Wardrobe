'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion';

export const SmoothScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  // 1. Initialize Lenis Buttery Smooth Momentum Scrolling
  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.8,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [shouldReduceMotion]);

  // 2. Viewport Scroll Progress Bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Sleek Top Luxury Scroll Progress Indicator */}
      {!shouldReduceMotion && (
        <motion.div
          style={{ scaleX, transformOrigin: '0%' }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#E87A90] via-[#C084FC] to-[#38BDF8] z-[9999] pointer-events-none shadow-[0_0_12px_rgba(56,189,248,0.5)]"
        />
      )}
      {children}
    </>
  );
};
