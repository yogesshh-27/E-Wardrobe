'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{
        duration: DURATIONS.pageTransition,
        ease: EASINGS.standard,
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
};
