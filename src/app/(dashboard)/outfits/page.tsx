'use client';

import React from 'react';
import Link from 'next/link';
import {
  Layers,
  Heart,
  Trash2,
  Eye,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';

export default function MyOutfitsPage() {
  const { savedOutfits, deleteOutfit, toggleOutfitFavorite, openTryOn } = useOutfitStore();
  const { setSelectedItem } = useWardrobeStore();
  const [wornOutfitId, setWornOutfitId] = React.useState<string | null>(null);

  const handleWearThis = (id: string) => {
    setWornOutfitId(id);
    setTimeout(() => setWornOutfitId(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D6] pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
            My Outfits
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
            Your saved capsules, occasion ensembles, and favorite combinations. ({savedOutfits.length} saved)
          </p>
        </div>

        <Link
          href="/occasions"
          className="inline-flex items-center gap-2 rounded-xl bg-[#B4533C] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span>Generate New Looks</span>
        </Link>
      </div>

      {savedOutfits.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-12 text-center space-y-4 card-shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-[#B4533C]">
            <Layers className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
            No saved outfits yet.
          </h3>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mx-auto">
            Explore the Occasion Stylist or check Today&apos;s Look on the dashboard to start saving your favorite looks.
          </p>
          <div className="pt-2">
            <Link
              href="/occasions"
              className="inline-flex items-center gap-2 rounded-xl bg-[#B4533C] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-colors"
            >
              <span>Explore Occasions</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedOutfits.map((outfit) => (
            <div
              key={outfit.id}
              className="rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-sm card-shadow flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#FAF8F5] border border-[#E7E0D6] px-3 py-1 text-[11px] font-semibold text-[#1C1917]">
                    {outfit.occasion}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleOutfitFavorite(outfit.id)}
                      className="p-1.5 rounded-full text-[#78716C] hover:text-[#B4533C]"
                      title="Favorite outfit"
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          outfit.favorite ? 'fill-[#B4533C] text-[#B4533C]' : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => deleteOutfit(outfit.id)}
                      className="p-1.5 rounded-full text-[#78716C] hover:text-red-600"
                      title="Delete outfit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#1C1917]">{outfit.name}</h3>
                <p className="text-xs text-[#57534E] leading-relaxed">{outfit.reason}</p>

                {/* Garments Visual Strip */}
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#78716C]">
                    Garments ({outfit.items.length})
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {outfit.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className="group shrink-0 w-20 rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-1.5 cursor-pointer hover:border-[#B4533C] transition-all"
                        title={item.name}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-full rounded-lg object-cover mb-1"
                        />
                        <p className="text-[10px] font-bold text-[#1C1917] truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions: Wear This, Try on, Shop missing */}
              <div className="pt-3 border-t border-[#E7E0D6] space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleWearThis(outfit.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#1C1917] py-2.5 text-xs font-semibold text-white hover:bg-[#B4533C] transition-colors"
                  >
                    {wornOutfitId === outfit.id ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-[#C5A059]" />
                        <span>Logged as Worn!</span>
                      </>
                    ) : (
                      <span>Wear This Today</span>
                    )}
                  </button>

                  <button
                    onClick={() => openTryOn(outfit)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-[#E7E0D6] bg-white py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <Eye className="h-4 w-4 text-[#78716C]" />
                    <span>See It on You</span>
                  </button>
                </div>

                <Link
                  href="/shopping"
                  className="block text-center text-[11px] font-semibold text-[#B4533C] hover:underline pt-1"
                >
                  Shop missing capsule items →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
