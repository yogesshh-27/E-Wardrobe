'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MapPin,
  Clock,
  Sun,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Eye,
  Check,
  ArrowRight,
  ExternalLink,
  Layers,
  Scissors,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOutfitStore } from '@/store/useOutfitStore';
import { stylistService } from '@/services/stylistService';
import { Outfit } from '@/types';

const OCCASIONS_LIST = [
  'Dandiya Night',
  'Wedding',
  'College Event',
  'Date',
  'Interview',
  'Party',
  'Dinner',
  'Festival',
  'Casual Day',
];

const STYLES_LIST = [
  'Classic / Minimalist',
  'Modern Streetwear',
  'Traditional Heritage',
  'Indo-Western Fusion',
  'Old Money Quiet Luxury',
  'Trendy Runway',
  'Smart Casual',
];

const WEATHER_OPTIONS = ['Warm & Sunny', 'Breezy / Mild', 'Chilly / Winter', 'Monsoon / Humid'];

export default function OccasionsPage() {
  const { items, setSelectedItem } = useWardrobeStore();
  const { user } = useAuthStore();
  const {
    generatedOutfits,
    setGeneratedOutfits,
    saveOutfit,
    savedOutfits,
    openTryOn,
  } = useOutfitStore();

  const [selectedOccasion, setSelectedOccasion] = useState('Dandiya Night');
  const [customOccasion, setCustomOccasion] = useState('');
  const [dressCode, setDressCode] = useState('Festive Traditional');
  const [weatherCondition, setWeatherCondition] = useState('Warm & Sunny');
  const [preferredStyle, setPreferredStyle] = useState('Traditional Heritage');
  const [isGenerating, setIsGenerating] = useState(false);

  // Fallback complete look generation if wardrobe is small
  const handleStyleMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsGenerating(true);
    try {
      const results = await stylistService.generateOccasionOutfits({
        occasion: selectedOccasion === 'Other' ? customOccasion : selectedOccasion,
        dressCode,
        desiredLook: preferredStyle,
        wardrobe: items,
        userProfile: user,
      });
      setGeneratedOutfits(results);
    } finally {
      setIsGenerating(false);
    }
  };

  const hairstyles: Record<string, string> = {
    'Dandiya Night': 'Textured braided crown or side-swept locks decorated with subtle silver pins.',
    Wedding: 'Sleek low chignon or voluminous soft Hollywood waves with botanical accents.',
    'College Event': 'Textured messy quiff or casual half-up knot for effortless movement.',
    Date: 'Soft brushed waves with natural sheen or relaxed tapered fade.',
    Interview: 'Sharp side parting with low-shine matte styling cream for structured authority.',
    Party: 'Glossy slicked-back high ponytail or textured undone fade.',
    Dinner: 'Effortless middle-parted bob or clean combed pompadour.',
    Festival: 'Traditional fishtail braid with floral jasmine strands or classic groomed wave.',
    'Casual Day': 'Natural air-dried texture with light leave-in conditioning mist.',
  };

  const makeups: Record<string, string> = {
    'Dandiya Night': 'Winged kohl eyeliner, terracotta terracotta blush, and sweat-resistant matte nude lipstick.',
    Wedding: 'Warm gilded champagne eye shimmer, flushed rose cheeks, and deep berry-rose satin lip.',
    'College Event': 'Light BB hydration tint, brushed soap brows, and tinted berry lip balm.',
    Date: 'Soft smoked eyeliner, luminous cheekbone highlighter, and soft velvet rosewood lip.',
    Interview: 'Clean matte skin finish, groomed structured brows, and neutral velvet nude tint.',
    Party: 'Chic metallic bronze lids, sculpted cheekbones, and bold statement plum lip.',
    Dinner: 'Warm amber monochrome tones, defined lashes, and creamy spiced peach lip.',
    Festival: 'Subtle forehead bindi, golden highlight on brow bones, and classic red vermillion tint.',
    'Casual Day': 'Sunscreen tint, clear brow gel, and nourishing hydrating gloss.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <div className="border-b border-[#E7E0D6] pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#B4533C]/10 px-3 py-1 text-xs font-bold text-[#B4533C] uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Occasion Stylist Atelier</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          Occasion Stylist
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          Creates full looks prioritizing your existing wardrobe: Clothing + Shoes + Accessories + Hair + Makeup.
        </p>
      </div>

      {/* Occasion Selection & Input Controls */}
      <form
        onSubmit={handleStyleMe}
        className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-8"
      >
        {/* 1. What are you dressing for? */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
            What are you dressing for?
          </label>
          <div className="flex flex-wrap gap-2.5">
            {OCCASIONS_LIST.map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-semibold border transition-all ${
                  selectedOccasion === occ
                    ? 'border-[#B4533C] bg-[#B4533C] text-white shadow-xs scale-102'
                    : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:border-[#D5CCC0] hover:bg-white'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Dress Code, Weather, Preferred Style */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#E7E0D6] pt-6">
          {/* Dress Code */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
              Dress Code
            </label>
            <input
              type="text"
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
              placeholder="e.g. Smart Casual, Black Tie, Traditional..."
              className="w-full rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Weather */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
              Weather
            </label>
            <select
              value={weatherCondition}
              onChange={(e) => setWeatherCondition(e.target.value)}
              className="w-full rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
            >
              {WEATHER_OPTIONS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Style */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
              Preferred Style
            </label>
            <select
              value={preferredStyle}
              onChange={(e) => setPreferredStyle(e.target.value)}
              className="w-full rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
            >
              {STYLES_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-end pt-2 border-t border-[#E7E0D6]">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-8 py-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {isGenerating ? 'Curating Ensemble...' : `Generate Look for ${selectedOccasion}`}
            </span>
          </button>
        </div>
      </form>

      {/* Generated Looks Results */}
      {generatedOutfits.length > 0 && (
        <div className="space-y-8 animate-in fade-in">
          <div className="border-b border-[#E7E0D6] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
              Wardrobe-First Recommendations
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#1C1917] mt-0.5">
              Complete Looks for {selectedOccasion}
            </h2>
            <p className="text-xs text-[#57534E]">
              Harmonized using pieces from your digital wardrobe with hair and makeup advice.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {generatedOutfits.map((outfit, idx) => {
              const isSaved = savedOutfits.some((o) => o.id === outfit.id);
              const hairTip = hairstyles[selectedOccasion] || hairstyles['Dandiya Night'];
              const makeupTip = makeups[selectedOccasion] || makeups['Dandiya Night'];

              return (
                <div
                  key={outfit.id}
                  className="rounded-3xl bg-white border border-[#E7E0D6] p-7 shadow-lg card-shadow flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-4">
                      <div>
                        <span className="rounded-full bg-[#B4533C]/10 px-3 py-1 text-[11px] font-bold text-[#B4533C]">
                          Option {idx + 1} • {outfit.style}
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-1.5">
                          {outfit.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-[#5F6F52] bg-[#5F6F52]/10 px-2.5 py-1 rounded-full">
                        Wardrobe Prioritized
                      </span>
                    </div>

                    {/* COMPLETE LOOK BREAKDOWN */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#1C1917] flex items-center gap-1.5">
                        <Layers className="h-4 w-4 text-[#B4533C]" />
                        <span>COMPLETE LOOK</span>
                      </h4>

                      {/* Garment pieces list */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {outfit.items.map((garment) => (
                          <div
                            key={garment.id}
                            onClick={() => setSelectedItem(garment)}
                            className="flex items-center gap-3 p-2.5 rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] cursor-pointer hover:border-[#B4533C] transition-all"
                          >
                            <img
                              src={garment.image}
                              alt={garment.name}
                              className="h-11 w-11 rounded-xl object-cover border border-[#E7E0D6] shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#1C1917] truncate">
                                {garment.name}
                              </p>
                              <p className="text-[10px] text-[#78716C] truncate mt-0.5">
                                {garment.color} • {garment.category}
                              </p>
                            </div>
                            <span className="text-[9px] font-bold text-[#5F6F52] bg-[#5F6F52]/10 px-2 py-0.5 rounded-full shrink-0">
                              Owned
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hairstyle Suggestion */}
                    <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                        <Scissors className="h-4 w-4 text-[#B4533C]" />
                        <span>Hairstyle Suggestion</span>
                      </div>
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        {hairTip}
                      </p>
                    </div>

                    {/* Makeup Suggestion */}
                    <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-4 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#1C1917]">
                        <Palette className="h-4 w-4 text-[#C5A059]" />
                        <span>Optional Makeup & Grooming</span>
                      </div>
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        {makeupTip}
                      </p>
                    </div>

                    {/* Styling Reason */}
                    <div className="rounded-2xl border border-[#E7E0D6] p-4 bg-white space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                        Why This Works
                      </span>
                      <p className="text-xs text-[#57534E] leading-relaxed">
                        {outfit.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#E7E0D6] flex gap-3">
                    <button
                      onClick={() => openTryOn(outfit)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-2xl border border-[#E7E0D6] py-3 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                    >
                      <Eye className="h-4 w-4 text-[#78716C]" />
                      <span>See the Look (Try On)</span>
                    </button>

                    <button
                      onClick={() => saveOutfit(outfit)}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-semibold transition-all ${
                        isSaved
                          ? 'bg-[#5F6F52] text-white shadow-xs'
                          : 'bg-[#B4533C] text-white shadow-xs hover:bg-[#9E4530]'
                      }`}
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
                      <span>{isSaved ? 'Look Saved' : 'Save Complete Look'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
