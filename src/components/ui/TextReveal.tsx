'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/lib/animations';

interface TextRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
  stagger?: number;
}

export const TextReveal: React.FC<TextRevealProps> = ({
  text,
  className = '',
  wordClassName = '',
  as: Component = 'h1',
  delay = 0.1,
  stagger = 0.04,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 18,
      rotateZ: 1.5,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateZ: 0,
      transition: {
        duration: 0.6,
        ease: EASINGS.luxury,
      },
    },
  };

  return (
    <Component className={`${className} inline-flex flex-wrap gap-x-[0.28em]`}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="inline-flex flex-wrap gap-x-[0.28em]"
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden py-1">
            <motion.span
              variants={wordVariants}
              className={`inline-block ${wordClassName}`}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Component>
  );
};
