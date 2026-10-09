'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Sparkles, Shirt, SlidersHorizontal, ArrowRight, User } from 'lucide-react';
import { BubbleLogo } from './BubbleLogo';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';

interface ShowcaseNavbarProps {
  colorMode: 'dual' | 'sky' | 'blush';
  onColorModeChange: (mode: 'dual' | 'sky' | 'blush') => void;
  onOpenSearch?: () => void;
}

export const ShowcaseNavbar: React.FC<ShowcaseNavbarProps> = ({
  colorMode,
  onColorModeChange,
  onOpenSearch,
}) => {
  const { items } = useWardrobeStore();
  const { user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E0D6]/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Navigation: Explore, Collections, About, Reviews */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] font-semibold text-[#57534E]">
          <Link
            href="#explore"
            className="flex items-center gap-1.5 text-[#1C1917] hover:text-[#E87A90] transition-colors group"
          >
            <span>Explore</span>
            <span className="h-2 w-2 rounded-full bg-[#E87A90] group-hover:scale-125 transition-transform animate-pulse" />
          </Link>
          <Link
            href="#collections"
            className="hover:text-[#0284C7] transition-colors"
          >
            Collections
          </Link>
          <Link
            href="#about"
            className="hover:text-[#E87A90] transition-colors"
          >
            About
          </Link>
          <Link
            href="#reviews"
            className="hover:text-[#0284C7] transition-colors"
          >
            Reviews
          </Link>
        </nav>

        {/* Center: Iconic Bubble Wordmark */}
        <div className="flex-1 md:flex-initial text-center md:text-left flex justify-center">
          <Link href="/" className="group flex items-center justify-center">
            <BubbleLogo
              text="WARDROBE"
              variant={colorMode === 'sky' ? 'sky' : colorMode === 'blush' ? 'blush' : 'dual'}
              size="md"
            />
          </Link>
        </div>

        {/* Right Section: Color Palette / Compatibility Switcher + Search + Wardrobe Studio CTA */}
        <div className="flex items-center gap-3">
          {/* Dual / Unisex Compatibility Mode Toggle */}
          <div className="hidden sm:flex items-center bg-white/80 border border-[#E7E0D6] rounded-full p-1 shadow-xs text-xs font-medium">
            <button
              onClick={() => onColorModeChange('dual')}
              className={`px-3 py-1 rounded-full transition-all flex items-center gap-1.5 ${
                colorMode === 'dual'
                  ? 'bg-gradient-to-r from-[#F8B4C0] to-[#93C5FD] text-[#1C1917] font-bold shadow-xs'
                  : 'text-[#78716C] hover:text-[#1C1917]'
              }`}
              title="Balanced Blush & Sky Blue (Unisex)"
            >
              <Sparkles className="h-3 w-3" />
              <span>Unisex</span>
            </button>
            <button
              onClick={() => onColorModeChange('sky')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                colorMode === 'sky'
                  ? 'bg-[#38BDF8] text-white font-bold shadow-xs'
                  : 'text-[#78716C] hover:text-[#0284C7]'
              }`}
              title="Sky Blue (Cool tone)"
            >
              Blue
            </button>
            <button
              onClick={() => onColorModeChange('blush')}
              className={`px-2.5 py-1 rounded-full transition-all ${
                colorMode === 'blush'
                  ? 'bg-[#F498A9] text-white font-bold shadow-xs'
                  : 'text-[#78716C] hover:text-[#E87A90]'
              }`}
              title="Blush Rose (Warm tone)"
            >
              Pink
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-[#E7E0D6] text-[#57534E] hover:text-[#1C1917] hover:border-[#CBD5E1] transition-all shadow-xs"
            aria-label="Search collection"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* Wardrobe Atelier Quick Access */}
          <Link
            href="/wardrobe"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1C1917] hover:bg-[#2D2926] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md"
          >
            <Shirt className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span className="hidden lg:inline">My Wardrobe</span>
            <span className="bg-white/20 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
              {items.length}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
