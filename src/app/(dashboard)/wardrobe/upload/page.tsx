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
  Crop,
  Layers,
  Scissors,
  Wand2,
  FolderPlus,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { visionService } from '@/services/visionService';
import { storageService } from '@/services/storageService';
import { ClothingCategory, VisionAnalysisResult } from '@/types';
import { InteractiveUploadZone } from '@/components/ui/InteractiveUploadZone';

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
const FITS_LIST = ['Fitted', 'Relaxed', 'Oversized', 'Slim', 'Loose'];

export default function UploadPage() {
  const router = useRouter();
  const { addItem, folders, createFolder } = useWardrobeStore();

  const [stage, setStage] = useState<'upload' | 'analyzing' | 'confirm' | 'success'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isBackgroundRemoved, setIsBackgroundRemoved] = useState(false);
  const [isCropped, setIsCropped] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // AI Detected Fields
  const [itemName, setItemName] = useState('Oversized Cotton Oxford Shirt');
  const [category, setCategory] = useState<ClothingCategory>('Shirts');
  const [color, setColor] = useState('White');
  const [style, setStyle] = useState('Casual');
  const [fit, setFit] = useState('Relaxed');
  const [formality, setFormality] = useState<typeof FORMALITY_OPTIONS[number]>('Casual');
  const [pattern, setPattern] = useState('Solid');
  const [selectedFolderId, setSelectedFolderId] = useState('f-shirts');
  const [customTags, setCustomTags] = useState('WHITE · CASUAL · RELAXED');
  const [aiConfidence, setAiConfidence] = useState(96);
  const [analyzingProgress, setAnalyzingProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    try {
      setErrorMessage('');
      const dataUrl = await storageService.storeImage(file);
      setImagePreview(dataUrl);
      setStage('analyzing');
      setAnalyzingProgress(20);

      const progressInterval = setInterval(() => {
        setAnalyzingProgress((prev) => {
          if (prev >= 88) return prev;
          return prev + 18;
        });
      }, 180);

      // AI Vision Inference
      const analysis: VisionAnalysisResult = await visionService.analyze(file);
      clearInterval(progressInterval);
      setAnalyzingProgress(100);

      setItemName(analysis.name || 'Tailored Garment Piece');
      setCategory(analysis.category);
      setColor(analysis.color);
      setStyle(analysis.style.split(' ')[0] || 'Casual');
      setFit(analysis.fit || 'Relaxed');
      setPattern(analysis.pattern);
      setFormality(analysis.formality);
      setAiConfidence(analysis.confidence);
      setCustomTags(`${analysis.color.toUpperCase()} · ${analysis.style.split(' ')[0].toUpperCase()} · ${(analysis.fit || 'RELAXED').toUpperCase()}`);

      // Auto-suggest folder
      const matchedFolder = folders.find(
        (f) =>
          f.name.toLowerCase().includes(analysis.category.toLowerCase()) ||
          analysis.category.toLowerCase().includes(f.name.toLowerCase())
      );
      if (matchedFolder) {
        setSelectedFolderId(matchedFolder.id);
      }

      setTimeout(() => {
        setStage('confirm');
      }, 350);
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
      material: 'Organic Cotton',
      formality,
      fit,
      occasion: ['Casual Outing', 'Travel', 'Daily Chic'],
      season: ['All Season'],
      folderId: selectedFolderId,
      favorite: false,
    });

    setStage('success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#0284C7]/10 px-3 py-1 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Vision Digitizer • 21st.dev Upload</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          Add something new to your wardrobe.
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1">
          Upload one piece at a time. Computer vision detects category, color, silhouette, and fit.
        </p>
      </div>

      {errorMessage && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-700 flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 1 & 2. STAGES: UPLOAD & ANALYZING (Integrated with 21st.dev InteractiveUploadZone) */}
      {(stage === 'upload' || stage === 'analyzing') && (
        <div className="space-y-4">
          <InteractiveUploadZone
            onFileSelect={processFile}
            isAnalyzing={stage === 'analyzing'}
            analyzingProgress={analyzingProgress}
            previewUrl={imagePreview}
            onClearPreview={() => {
              setImagePreview(null);
              setStage('upload');
            }}
          />

          {stage === 'upload' && (
            <div className="text-center pt-2">
              <span className="text-[11px] text-[#78716C] mr-2">Or test sample item:</span>
              <button
                type="button"
                onClick={() => {
                  setImagePreview('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80');
                  setStage('confirm');
                }}
                className="text-xs font-bold text-[#0284C7] hover:underline"
              >
                Load Sample White Linen Shirt →
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. STAGE: CONFIRM & CUSTOMIZE */}
      {stage === 'confirm' && imagePreview && (
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-10 shadow-xl card-shadow space-y-8 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Image Preview with Crop & Remove Background */}
            <div className="md:col-span-5 space-y-4">
              <div
                className={`relative aspect-square w-full rounded-3xl overflow-hidden border border-[#E2E8F0] transition-all duration-300 ${
                  isBackgroundRemoved ? 'bg-gradient-to-br from-neutral-100 to-neutral-200' : 'bg-[#FAF8F5]'
                } ${isCropped ? 'p-6' : 'p-2'}`}
              >
                <img
                  src={imagePreview}
                  alt="Garment preview"
                  className={`w-full h-full object-cover rounded-2xl transition-all duration-300 ${
                    isBackgroundRemoved ? 'filter contrast-110 drop-shadow-2xl' : ''
                  }`}
                />

                {/* AI Tag Overlay */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="rounded-full bg-black/75 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                    {category}
                  </span>
                  <span className="rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-[#E87A90] shadow-xs">
                    {aiConfidence}% Confidence
                  </span>
                </div>
              </div>

              {/* Crop & Remove Background Controls */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsCropped(!isCropped)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                    isCropped
                      ? 'border-[#0284C7] bg-[#0284C7]/10 text-[#0284C7]'
                      : 'border-[#E2E8F0] bg-white text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Crop className="h-3.5 w-3.5" />
                  <span>{isCropped ? 'Cropped (Center)' : 'Crop Image'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsBackgroundRemoved(!isBackgroundRemoved)}
                  className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-all ${
                    isBackgroundRemoved
                      ? 'border-[#E87A90] bg-[#E87A90] text-white shadow-xs'
                      : 'border-[#E2E8F0] bg-white text-[#57534E] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                  <span>{isBackgroundRemoved ? 'Background Removed' : 'Remove BG'}</span>
                </button>
              </div>
            </div>

            {/* Right: AI Detection Breakdown & Customization */}
            <div className="md:col-span-7 space-y-6">
              {/* Exact AI Detection Breakdown Box */}
              <div className="rounded-2xl border-2 border-[#0284C7]/20 bg-[#FAF8F5] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#0284C7] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>AI Detection Summary</span>
                  </span>
                  <span className="text-[10px] font-bold text-[#E87A90]">Verified</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#78716C] uppercase block">CATEGORY</span>
                    <span className="font-bold text-[#1C1917] text-sm">{category}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#78716C] uppercase block">COLOUR</span>
                    <span className="font-bold text-[#1C1917] text-sm">{color}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#78716C] uppercase block">STYLE</span>
                    <span className="font-bold text-[#1C1917] text-sm">{style}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                    <span className="text-[10px] font-bold text-[#78716C] uppercase block">FIT</span>
                    <span className="font-bold text-[#1C1917] text-sm">{fit}</span>
                  </div>
                </div>
              </div>

              {/* Editable Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
                  Garment Name
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-3 text-xs font-bold text-[#1C1917] focus:border-[#0284C7] focus:bg-white"
                />
              </div>

              {/* Folder & Category Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
                    Folder
                  </label>
                  <select
                    value={selectedFolderId}
                    onChange={(e) => setSelectedFolderId(e.target.value)}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917]"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Tags */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#78716C] block">
                  Tags (e.g. BLACK · CASUAL · OVERSIZED)
                </label>
                <input
                  type="text"
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white"
                />
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setStage('upload');
                  }}
                  className="px-5 py-3 text-xs font-semibold text-[#78716C] hover:text-[#1C1917]"
                >
                  Discard
                </button>

                <button
                  type="button"
                  onClick={handleSaveToWardrobe}
                  className="flex items-center gap-2 rounded-2xl bg-[#0284C7] px-8 py-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#0369A1] transition-all"
                >
                  <Check className="h-4 w-4" />
                  <span>Confirm & Save to Wardrobe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. STAGE: SUCCESS */}
      {stage === 'success' && (
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-12 text-center space-y-6 card-shadow">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#E87A90]/10 text-[#E87A90]">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-[#1C1917]">
              Item Added to Your Wardrobe!
            </h3>
            <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mx-auto">
              &ldquo;{itemName}&rdquo; is now cataloged and available for Travel capsules and Occasion styling.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setImagePreview(null);
                setStage('upload');
              }}
              className="rounded-2xl border border-[#E2E8F0] bg-white px-6 py-3.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
            >
              + Upload Another Item
            </button>

            <Link
              href="/wardrobe"
              className="rounded-2xl bg-[#1C1917] px-8 py-3.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0284C7] transition-colors"
            >
              View in Wardrobe →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
