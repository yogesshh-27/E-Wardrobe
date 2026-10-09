'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/lib/animations';

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  delay?: number;
  hoverZoom?: boolean;
}

export const ImageReveal: React.FC<ImageRevealProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  delay = 0.15,
  hoverZoom = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-hidden ${containerClassName}`}>
        <img src={src} alt={alt} className={className} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        clipPath: 'inset(14% 0% 14% 0% round 24px)',
        opacity: 0,
        scale: 0.96,
      }}
      whileInView={{
        clipPath: 'inset(0% 0% 0% 0% round 24px)',
        opacity: 1,
        scale: 1,
      }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.7,
        ease: EASINGS.luxury,
        delay,
      }}
      className={`overflow-hidden relative ${containerClassName}`}
    >
      <motion.img
        src={src}
        alt={alt}
        whileHover={hoverZoom ? { scale: 1.05 } : undefined}
        transition={{ duration: DURATIONS.reveal, ease: EASINGS.standard }}
        className={`w-full h-full object-cover ${className}`}
      />
    </motion.div>
  );
};
