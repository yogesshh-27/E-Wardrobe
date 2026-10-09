'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Shirt, Heart, Eye } from 'lucide-react';

interface CollectionCard {
  id: string;
  title: string;
  subtitle: string;
  gender: 'unisex' | 'him' | 'her';
  image: string;
  itemCount: number;
  paletteBadge: string;
  accentColor: string;
}

const COLLECTIONS: CollectionCard[] = [
  {
    id: 'sky-blue-everyday',
    title: 'Sky Blue Everyday',
    subtitle: 'Relaxed cashmere crewnecks, crisp overshirts, and washed smart denim.',
    gender: 'him',
    image: '/images/showcase/knitwear_sky_blue_1791561486841.jpg',
    itemCount: 14,
    paletteBadge: 'Ice Sky Blue',
    accentColor: '#38BDF8',
  },
  {
    id: 'blush-tailoring',
    title: 'Blush Minimalist Tailoring',
    subtitle: 'Contemporary unstructured wool blazers and fluid wide-leg trousers.',
    gender: 'her',
    image: '/images/showcase/tailored_blush_blazer_1791561509441.jpg',
    itemCount: 12,
    paletteBadge: 'Soft Blush Rose',
    accentColor: '#F498A9',
  },
  {
    id: 'architectural-leather',
    title: 'Contemporary Leather & Hardware',
    subtitle: 'Minimalist crossbody bags with brushed titanium & chrome accents.',
    gender: 'unisex',
    image: '/images/showcase/hero_contemporary_bag_1791561448222.jpg',
    itemCount: 8,
    paletteBadge: 'Duo Harmony',
    accentColor: '#C084FC',
  },
  {
    id: 'liquid-chrome-capsule',
    title: 'Polished Titanium Edition',
    subtitle: 'Sculptural metallic statements crafted for effortless elevated evenings.',
    gender: 'unisex',
    image: '/images/showcase/bag_sabrina_chrome_1791561253395.jpg',
    itemCount: 6,
    paletteBadge: 'Pure Chrome',
    accentColor: '#94A3B8',
  },
];

interface CollectionsGridProps {
  colorMode: 'dual' | 'sky' | 'blush';
}

export const CollectionsGrid: React.FC<CollectionsGridProps> = ({ colorMode }) => {
  const [filter, setFilter] = useState<'all' | 'unisex' | 'him' | 'her'>('all');

  const filtered = COLLECTIONS.filter((col) => {
    if (filter === 'all') return true;
    if (filter === 'unisex') return col.gender === 'unisex';
    return col.gender === filter || col.gender === 'unisex';
  });

  return (
    <section id="collections" className="w-full py-20 bg-[#FAF8F5] border-t border-[#E7E0D6]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER (Matching reference: "Our collections") */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917] font-sans">
              Our collections
            </h2>
            <p className="text-sm text-[#78716C] mt-2">
              Contemporary smart casual curations balanced in soft blush &amp; sky blue for both guys &amp; girls.
            </p>
          </div>

          {/* Gender Filter Buttons */}
          <div className="flex items-center gap-2 bg-white border border-[#E7E0D6] rounded-full p-1 shadow-2xs">
            {[
              { id: 'all', label: 'All Curations' },
              { id: 'him', label: 'For Him' },
              { id: 'her', label: 'For Her' },
              { id: 'unisex', label: 'Unisex' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === btn.id
                    ? 'bg-[#1C1917] text-white shadow-xs'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4-COLUMN CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl bg-white border border-[#E7E0D6] overflow-hidden hover:border-[#CBD5E1] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Product Visual Container with Arch Curve */}
              <div className="relative aspect-square w-full bg-[#F4EFEA]/60 flex items-center justify-center p-6 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-108 transition-transform duration-500"
                />

                {/* Floating Palette Pill */}
                <div className="absolute top-3 left-3">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md shadow-2xs border border-[#E7E0D6]"
                    style={{ color: item.accentColor }}
                  >
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.accentColor }}
                    />
                    <span>{item.paletteBadge}</span>
                  </span>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-bold text-[#57534E] bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-2xs">
                    {item.itemCount} items
                  </span>
                </div>
              </div>

              {/* Card Meta Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-base text-[#1C1917] group-hover:text-[#0284C7] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed line-clamp-2">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#F4EFEA] flex items-center justify-between">
                  <Link
                    href="/wardrobe"
                    className="text-xs font-bold text-[#1C1917] hover:text-[#0284C7] flex items-center gap-1.5 transition-colors"
                  >
                    <span>Style Ensemble</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href="/outfits"
                    className="h-8 w-8 rounded-full bg-[#FAF8F5] hover:bg-[#E0F2FE] text-[#57534E] hover:text-[#0284C7] flex items-center justify-center transition-colors"
                    title="View Outfits"
                  >
                    <Shirt className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
