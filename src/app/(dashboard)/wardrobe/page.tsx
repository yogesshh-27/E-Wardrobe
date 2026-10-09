'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Shirt,
  FolderPlus,
  Grid,
  List,
  Search,
  Filter,
  Plus,
  Heart,
  Folder as FolderIcon,
  Trash2,
  Edit2,
  X,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { ClothingCategory } from '@/types';
import { motion } from 'framer-motion';
import { EASINGS } from '@/lib/animations';

export default function WardrobePage() {
  const {
    items,
    folders,
    filters,
    setFilters,
    resetFilters,
    createFolder,
    renameFolder,
    deleteFolder,
    toggleFavorite,
    setSelectedItem,
  } = useWardrobeStore();

  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [renamedName, setRenamedName] = useState('');

  // Filtering Logic
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Folder filter
      if (filters.activeFolderId !== 'all' && item.folderId !== filters.activeFolderId) {
        return false;
      }
      // Favorites filter
      if (filters.onlyFavorites && !item.favorite) {
        return false;
      }
      // Category filter
      if (filters.category && filters.category !== 'All' && item.category !== filters.category) {
        return false;
      }
      // Color filter
      if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase())) {
        return false;
      }
      // Style filter
      if (filters.style && !item.style.toLowerCase().includes(filters.style.toLowerCase())) {
        return false;
      }
      // Formality filter
      if (filters.formality && item.formality !== filters.formality) {
        return false;
      }
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.color.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.style.toLowerCase().includes(q) ||
          item.occasion.some((o) => o.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [items, filters]);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    createFolder(newFolderName.trim());
    setNewFolderName('');
    setIsNewFolderOpen(false);
  };

  const handleRenameFolder = (id: string) => {
    if (renamedName.trim()) {
      renameFolder(id, renamedName.trim());
    }
    setEditingFolderId(null);
  };

  const allColors = ['White', 'Black', 'Blue', 'Beige', 'Grey', 'Green', 'Brown'];
  const allFormalities = ['Casual', 'Smart Casual', 'Formal', 'Festive'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
            My Wardrobe
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
            Everything you own, organized your way. ({items.length} items cataloged)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewFolderOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors shadow-2xs"
          >
            <FolderPlus className="h-4 w-4 text-[#38BDF8]" />
            <span>New Folder</span>
          </button>

          <Link
            href="/wardrobe/upload"
            className="flex items-center gap-2 rounded-xl bg-[#0284C7] px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0369A1] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Item</span>
          </Link>
        </div>
      </div>

      {/* New Folder Modal */}
      {isNewFolderOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-[#E2E8F0] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">Create Custom Folder</h3>
              <button
                onClick={() => setIsNewFolderOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                placeholder="Folder name (e.g. Vacation Fits, Office Linens)..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white focus:outline-hidden"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#78716C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#0284C7] text-xs font-semibold text-white"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Folders Horizontal Pills Strip */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
            Folders & Capsules
          </p>
          <span className="text-xs text-[#78716C]">{folders.length} categories</span>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {/* All items pill */}
          <button
            onClick={() => setFilters({ activeFolderId: 'all' })}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
              filters.activeFolderId === 'all'
                ? 'bg-[#1C1917] text-white shadow-xs'
                : 'bg-white border border-[#E2E8F0] text-[#57534E] hover:border-[#CBD5E1]'
            }`}
          >
            <FolderIcon className="h-3.5 w-3.5" />
            <span>All Clothes ({items.length})</span>
          </button>

          {/* Folder pills */}
          {folders.map((folder) => {
            const count = items.filter((i) => i.folderId === folder.id).length;
            const isSelected = filters.activeFolderId === folder.id;

            return (
              <div
                key={folder.id}
                className={`group flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#0284C7] text-white shadow-xs'
                    : 'bg-white border border-[#E2E8F0] text-[#57534E] hover:border-[#CBD5E1]'
                }`}
              >
                {editingFolderId === folder.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={renamedName}
                      onChange={(e) => setRenamedName(e.target.value)}
                      onBlur={() => handleRenameFolder(folder.id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRenameFolder(folder.id)}
                      autoFocus
                      className="w-24 rounded bg-white px-1 text-xs text-[#1C1917]"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setFilters({ activeFolderId: folder.id })}
                    className="flex items-center gap-1.5"
                  >
                    <FolderIcon
                      className={`h-3.5 w-3.5 ${
                        isSelected ? 'text-white' : 'text-[#38BDF8]'
                      }`}
                    />
                    <span>{folder.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF8F5] text-[#78716C]'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                )}

                {/* Custom folder edit/delete controls */}
                {!folder.isDefault && (
                  <div className="hidden group-hover:flex items-center gap-1 ml-1 pl-1 border-l border-black/10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFolderId(folder.id);
                        setRenamedName(folder.name);
                      }}
                      className="p-0.5 hover:text-black"
                      title="Rename folder"
                    >
                      <Edit2 className="h-3 w-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(folder.id);
                      }}
                      className="p-0.5 hover:text-red-600"
                      title="Delete folder"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#78716C]" />
            <input
              type="text"
              placeholder="Search by color, fabric, style, occasion..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] pl-10 pr-4 py-2.5 text-xs text-[#1C1917] placeholder-[#78716C] focus:border-[#0284C7] focus:bg-white focus:outline-hidden"
            />
            {filters.searchQuery && (
              <button
                onClick={() => setFilters({ searchQuery: '' })}
                className="absolute right-3 top-3 text-[#78716C] hover:text-[#1C1917]"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Selects & Toggles */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {/* Color select */}
            <select
              value={filters.color || ''}
              onChange={(e) => setFilters({ color: e.target.value || undefined })}
              className="rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917] focus:outline-hidden cursor-pointer"
            >
              <option value="">All Colors</option>
              {allColors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Formality select */}
            <select
              value={filters.formality || ''}
              onChange={(e) => setFilters({ formality: e.target.value || undefined })}
              className="rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917] focus:outline-hidden cursor-pointer"
            >
              <option value="">All Formality</option>
              {allFormalities.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            {/* Favorites Toggle */}
            <button
              onClick={() => setFilters({ onlyFavorites: !filters.onlyFavorites })}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold border transition-all ${
                filters.onlyFavorites
                  ? 'border-[#0284C7] bg-[#0284C7]/10 text-[#0284C7]'
                  : 'border-[#E2E8F0] bg-[#FAF8F5] text-[#57534E] hover:bg-white'
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${
                  filters.onlyFavorites ? 'fill-[#0284C7]' : ''
                }`}
              />
              <span>Favorites</span>
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-[#E2E8F0] rounded-xl bg-[#FAF8F5] p-1">
              <button
                onClick={() => setFilters({ viewMode: 'grid' })}
                className={`p-1 rounded-lg transition-colors ${
                  filters.viewMode === 'grid'
                    ? 'bg-white text-[#1C1917] shadow-2xs font-bold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
                aria-label="Grid view"
              >
                <Grid className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setFilters({ viewMode: 'list' })}
                className={`p-1 rounded-lg transition-colors ${
                  filters.viewMode === 'list'
                    ? 'bg-white text-[#1C1917] shadow-2xs font-bold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
                aria-label="List view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Clear Button */}
        {(filters.searchQuery ||
          filters.color ||
          filters.formality ||
          filters.onlyFavorites ||
          filters.activeFolderId !== 'all') && (
          <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0] text-xs">
            <span className="text-[#78716C]">
              Showing {filteredItems.length} of {items.length} items
            </span>
            <button
              onClick={resetFilters}
              className="text-[#0284C7] hover:underline font-semibold"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Wardrobe Items Display */}
      {filteredItems.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-12 text-center space-y-4 card-shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] text-[#0284C7]">
            <Shirt className="h-8 w-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
            Your wardrobe is waiting for you.
          </h3>
          <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mx-auto">
            Start by uploading your first clothing item. Our AI will automatically categorize colors, cuts, and occasions.
          </p>
          <div className="pt-2">
            <Link
              href="/wardrobe/upload"
              className="inline-flex items-center gap-2 rounded-xl bg-[#0284C7] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#0369A1] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Upload My First Item</span>
            </Link>
          </div>
        </div>
      ) : filters.viewMode === 'grid' ? (
        /* Grid View with Stagger and Hover */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: Math.min(index * 0.04, 0.35),
                ease: EASINGS.luxury,
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.2, ease: EASINGS.luxury },
              }}
              onClick={() => setSelectedItem(item)}
              className="group rounded-3xl border border-[#E2E8F0] bg-white p-3 card-shadow card-shadow-hover cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#FAF8F5] mb-3 group/img">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* 21st.dev Hover Reveal Spotlight Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 pointer-events-none">
                    <span className="flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-[#1C1917] shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="h-3 w-3 text-[#0284C7]" />
                      <span>Inspect Details</span>
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/80 backdrop-blur-xs text-[#78716C] hover:text-[#0284C7] transition-colors z-10"
                  >
                    <Heart
                      className={`h-3.5 w-3.5 ${
                        item.favorite ? 'fill-[#0284C7] text-[#0284C7]' : ''
                      }`}
                    />
                  </button>

                  <span className="absolute bottom-2.5 left-2.5 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold text-white z-10 group-hover:opacity-0 transition-opacity">
                    {item.category}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-[#1C1917] truncate leading-tight group-hover:text-[#0284C7] transition-colors">{item.name}</h4>
                <p className="text-[9px] font-bold tracking-wider text-[#78716C] mt-1 uppercase truncate">
                  {item.color.toUpperCase()} · {item.formality.toUpperCase()} · {(item.fit || item.style).split(' ')[0].toUpperCase()}
                </p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#F0F7FD]">
                <span className="text-[10px] text-[#E87A90] font-semibold">
                  {item.style}
                </span>
                <span className="text-[10px] text-[#78716C]">
                  {item.occasion[0]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2.5">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: Math.min(index * 0.03, 0.3),
                ease: EASINGS.luxury,
              }}
              whileHover={{
                x: 3,
                transition: { duration: 0.18 },
              }}
              onClick={() => setSelectedItem(item)}
              className="group flex items-center justify-between gap-4 p-3.5 rounded-2xl border border-[#E2E8F0] bg-white hover:border-[#0284C7]/40 hover:shadow-xs cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl object-cover border border-[#E2E8F0] shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[#1C1917] truncate">{item.name}</h4>
                  <p className="text-[11px] text-[#78716C]">
                    {item.category} • {item.color} • {item.material || 'Cotton'} • {item.formality}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {item.occasion.slice(0, 3).map((occ) => (
                      <span
                        key={occ}
                        className="rounded-sm bg-[#FAF8F5] border border-[#E2E8F0] px-1.5 py-0.2 text-[9px] text-[#57534E]"
                      >
                        {occ}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className="p-2 text-[#78716C] hover:text-[#0284C7]"
                >
                  <Heart
                    className={`h-4 w-4 ${
                      item.favorite ? 'fill-[#0284C7] text-[#0284C7]' : ''
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
