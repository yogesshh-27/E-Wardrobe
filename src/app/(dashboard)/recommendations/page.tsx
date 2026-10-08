'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Heart,
  Eye,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOutfitStore } from '@/store/useOutfitStore';
import { stylistService } from '@/services/stylistService';
import { productService } from '@/services/productService';
import { Outfit, ProductItem } from '@/types';

export default function RecommendationsPage() {
  const { items, setSelectedItem } = useWardrobeStore();
  const { user } = useAuthStore();
  const { saveOutfit, savedOutfits, openTryOn } = useOutfitStore();

  const [dailyLook, setDailyLook] = useState<{
    theme: string;
    outfit: Outfit;
    whyYoullLikeIt: string;
  } | null>(null);
  const [trendingProducts, setTrendingProducts] = useState<ProductItem[]>([]);
  const [alternateLooks, setAlternateLooks] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        stylistService.generateDailyLook({ wardrobe: items, userProfile: user }),
        stylistService.generateOccasionOutfits({
          occasion: 'Casual Outing',
          wardrobe: items,
          userProfile: user,
          desiredLook: 'Trendy',
        }),
        productService.getTrendingProducts(user.stylePreferences),
      ])
        .then(([daily, alternates, prods]) => {
          setDailyLook(daily);
          setAlternateLooks(alternates);
          setTrendingProducts(prods.slice(0, 4));
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, items]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E0D6] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          For You • AI Recommendations
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          Styles, daily inspirations, and missing capsule pieces calibrated directly to your preferences.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-12 text-center card-shadow space-y-3">
          <Sparkles className="h-6 w-6 text-[#B4533C] animate-spin mx-auto" />
          <p className="text-xs text-[#78716C]">Synthesizing personalized style recommendations...</p>
        </div>
      ) : (
        <>
          {/* Hero: Today's Curated Look */}
          {dailyLook && (
            <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-10 card-shadow space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E0D6] pb-4">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-[#B4533C]/10 px-3 py-1 text-xs font-bold text-[#B4533C] uppercase tracking-wider">
                    Today&apos;s Look
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                    {dailyLook.theme}
                  </h2>
                </div>
                <span className="text-xs text-[#78716C]">
                  Refreshed today • Based on your wardrobe inventory
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Outfit Items Thumbnails */}
                <div className="lg:col-span-7 flex gap-4 overflow-x-auto pb-2">
                  {dailyLook.outfit.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="shrink-0 w-36 sm:w-44 rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-3 cursor-pointer hover:border-[#B4533C] hover:shadow-md transition-all"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="aspect-square w-full rounded-xl object-cover mb-2"
                      />
                      <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
                      <p className="text-[10px] text-[#78716C]">{item.category}</p>
                    </div>
                  ))}
                </div>

                {/* Rationale & Actions */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                      Why You&apos;ll Like It
                    </p>
                    <p className="text-xs sm:text-sm text-[#57534E] mt-1.5 leading-relaxed">
                      {dailyLook.whyYoullLikeIt}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => saveOutfit(dailyLook.outfit)}
                      className="flex-1 rounded-xl bg-[#B4533C] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
                    >
                      Save to My Outfits
                    </button>
                    <button
                      onClick={() => openTryOn(dailyLook.outfit)}
                      className="flex-1 rounded-xl border border-[#E7E0D6] bg-white py-3 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                    >
                      Virtual Try-On
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Alternate Trending Looks */}
          {alternateLooks.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                Trending Combinations for Your Aesthetic
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alternateLooks.slice(0, 2).map((alt) => (
                  <div
                    key={alt.id}
                    className="rounded-3xl bg-white border border-[#E7E0D6] p-6 card-shadow space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#FAF8F5] px-3 py-1 text-xs font-semibold text-[#1C1917]">
                        {alt.style}
                      </span>
                      <button
                        onClick={() => saveOutfit(alt)}
                        className="text-xs font-semibold text-[#B4533C] hover:underline"
                      >
                        + Save Look
                      </button>
                    </div>

                    <h4 className="font-serif text-lg font-bold text-[#1C1917]">{alt.name}</h4>
                    <p className="text-xs text-[#57534E]">{alt.reason}</p>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {alt.items.map((i) => (
                        <img
                          key={i.id}
                          src={i.image}
                          alt={i.name}
                          onClick={() => setSelectedItem(i)}
                          className="h-14 w-14 rounded-xl object-cover border border-[#E7E0D6] cursor-pointer"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trending Products for Missing Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  Capsule Additions For You
                </h3>
                <p className="text-xs text-[#78716C]">
                  Pieces that expand styling combinations based on your wardrobe gaps
                </p>
              </div>
              <Link
                href="/shopping"
                className="text-xs font-semibold text-[#B4533C] hover:underline flex items-center gap-1"
              >
                <span>View All Recommendations</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {trendingProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl border border-[#E7E0D6] bg-white p-3 card-shadow card-shadow-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-2.5">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-[#B4533C] bg-[#B4533C]/10 px-2 py-0.5 rounded-full">
                      {p.platform}
                    </span>
                    <h4 className="text-xs font-bold text-[#1C1917] truncate mt-1.5">{p.name}</h4>
                    <p className="text-[11px] text-[#78716C] line-clamp-2 mt-0.5">{p.reason}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#F4EFEA] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#1C1917]">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-semibold text-[#B4533C] hover:underline"
                    >
                      <span>Shop Now</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
