'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Folder, Sparkles, Shirt, Calendar } from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useOutfitStore } from '@/store/useOutfitStore';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { items, folders, setSelectedItem, setFilters } = useWardrobeStore();
  const { savedOutfits } = useOutfitStore();
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { items: [], folders: [], outfits: [] };

    const matchedItems = items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.color.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.style.toLowerCase().includes(q) ||
        item.occasion.some((occ) => occ.toLowerCase().includes(q))
    );

    const matchedFolders = folders.filter((f) => f.name.toLowerCase().includes(q));

    const matchedOutfits = savedOutfits.filter(
      (o) =>
        o.name.toLowerCase().includes(q) ||
        o.occasion.toLowerCase().includes(q) ||
        o.style.toLowerCase().includes(q)
    );

    return {
      items: matchedItems,
      folders: matchedFolders,
      outfits: matchedOutfits,
    };
  }, [query, items, folders, savedOutfits]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[85vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] px-5 py-4 bg-[#FAF8F5]">
          <Search className="h-5 w-5 text-[#0284C7]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clothes by color, style, occasion, or folder..."
            autoFocus
            className="flex-1 bg-transparent text-base text-[#1C1917] placeholder-[#64748B] focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="rounded-full p-1 text-[#64748B] hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#475569] hover:text-[#1C1917] ml-2 px-2 py-1 rounded-md border border-[#E2E8F0] bg-white shadow-2xs"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {!query ? (
            <div className="text-center py-10 space-y-3">
              <Sparkles className="h-8 w-8 text-[#0284C7]/60 mx-auto" />
              <p className="text-sm font-medium text-[#1C1917]">
                Search across your entire wardrobe ecosystem
              </p>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Try searching for colors like &ldquo;Sky Blue&rdquo;, garment types like &ldquo;Blazer&rdquo;, or occasions like &ldquo;Dinner&rdquo;.
              </p>
            </div>
          ) : searchResults.items.length === 0 &&
            searchResults.folders.length === 0 &&
            searchResults.outfits.length === 0 ? (
            <div className="text-center py-12 text-[#64748B]">
              <p className="text-sm font-medium">No matches found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs mt-1">Try another search keyword or explore by category.</p>
            </div>
          ) : (
            <>
              {/* Matched Wardrobe Items */}
              {searchResults.items.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                    <Shirt className="h-3.5 w-3.5 text-[#0284C7]" />
                    Wardrobe Items ({searchResults.items.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {searchResults.items.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedItem(item);
                          onClose();
                          router.push('/wardrobe');
                        }}
                        className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E2E8F0] bg-[#FAF8F5]/60 hover:bg-white hover:border-[#0284C7]/40 hover:shadow-xs cursor-pointer transition-all"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 rounded-lg object-cover border border-[#E2E8F0] shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
                          <p className="text-[11px] text-[#64748B]">
                            {item.color} • {item.category}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Folders */}
              {searchResults.folders.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                    <Folder className="h-3.5 w-3.5 text-[#38BDF8]" />
                    Folders ({searchResults.folders.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {searchResults.folders.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setFilters({ activeFolderId: f.id });
                          onClose();
                          router.push('/wardrobe');
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2E8F0] bg-white text-xs font-medium text-[#1C1917] hover:border-[#0284C7] hover:bg-[#FAF8F5] transition-all"
                      >
                        <Folder className="h-3.5 w-3.5 text-[#38BDF8]" />
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched Outfits */}
              {searchResults.outfits.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3">
                    <Calendar className="h-3.5 w-3.5 text-[#E87A90]" />
                    Saved Outfits ({searchResults.outfits.length})
                  </h4>
                  <div className="space-y-2">
                    {searchResults.outfits.map((outfit) => (
                      <div
                        key={outfit.id}
                        onClick={() => {
                          onClose();
                          router.push('/outfits');
                        }}
                        className="p-3 rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] hover:bg-white cursor-pointer transition-all"
                      >
                        <p className="text-xs font-bold text-[#1C1917]">{outfit.name}</p>
                        <p className="text-[11px] text-[#64748B]">
                          {outfit.occasion} • {outfit.style}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
