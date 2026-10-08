'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, AlertCircle, Camera, Check, Eye, Layers, ShieldCheck, RefreshCw } from 'lucide-react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useAuthStore } from '@/store/useAuthStore';

import { ImageComparisonSlider } from '@/components/ui/ImageComparisonSlider';

export const VirtualTryOnModal: React.FC = () => {
  const router = useRouter();
  const { activeOutfitForTryOn, isTryOnModalOpen, closeTryOn } = useOutfitStore();
  const { user } = useAuthStore();

  const [interactiveSliderMode, setInteractiveSliderMode] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeLayer, setActiveLayer] = useState<string>('all');

  if (!isTryOnModalOpen || !activeOutfitForTryOn) return null;

  const userImage =
    user?.profileImage ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80';

  // Editorial composite styled avatar image
  const styledLookImage =
    activeOutfitForTryOn.items[0]?.image ||
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80';

  const handleSimulateRegenerate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-[#E7E0D6] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E7E0D6] px-6 py-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B4533C] text-white shadow-xs">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-xl text-[#1C1917]">
                  See the Look
                </h3>
                <span className="rounded-full bg-[#B4533C]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#B4533C] uppercase tracking-wide">
                  Virtual Try-On • 21st.dev Slider
                </span>
              </div>
              <p className="text-xs text-[#78716C] mt-0.5">{activeOutfitForTryOn.name}</p>
            </div>
          </div>

          <button
            onClick={closeTryOn}
            className="rounded-full p-2 text-[#57534E] hover:bg-[#E7E0D6] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Clear Truthful Architecture Notice */}
        <div className="bg-[#FAF8F5] border-b border-[#E7E0D6] px-6 py-2.5 flex items-center justify-between text-xs text-[#B4533C]">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">
              Interactive 21st.dev Comparison Slider • Silhouette vs Styled Composite
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setInteractiveSliderMode(!interactiveSliderMode)}
              className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-[#1C1917] hover:underline"
            >
              <span>{interactiveSliderMode ? 'Switch to Static View' : 'Switch to 21st.dev Slider'}</span>
            </button>
            <button
              onClick={handleSimulateRegenerate}
              disabled={isSimulating}
              className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-[#1C1917] hover:underline"
            >
              <RefreshCw className={`h-3 w-3 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>Re-render Composite</span>
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Visual Canvas (Avatar & Clothing Layers) */}
            <div className="md:col-span-7 flex flex-col items-center">
              {interactiveSliderMode ? (
                <div className="w-full max-w-sm">
                  <ImageComparisonSlider
                    beforeImage={userImage}
                    afterImage={styledLookImage}
                    beforeLabel="Base Silhouette"
                    afterLabel="Atelier Look"
                    className="aspect-3/4"
                  />
                  <div className="mt-3 flex items-center justify-center gap-1 text-[11px] text-[#78716C]">
                    <span>Drag the gold dial or use left/right arrow keys to compare</span>
                  </div>
                </div>
              ) : (
                <div className="relative rounded-3xl overflow-hidden border border-[#E7E0D6] bg-[#FAF8F5] aspect-3/4 w-full max-w-sm shadow-xl group">
                  <img
                    src={userImage}
                    alt="Avatar preview"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      viewMode === 'after' ? 'contrast-105' : 'grayscale-15'
                    }`}
                  />

                  {/* Outfit Layers Overlay */}
                  {viewMode === 'after' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                      <div className="mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-white/90 block mb-1.5">
                          Active Outfit Layers:
                        </span>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {activeOutfitForTryOn.items.map((garment, gIdx) => (
                            <div
                              key={garment.id}
                              className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-xl p-1.5 border border-white shadow-md shrink-0"
                            >
                              <img
                                src={garment.image}
                                alt={garment.name}
                                className="h-9 w-9 rounded-lg object-cover"
                              />
                              <div className="pr-1 text-left">
                                <p className="text-[10px] font-bold text-[#1C1917] leading-tight max-w-[80px] truncate">
                                  {garment.name}
                                </p>
                                <span className="text-[9px] text-[#B4533C] font-semibold">
                                  Layer {gIdx + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <span className="text-[11px] text-white/80 font-medium">
                        Simulated silhouette drape & color harmony applied
                      </span>
                    </div>
                  )}

                  {/* Loading scanning simulation */}
                  {isSimulating && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-2">
                      <Sparkles className="h-8 w-8 animate-spin text-[#C5A059]" />
                      <p className="text-xs font-bold tracking-wide">Compositing Garment Layers...</p>
                    </div>
                  )}

                  {/* Before / After Switch Toggle */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex bg-black/70 backdrop-blur-md rounded-full p-1 border border-white/20 text-white text-xs shadow-lg">
                      <button
                        onClick={() => setViewMode('before')}
                        className={`px-3.5 py-1 rounded-full transition-all ${
                          viewMode === 'before'
                            ? 'bg-white text-[#1C1917] font-bold shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        Before
                      </button>
                      <button
                        onClick={() => setViewMode('after')}
                        className={`px-3.5 py-1 rounded-full transition-all ${
                          viewMode === 'after'
                            ? 'bg-[#B4533C] text-white font-bold shadow-xs'
                            : 'text-white/80 hover:text-white'
                        }`}
                      >
                        After
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side: Outfit Layers & Garments Details */}
            <div className="md:col-span-5 space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
                  Styling Synthesis
                </span>
                <h4 className="font-serif text-2xl font-bold text-[#1C1917] mt-0.5">
                  {activeOutfitForTryOn.name}
                </h4>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  {activeOutfitForTryOn.reason}
                </p>
              </div>

              {/* Garments in this Look */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1C1917] flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-[#B4533C]" />
                    <span>Selected Outfit Layers ({activeOutfitForTryOn.items.length})</span>
                  </span>
                </div>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {activeOutfitForTryOn.items.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] shadow-2xs"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-12 w-12 rounded-xl object-cover border border-[#E7E0D6] shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
                        <p className="text-[10px] text-[#78716C] mt-0.5">
                          {item.color} • {item.category} • {item.style}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-[#5F6F52] bg-[#5F6F52]/10 px-2.5 py-1 rounded-full shrink-0">
                        Layer {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Close & Action Buttons */}
              <div className="pt-4 border-t border-[#E7E0D6] space-y-2">
                <button
                  onClick={closeTryOn}
                  className="w-full rounded-2xl bg-[#1C1917] py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#B4533C] transition-colors"
                >
                  Save & Apply to Wardrobe Rotation
                </button>

                <p className="text-[10px] text-[#78716C] text-center">
                  Preview rendered at native viewport resolution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
