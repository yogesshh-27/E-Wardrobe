'use client';

import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  ExternalLink,
  Star,
  Sparkles,
  Filter,
  Search,
  Check,
} from 'lucide-react';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { ProductItem } from '@/types';

const TABS = [
  'Recommended for You',
  'Complete Your Wardrobe',
  'Trending',
  'Occasion Wear',
  'Travel Essentials',
  'Footwear',
  'Accessories',
] as const;

const PLATFORMS = ['All', 'Myntra', 'Amazon', 'Flipkart', 'Meesho'] as const;

export default function ShoppingPage() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('Recommended for You');
  const [selectedPlatform, setSelectedPlatform] = useState<typeof PLATFORMS[number]>('All');
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((prod) => {
      // Platform filter
      if (selectedPlatform !== 'All' && prod.platform !== selectedPlatform) {
        return false;
      }
      // Price filter
      if (prod.price > maxPrice) {
        return false;
      }
      // Tab Category filter
      if (activeTab === 'Footwear' && !prod.category.toLowerCase().includes('footwear')) {
        return false;
      }
      if (activeTab === 'Accessories' && !prod.category.toLowerCase().includes('accessories')) {
        return false;
      }
      if (activeTab === 'Occasion Wear' && !prod.category.toLowerCase().includes('ethnic')) {
        return false;
      }
      // Search query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matches =
          prod.name.toLowerCase().includes(q) ||
          prod.reason.toLowerCase().includes(q) ||
          prod.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [activeTab, selectedPlatform, maxPrice, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          Shopping Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          &ldquo;Complete your look.&rdquo; AI-identified missing pieces across top fashion platforms with instant search links.
        </p>
      </div>

      {/* Tabs Strip (Section 15) */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              activeTab === tab
                ? 'bg-[#0284C7] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#57534E] hover:border-[#CBD5E1]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter and Price Controls Bar */}
      <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
            <input
              type="text"
              placeholder="Search recommended pieces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] pl-10 pr-4 py-2 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Platform Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto">
            <span className="text-[11px] font-semibold text-[#78716C] mr-1">Platform:</span>
            {PLATFORMS.map((plat) => (
              <button
                key={plat}
                onClick={() => setSelectedPlatform(plat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedPlatform === plat
                    ? 'border-[#0284C7] bg-[#0284C7]/10 text-[#0284C7]'
                    : 'border-[#E2E8F0] bg-[#FAF8F5] text-[#57534E]'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-semibold text-[#78716C] whitespace-nowrap">
              Under ₹{maxPrice.toLocaleString('en-IN')}:
            </span>
            <input
              type="range"
              min="1000"
              max="10000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="accent-[#0284C7] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Product Cards Grid (Section 15) */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-12 text-center text-[#78716C] space-y-2">
          <p className="text-sm font-semibold">No products match current filters.</p>
          <p className="text-xs">Try adjusting the price range or platform filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-3xl border border-[#E2E8F0] bg-white p-4 shadow-sm card-shadow card-shadow-hover flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] mb-3">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {/* Platform Badge */}
                  <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-[10px] font-bold text-[#1C1917] shadow-2xs border border-[#E2E8F0]">
                    {prod.platform}
                  </span>

                  {/* Rating */}
                  {prod.rating && (
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-bold text-white">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                    </div>
                  )}
                </div>

                {prod.brand && (
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C]">
                    {prod.brand}
                  </p>
                )}
                <h4 className="text-xs font-bold text-[#1C1917] line-clamp-1 mt-0.5">
                  {prod.name}
                </h4>

                {/* AI Reason for suggestion */}
                <div className="mt-2 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] p-2">
                  <p className="text-[10px] text-[#57534E] leading-relaxed">
                    <span className="font-semibold text-[#0284C7]">AI match:</span> {prod.reason}
                  </p>
                </div>
              </div>

              {/* Price & Shop Now External Link (Section 15) */}
              <div className="pt-2 border-t border-[#F0F7FD] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-[#1C1917]">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-[11px] text-[#78716C] line-through">
                        ₹{prod.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] text-[#E87A90] font-semibold">In stock</span>
                </div>

                <a
                  href={prod.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-[#1C1917] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#0284C7] active:scale-95 transition-all shadow-2xs"
                >
                  <span>Shop Now</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
