'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Heart,
  Trash2,
  Folder,
  Sparkles,
  Edit2,
  Check,
  Tag,
  Calendar,
  Layers,
} from 'lucide-react';
import { WardrobeItem, ClothingCategory } from '@/types';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { stylistService } from '@/services/stylistService';

interface ItemDetailModalProps {
  item: WardrobeItem | null;
  onClose: () => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ item, onClose }) => {
  const router = useRouter();
  const { items, folders, updateItem, deleteItem, toggleFavorite, moveItemToFolder, setSelectedItem } =
    useWardrobeStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedCategory, setEditedCategory] = useState<ClothingCategory>('Shirts');
  const [editedColor, setEditedColor] = useState('');
  const [editedNotes, setEditedNotes] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [aiMatches, setAiMatches] = useState<WardrobeItem[]>([]);
  const [aiRules, setAiRules] = useState<string[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);

  useEffect(() => {
    if (item) {
      setEditedName(item.name);
      setEditedCategory(item.category);
      setEditedColor(item.color);
      setEditedNotes(item.notes || '');
      setSelectedFolderId(item.folderId);
      setConfirmDelete(false);
      setIsEditing(false);

      // Fetch AI Outfit Ideas
      setIsLoadingIdeas(true);
      stylistService
        .getOutfitIdeasForItem(item, items)
        .then((res) => {
          setAiMatches(res.matchingItems);
          setAiRules(res.suggestionRules);
        })
        .finally(() => setIsLoadingIdeas(false));
    }
  }, [item, items]);

  if (!item) return null;

  const currentFolder = folders.find((f) => f.id === item.folderId);

  const handleSaveEdit = () => {
    updateItem(item.id, {
      name: editedName,
      category: editedCategory,
      color: editedColor,
      notes: editedNotes,
      folderId: selectedFolderId,
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteItem(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-2 text-xs text-[#78716C]">
            <Folder className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>{currentFolder?.name || 'Wardrobe'}</span>
            <span>/</span>
            <span className="font-semibold text-[#1C1917]">{item.category}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(item.id)}
              className={`p-2 rounded-full transition-colors ${
                item.favorite
                  ? 'text-[#0284C7] bg-[#0284C7]/10'
                  : 'text-[#78716C] hover:bg-[#E2E8F0]'
              }`}
              title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`h-4 w-4 ${item.favorite ? 'fill-[#0284C7]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#78716C] hover:bg-[#E2E8F0] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Image Container */}
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#FAF8F5] aspect-square shadow-sm">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-[11px] font-semibold text-[#1C1917] shadow-2xs">
                {item.formality}
              </span>
            </div>

            {/* Folder Mover Dropdown */}
            <div className="flex items-center gap-2 p-3 rounded-xl border border-[#E2E8F0] bg-[#FAF8F5]">
              <Folder className="h-4 w-4 text-[#38BDF8] shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase text-[#64748B]">Folder</p>
                <select
                  value={selectedFolderId}
                  onChange={(e) => {
                    setSelectedFolderId(e.target.value);
                    moveItemToFolder(item.id, e.target.value);
                  }}
                  className="w-full bg-transparent text-xs font-semibold text-[#1C1917] focus:outline-hidden cursor-pointer"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Right: Details & AI Ideas */}
          <div className="space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Title & Edit mode */}
              {isEditing ? (
                <div className="space-y-3 p-3 rounded-xl border border-[#0284C7]/30 bg-[#FAF8F5]">
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-[#64748B]">Name</label>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2 text-xs font-bold text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-[#64748B]">Color</label>
                    <input
                      type="text"
                      value={editedColor}
                      onChange={(e) => setEditedColor(e.target.value)}
                      className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2 text-xs text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-[#64748B]">Notes</label>
                    <textarea
                      value={editedNotes}
                      onChange={(e) => setEditedNotes(e.target.value)}
                      rows={2}
                      className="w-full rounded-lg border border-[#E2E8F0] bg-white p-2 text-xs text-[#1C1917]"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-3 py-1 rounded-md text-xs font-medium text-[#64748B]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveEdit}
                      className="px-3 py-1 rounded-md text-xs font-semibold bg-[#0284C7] text-white hover:bg-[#0369A1]"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-sans font-bold text-xl text-[#1C1917]">{item.name}</h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 text-[#64748B] hover:text-[#0284C7]"
                      title="Edit details"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1">
                    {item.color} • {item.style} {item.fit ? `• ${item.fit}` : ''}
                  </p>
                </div>
              )}

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-[#FAF8F5] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-medium text-[#475569]">
                  Pattern: {item.pattern}
                </span>
                {item.material && (
                  <span className="rounded-full bg-[#FAF8F5] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-medium text-[#475569]">
                    {item.material}
                  </span>
                )}
                {item.season?.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-[#FAF8F5] border border-[#E2E8F0] px-2.5 py-1 text-[11px] font-medium text-[#475569]"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Occasion chips */}
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1.5">
                  Occasions Suited
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.occasion.map((occ) => (
                    <span
                      key={occ}
                      className="rounded-md bg-[#E0F2FE] px-2 py-0.5 text-[10px] font-semibold text-[#0284C7]"
                    >
                      {occ}
                    </span>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {item.notes && !isEditing && (
                <div className="rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] p-3">
                  <p className="text-[10px] font-semibold uppercase text-[#64748B]">Styling Notes</p>
                  <p className="text-xs text-[#475569] mt-0.5 italic">&ldquo;{item.notes}&rdquo;</p>
                </div>
              )}

              {/* AI Outfit Ideas Section (Section 11) */}
              <div className="border-t border-[#E2E8F0] pt-3 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1C1917]">
                  <Sparkles className="h-4 w-4 text-[#0284C7]" />
                  <span>AI Outfit Ideas</span>
                </div>

                {isLoadingIdeas ? (
                  <p className="text-xs text-[#64748B]">Finding matching wardrobe pieces...</p>
                ) : (
                  <>
                    <p className="text-xs text-[#475569]">
                      This {item.color.toLowerCase()} {item.category.toLowerCase().slice(0, -1) || item.category.toLowerCase()} works well with:
                    </p>

                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {aiMatches.length > 0 ? (
                        aiMatches.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedItem(m)}
                            className="shrink-0 w-20 rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] p-1.5 text-center cursor-pointer hover:border-[#0284C7] transition-all"
                            title={m.name}
                          >
                            <img
                              src={m.image}
                              alt={m.name}
                              className="h-14 w-full rounded-lg object-cover mb-1"
                            />
                            <p className="text-[10px] font-semibold text-[#1C1917] truncate">{m.name}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-[#64748B] italic">
                          Upload more bottoms or footwear to generate complete pairing visuals.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Bottom Actions: Create Outfit & Delete */}
            <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  onClose();
                  router.push(`/occasions`);
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E87A90] to-[#0284C7] py-2.5 text-xs font-semibold text-white shadow-xs hover:opacity-95 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                Style This Piece
              </button>

              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#0284C7] font-semibold">Confirm delete?</span>
                  <button
                    onClick={handleDelete}
                    className="rounded-lg bg-red-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-red-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="rounded-lg border border-[#E2E8F0] px-2 py-1.5 text-[11px] font-medium text-[#78716C]"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-xl p-2.5 text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
