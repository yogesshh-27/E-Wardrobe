'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Shirt, Layers, Eye, ArrowRight } from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useOutfitStore } from '@/store/useOutfitStore';

export default function FavoritesPage() {
  const { items, setSelectedItem, toggleFavorite } = useWardrobeStore();
  const { savedOutfits, toggleOutfitFavorite, openTryOn } = useOutfitStore();

  const [activeTab, setActiveTab] = useState<'all' | 'garments' | 'outfits'>('all');

  const favoriteItems = items.filter((i) => i.favorite);
  const favoriteOutfits = savedOutfits.filter((o) => o.favorite);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
            Favorites
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
            Your most loved wardrobe pieces and curated outfits in one place.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl border border-[#E2E8F0] bg-white p-1 shadow-2xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-[#0284C7] text-white shadow-2xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            All ({favoriteItems.length + favoriteOutfits.length})
          </button>
          <button
            onClick={() => setActiveTab('garments')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'garments'
                ? 'bg-[#0284C7] text-white shadow-2xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Garments ({favoriteItems.length})
          </button>
          <button
            onClick={() => setActiveTab('outfits')}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'outfits'
                ? 'bg-[#0284C7] text-white shadow-2xs'
                : 'text-[#57534E] hover:text-[#1C1917]'
            }`}
          >
            Outfits ({favoriteOutfits.length})
          </button>
        </div>
      </div>

      {favoriteItems.length === 0 && favoriteOutfits.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-12 text-center space-y-4 card-shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-[#0284C7]">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
            No favorites saved yet.
          </h3>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mx-auto">
            Click the heart icon on any wardrobe garment or styled look to pin it to your favorites.
          </p>
          <div className="pt-2">
            <Link
              href="/wardrobe"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0284C7] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#0369A1] transition-colors"
            >
              <span>Explore Wardrobe</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Favorite Garments Section */}
          {(activeTab === 'all' || activeTab === 'garments') && favoriteItems.length > 0 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-[#1C1917]">
                <Shirt className="h-5 w-5 text-[#0284C7]" />
                Favorite Garments ({favoriteItems.length})
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {favoriteItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="group rounded-3xl border border-[#E2E8F0] bg-white p-3 card-shadow card-shadow-hover cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] mb-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-[#0284C7]"
                      >
                        <Heart className="h-3.5 w-3.5 fill-[#0284C7]" />
                      </button>
                    </div>
                    <h4 className="text-xs font-bold text-[#1C1917] truncate">{item.name}</h4>
                    <p className="text-[10px] text-[#78716C]">{item.color} • {item.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Outfits Section */}
          {(activeTab === 'all' || activeTab === 'outfits') && favoriteOutfits.length > 0 && (
            <div className="space-y-4">
              <h2 className="flex items-center gap-2 font-serif text-2xl font-bold text-[#1C1917]">
                <Layers className="h-5 w-5 text-[#0284C7]" />
                Favorite Outfits ({favoriteOutfits.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {favoriteOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="rounded-3xl border border-[#E2E8F0] bg-white p-5 card-shadow space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#FAF8F5] px-2.5 py-1 text-[10px] font-semibold text-[#1C1917]">
                          {outfit.occasion}
                        </span>
                        <button
                          onClick={() => toggleOutfitFavorite(outfit.id)}
                          className="p-1 text-[#0284C7]"
                        >
                          <Heart className="h-4 w-4 fill-[#0284C7]" />
                        </button>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#1C1917] mt-2">
                        {outfit.name}
                      </h4>
                      <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
                        {outfit.items.map((i) => (
                          <img
                            key={i.id}
                            src={i.image}
                            alt={i.name}
                            className="h-12 w-12 rounded-lg object-cover border border-[#E2E8F0]"
                          />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => openTryOn(outfit)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] py-2 text-xs font-semibold text-[#1C1917] hover:bg-white"
                    >
                      <Eye className="h-3.5 w-3.5 text-[#78716C]" />
                      <span>Virtual Try-On</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
