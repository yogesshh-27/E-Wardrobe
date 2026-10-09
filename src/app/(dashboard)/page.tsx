'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Plane,
  Compass,
  ArrowRight,
  Shirt,
  Heart,
  Search,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { ShowcaseNavbar } from '@/components/showcase/ShowcaseNavbar';
import { HeroSection } from '@/components/showcase/HeroSection';
import { NewArrivalsCarousel } from '@/components/showcase/NewArrivalsCarousel';
import { EditorialCollageSection } from '@/components/showcase/EditorialCollageSection';
import { CollectionsGrid } from '@/components/showcase/CollectionsGrid';
import { ShowcaseFooter } from '@/components/showcase/ShowcaseFooter';
import { GlobalSearchModal } from '@/components/navigation/GlobalSearchModal';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOutfitStore } from '@/store/useOutfitStore';

export default function HomePage() {
  // 'dual' = Balanced soft blush pink & clean ice sky blue for both boys and girls
  const [colorMode, setColorMode] = useState<'dual' | 'sky' | 'blush'>('dual');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { items } = useWardrobeStore();
  const { user } = useAuthStore();
  const { openTryOn } = useOutfitStore();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col selection:bg-[#38BDF8]/20 selection:text-[#0284C7]">
      {/* 1. TOP NAVBAR (Explore, Collections, About, Reviews, Brand Wordmark, Mode Toggle, Search) */}
      <ShowcaseNavbar
        colorMode={colorMode}
        onColorModeChange={setColorMode}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. HERO SECTION (Massive "your style" background typography, 3D Hero Bag, Chrome splash, Bottom details) */}
      <HeroSection colorMode={colorMode} />

      {/* 3. NEW ARRIVALS ARCHED CAROUSEL (The Iconic Colored Block in balanced Blush & Sky Blue) */}
      <NewArrivalsCarousel colorMode={colorMode} />

      {/* 4. EDITORIAL MANIFESTO & VISUAL COLLAGE (Philosophy, Giant Bubble Wordmark, Liquid Chrome, Couple, Mini pouches) */}
      <EditorialCollageSection colorMode={colorMode} />

      {/* 5. OUR COLLECTIONS SECTION (Sky Blue Everyday, Blush Tailoring, Unisex Minimalist, Leather & Accessories) */}
      <CollectionsGrid colorMode={colorMode} />

      {/* 6. AI ATELIER QUICK LAUNCHPAD (Seamless bridge to E-Wardrobe smart features) */}
      <section className="w-full py-16 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
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

            <Link
              href="/wardrobe"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1C1917] hover:bg-[#2D2926] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
            >
              <span>View Full Wardrobe ({items.length} garments)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: ✈️ TRAVEL CAPSULE */}
            <Link
              href="/travel"
              className="group rounded-3xl bg-[#FAF8F5] border border-[#E2E8F0] p-7 hover:border-[#38BDF8] hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0284C7] border border-[#E2E8F0] mb-5 group-hover:scale-110 transition-transform shadow-2xs">
                <Plane className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#0284C7]">
                Core Feature
              </span>
              <h3 className="text-xl font-bold text-[#1C1917] mt-1 group-hover:text-[#0284C7] transition-colors">
                ✈️ Travel Packing
              </h3>
              <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                Plan outfits for your next trip. Day-wise weather intelligence, capsule reuse, and luggage optimization.
              </p>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs font-bold text-[#0284C7]">
                <span>Launch Packing Assistant →</span>
              </div>
            </Link>

            {/* Card 2: ✨ OCCASION STYLIST */}
            <Link
              href="/occasions"
              className="group rounded-3xl bg-[#FAF8F5] border border-[#E2E8F0] p-7 hover:border-[#E87A90] hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#E87A90] border border-[#E2E8F0] mb-5 group-hover:scale-110 transition-transform shadow-2xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#E87A90]">
                Event Curations
              </span>
              <h3 className="text-xl font-bold text-[#1C1917] mt-1 group-hover:text-[#E87A90] transition-colors">
                ✨ Occasion Stylist
              </h3>
              <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                Create the perfect look for dinner dates, weddings, galas, and professional meetings for both him and her.
              </p>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs font-bold text-[#E87A90]">
                <span>Style An Event →</span>
              </div>
            </Link>

            {/* Card 3: 🛍️ RECOMMENDATIONS */}
            <Link
              href="/recommendations"
              className="group rounded-3xl bg-[#FAF8F5] border border-[#E2E8F0] p-7 hover:border-[#8B5CF6] hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#8B5CF6] border border-[#E2E8F0] mb-5 group-hover:scale-110 transition-transform shadow-2xs">
                <Compass className="h-6 w-6" />
              </div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#8B5CF6]">
                AI Taste Engine
              </span>
              <h3 className="text-xl font-bold text-[#1C1917] mt-1 group-hover:text-[#8B5CF6] transition-colors">
                🛍️ Recommendations
              </h3>
              <p className="text-xs text-[#57534E] mt-2 leading-relaxed">
                Smart suggestions tailored to your personal aesthetic taxonomy and closet gaps in soft blue and blush.
              </p>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0]/60 flex items-center justify-between text-xs font-bold text-[#8B5CF6]">
                <span>Discover Items →</span>
              </div>
            </Link>
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
