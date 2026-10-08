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
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useOutfitStore } from '@/store/useOutfitStore';
import { stylistService } from '@/services/stylistService';
import { Outfit } from '@/types';

const OCCASIONS_LIST = [
  'Wedding',
  'Party',
  'Dandiya Night',
  'College Event',
  'Office',
  'Interview',
  'Date',
  'Dinner',
  'Festival',
  'Puja',
  'Family Function',
  'Birthday',
  'Casual Outing',
  'Beach',
  'Formal Event',
  'Business Meeting',
  'Other',
];

const LOOKS_LIST = [
  'Elegant',
  'Traditional',
  'Trendy',
  'Minimal',
  'Bold',
  'Comfortable',
  'Festive',
  'Classy',
  'Experimental',
];

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

  const [selectedOccasion, setSelectedOccasion] = useState('Dinner');
  const [customOccasion, setCustomOccasion] = useState('');
  const [venue, setVenue] = useState<'Indoor' | 'Outdoor'>('Indoor');
  const [timeOfDay, setTimeOfDay] = useState<'Morning' | 'Afternoon' | 'Evening' | 'Night'>('Evening');
  const [dressCode, setDressCode] = useState('Smart Casual');
  const [desiredLook, setDesiredLook] = useState('Elegant');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleStyleMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsGenerating(true);
    try {
      const results = await stylistService.generateOccasionOutfits({
        occasion: selectedOccasion,
        customOccasion: selectedOccasion === 'Other' ? customOccasion : undefined,
        venue,
        timeOfDay,
        dressCode,
        desiredLook,
        wardrobe: items,
        userProfile: user,
      });
      setGeneratedOutfits(results);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E0D6] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          Occasion Stylist
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          Curates 2-3 complete looks built from your wardrobe first, with color harmony, formality, and missing pieces.
        </p>
      </div>

      {/* Occasion Selection & Criteria Form */}
      <form
        onSubmit={handleStyleMe}
        className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-6"
      >
        {/* Step 1: What are you dressing for? */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
            1. What are you dressing for?
          </label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS_LIST.map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  selectedOccasion === occ
                    ? 'border-[#B4533C] bg-[#B4533C] text-white shadow-xs'
                    : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:border-[#D5CCC0] hover:bg-white'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>

          {selectedOccasion === 'Other' && (
            <div className="pt-2">
              <input
                type="text"
                placeholder="Enter custom occasion (e.g. Art Gallery Vernissage, High Tea)..."
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                autoFocus
                className="w-full sm:max-w-md rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
              />
            </div>
          )}
        </div>

        {/* Step 2: Customization parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#E7E0D6] pt-6">
          {/* Venue */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-[#78716C] block mb-1.5">
              Location / Venue
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Indoor', 'Outdoor'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVenue(v)}
                  className={`py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    venue === v
                      ? 'border-[#B4533C] bg-[#B4533C]/10 text-[#B4533C]'
                      : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-[#78716C] block mb-1.5">
              Time of Day
            </label>
            <select
              value={timeOfDay}
              onChange={(e) => setTimeOfDay(e.target.value as any)}
              className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
              <option value="Evening">Evening</option>
              <option value="Night">Night</option>
            </select>
          </div>

          {/* Dress code */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-[#78716C] block mb-1.5">
              Dress Code
            </label>
            <input
              type="text"
              value={dressCode}
              onChange={(e) => setDressCode(e.target.value)}
              placeholder="e.g. Smart Casual, Black Tie..."
              className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
            >
            </input>
          </div>

          {/* Desired Look */}
          <div>
            <label className="text-[11px] font-semibold uppercase text-[#78716C] block mb-1.5">
              Desired Aesthetic
            </label>
            <select
              value={desiredLook}
              onChange={(e) => setDesiredLook(e.target.value)}
              className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
            >
              {LOOKS_LIST.map((look) => (
                <option key={look} value={look}>
                  {look}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2 border-t border-[#E7E0D6]">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-8 py-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] disabled:opacity-50 transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isGenerating ? 'Curating Looks with AI...' : 'Style Me'}</span>
          </button>
        </div>
      </form>

      {/* AI Loading State */}
      {isGenerating && (
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-12 text-center card-shadow space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#B4533C]">
            <Sparkles className="h-7 w-7 animate-spin" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
            Your AI Stylist is Creating Your Look...
          </h3>
          <p className="text-xs text-[#57534E] max-w-sm mx-auto">
            Matching silhouettes, color palettes, and formality ratings from your wardrobe inventory.
          </p>
        </div>
      )}

      {/* Generated Outfits Results Grid (Section 13) */}
      {!isGenerating && generatedOutfits.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
              Curated Outfits for {selectedOccasion === 'Other' ? customOccasion : selectedOccasion}
            </h2>
            <span className="text-xs text-[#78716C]">
              {generatedOutfits.length} complete styling options
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {generatedOutfits.map((outfit, index) => {
              const isSaved = savedOutfits.some((s) => s.id === outfit.id);

              return (
                <div
                  key={outfit.id}
                  className="rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-sm card-shadow flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-4">
                    {/* Header badge */}
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#B4533C]/10 px-3 py-1 text-[11px] font-bold text-[#B4533C]">
                        Look 0{index + 1} • {outfit.style}
                      </span>
                      <span className="text-[10px] text-[#5F6F52] font-semibold bg-[#5F6F52]/10 px-2 py-0.5 rounded-full">
                        Wardrobe First
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                      {outfit.name}
                    </h3>

                    {/* Garments Visual Strip */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                        Ensemble Pieces ({outfit.items.length})
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {outfit.items.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => setSelectedItem(item)}
                            className="group flex items-center gap-2.5 p-2 rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] cursor-pointer hover:border-[#B4533C] transition-all"
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-10 w-10 rounded-lg object-cover border border-[#E7E0D6] shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="text-[11px] font-bold text-[#1C1917] truncate">
                                {item.name}
                              </p>
                              <p className="text-[10px] text-[#78716C] truncate">
                                {item.color} • {item.category}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missing Item Flag & Shopping Recommendations */}
                    {outfit.missingItems && outfit.missingItems.length > 0 && (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                          <ShoppingBag className="h-3.5 w-3.5 text-amber-700" />
                          <span>You May Want to Add:</span>
                        </div>
                        {outfit.missingItems.map((missing, mIdx) => (
                          <div key={mIdx} className="space-y-2">
                            <p className="text-[11px] text-amber-800">
                              {missing.suggestedName} — {missing.reason}
                            </p>
                            {/* Product pills */}
                            <div className="space-y-1.5 pt-1">
                              {missing.productRecommendations.slice(0, 1).map((prod) => (
                                <a
                                  key={prod.id}
                                  href={prod.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-between rounded-xl border border-amber-200 bg-white p-2 hover:bg-amber-50/50 transition-colors"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <img
                                      src={prod.imageUrl}
                                      alt={prod.name}
                                      className="h-8 w-8 rounded-lg object-cover"
                                    />
                                    <div className="min-w-0">
                                      <p className="text-[11px] font-bold text-[#1C1917] truncate">
                                        {prod.name}
                                      </p>
                                      <p className="text-[10px] text-[#B4533C] font-semibold">
                                        ₹{prod.price.toLocaleString('en-IN')} on {prod.platform}
                                      </p>
                                    </div>
                                  </div>
                                  <ExternalLink className="h-3.5 w-3.5 text-[#78716C] shrink-0 ml-2" />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* "Why this works" rationale (Section 13) */}
                    <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-3.5">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                        Why This Works
                      </p>
                      <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                        {outfit.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Try This Look / Save Outfit / Shop Missing */}
                  <div className="pt-3 border-t border-[#E7E0D6] space-y-2">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openTryOn(outfit)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#E7E0D6] bg-white py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                      >
                        <Eye className="h-4 w-4 text-[#78716C]" />
                        <span>Try This Look</span>
                      </button>

                      <button
                        onClick={() => saveOutfit(outfit)}
                        className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-colors ${
                          isSaved
                            ? 'bg-[#5F6F52] text-white shadow-2xs'
                            : 'bg-[#B4533C] text-white shadow-xs hover:bg-[#9E4530]'
                        }`}
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
                        <span>{isSaved ? 'Look Saved' : 'Save Outfit'}</span>
                      </button>
                    </div>

                    <Link
                      href="/shopping"
                      className="block text-center text-[11px] font-semibold text-[#B4533C] hover:underline pt-1"
                    >
                      Browse matching capsule pieces →
                    </Link>
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
