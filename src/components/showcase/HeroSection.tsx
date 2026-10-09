'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  colorMode: 'dual' | 'sky' | 'blush';
  onExploreClick?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  colorMode,
  onExploreClick,
}) => {
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
    <section className="relative w-full pt-10 pb-20 overflow-hidden bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CENTERPIECE + MASSIVE TYPOGRAPHY CONTAINER */}
        <div className="relative min-h-[460px] sm:min-h-[520px] md:min-h-[620px] flex items-center justify-center">
          
          {/* 1. GIANT OVERLAPPING BACKGROUND TEXT: "your choice" */}
          <div
            className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between w-full pointer-events-none select-none z-0"
            aria-hidden="true"
          >
            <span
              className="text-[17vw] md:text-[18vw] font-bold tracking-tight text-[#1C1917] font-sans leading-none pl-2 sm:pl-6"
              style={{ letterSpacing: '-0.04em' }}
            >
              your
            </span>
            <span
              className="text-[17vw] md:text-[18vw] font-bold tracking-tight text-[#1C1917] font-sans leading-none pr-2 sm:pr-6"
              style={{ letterSpacing: '-0.04em' }}
            >
              style
            </span>
          </div>

          {/* 2. LIQUID CHROME SUSPENDED ABSTRACT SPLASH (Upper Left behind bag, like reference) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute z-10 -top-4 sm:top-2 left-1/4 sm:left-[28%] w-36 sm:w-48 md:w-56 h-36 sm:h-48 md:h-56 pointer-events-none"
          >
            <img
              src="/images/showcase/liquid_chrome_splash_1791561214924.jpg"
              alt="Liquid Chrome Element"
              className="w-full h-full object-contain filter drop-shadow-xl mix-blend-multiply opacity-90 rotate-[-12deg]"
            />
          </motion.div>

          {/* 3. FOREGROUND 3D HERO PRODUCT (Soft Blush & Ice Blue Contemporary Designer Bag) */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-20 w-72 sm:w-96 md:w-[480px] lg:w-[540px] flex flex-col items-center group cursor-pointer"
          >
            <div className="relative w-full aspect-square filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-105">
              <img
                src="/images/showcase/hero_contemporary_bag_1791561448222.jpg"
                alt="Contemporary Minimalist Signature Bag in Soft Blush & Sky Blue"
                className="w-full h-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.18)]"
              />

              {/* Floating Aesthetic Tag */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#E7E0D6] text-xs font-bold text-[#1C1917] shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                  <Sparkles className="h-3 w-3 text-[#38BDF8]" />
                  <span>Blush × Ice Blue Edition • Unisex</span>
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* HERO BOTTOM DETAILS ROW (Exactly matching the reference image layout) */}
        <div className="mt-8 pt-8 border-t border-[#E7E0D6]/60 flex flex-col md:flex-row md:items-end justify-between gap-8">
          {/* Left Column: About us / What we do */}
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#78716C] font-semibold">
              About us
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1917]">
              What we do
            </h2>
          </div>

          {/* Right Column: Statement Paragraph + Rounded "Learn more ->" Pill Button */}
          <div className="max-w-xl space-y-4">
            <p className="text-sm sm:text-base text-[#57534E] leading-relaxed font-sans font-medium">
              Each <strong className="text-[#1C1917] font-semibold">WARDROBE</strong> piece is the perfect
              combination of contemporary minimalism, mindful tailoring, and effortless everyday practicality for both boys and girls.
            </p>

            <div className="flex items-center gap-4 pt-1">
              <Link
                href="#new-arrivals"
                className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-bold tracking-wide transition-all shadow-md hover:shadow-lg ${getPillTheme()}`}
              >
                <span>Learn more</span>
                <span className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>

              <Link
                href="/wardrobe"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#E7E0D6] hover:border-[#CBD5E1] text-[#1C1917] text-sm font-semibold transition-all hover:shadow-xs"
              >
                <span>Open Digital Studio</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
