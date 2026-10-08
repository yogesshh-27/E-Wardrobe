'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Plane,
  Compass,
  ArrowRight,
  Shirt,
  Heart,
  Plus,
  FolderPlus,
  Search,
  SlidersHorizontal,
  X,
  Camera,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useOutfitStore } from '@/store/useOutfitStore';
import { Card3D } from '@/components/ui/Card3D';
import { CinematicHeroBanner } from '@/components/ui/CinematicHeroBanner';
import { WardrobeItem } from '@/types';

export default function DashboardHomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    folders,
    createFolder,
    toggleFavorite,
    setSelectedItem,
  } = useWardrobeStore();
  const { openTryOn } = useOutfitStore();

  const [greeting, setGreeting] = useState('Good evening');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'favorite'>('recent');

  // New Folder Modal
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Time-aware greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const userName = user?.name ? user.name.split(' ')[0] : 'Stylist';

  // Filter & Sort Wardrobe Items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (selectedFolderId !== 'all' && item.folderId !== selectedFolderId) return false;
        if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(q);
          const matchColor = item.color.toLowerCase().includes(q);
          const matchCategory = item.category.toLowerCase().includes(q);
          const matchStyle = item.style.toLowerCase().includes(q);
          if (!matchName && !matchColor && !matchCategory && !matchStyle) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'favorite') {
          return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
        }
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, selectedFolderId, selectedCategory, searchQuery, sortBy]);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const categoriesList = ['All', 'T-Shirts', 'Shirts', 'Pants', 'Jeans', 'Jackets', 'Shoes', 'Accessories'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. GREETING & HERO SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E7E0D6] pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#B4533C]/10 px-3 py-1 text-xs font-bold text-[#B4533C] uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Personal Styling Atelier</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1C1917] leading-none">
            {greeting}, {userName}.
          </h1>

          <p className="text-base sm:text-lg text-[#57534E] font-sans">
            What are we styling today?
          </p>
        </div>

        {/* User Avatar & Capsule Pill */}
        <div className="flex items-center gap-4 bg-white border border-[#E7E0D6] rounded-3xl p-3 shadow-xs">
          <Link href="/profile" className="relative group">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name || 'Avatar'}
                className="h-14 w-14 rounded-2xl object-cover border border-[#E7E0D6] group-hover:border-[#B4533C] transition-colors"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6] flex flex-col items-center justify-center text-[#B4533C] group-hover:border-[#B4533C] transition-colors">
                <Camera className="h-5 w-5" />
                <span className="text-[9px] font-bold mt-0.5">Avatar</span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[#5F6F52] border-2 border-white" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#1C1917]">Personal Silhouette</span>
              <span className="text-[9px] uppercase tracking-wider font-semibold text-[#5F6F52] bg-[#5F6F52]/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-[#78716C] mt-0.5">
              {items.length} garments in digital rotation
            </p>
            <Link
              href="/style-profile"
              className="text-[11px] font-semibold text-[#B4533C] hover:underline flex items-center gap-1 mt-1"
            >
              <span>View Style DNA</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. CINEMATIC EDITORIAL RUNWAY HERO BANNER */}
      <CinematicHeroBanner />

      {/* 3. THREE LARGE INTERACTIVE 3D HERO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: ✈️ TRAVEL */}
        <Card3D depth={12} className="h-full">
          <Link
            href="/travel"
            className="group block h-full rounded-3xl bg-white border border-[#E7E0D6] p-7 shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden shimmer-card"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-28 w-28 rounded-full bg-[#B4533C]/5 group-hover:bg-[#B4533C]/12 transition-colors duration-500" />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#B4533C] border border-[#E7E0D6]/60 mb-5 group-hover:scale-110 transition-transform">
              <Plane className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#B4533C]">
                  Core USP • Feature
                </span>
                <span className="text-xs font-bold text-[#5F6F52] bg-[#5F6F52]/10 px-2.5 py-0.5 rounded-full">
                  Day-Wise
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917] group-hover:text-[#B4533C] transition-colors">
                ✈️ TRAVEL
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                &ldquo;Plan outfits for your next trip.&rdquo; Multi-day itinerary capsules and smart packing analytics.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F4EFEA] flex items-center justify-between text-xs font-bold text-[#B4533C]">
              <span>Pack Smarter →</span>
              <span className="text-[10px] text-[#78716C] font-normal">Pack • Reuse • Skip</span>
            </div>
          </Link>
        </Card3D>

        {/* Card 2: ✨ OCCASION */}
        <Card3D depth={12} className="h-full">
          <Link
            href="/occasions"
            className="group block h-full rounded-3xl bg-white border border-[#E7E0D6] p-7 shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden shimmer-card"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-28 w-28 rounded-full bg-[#C5A059]/10 group-hover:bg-[#C5A059]/20 transition-colors duration-500" />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#C5A059] border border-[#E7E0D6]/60 mb-5 group-hover:scale-110 transition-transform">
              <Sparkles className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#C5A059]">
                  Event Stylist
                </span>
                <span className="text-xs font-bold text-[#1C1917] bg-[#FAF8F5] px-2.5 py-0.5 rounded-full border border-[#E7E0D6]">
                  Full Look
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917] group-hover:text-[#B4533C] transition-colors">
                ✨ OCCASION
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                &ldquo;Create the perfect look for an event.&rdquo; Clothes, footwear, accessories, and grooming harmony.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F4EFEA] flex items-center justify-between text-xs font-bold text-[#B4533C]">
              <span>Style Event →</span>
              <span className="text-[10px] text-[#78716C] font-normal">Weddings • Dates • Galas</span>
            </div>
          </Link>
        </Card3D>

        {/* Card 3: 🛍️ RECOMMENDATIONS */}
        <Card3D depth={12} className="h-full">
          <Link
            href="/recommendations"
            className="group block h-full rounded-3xl bg-white border border-[#E7E0D6] p-7 shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden shimmer-card"
          >
            <div className="absolute top-0 right-0 -mr-6 -mt-6 h-28 w-28 rounded-full bg-[#5F6F52]/10 group-hover:bg-[#5F6F52]/20 transition-colors duration-500" />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#5F6F52] border border-[#E7E0D6]/60 mb-5 group-hover:scale-110 transition-transform">
              <Compass className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#5F6F52]">
                  Picked For You
                </span>
                <span className="text-xs font-bold text-[#B4533C] bg-[#B4533C]/10 px-2.5 py-0.5 rounded-full">
                  Curated
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#1C1917] group-hover:text-[#B4533C] transition-colors">
                🛍️ RECOMMENDATIONS
              </h3>
              <p className="text-xs sm:text-sm text-[#57534E] leading-relaxed">
                &ldquo;Discover pieces that match your style.&rdquo; Curated missing pieces tailored to your Style DNA.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F4EFEA] flex items-center justify-between text-xs font-bold text-[#B4533C]">
              <span>Explore Curation →</span>
              <span className="text-[10px] text-[#78716C] font-normal">Save • Not for Me</span>
            </div>
          </Link>
        </Card3D>
      </div>



      {/* 4. WARDROBE SECTION */}
      <section className="space-y-6 pt-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E0D6] pb-4">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
              Your Wardrobe
            </h2>
            <p className="text-xs sm:text-sm text-[#57534E] mt-0.5">
              Digitally organized with AI auto-tagging, custom folders, and capsule rotation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Create Folder Button */}
            <button
              onClick={() => setIsFolderModalOpen(true)}
              className="flex items-center gap-2 rounded-2xl border border-[#E7E0D6] bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] hover:border-[#D5CCC0] transition-colors shadow-2xs"
            >
              <FolderPlus className="h-4 w-4 text-[#C5A059]" />
              <span>+ Create Folder</span>
            </button>

            {/* Add Item Button */}
            <Link
              href="/wardrobe/upload"
              className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Clothing Item</span>
            </Link>
          </div>
        </div>

        {/* Custom Folder Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setSelectedFolderId('all')}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
              selectedFolderId === 'all'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-white border border-[#E7E0D6] text-[#57534E] hover:border-[#D5CCC0]'
            }`}
          >
            All Items ({items.length})
          </button>

          {folders.map((f) => {
            const count = items.filter((i) => i.folderId === f.id).length;
            const isSelected = selectedFolderId === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSelectedFolderId(f.id)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#B4533C] text-white shadow-xs'
                    : 'bg-white border border-[#E7E0D6] text-[#57534E] hover:border-[#D5CCC0]'
                }`}
              >
                {f.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search, Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-[#E7E0D6] p-3 rounded-2xl shadow-xs">
          {/* Search Box */}
          <div className="flex items-center gap-2 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] px-3 py-2 w-full sm:w-72 focus-within:bg-white focus-within:border-[#B4533C]">
            <Search className="h-4 w-4 text-[#78716C] shrink-0" />
            <input
              type="text"
              placeholder="Search by name, color, style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[#1C1917] focus:outline-hidden"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#78716C] hover:text-[#1C1917]">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
            {categoriesList.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#B4533C]/10 text-[#B4533C] font-bold'
                    : 'text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-[#78716C] font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-[#E7E0D6] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1C1917] focus:outline-hidden"
            >
              <option value="recent">Recently Added</option>
              <option value="name">Alphabetical</option>
              <option value="favorite">Favorites First</option>
            </select>
          </div>
        </div>

        {/* Clothing Items Grid */}
        {filteredItems.length === 0 ? (
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-12 text-center space-y-4 card-shadow">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-[#B4533C]">
              <Shirt className="h-8 w-8" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
              No clothing items match your filter.
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mx-auto">
              Try adjusting your category or search query, or upload a new piece to expand your digital closet.
            </p>
            <div className="pt-2">
              <Link
                href="/wardrobe/upload"
                className="inline-flex items-center gap-2 rounded-xl bg-[#B4533C] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Upload New Garment</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {filteredItems.map((item) => {
              // Construct exact tags as specified: e.g. BLACK · CASUAL · OVERSIZED
              const tag1 = item.color.toUpperCase();
              const tag2 = item.formality.toUpperCase();
              const tag3 = (item.fit || item.style).split(' ')[0].toUpperCase();
              const tagString = `${tag1} · ${tag2} · ${tag3}`;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className="group rounded-3xl border border-[#E7E0D6] bg-white p-3.5 card-shadow card-shadow-hover cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-[#B4533C]/60"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div>
                    {/* Item Image Container with Perspective */}
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] mb-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                      />

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/85 backdrop-blur-xs text-[#78716C] hover:text-[#B4533C] transition-colors shadow-2xs"
                        aria-label="Toggle favorite"
                      >
                        <Heart
                          className={`h-3.5 w-3.5 ${
                            item.favorite ? 'fill-[#B4533C] text-[#B4533C]' : ''
                          }`}
                        />
                      </button>

                      {/* Category Badge */}
                      <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/65 backdrop-blur-xs px-2.5 py-0.5 text-[9px] font-bold text-white tracking-wide uppercase">
                        {item.category}
                      </span>
                    </div>

                    {/* Item Title & Specs */}
                    <h4 className="text-xs font-bold text-[#1C1917] truncate leading-tight group-hover:text-[#B4533C] transition-colors">
                      {item.name}
                    </h4>

                    {/* Exact Prompt Tags Formatting: BLACK · CASUAL · OVERSIZED */}
                    <p className="text-[9px] font-bold tracking-wider text-[#78716C] mt-1.5 uppercase truncate">
                      {tagString}
                    </p>
                  </div>

                  {/* Card Bottom Bar */}
                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#F4EFEA] text-[10px]">
                    <span className="text-[#5F6F52] font-semibold">
                      {item.style}
                    </span>
                    <span className="text-[#78716C] flex items-center gap-1 group-hover:text-[#B4533C]">
                      <span>Details</span>
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CREATE FOLDER MODAL */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-[#E7E0D6] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#1C1917] flex items-center gap-2">
                <FolderPlus className="h-5 w-5 text-[#C5A059]" />
                <span>+ Create Folder</span>
              </h3>
              <button
                onClick={() => setIsFolderModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-[#57534E]">
              Create custom categories or travel capsules to organize your pieces.
            </p>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                placeholder="e.g. Vacation Fits, Office Linens, Streetwear..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-[#78716C] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B4533C] text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530]"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
