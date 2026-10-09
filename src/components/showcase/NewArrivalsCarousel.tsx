'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Leaf, Heart } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASINGS, DURATIONS } from '@/lib/animations';

interface ShowcaseItem {
  id: string;
  name: string;
  code: string;
  price: string;
  category: 'unisex' | 'men' | 'women';
  tag: string;
  image: string;
  description: string;
}

const ARRIVAL_ITEMS: ShowcaseItem[] = [
  {
    id: 'sabrina',
    name: 'Sabrina',
    code: '220S',
    price: '$280',
    category: 'unisex',
    tag: 'ECO',
    image: '/images/showcase/bag_sabrina_chrome_1791561253395.jpg',
    description: 'Sculpted titanium & chrome finish with automotive contours.',
  },
  {
    id: 'brielle',
    name: 'Brielle',
    code: '200S',
    price: '$220',
    category: 'men',
    tag: 'ECO',
    image: '/images/showcase/knitwear_sky_blue_1791561486841.jpg',
    description: 'Clean minimalist crewneck in pure sky blue cashmere.',
  },
  {
    id: 'naomi',
    name: 'Naomi',
    code: '235S',
    price: '$340',
    category: 'women',
    tag: 'ECO',
    image: '/images/showcase/tailored_blush_blazer_1791561509441.jpg',
    description: 'Tailored minimalist single-button blazer in soft blush rose.',
  },
  {
    id: 'aero-duo',
    name: 'Aero Duo',
    code: '310S',
    price: '$290',
    category: 'unisex',
    tag: 'ECO',
    image: '/images/showcase/hero_contemporary_bag_1791561448222.jpg',
    description: 'Signature architectural leather in blush & ice blue harmony.',
  },
  {
    id: 'athletic-sky',
    name: 'Aether Sky',
    code: '190S',
    price: '$195',
    category: 'men',
    tag: 'ECO',
    image: '/images/showcase/bag_brielle_ice_blue_1791561270814.jpg',
    description: 'Contemporary athletic backpack in crisp ice blue and titanium.',
  },
];

interface NewArrivalsCarouselProps {
  colorMode: 'dual' | 'sky' | 'blush';
  onSelectItem?: (item: ShowcaseItem) => void;
}

export const NewArrivalsCarousel: React.FC<NewArrivalsCarouselProps> = ({
  colorMode,
  onSelectItem,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<'all' | 'men' | 'women' | 'unisex'>('all');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const getBackgroundTheme = () => {
    switch (colorMode) {
      case 'sky':
        return 'bg-gradient-to-r from-[#93C5FD] via-[#38BDF8] to-[#0284C7] text-white';
      case 'blush':
        return 'bg-gradient-to-r from-[#F498A9] via-[#E87A90] to-[#F4829A] text-white';
      case 'dual':
      default:
        return 'bg-gradient-to-r from-[#F8A4B6] via-[#D8B4F8] to-[#60A5FA] text-white';
    }
  };

  const filteredItems = ARRIVAL_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'unisex') return item.category === 'unisex';
    return item.category === activeCategory || item.category === 'unisex';
  });

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = 340;
    carouselRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="new-arrivals"
      className={`relative w-full py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-700 shadow-xl overflow-hidden ${getBackgroundTheme()}`}
    >
      {/* Decorative ambient blurred orbs with subtle float */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, 20, 0],
                y: [0, -15, 0],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                x: [0, -20, 0],
                y: [0, 15, 0],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-white/20 blur-3xl pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* SUB-NAV HEADER WITH SCROLL REVEAL */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: EASINGS.luxury }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12"
        >
          {/* Subtitle Left */}
          <span className="text-sm font-semibold tracking-wider text-white/80 hover:text-white cursor-pointer transition-colors">
            Bloggers&apos; Choice
          </span>

          {/* Main Title Center: Bold White Uppercase NEW ARRIVALS */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-wider text-white font-sans drop-shadow-sm">
              NEW ARRIVALS
            </h2>
            <p className="text-xs sm:text-sm font-medium text-white/85 mt-1 tracking-wide">
              Curated essentials in soft blush &amp; ice blue • Tailored for boys &amp; girls
            </p>
          </div>

          {/* Subtitle Right */}
          <span className="text-sm font-semibold tracking-wider text-white/80 hover:text-white cursor-pointer transition-colors">
            Bestsellers
          </span>
        </motion.div>

        {/* GENDER & AESTHETIC FILTER PILLS */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASINGS.luxury }}
          className="flex items-center justify-center gap-2 mb-10 overflow-x-auto pb-2"
        >
          {[
            { id: 'all', label: 'All Curations' },
            { id: 'men', label: 'For Him (Blue & Neutrals)' },
            { id: 'women', label: 'For Her (Blush & Soft)' },
            { id: 'unisex', label: 'Unisex Essentials' },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs whitespace-nowrap ${
                activeCategory === tab.id
                  ? 'bg-white text-[#1C1917] shadow-md scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* CAROUSEL WRAPPER WITH NAVIGATION ARROWS */}
        <div className="relative">
          {/* Left Arrow Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scroll('left')}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-md border border-white/40 text-white hover:text-[#1C1917] flex items-center justify-center transition-colors shadow-lg"
            aria-label="Previous item"
          >
            <ChevronLeft className="h-6 w-6" />
          </motion.button>

          {/* Right Arrow Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => scroll('right')}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/30 hover:bg-white/60 backdrop-blur-md border border-white/40 text-white hover:text-[#1C1917] flex items-center justify-center transition-colors shadow-lg"
            aria-label="Next item"
          >
            <ChevronRight className="h-6 w-6" />
          </motion.button>

          {/* HORIZONTAL SCROLLING CONTAINER WITH STAGGERED REVEALS */}
          <div
            ref={carouselRef}
            className="flex items-stretch gap-6 overflow-x-auto scroll-smooth py-4 px-2 no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{
                  duration: 0.55,
                  delay: index * DURATIONS.stagger, // 80ms stagger
                  ease: EASINGS.luxury,
                }}
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : {
                        y: -8,
                        transition: { duration: 0.24, ease: EASINGS.luxury },
                      }
                }
                className="flex-shrink-0 w-72 sm:w-80 flex flex-col group cursor-pointer"
                onClick={() => onSelectItem?.(item)}
              >
                {/* ARCHED CAPSULE CARD CONTAINER */}
                <div className="relative bg-white/30 hover:bg-white/40 backdrop-blur-lg border border-white/40 p-6 rounded-[48px] shadow-lg flex flex-col items-center justify-between min-h-[380px] transition-colors">
                  {/* Top Bar: "ECO" Pill Tag + Favorite Heart */}
                  <div className="w-full flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/30 backdrop-blur-md text-[11px] font-bold tracking-wider text-white border border-white/30">
                      <Leaf className="h-3 w-3 text-emerald-300" />
                      <span>{item.tag}</span>
                    </span>

                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={(e) => toggleFavorite(item.id, e)}
                      className={`h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                        favorites[item.id]
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/25 hover:bg-white/40 text-white'
                      }`}
                      aria-label="Add to favorites"
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites[item.id] ? 'fill-current' : ''}`}
                      />
                    </motion.button>
                  </div>

                  {/* 3D PRODUCT IMAGE SHOWCASE WITH GENTLE HOVER ZOOM */}
                  <div className="relative w-full aspect-square my-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain filter drop-shadow-xl transition-transform duration-500 group-hover:scale-108"
                    />
                  </div>

                  {/* BOTTOM ROW DETAILS */}
                  <div className="w-full flex items-center justify-between pt-2 border-t border-white/20">
                    <div>
                      <h3 className="font-bold text-lg text-white font-sans tracking-tight leading-tight">
                        {item.name}
                      </h3>
                      <span className="text-xs text-white/80 font-mono font-medium">
                        {item.code} • {item.price}
                      </span>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Link
                        href="/wardrobe"
                        onClick={(e) => e.stopPropagation()}
                        className="px-4 py-2 rounded-full bg-white text-[#1C1917] hover:bg-[#FAF8F5] text-xs font-bold transition-all shadow-sm hover:shadow-md block"
                      >
                        Learn more
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
