'use client';

import React from 'react';
import Link from 'next/link';
import { BubbleLogo } from './BubbleLogo';
import { ArrowUpRight, Heart, Sparkles } from 'lucide-react';

export const ShowcaseFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#FAF8F5] border-t border-[#E7E0D6] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <BubbleLogo text="WARDROBE" variant="dual" size="sm" />
            <p className="text-xs text-[#57534E] leading-relaxed max-w-xs">
              Contemporary smart casual fashion atelier &amp; digital wardrobe assistant for both guys and girls.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0284C7]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI-Powered Styling Atelier</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              Wardrobe Atelier
            </h4>
            <ul className="space-y-2 text-xs text-[#57534E]">
              <li>
                <Link href="/wardrobe" className="hover:text-[#1C1917] transition-colors">
                  Digital Closet
                </Link>
              </li>
              <li>
                <Link href="/outfits" className="hover:text-[#1C1917] transition-colors">
                  Outfit Combinations
                </Link>
              </li>
              <li>
                <Link href="/travel" className="hover:text-[#1C1917] transition-colors">
                  Travel Capsule Packing
                </Link>
              </li>
              <li>
                <Link href="/occasions" className="hover:text-[#1C1917] transition-colors">
                  Event Occasions
                </Link>
              </li>
            </ul>
          </div>

          {/* Curations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              Curations
            </h4>
            <ul className="space-y-2 text-xs text-[#57534E]">
              <li>
                <Link href="#new-arrivals" className="hover:text-[#1C1917] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-[#1C1917] transition-colors">
                  Sky Blue Essentials
                </Link>
              </li>
              <li>
                <Link href="#collections" className="hover:text-[#1C1917] transition-colors">
                  Blush Tailoring
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-[#1C1917] transition-colors">
                  Smart Recommendations
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Profile */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1917]">
              Personal Style
            </h4>
            <ul className="space-y-2 text-xs text-[#57534E]">
              <li>
                <Link href="/style-profile" className="hover:text-[#1C1917] transition-colors">
                  Style DNA Analysis
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#1C1917] transition-colors">
                  Silhouette Profile
                </Link>
              </li>
              <li>
                <Link href="/settings" className="hover:text-[#1C1917] transition-colors">
                  Preferences &amp; Fit
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-[#1C1917] transition-colors">
                  Stylist Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#E7E0D6]/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#78716C]">
          <p>© 2026 WARDROBE AI. Designed for contemporary smart casual elegance.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Balanced in <span className="text-[#E87A90] font-semibold">Blush</span> &amp; <span className="text-[#0284C7] font-semibold">Sky Blue</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
