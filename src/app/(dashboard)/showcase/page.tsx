'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plane,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShowcaseNavbar } from '@/components/showcase/ShowcaseNavbar';
import { HeroSection } from '@/components/showcase/HeroSection';
import { NewArrivalsCarousel } from '@/components/showcase/NewArrivalsCarousel';
import { EditorialCollageSection } from '@/components/showcase/EditorialCollageSection';
import { CollectionsGrid } from '@/components/showcase/CollectionsGrid';
import { ShowcaseFooter } from '@/components/showcase/ShowcaseFooter';
import { GlobalSearchModal } from '@/components/navigation/GlobalSearchModal';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { EASINGS, DURATIONS } from '@/lib/animations';

export default function ShowcasePage() {
  const [colorMode, setColorMode] = useState<'dual' | 'sky' | 'blush'>('dual');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const { items } = useWardrobeStore();

  const atelierFeatures = [
    {
      href: '/travel',
      badge: 'Core Feature',
      badgeColor: 'text-[#0284C7]',
      hoverBorder: 'hover:border-[#38BDF8]',
      icon: Plane,
      iconColor: 'text-[#0284C7]',
      title: '✈️ Travel Packing',
      hoverTitleColor: 'group-hover:text-[#0284C7]',
      description:
        'Plan outfits for your next trip. Day-wise weather intelligence, capsule reuse, and luggage optimization.',
      actionText: 'Launch Packing Assistant →',
      actionColor: 'text-[#0284C7]',
    },
    {
      href: '/occasions',
      badge: 'Event Curations',
      badgeColor: 'text-[#E87A90]',
      hoverBorder: 'hover:border-[#E87A90]',
      icon: Sparkles,
      iconColor: 'text-[#E87A90]',
      title: '✨ Occasion Stylist',
      hoverTitleColor: 'group-hover:text-[#E87A90]',
      description:
        'Create the perfect look for dinner dates, weddings, galas, and professional meetings for both him and her.',
      actionText: 'Style An Event →',
      actionColor: 'text-[#E87A90]',
    },
    {
      href: '/recommendations',
      badge: 'AI Taste Engine',
      badgeColor: 'text-[#8B5CF6]',
      hoverBorder: 'hover:border-[#8B5CF6]',
      icon: Compass,
      iconColor: 'text-[#8B5CF6]',
      title: '🛍️ Recommendations',
      hoverTitleColor: 'group-hover:text-[#8B5CF6]',
      description:
        'Smart suggestions tailored to your personal aesthetic taxonomy and closet gaps in soft blue and blush.',
      actionText: 'Discover Items →',
      actionColor: 'text-[#8B5CF6]',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col selection:bg-[#38BDF8]/20 selection:text-[#0284C7]">
      {/* 1. TOP NAVBAR */}
      <ShowcaseNavbar
        colorMode={colorMode}
        onColorModeChange={setColorMode}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. HERO SECTION */}
      <HeroSection colorMode={colorMode} />

      {/* 3. NEW ARRIVALS ARCHED CAROUSEL */}
      <NewArrivalsCarousel colorMode={colorMode} />

      {/* 4. EDITORIAL MANIFESTO & VISUAL COLLAGE */}
      <EditorialCollageSection colorMode={colorMode} />

      {/* 5. OUR COLLECTIONS SECTION */}
      <CollectionsGrid colorMode={colorMode} />

      {/* 6. AI ATELIER QUICK LAUNCHPAD */}
      <section className="w-full py-16 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: EASINGS.luxury }}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Personal Stylist Studio</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-[#1C1917]">
                Smart Wardrobe Atelier
              </h2>
              <p className="text-sm text-[#57534E] mt-1">
                Digitally curate your clothing, generate occasion looks, and pack smart capsules for upcoming journeys.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Link
                href="/wardrobe"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#2D2926] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
              >
                <span>View Full Wardrobe ({items.length} garments)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {atelierFeatures.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.href}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{
                    duration: 0.55,
                    delay: index * DURATIONS.stagger,
                    ease: EASINGS.luxury,
                  }}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : {
                          y: -6,
                          transition: { duration: 0.24, ease: EASINGS.luxury },
                        }
                  }
                >
                  <Link
                    href={card.href}
                    className={`block h-full group rounded-3xl bg-[#FAF8F5] border border-[#E2E8F0] p-7 ${card.hoverBorder} hover:shadow-lg transition-all duration-300 relative overflow-hidden`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white ${card.iconColor} border border-[#E2E8F0] mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-2xs`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className={`text-[11px] font-bold tracking-widest uppercase ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                    <h3 className={`text-xl font-bold text-[#1C1917] mt-1 ${card.hoverTitleColor} transition-colors`}>
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                      {card.description}
                    </p>
                    <div
                      className={`mt-6 pt-4 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs font-bold ${card.actionColor}`}
                    >
                      <span>{card.actionText}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. SHOWCASE FOOTER */}
      <ShowcaseFooter />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
