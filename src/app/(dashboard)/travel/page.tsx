'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plane,
  Calendar,
  Sparkles,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ExternalLink,
  ShoppingBag,
  ArrowRight,
  Sun,
  ShieldCheck,
  RefreshCw,
  Repeat,
  Ban,
  Luggage,
  Check,
  Layers,
  Eye,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTravelStore } from '@/store/useTravelStore';
import { useOutfitStore } from '@/store/useOutfitStore';
import { weatherService } from '@/services/weatherService';
import { Card3D } from '@/components/ui/Card3D';
import { JourneyTimelineStepper } from '@/components/ui/JourneyTimelineStepper';
import { POPULAR_DESTINATIONS } from '@/data/mockDestinations';
import { WardrobeItem } from '@/types';

interface CustomItineraryDay {
  dayNumber: number;
  title: string;
  activities: string[];
}

interface TravelOutfitPlan {
  dayNumber: number;
  themeTitle: string;
  top: { name: string; image: string; tag: string };
  bottom: { name: string; image: string; tag: string };
  shoes: { name: string; image: string; tag: string };
  accessories: { name: string; image: string; tag: string };
  reason: string;
}

export default function TravelPlannerPage() {
  const { items, setSelectedItem } = useWardrobeStore();
  const { user } = useAuthStore();
  const { openTryOn } = useOutfitStore();
  const { togglePackingItem, addPackingItem, removePackingItem } = useTravelStore();

  const [destination, setDestination] = useState('Jaipur');
  const [startDate, setStartDate] = useState('2026-11-12');
  const [endDate, setEndDate] = useState('2026-11-15');
  const [isGenerating, setIsGenerating] = useState(false);
  const [weatherForecast, setWeatherForecast] = useState<any>(null);
  const [activeStepperDay, setActiveStepperDay] = useState<number>(1);

  // Custom multi-day itinerary builder
  const [itineraryDays, setItineraryDays] = useState<CustomItineraryDay[]>([
    {
      dayNumber: 1,
      title: 'City sightseeing',
      activities: ['City sightseeing', 'Hawa Mahal exploration', 'Local market walk'],
    },
    {
      dayNumber: 2,
      title: 'Fort visit & Dinner',
      activities: ['Amber Fort visit', 'Heritage courtyards', 'Rooftop fine dinner'],
    },
    {
      dayNumber: 3,
      title: 'Shopping & Café',
      activities: ['Textile bazaar shopping', 'Specialty café hopping', 'Sunset terrace'],
    },
  ]);

  // Selected activities chips
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'City sightseeing',
    'Fort visit',
    'Dinner',
    'Shopping',
    'Café',
  ]);

  // Generated Result state
  const [hasGeneratedPlan, setHasGeneratedPlan] = useState(true);
  const [generatedDayOutfits, setGeneratedDayOutfits] = useState<TravelOutfitPlan[]>([
    {
      dayNumber: 1,
      themeTitle: 'DAY 1 — CITY EXPLORATION',
      top: {
        name: 'White Oversized Tee',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        tag: 'WHITE · CASUAL · OVERSIZED',
      },
      bottom: {
        name: 'Blue Straight Jeans',
        image: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
        tag: 'BLUE · DENIM · STRAIGHT',
      },
      shoes: {
        name: 'White Sneakers',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        tag: 'WHITE · LEATHER · LOW-TOP',
      },
      accessories: {
        name: 'Watch + Sunglasses',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
        tag: 'METALLIC · MINIMAL · UV-PROTECT',
      },
      reason: 'Comfortable for walking while matching your casual style.',
    },
    {
      dayNumber: 2,
      themeTitle: 'DAY 2 — DINNER & FORT VISIT',
      top: {
        name: 'Black Shirt',
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
        tag: 'BLACK · COTTON · RELAXED',
      },
      bottom: {
        name: 'Beige Trousers',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
        tag: 'BEIGE · CHINO · TAILORED',
      },
      shoes: {
        name: 'Loafers',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&auto=format&fit=crop&q=80',
        tag: 'BROWN · SUEDE · SLIP-ON',
      },
      accessories: {
        name: 'Minimal Watch',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
        tag: 'LEATHER STRAP · TIMEPIECE',
      },
      reason: 'Sophisticated contrast tailored for heritage evening dining and fort courtyards.',
    },
    {
      dayNumber: 3,
      themeTitle: 'DAY 3 — SHOPPING & CAFÉ',
      top: {
        name: 'Linen Mandarin Kurta',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
        tag: 'IVORY · LINEN · BREATHABLE',
      },
      bottom: {
        name: 'Beige Trousers (Reused)',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
        tag: 'BEIGE · CHINO · VERSATILE',
      },
      shoes: {
        name: 'White Sneakers',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
        tag: 'WHITE · LEATHER · COMFORT',
      },
      accessories: {
        name: 'Canvas Tote + Sunglasses',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
        tag: 'TOTE · CASUAL · ACCESSORY',
      },
      reason: 'Breathable linen comfort ideal for bazaar shopping and warm afternoon café terraces.',
    },
  ]);

  // Smart Packing list
  const [packingChecklist, setPackingChecklist] = useState<{ id: string; name: string; isPacked: boolean; category: string }[]>([
    { id: 'p1', name: 'White Oversized Tee', isPacked: true, category: 'Clothing' },
    { id: 'p2', name: 'Black Shirt', isPacked: true, category: 'Clothing' },
    { id: 'p3', name: 'Linen Mandarin Kurta', isPacked: false, category: 'Clothing' },
    { id: 'p4', name: 'Blue Straight Jeans', isPacked: true, category: 'Clothing' },
    { id: 'p5', name: 'Beige Trousers', isPacked: true, category: 'Clothing' },
    { id: 'p6', name: 'Tailored Linen Blazer', isPacked: false, category: 'Clothing' },
    { id: 'p7', name: 'White Sneakers', isPacked: true, category: 'Shoes' },
    { id: 'p8', name: 'Brown Suede Loafers', isPacked: false, category: 'Shoes' },
    { id: 'p9', name: 'Minimal Watch', isPacked: true, category: 'Accessories' },
    { id: 'p10', name: 'UV Protection Sunglasses', isPacked: true, category: 'Accessories' },
    { id: 'p11', name: 'Canvas Shopping Tote', isPacked: false, category: 'Accessories' },
  ]);

  // Fetch destination weather
  useEffect(() => {
    weatherService.getWeatherForCity(destination).then((res) => {
      setWeatherForecast(res);
    });
  }, [destination]);

  const togglePackingCheck = (id: string) => {
    setPackingChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPacked: !item.isPacked } : item))
    );
  };

  const handleAddDay = () => {
    const nextNum = itineraryDays.length + 1;
    setItineraryDays([
      ...itineraryDays,
      {
        dayNumber: nextNum,
        title: `Day ${nextNum} Exploration`,
        activities: ['Leisure excursion', 'Local cuisine'],
      },
    ]);
  };

  const handleRemoveDay = (index: number) => {
    if (itineraryDays.length <= 1) return;
    setItineraryDays(itineraryDays.filter((_, i) => i !== index));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setHasGeneratedPlan(true);
    }, 1000);
  };

  const availableActivities = [
    'City sightseeing',
    'Fort visit',
    'Dinner',
    'Shopping',
    'Café',
    'Heritage Walk',
    'Museum',
    'Photography',
    'Brunch',
    'Desert Safari',
    'Cocktails',
  ];

  const toggleActivityChip = (act: string) => {
    if (selectedActivities.includes(act)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== act));
    } else {
      setSelectedActivities([...selectedActivities, act]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. EDITORIAL HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E0D6] pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#B4533C]/10 px-3 py-1 text-xs font-bold text-[#B4533C] uppercase tracking-wider">
            <Plane className="h-3.5 w-3.5" />
            <span>Core USP • Intelligent Travel Stylist</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#1C1917]">
            Pack Smarter.
          </h1>
          <p className="text-base sm:text-lg text-[#57534E] font-sans">
            Let your wardrobe plan the trip.
          </p>
        </div>

        {weatherForecast && (
          <div className="flex items-center gap-3 bg-white border border-[#E7E0D6] rounded-2xl p-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1C1917]">
                {destination} Weather
              </p>
              <p className="text-[11px] text-[#78716C]">
                {weatherForecast.temperatureCelsius}°C • {weatherForecast.condition}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. TRIP CONFIGURATION & ITINERARY BUILDER */}
      <form
        onSubmit={handleGenerate}
        className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
              Destination
            </label>
            <div className="flex items-center rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 focus-within:border-[#B4533C] focus-within:bg-white">
              <Plane className="h-4 w-4 text-[#B4533C] mr-2.5 shrink-0" />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Jaipur, Florence, Tokyo..."
                className="w-full bg-transparent text-sm font-bold text-[#1C1917] focus:outline-hidden"
              />
            </div>

            {/* Quick destination chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {['Jaipur', 'Goa', 'Paris', 'Tokyo', 'Mumbai', 'Udaipur'].map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => setDestination(city)}
                  className={`text-[10px] px-2.5 py-1 rounded-full border transition-all ${
                    destination.toLowerCase() === city.toLowerCase()
                      ? 'border-[#B4533C] bg-[#B4533C] text-white font-bold'
                      : 'border-[#E7E0D6] bg-white text-[#57534E] hover:border-[#D5CCC0]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Travel Dates */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
              Travel Dates
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] text-[#78716C] block mb-1">Start Date</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#78716C] block mb-1">End Date</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Packing Philosophy */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
              Capsule Strategy
            </label>
            <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-3 text-xs text-[#57534E] space-y-1">
              <p className="font-bold text-[#1C1917] flex items-center gap-1.5">
                <Repeat className="h-4 w-4 text-[#B4533C]" />
                <span>Maximized Capsule Reuse</span>
              </p>
              <p className="text-[11px] text-[#78716C]">
                Calculates repeated bottoms & outerwear pairings to keep your luggage ultra-light.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic Itinerary Section */}
        <div className="space-y-4 border-t border-[#E7E0D6] pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                Trip Itinerary (Day-by-Day)
              </h3>
              <p className="text-xs text-[#78716C]">
                Specify planned occasions and destinations per day for contextual styling.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddDay}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#E7E0D6] bg-white px-3 py-1.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5]"
            >
              <Plus className="h-3.5 w-3.5 text-[#B4533C]" />
              <span>+ Add Day</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {itineraryDays.map((d, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-4 space-y-2.5 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#B4533C]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#B4533C]">
                    Day {d.dayNumber}
                  </span>
                  {itineraryDays.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveDay(idx)}
                      className="text-[#78716C] hover:text-red-600 transition-colors"
                      title="Remove day"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  value={d.title}
                  onChange={(e) => {
                    const updated = [...itineraryDays];
                    updated[idx].title = e.target.value;
                    setItineraryDays(updated);
                  }}
                  className="w-full bg-white rounded-xl border border-[#E7E0D6] px-3 py-1.5 text-xs font-bold text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
                />

                <p className="text-[11px] text-[#78716C]">
                  {d.activities.join(' • ')}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Multi-selection */}
        <div className="space-y-2 border-t border-[#E7E0D6] pt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
            Trip Activities & Excursions
          </label>
          <div className="flex flex-wrap gap-2">
            {availableActivities.map((act) => {
              const isSelected = selectedActivities.includes(act);
              return (
                <button
                  key={act}
                  type="button"
                  onClick={() => toggleActivityChip(act)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'border-[#B4533C] bg-[#B4533C] text-white shadow-xs'
                      : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:border-[#D5CCC0] hover:bg-white'
                  }`}
                >
                  {act}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-2 border-t border-[#E7E0D6]">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-8 py-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-all"
          >
            <Sparkles className="h-4 w-4" />
            <span>
              {isGenerating ? 'Synthesizing Capsule...' : `Generate ${destination} Wardrobe Plan`}
            </span>
          </button>
        </div>
      </form>

      {/* 3. TRAVEL AI RESULT — DAY-WISE OUTFIT CARDS */}
      {hasGeneratedPlan && (
        <section className="space-y-8 animate-in fade-in">
          <div className="border-b border-[#E7E0D6] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
              AI Stylist Result
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] mt-1">
              Your {destination} Wardrobe Plan
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-1">
              Curated day-wise ensembles crafted from your existing wardrobe to minimize luggage bulk.
            </p>
          </div>

          {/* 21st.dev Interactive Journey Timeline Stepper */}
          <JourneyTimelineStepper
            days={itineraryDays.map((d) => ({
              dayNumber: d.dayNumber,
              title: d.title,
              activitiesCount: d.activities.length,
              highlightTheme: d.activities[0] || 'Activities & Sights',
            }))}
            activeDay={activeStepperDay}
            onSelectDay={(dayNum) => setActiveStepperDay(dayNum)}
            destinationName={destination}
          />

          {/* Day-Wise Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {generatedDayOutfits.map((outfit) => (
              <div
                key={outfit.dayNumber}
                className={`rounded-3xl bg-white border p-6 shadow-md card-shadow flex flex-col justify-between space-y-5 transition-all duration-300 ${
                  activeStepperDay === outfit.dayNumber
                    ? 'border-[#B4533C] ring-2 ring-[#B4533C]/20 shadow-xl'
                    : 'border-[#E7E0D6] opacity-90 hover:opacity-100'
                }`}
              >
                <div className="space-y-4">
                  {/* Day Header Badge */}
                  <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                      {outfit.themeTitle}
                    </h3>
                    <span className="text-xs font-bold text-[#5F6F52] bg-[#5F6F52]/10 px-2 py-0.5 rounded-full">
                      Ready
                    </span>
                  </div>

                  {/* Garment Breakdown */}
                  <div className="space-y-3">
                    {/* Top */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6]">
                      <img
                        src={outfit.top.image}
                        alt={outfit.top.name}
                        className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#E7E0D6]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                          Top
                        </span>
                        <p className="text-xs font-bold text-[#1C1917] truncate">
                          {outfit.top.name}
                        </p>
                        <p className="text-[9px] text-[#78716C] truncate mt-0.5">
                          {outfit.top.tag}
                        </p>
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6]">
                      <img
                        src={outfit.bottom.image}
                        alt={outfit.bottom.name}
                        className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#E7E0D6]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                          Bottom
                        </span>
                        <p className="text-xs font-bold text-[#1C1917] truncate">
                          {outfit.bottom.name}
                        </p>
                        <p className="text-[9px] text-[#78716C] truncate mt-0.5">
                          {outfit.bottom.tag}
                        </p>
                      </div>
                    </div>

                    {/* Shoes */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6]">
                      <img
                        src={outfit.shoes.image}
                        alt={outfit.shoes.name}
                        className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#E7E0D6]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                          Shoes
                        </span>
                        <p className="text-xs font-bold text-[#1C1917] truncate">
                          {outfit.shoes.name}
                        </p>
                        <p className="text-[9px] text-[#78716C] truncate mt-0.5">
                          {outfit.shoes.tag}
                        </p>
                      </div>
                    </div>

                    {/* Accessories */}
                    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6]">
                      <img
                        src={outfit.accessories.image}
                        alt={outfit.accessories.name}
                        className="h-12 w-12 rounded-xl object-cover shrink-0 border border-[#E7E0D6]"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] block">
                          Accessories
                        </span>
                        <p className="text-xs font-bold text-[#1C1917] truncate">
                          {outfit.accessories.name}
                        </p>
                        <p className="text-[9px] text-[#78716C] truncate mt-0.5">
                          {outfit.accessories.tag}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reason Callout */}
                  <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-3.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4533C] block">
                      Reason
                    </span>
                    <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                      &ldquo;{outfit.reason}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Card footer action */}
                <div className="pt-2 border-t border-[#F4EFEA]">
                  <button
                    onClick={() => {
                      // Trigger virtual try-on simulation
                      openTryOn({
                        id: `outfit-travel-${outfit.dayNumber}`,
                        userId: user?.id || 'demo',
                        name: outfit.themeTitle,
                        items: items.slice(0, 3),
                        occasion: 'Travel',
                        style: 'Capsule',
                        saved: true,
                        favorite: false,
                        generatedByAI: true,
                        reason: outfit.reason,
                        createdAt: new Date().toISOString(),
                      });
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#E7E0D6] py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <Eye className="h-4 w-4 text-[#78716C]" />
                    <span>See Look on Avatar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. SMART PACKING DASHBOARD (PACK, REUSE, SKIP, MISSING) */}
          <div className="space-y-6 pt-6">
            <div className="border-b border-[#E7E0D6] pb-3">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#5F6F52]">
                Luggage Optimization
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#1C1917]">
                Smart Packing Dashboard
              </h2>
              <p className="text-xs sm:text-sm text-[#57534E]">
                Capsule reuse analytics to travel light with high styling versatility.
              </p>
            </div>

            {/* 4 Core Prominent Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1: 🧳 PACK */}
              <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-md card-shadow space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#5F6F52]/10 text-[#5F6F52]">
                  <Luggage className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] block">
                    Total In Suitcase
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-0.5">
                    PACK
                  </h3>
                </div>

                <div className="space-y-1.5 border-t border-[#F4EFEA] pt-3 text-xs font-bold text-[#1C1917]">
                  <div className="flex justify-between">
                    <span>Clothing Items</span>
                    <span className="text-[#B4533C]">6</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shoes</span>
                    <span className="text-[#B4533C]">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessories</span>
                    <span className="text-[#B4533C]">3</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#78716C]">
                  Optimized for a 50cm carry-on overhead cabin bag.
                </p>
              </div>

              {/* Card 2: 🔄 REUSE */}
              <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-md card-shadow space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B4533C]/10 text-[#B4533C]">
                  <Repeat className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] block">
                    Capsule Harmony
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-0.5">
                    REUSE
                  </h3>
                </div>

                <div className="rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6] p-3 text-xs text-[#1C1917] font-semibold leading-relaxed">
                  &ldquo;Your beige trousers work with 3 outfits.&rdquo;
                </div>
                <p className="text-[10px] text-[#78716C]">
                  Neutral bottom pairings eliminate packing 2 unnecessary trousers.
                </p>
              </div>

              {/* Card 3: 🚫 SKIP */}
              <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-md card-shadow space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-700">
                  <Ban className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] block">
                    Weight Saver
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-0.5">
                    SKIP
                  </h3>
                </div>

                <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3 text-xs text-amber-900 font-semibold leading-relaxed">
                  &ldquo;You don&apos;t need to pack another pair of sneakers.&rdquo;
                </div>
                <p className="text-[10px] text-[#78716C]">
                  White low-top sneakers comfortably transition between sightseeing and casual dining.
                </p>
              </div>

              {/* Card 4: ✨ MISSING */}
              <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-md card-shadow space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C5A059]/10 text-[#C5A059]">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#78716C] block">
                    Capsule Completion
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#1C1917] mt-0.5">
                    MISSING
                  </h3>
                </div>

                <div className="rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6] p-3 text-xs text-[#1C1917] font-semibold leading-relaxed">
                  &ldquo;You may want one lightweight overshirt.&rdquo;
                </div>
                <Link
                  href="/recommendations"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B4533C] hover:underline"
                >
                  <span>View Curation</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Interactive Packing Checklist */}
            <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E7E0D6] pb-4">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                    Luggage Packing Checklist
                  </h3>
                  <p className="text-xs text-[#78716C]">
                    Check items off as you place them into your travel bag.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#E7E0D6] px-3.5 py-1.5 rounded-full text-xs font-bold text-[#1C1917]">
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F52]" />
                  <span>
                    {packingChecklist.filter((i) => i.isPacked).length} of {packingChecklist.length} Packed
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {packingChecklist.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => togglePackingCheck(item.id)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      item.isPacked
                        ? 'border-[#5F6F52]/40 bg-[#5F6F52]/5 text-[#57534E]'
                        : 'border-[#E7E0D6] bg-[#FAF8F5] hover:bg-white text-[#1C1917]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.isPacked ? (
                        <CheckCircle2 className="h-4 w-4 text-[#5F6F52] shrink-0" />
                      ) : (
                        <Circle className="h-4 w-4 text-[#78716C] shrink-0" />
                      )}
                      <span
                        className={`text-xs font-medium truncate ${
                          item.isPacked ? 'line-through text-[#78716C]' : ''
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>

                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#78716C] bg-white px-2 py-0.5 rounded-md border border-[#E7E0D6] shrink-0">
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
