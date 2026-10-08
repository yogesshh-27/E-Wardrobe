'use client';

import React, { useState, useEffect } from 'react';
import {
  Plane,
  Calendar,
  CloudSun,
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
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useTravelStore } from '@/store/useTravelStore';
import { locationService } from '@/services/locationService';
import { weatherService } from '@/services/weatherService';
import { stylistService } from '@/services/stylistService';
import { POPULAR_DESTINATIONS } from '@/data/mockDestinations';
import { PackingListItem } from '@/types';

const ACTIVITIES_LIST = [
  'Sightseeing',
  'Beach',
  'Hiking',
  'Shopping',
  'Dinner',
  'Party',
  'Business',
  'Religious visit',
  'Casual exploration',
  'Wedding',
  'Adventure',
];

const TRIP_STYLES = [
  'Relaxed',
  'Stylish',
  'Minimal luggage',
  'Fashion-focused',
  'Comfortable',
] as const;

export default function TravelPlannerPage() {
  const { items, setSelectedItem } = useWardrobeStore();
  const { user } = useAuthStore();
  const {
    currentTrip,
    setCurrentTrip,
    saveTrip,
    togglePackingItem,
    addPackingItem,
    removePackingItem,
  } = useTravelStore();

  const [destination, setDestination] = useState('Goa');
  const [destSuggestions, setDestSuggestions] = useState<any[]>([]);
  const [startDate, setStartDate] = useState('2026-11-10');
  const [endDate, setEndDate] = useState('2026-11-14');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    'Beach',
    'Dinner',
    'Casual exploration',
  ]);
  const [tripStyle, setTripStyle] = useState<typeof TRIP_STYLES[number]>('Minimal luggage');
  const [weatherForecast, setWeatherForecast] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newPackingName, setNewPackingName] = useState('');
  const [newPackingCategory, setNewPackingCategory] = useState<PackingListItem['category']>('Clothing');

  // Auto-fetch weather when destination changes
  useEffect(() => {
    weatherService.getWeatherForCity(destination).then((res) => {
      setWeatherForecast(res);
    });
  }, [destination]);

  // Destination autocomplete
  const handleDestinationInput = async (val: string) => {
    setDestination(val);
    const results = await locationService.searchDestinations(val);
    setDestSuggestions(results);
  };

  const toggleActivity = (act: string) => {
    if (selectedActivities.includes(act)) {
      setSelectedActivities(selectedActivities.filter((a) => a !== act));
    } else {
      setSelectedActivities([...selectedActivities, act]);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsGenerating(true);
    try {
      const trip = await stylistService.generateTravelWardrobe({
        destination,
        startDate,
        endDate,
        activities: selectedActivities,
        tripStyle,
        wardrobe: items,
        userProfile: user,
      });
      setCurrentTrip(trip);
      saveTrip(trip);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCustomPacking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackingName.trim()) return;
    addPackingItem(newPackingName.trim(), newPackingCategory);
    setNewPackingName('');
  };

  // Packing list stats
  const totalPacking = currentTrip?.packingList?.length || 0;
  const packedCount = currentTrip?.packingList?.filter((i) => i.isPacked).length || 0;
  const packedPercentage = totalPacking > 0 ? Math.round((packedCount / totalPacking) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E7E0D6] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          Travel Wardrobe Planner
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          Pack light, dress smart. AI creates day-by-day outfits and packing lists with intelligent capsule reuse.
        </p>
      </div>

      {/* Trip Configuration Form */}
      <form
        onSubmit={handleGenerate}
        className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Destination with Autocomplete */}
          <div className="relative">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
              Destination City
            </label>
            <div className="flex items-center rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 focus-within:border-[#B4533C] focus-within:bg-white">
              <Plane className="h-4 w-4 text-[#B4533C] mr-2 shrink-0" />
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationInput(e.target.value)}
                placeholder="e.g. Goa, Paris, Jaipur..."
                className="w-full bg-transparent text-xs font-bold text-[#1C1917] focus:outline-hidden"
              />
            </div>

            {/* Quick popular destination chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {POPULAR_DESTINATIONS.slice(0, 5).map((d) => (
                <button
                  key={d.city}
                  type="button"
                  onClick={() => setDestination(d.city)}
                  className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                    destination.toLowerCase() === d.city.toLowerCase()
                      ? 'border-[#B4533C] bg-[#B4533C]/10 text-[#B4533C] font-bold'
                      : 'border-[#E7E0D6] bg-white text-[#78716C]'
                  }`}
                >
                  {d.city}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
              Travel Dates
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-[#78716C] block mb-0.5">Start</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
                />
              </div>
              <div>
                <span className="text-[10px] text-[#78716C] block mb-0.5">End</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
                />
              </div>
            </div>
          </div>

          {/* Trip Style & Weather Pill */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
                Packing Philosophy
              </label>
              <select
                value={tripStyle}
                onChange={(e) => setTripStyle(e.target.value as any)}
                className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917]"
              >
                {TRIP_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            {weatherForecast && (
              <div className="rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold text-[#1C1917]">
                    {weatherForecast.condition} ({weatherForecast.temperatureCelsius}°C)
                  </span>
                </div>
                <span className="text-[10px] text-[#78716C] truncate max-w-[120px]">
                  {weatherForecast.description}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Activities Multi-select */}
        <div className="border-t border-[#E7E0D6] pt-5 space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block">
            Trip Activities & Excursions
          </label>
          <div className="flex flex-wrap gap-2">
            {ACTIVITIES_LIST.map((act) => {
              const isSelected = selectedActivities.includes(act);
              return (
                <button
                  key={act}
                  type="button"
                  onClick={() => toggleActivity(act)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSelected
                      ? 'border-[#B4533C] bg-[#B4533C] text-white shadow-2xs'
                      : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:bg-white'
                  }`}
                >
                  {act}
                </button>
              );
            })}
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
              {isGenerating ? 'Optimizing Capsule Wardrobe...' : 'Generate My Travel Wardrobe'}
            </span>
          </button>
        </div>
      </form>

      {/* Generated Travel Plan View (Section 12) */}
      {currentTrip && (
        <div className="space-y-10 animate-in fade-in">
          {/* Day-by-Day Outfit Plan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#1C1917]">
                  Day-by-Day Outfit Capsule for {currentTrip.destination}
                </h2>
                <p className="text-xs text-[#78716C]">
                  {currentTrip.generatedOutfits.length} curated day itineraries • Minimal luggage reuse strategy applied
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentTrip.generatedOutfits.map((day) => (
                <div
                  key={day.dayNumber}
                  className="rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-sm card-shadow flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Day Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-full bg-[#B4533C]/10 px-3 py-1 text-[11px] font-bold text-[#B4533C]">
                        {day.dateStr}
                      </span>
                      <span className="text-xs text-[#78716C]">{day.temperature}</span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                      {day.activityTitle}
                    </h3>
                    <p className="text-xs text-[#57534E] mb-3">{day.vibe}</p>

                    {/* Garments in this day */}
                    <div className="space-y-2 border-t border-[#F4EFEA] pt-3">
                      {[
                        { role: 'Top', item: day.top },
                        { role: 'Bottom', item: day.bottom },
                        { role: 'Footwear', item: day.footwear },
                        { role: 'Outerwear', item: day.outerwear },
                        { role: 'Accessory', item: day.accessories },
                      ]
                        .filter((x) => x.item)
                        .map((slot, sIdx) => (
                          <div
                            key={sIdx}
                            onClick={() => slot.item && setSelectedItem(slot.item)}
                            className="flex items-center justify-between p-2 rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] cursor-pointer hover:border-[#B4533C] transition-colors"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={slot.item!.image}
                                alt={slot.item!.name}
                                className="h-8 w-8 rounded-lg object-cover"
                              />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-[#1C1917] truncate">
                                  {slot.item!.name}
                                </p>
                                <p className="text-[9px] text-[#78716C]">{slot.role}</p>
                              </div>
                            </div>
                            <span className="text-[9px] font-semibold text-[#5F6F52] bg-[#5F6F52]/10 px-2 py-0.5 rounded-full shrink-0">
                              From Wardrobe
                            </span>
                          </div>
                        ))}
                    </div>

                    {/* Missing Suggestion if applicable */}
                    {day.missingSuggestion && (
                      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-2.5 space-y-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-900">
                          <ShoppingBag className="h-3 w-3 text-amber-700" />
                          <span>You May Want to Add:</span>
                        </div>
                        <p className="text-[10px] text-amber-800">
                          {day.missingSuggestion.name} — {day.missingSuggestion.reason}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Packing Checklist Section (Section 12) */}
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D6] pb-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
                  Smart Packing Checklist
                </h3>
                <p className="text-xs text-[#57534E]">
                  Track packed luggage items so you never forget a piece.
                </p>
              </div>

              {/* Progress counter */}
              <div className="flex items-center gap-3 bg-[#FAF8F5] border border-[#E7E0D6] rounded-2xl px-4 py-2">
                <div className="text-right">
                  <p className="text-xs font-bold text-[#1C1917]">
                    {packedCount} of {totalPacking} Packed
                  </p>
                  <p className="text-[10px] text-[#78716C]">{packedPercentage}% completed</p>
                </div>
                <div className="h-8 w-8 rounded-full border-2 border-[#B4533C] flex items-center justify-center font-bold text-[10px] text-[#B4533C]">
                  {packedPercentage}%
                </div>
              </div>
            </div>

            {/* Checklist items by category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['Clothing', 'Footwear', 'Accessories', 'Toiletries'] as const).map((cat) => {
                const catItems = currentTrip.packingList.filter((i) => i.category === cat);
                if (catItems.length === 0) return null;

                return (
                  <div key={cat} className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C] border-b border-[#F4EFEA] pb-1.5">
                      {cat} ({catItems.length})
                    </h4>
                    <div className="space-y-2">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => togglePackingItem(item.id)}
                          className={`group flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                            item.isPacked
                              ? 'border-[#5F6F52]/30 bg-[#5F6F52]/5 text-[#57534E]'
                              : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#1C1917] hover:bg-white'
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
                              {item.name} {item.quantity && item.quantity > 1 ? `(x${item.quantity})` : ''}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePackingItem(item.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 text-[#78716C] hover:text-red-600 transition-opacity"
                            title="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Item to Packing List */}
            <form
              onSubmit={handleAddCustomPacking}
              className="border-t border-[#E7E0D6] pt-4 flex flex-col sm:flex-row items-center gap-3"
            >
              <input
                type="text"
                placeholder="Add custom packing item (e.g. Passport, Power Bank)..."
                value={newPackingName}
                onChange={(e) => setNewPackingName(e.target.value)}
                className="flex-1 w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
              />
              <select
                value={newPackingCategory}
                onChange={(e) => setNewPackingCategory(e.target.value as any)}
                className="w-full sm:w-auto rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
              >
                <option value="Clothing">Clothing</option>
                <option value="Footwear">Footwear</option>
                <option value="Accessories">Accessories</option>
                <option value="Toiletries">Toiletries</option>
              </select>
              <button
                type="submit"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-[#1C1917] px-4 py-2 text-xs font-semibold text-white hover:bg-[#B4533C] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Item</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
