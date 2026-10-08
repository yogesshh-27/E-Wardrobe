'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plane,
  Camera,
  Compass,
  ArrowRight,
  Shirt,
  Calendar,
  Layers,
  Heart,
  Eye,
  Plus,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useTravelStore } from '@/store/useTravelStore';
import { stylistService } from '@/services/stylistService';
import { Outfit } from '@/types';

export default function DashboardHomePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { items, setSelectedItem } = useWardrobeStore();
  const { saveOutfit, openTryOn } = useOutfitStore();
  const { savedTrips } = useTravelStore();

  const [greeting, setGreeting] = useState('Good day');
  const [dailyLook, setDailyLook] = useState<{ theme: string; outfit: Outfit; whyYoullLikeIt: string } | null>(null);
  const [isLoadingDaily, setIsLoadingDaily] = useState(false);

  // Time-aware greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  // Fetch or generate Daily Look
  useEffect(() => {
    if (user && items.length > 0) {
      setIsLoadingDaily(true);
      stylistService
        .generateDailyLook({ wardrobe: items, userProfile: user })
        .then((res) => setDailyLook(res))
        .finally(() => setIsLoadingDaily(false));
    }
  }, [user, items]);

  const userName = user?.name ? user.name.split(' ')[0] : 'Stylist';
  const recentItems = items.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E0D6] pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#1C1917]">
            {greeting}, {userName}.
          </h1>
          <p className="text-sm sm:text-base text-[#57534E] mt-1.5 font-sans">
            What are you dressing for today?
          </p>
        </div>

        {/* Gentle Wardrobe Progress Nudge */}
        <div className="flex items-center gap-3 bg-white border border-[#E7E0D6] rounded-2xl px-4 py-2.5 shadow-xs w-fit">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FAF8F5] text-[#B4533C]">
            <Shirt className="h-4 w-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#1C1917]">
              {items.length} garments cataloged
            </p>
            <p className="text-[11px] text-[#78716C]">
              {items.length < 5
                ? 'Add 2 more items to unlock deeper styling harmony'
                : 'Your AI stylist has full capsule intelligence'}
            </p>
          </div>
        </div>
      </div>

      {/* Four Large Action Cards (Section 8) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Travel Planner */}
        <div className="group relative rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-sm card-shadow card-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#B4533C]/5 group-hover:bg-[#B4533C]/10 transition-colors" />
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#B4533C] mb-4 border border-[#E7E0D6]/60">
              <Plane className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Travel Planner
            </h3>
            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
              Plan outfits and packing with AI for any destination and climate.
            </p>
          </div>
          <Link
            href="/travel"
            className="mt-6 flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] group-hover:bg-[#B4533C] group-hover:text-white group-hover:border-[#B4533C] transition-all"
          >
            <span>Plan My Trip</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Card 2: Add to Wardrobe */}
        <div className="group relative rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-sm card-shadow card-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 transition-colors" />
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#C5A059] mb-4 border border-[#E7E0D6]/60">
              <Camera className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Add to Wardrobe
            </h3>
            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
              Upload your clothes one item at a time with AI auto-tagging.
            </p>
          </div>
          <Link
            href="/wardrobe/upload"
            className="mt-6 flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] group-hover:bg-[#B4533C] group-hover:text-white group-hover:border-[#B4533C] transition-all"
          >
            <span>Upload Item</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Card 3: Occasion Stylist */}
        <div className="group relative rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-sm card-shadow card-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#5F6F52]/10 group-hover:bg-[#5F6F52]/20 transition-colors" />
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#5F6F52] mb-4 border border-[#E7E0D6]/60">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Occasion Stylist
            </h3>
            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
              Get the perfect outfit for weddings, parties, offices, or casual dates.
            </p>
          </div>
          <Link
            href="/occasions"
            className="mt-6 flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] group-hover:bg-[#B4533C] group-hover:text-white group-hover:border-[#B4533C] transition-all"
          >
            <span>Style Me</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Card 4: For You */}
        <div className="group relative rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-sm card-shadow card-shadow-hover flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 rounded-full bg-[#B4533C]/10 group-hover:bg-[#B4533C]/20 transition-colors" />
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#B4533C] mb-4 border border-[#E7E0D6]/60">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              For You
            </h3>
            <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
              Discover outfits and pairings custom-selected for your style profile.
            </p>
          </div>
          <Link
            href="/recommendations"
            className="mt-6 flex items-center justify-between rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] px-4 py-2.5 text-xs font-semibold text-[#1C1917] group-hover:bg-[#B4533C] group-hover:text-white group-hover:border-[#B4533C] transition-all"
          >
            <span>View Recommendations</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Today's Look Teaser Section */}
      <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E0D6] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#B4533C]/10 px-3 py-1 text-xs font-bold text-[#B4533C] uppercase tracking-wider">
              Today&apos;s Look
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
              {dailyLook?.theme || 'Curated Daily Ensemble'}
            </h2>
          </div>
          <Link
            href="/recommendations"
            className="text-xs font-semibold text-[#B4533C] hover:underline flex items-center gap-1"
          >
            <span>Explore full style rationale</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {dailyLook ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Outfits Thumbnails Strip */}
            <div className="lg:col-span-7 flex gap-3 overflow-x-auto pb-2">
              {dailyLook.outfit.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group shrink-0 w-36 sm:w-40 rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-2.5 cursor-pointer hover:border-[#B4533C] hover:shadow-md transition-all"
                >
                  <div className="aspect-square rounded-xl overflow-hidden mb-2 bg-white">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
                  <p className="text-[10px] text-[#78716C]">{item.category}</p>
                </div>
              ))}
            </div>

            {/* Rationale & Actions */}
            <div className="lg:col-span-5 space-y-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
                  Why You&apos;ll Love It
                </p>
                <p className="text-xs sm:text-sm text-[#57534E] mt-1 leading-relaxed">
                  {dailyLook.whyYoullLikeIt}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => saveOutfit(dailyLook.outfit)}
                  className="flex-1 rounded-xl bg-[#B4533C] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
                >
                  Save Look
                </button>
                <button
                  onClick={() => openTryOn(dailyLook.outfit)}
                  className="flex-1 rounded-xl border border-[#E7E0D6] bg-white py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                >
                  Virtual Try-On
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-[#78716C]">
            Loading today&apos;s style recommendations...
          </div>
        )}
      </div>

      {/* Recent Wardrobe Items Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
              Recent Additions
            </h2>
            <p className="text-xs text-[#78716C]">
              Your most recently cataloged wardrobe garments
            </p>
          </div>
          <Link
            href="/wardrobe"
            className="text-xs font-semibold text-[#B4533C] hover:underline flex items-center gap-1"
          >
            <span>View All Wardrobe ({items.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {recentItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group rounded-2xl border border-[#E7E0D6] bg-white p-3 card-shadow card-shadow-hover cursor-pointer"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-[#FAF8F5] mb-2.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] text-[#78716C]">{item.color}</span>
                <span className="text-[10px] text-[#5F6F52] font-semibold">{item.formality}</span>
              </div>
            </div>
          ))}

          {/* Upload card slot */}
          <Link
            href="/wardrobe/upload"
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E7E0D6] bg-[#FAF8F5]/50 p-4 text-center hover:border-[#B4533C] hover:bg-white transition-all group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xs text-[#B4533C] group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-xs font-semibold text-[#1C1917] mt-2">
              Add New Item
            </span>
            <span className="text-[10px] text-[#78716C]">AI Vision Tagging</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
