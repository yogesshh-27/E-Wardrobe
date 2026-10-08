'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UploadCloud,
  Camera,
  Sparkles,
  Check,
  ArrowRight,
  Folder,
  Tag,
  AlertCircle,
  RefreshCw,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { visionService } from '@/services/visionService';
import { storageService } from '@/services/storageService';
import { ClothingCategory, VisionAnalysisResult } from '@/types';

const CATEGORIES: ClothingCategory[] = [
  'Shirts',
  'T-Shirts',
  'Tops',
  'Trousers',
  'Jeans',
  'Pants',
  'Skirts',
  'Dresses',
  'Kurtas',
  'Sarees',
  'Suits',
  'Blazers',
  'Jackets',
  'Hoodies',
  'Sweaters',
  'Shoes',
  'Sandals',
  'Sneakers',
  'Accessories',
  'Bags',
  'Watches',
  'Jewellery',
  'Other',
];

const FORMALITY_OPTIONS = ['Casual', 'Smart Casual', 'Formal', 'Festive', 'Athletic'] as const;

const OCCASIONS_LIST = [
  'Casual Outing',
  'Office',
  'Business Meeting',
  'Dinner',
  'Date',
  'Wedding',
  'Festival',
  'Puja',
  'Party',
  'Sightseeing',
  'Beach',
  'Travel',
  'College Event',
];

const SEASONS_LIST = ['Spring', 'Summer', 'Autumn', 'Winter', 'All Season'];

export default function UploadPage() {
  const router = useRouter();
  const { addItem, folders } = useWardrobeStore();

  const [stage, setStage] = useState<'upload' | 'analyzing' | 'confirm' | 'success'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Editable Form fields populated by AI vision
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('Shirts');
  const [color, setColor] = useState('');
  const [pattern, setPattern] = useState('Solid');
  const [style, setStyle] = useState('Classic / Minimalist');
  const [material, setMaterial] = useState('Cotton');
  const [formality, setFormality] = useState<typeof FORMALITY_OPTIONS[number]>('Smart Casual');
  const [fit, setFit] = useState('Relaxed');
  const [occasions, setOccasions] = useState<string[]>(['Casual Outing']);
  const [seasons, setSeasons] = useState<string[]>(['All Season']);
  const [selectedFolderId, setSelectedFolderId] = useState('f-shirts');
  const [notes, setNotes] = useState('');
  const [aiConfidence, setAiConfidence] = useState(94);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    try {
      setErrorMessage('');
      const dataUrl = await storageService.storeImage(file);
      setImagePreview(dataUrl);
      setStage('analyzing');

      // AI Vision Inference
      const analysis: VisionAnalysisResult = await visionService.analyze(file);

      // Populate editable fields with AI detected properties
      setItemName(analysis.name);
      setCategory(analysis.category);
      setColor(analysis.color);
      setPattern(analysis.pattern);
      setStyle(analysis.style);
      setMaterial(analysis.material);
      setFormality(analysis.formality);
      setFit(analysis.fit);
      setOccasions(analysis.occasion);
      setSeasons(analysis.season);
      setAiConfidence(analysis.confidence);

      // Auto-suggest folder matching category
      const matchedFolder = folders.find(
        (f) =>
          f.name.toLowerCase() === analysis.category.toLowerCase() ||
          f.category?.toLowerCase() === analysis.category.toLowerCase()
      );
      if (matchedFolder) {
        setSelectedFolderId(matchedFolder.id);
      } else {
        setSelectedFolderId('f-other');
      }

      setStage('confirm');
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || 'Failed to process garment image.');
      setStage('upload');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const toggleOccasion = (occ: string) => {
    if (occasions.includes(occ)) {
      setOccasions(occasions.filter((x) => x !== occ));
    } else {
      setOccasions([...occasions, occ]);
    }
  };

  const handleSaveToWardrobe = () => {
    if (!imagePreview || !itemName.trim()) return;

    addItem({
      userId: 'user-default',
      name: itemName.trim(),
      image: imagePreview,
      category,
      color,
      pattern,
      style,
      material,
      formality,
      fit,
      occasion: occasions.length > 0 ? occasions : ['Casual Outing'],
      season: seasons,
      folderId: selectedFolderId,
      notes: notes.trim(),
      favorite: false,
    });

    setStage('success');
  };

  const handleResetForAnother = () => {
    setImagePreview(null);
    setItemName('');
    setNotes('');
    setStage('upload');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-[#E7E0D6] pb-4">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#1C1917]">
          Add to Wardrobe
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1">
          Upload clothes one item at a time. AI vision auto-detects colors, silhouette, category, and styling occasions.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STAGE 1: UPLOAD ZONE (Drag & Drop / Camera / Gallery) */}
      {stage === 'upload' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="rounded-3xl border-2 border-dashed border-[#E7E0D6] bg-white p-8 sm:p-14 text-center card-shadow hover:border-[#B4533C] transition-colors"
        >
          <div className="max-w-md mx-auto space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF8F5] text-[#B4533C] border border-[#E7E0D6]">
              <UploadCloud className="h-8 w-8" />
            </div>

            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917]">
                Drag and drop your clothing image
              </h3>
              <p className="text-xs text-[#78716C] mt-1.5">
                Supports JPG, PNG, or WebP up to 10MB. Flat-lays or hanger photos work best.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#B4533C] px-5 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-colors"
              >
                <UploadCloud className="h-4 w-4" />
                <span>Upload from Gallery</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#E7E0D6] bg-white px-5 py-3 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
              >
                <Camera className="h-4 w-4 text-[#78716C]" />
                <span>Take Photo (Camera)</span>
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* STAGE 2: AI ANALYSIS SCANNING ANIMATION */}
      {stage === 'analyzing' && imagePreview && (
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-10 text-center card-shadow space-y-6">
          <div className="relative mx-auto h-64 w-52 rounded-2xl overflow-hidden border border-[#E7E0D6] shadow-lg">
            <img
              src={imagePreview}
              alt="Analyzing Garment"
              className="h-full w-full object-cover filter brightness-90"
            />
            {/* Glowing Scanline Animation */}
            <div className="animate-scanline" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-3">
              <span className="text-[11px] font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#C5A059] animate-spin" />
                AI Vision Scanning Active
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
              Analyzing Garment Features...
            </h3>
            <p className="text-xs text-[#57534E] max-w-sm mx-auto">
              Extracting fabric tone, collar architecture, weave pattern, formality rating, and matching occasion metadata.
            </p>
          </div>
        </div>
      )}

      {/* STAGE 3: EDITABLE CONFIRMATION SCREEN (Section 10) */}
      {stage === 'confirm' && imagePreview && (
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-6">
          {/* AI Banner */}
          <div className="flex items-center justify-between rounded-2xl bg-[#B4533C]/5 border border-[#B4533C]/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#B4533C]" />
              <span className="text-xs font-bold text-[#1C1917]">
                AI Detected Attributes ({aiConfidence}% confidence)
              </span>
            </div>
            <span className="text-[11px] text-[#78716C]">
              Verify or customize any details below before saving
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Image Preview */}
            <div className="md:col-span-4 space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden border border-[#E7E0D6] shadow-xs">
                <img
                  src={imagePreview}
                  alt={itemName}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={handleResetForAnother}
                className="w-full text-center text-xs text-[#78716C] hover:text-[#B4533C] py-1"
              >
                Replace image
              </button>
            </div>

            {/* Right: Editable Form Controls */}
            <div className="md:col-span-8 space-y-4">
              {/* Item Name */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                  Item Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs font-bold text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Category & Folder */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                    Save to Folder
                  </label>
                  <select
                    value={selectedFolderId}
                    onChange={(e) => setSelectedFolderId(e.target.value)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Color, Pattern, Style, Formality */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                    Pattern
                  </label>
                  <input
                    type="text"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1C1917]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                    Formality
                  </label>
                  <select
                    value={formality}
                    onChange={(e) => setFormality(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-2 py-1.5 text-xs text-[#1C1917]"
                  >
                    {FORMALITY_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                    Fit
                  </label>
                  <input
                    type="text"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-2.5 py-1.5 text-xs text-[#1C1917]"
                  />
                </div>
              </div>

              {/* Occasion Chips (Multi-select) */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
                  Occasions Suited
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {OCCASIONS_LIST.map((occ) => {
                    const isSelected = occasions.includes(occ);
                    return (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => toggleOccasion(occ)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all ${
                          isSelected
                            ? 'border-[#B4533C] bg-[#B4533C] text-white font-semibold'
                            : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:bg-white'
                        }`}
                      >
                        {occ}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                  Styling Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Pairs nicely with dark wash denim or layered under camel coat..."
                  rows={2}
                  className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetForAnother}
                  className="px-4 py-2.5 rounded-xl border border-[#E7E0D6] text-xs font-semibold text-[#78716C] hover:bg-[#FAF8F5]"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSaveToWardrobe}
                  className="flex items-center gap-2 rounded-xl bg-[#B4533C] px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Add to Wardrobe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STAGE 4: SUCCESS CONFIRMATION ANIMATION */}
      {stage === 'success' && (
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-10 text-center card-shadow space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#5F6F52]/10 text-[#5F6F52]">
            <CheckCircle2 className="h-8 w-8" />
          </div>

          <div>
            <h3 className="font-serif text-2xl font-bold text-[#1C1917]">
              Item Added to Your Wardrobe!
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mx-auto mt-1">
              Your AI stylist has learned this garment&apos;s attributes and is ready to recommend matching outfits.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetForAnother}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#E7E0D6] bg-white px-5 py-3 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-[#78716C]" />
              <span>Add Another Item</span>
            </button>

            <Link
              href="/wardrobe"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#B4533C] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-colors"
            >
              <span>View in Wardrobe</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
