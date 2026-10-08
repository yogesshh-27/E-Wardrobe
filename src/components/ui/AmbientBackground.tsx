'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Atmospheric Ambient Orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 20, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 -left-32 w-96 h-96 sm:w-[550px] sm:h-[550px] rounded-full bg-gradient-to-br from-[#B4533C]/12 via-[#C5A059]/10 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -50, 40, 0],
          y: [0, 60, -30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 -right-40 w-96 h-96 sm:w-[600px] sm:h-[600px] rounded-full bg-gradient-to-bl from-[#C5A059]/15 via-[#B4533C]/8 to-transparent blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 30, -40, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-40 left-1/4 w-96 h-96 sm:w-[500px] sm:h-[500px] rounded-full bg-gradient-to-tr from-[#5F6F52]/12 via-[#B4533C]/10 to-transparent blur-3xl"
      />

      {/* 2. Subtle Luxury Editorial Film Grain Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #1C1917 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}
