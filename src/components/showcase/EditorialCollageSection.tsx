'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BubbleLogo } from './BubbleLogo';
import { motion, useReducedMotion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/lib/animations';

interface EditorialCollageSectionProps {
  colorMode: 'dual' | 'sky' | 'blush';
}

export const EditorialCollageSection: React.FC<EditorialCollageSectionProps> = ({
  colorMode,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const getPillTheme = () => {
    switch (colorMode) {
      case 'sky':
        return 'bg-[#38BDF8] hover:bg-[#0284C7] text-white shadow-sky-200';
      case 'blush':
        return 'bg-[#E87A90] hover:bg-[#D4657B] text-white shadow-pink-200';
      case 'dual':
      default:
        return 'bg-gradient-to-r from-[#E87A90] to-[#38BDF8] hover:opacity-95 text-white shadow-purple-200';
    }
  };

  return (
    <section id="about" className="relative w-full py-24 bg-[#FAF8F5] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Editorial Philosophy & Giant Bubble Wordmark */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: EASINGS.luxury }}
              className="space-y-4 max-w-lg"
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E0D6] text-xs font-bold text-[#57534E] shadow-2xs">
                <Sparkles className="h-3 w-3 text-[#38BDF8]" />
                <span>Mindful Fashion Philosophy</span>
              </span>

              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-sans">
                Our team is passionate about contemporary minimalism and everyday versatility,
                and we bring this vision to life in every piece we curate.
              </p>

              <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-sans">
                We love experimenting with breathable organic textiles, relaxed tailored silhouettes,
                and harmonized neutral palettes. Together we explore pieces that not only complement your
                daily lifestyle, but also celebrate authentic personal style for both men and women.
              </p>

              <div className="pt-2">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  className="inline-block"
                >
                  <Link
                    href="/style-profile"
                    className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg ${getPillTheme()}`}
                  >
                    <span>More about us</span>
                    <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            {/* GIANT CHUNKY BUBBLE WORDMARK */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, ease: EASINGS.luxury, delay: 0.2 }}
              className="pt-8 select-none"
            >
              <motion.div
                whileHover={{ rotate: 1, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <BubbleLogo
                  text="WARDROBE"
                  variant={colorMode === 'sky' ? 'sky' : colorMode === 'blush' ? 'blush' : 'dual'}
                  size="lg"
                  className="opacity-95 transform -rotate-1 transition-transform"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: The High-Fashion Aesthetic Visual Collage */}
          <div className="lg:col-span-7 relative min-h-[500px] sm:min-h-[580px] flex items-center justify-center">
            
            {/* 1. Abstract Liquid Chrome Splash (Top Left in collage) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, -8, 0],
                    }
              }
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              transition={
                shouldReduceMotion
                  ? { duration: 0.8 }
                  : {
                      y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                      duration: 0.8,
                    }
              }
              className="absolute -top-6 left-4 sm:left-12 w-32 sm:w-44 h-32 sm:h-44 z-20 pointer-events-none"
            >
              <img
                src="/images/showcase/liquid_chrome_splash_1791561214924.jpg"
                alt="Liquid metal abstract sculpture"
                className="w-full h-full object-contain filter drop-shadow-xl mix-blend-multiply opacity-85"
              />
            </motion.div>

            {/* 2. Mini Pastel Pouches with Whipped Cream Tops */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: EASINGS.luxury }}
              whileHover={{ scale: 1.05 }}
              className="absolute -top-4 right-4 sm:right-10 w-28 sm:w-36 h-28 sm:h-36 z-30 rounded-2xl overflow-hidden shadow-xl border-2 border-white cursor-pointer"
            >
              <img
                src="/images/showcase/collage_mini_pouches_1791561309003.jpg"
                alt="Mini pastel luxury pouches"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
              />
            </motion.div>

            {/* 3. Main Center Editorial Photo with Mask Clip-Path Reveal */}
            <motion.div
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 0,
                      clipPath: 'inset(10% 0% 10% 0% round 24px)',
                      scale: 0.96,
                    }
              }
              whileInView={{
                opacity: 1,
                clipPath: 'inset(0% 0% 0% 0% round 24px)',
                scale: 1,
              }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASINGS.luxury }}
              className="relative z-10 w-64 sm:w-80 md:w-96 rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white"
            >
              <div className="aspect-[3/4] relative overflow-hidden group">
                <img
                  src="/images/showcase/editorial_smart_casual_1791561468361.jpg"
                  alt="Contemporary smart casual styling for both boys and girls"
                  className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700"
                />

                {/* Subtle Floating Label with spring reveal */}
                <motion.div
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4, ease: EASINGS.luxury }}
                  className="absolute bottom-4 left-4 right-4 bg-white/85 backdrop-blur-md rounded-2xl p-3 border border-[#E7E0D6] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1C1917]">Contemporary Smart Casual</p>
                      <p className="text-[10px] text-[#78716C]">Cashmere Crewneck &amp; Tailored Fit</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                      His &amp; Hers
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* 4. Floating Holographic Iridescent Spiral (Bottom Left of photo) */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, rotate: -20, scale: 0.8 }}
              whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              animate={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: [0, 8, 0],
                      rotate: [0, 5, 0],
                    }
              }
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              transition={
                shouldReduceMotion
                  ? { duration: 0.8 }
                  : {
                      y: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
                      rotate: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
                      duration: 0.8,
                    }
              }
              className="absolute -bottom-6 left-6 sm:left-16 w-28 sm:w-36 h-28 sm:h-36 z-30 pointer-events-none"
            >
              <img
                src="/images/showcase/iridescent_spiral_1791561327078.jpg"
                alt="Iridescent ribbon element"
                className="w-full h-full object-contain filter drop-shadow-xl"
              />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};
