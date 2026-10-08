'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, AlertCircle, Camera, Check, Eye } from 'lucide-react';
import { useOutfitStore } from '@/store/useOutfitStore';
import { useAuthStore } from '@/store/useAuthStore';

export const VirtualTryOnModal: React.FC = () => {
  const router = useRouter();
  const { activeOutfitForTryOn, isTryOnModalOpen, closeTryOn } = useOutfitStore();
  const { user } = useAuthStore();

  const [viewMode, setViewMode] = useState<'after' | 'before'>('after');
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isTryOnModalOpen || !activeOutfitForTryOn) return null;

  const hasPhoto = !!user?.profileImage;

  const handleSimulateRegenerate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-[#E7E0D6] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E7E0D6] px-6 py-4 bg-[#FAF8F5]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B4533C] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#1C1917]">
                Virtual Preview (&ldquo;See it on you&rdquo;)
              </h3>
              <p className="text-xs text-[#78716C]">{activeOutfitForTryOn.name}</p>
            </div>
          </div>
          <button
            onClick={closeTryOn}
            className="rounded-full p-1.5 text-[#57534E] hover:bg-[#E7E0D6] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mandatory Simulation Disclosure Banner (Section 14) */}
        <div className="bg-[#FAF8F5] border-b border-[#E7E0D6] px-6 py-2.5 flex items-center gap-2 text-xs text-[#B4533C]">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="font-medium">
            Preview simulation. Real AI virtual try-on engine coming soon.
          </span>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!hasPhoto ? (
            <div className="text-center py-12 px-4 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E7E0D6] text-[#B4533C]">
                <Camera className="h-8 w-8" />
              </div>
              <h4 className="font-serif font-bold text-xl text-[#1C1917]">
                Add your photo to unlock personalized outfit previews
              </h4>
              <p className="text-xs text-[#57534E] max-w-md mx-auto">
                Upload a full-body photo to visualize garments, fit proportions, and style color harmony directly on your silhouette.
              </p>
              <button
                onClick={() => {
                  closeTryOn();
                  router.push('/profile');
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#B4533C] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-colors"
              >
                <Camera className="h-4 w-4" />
                Add Photo in Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Preview Canvas with Before/After */}
              <div className="relative rounded-2xl overflow-hidden border border-[#E7E0D6] bg-[#FAF8F5] aspect-3/4 flex items-center justify-center shadow-inner group">
                <img
                  src={user.profileImage}
                  alt="User preview"
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    viewMode === 'after' ? 'filter contrast-105' : 'filter grayscale-20'
                  }`}
                />

                {/* Simulated Garment Overlay when viewMode === 'after' */}
                {viewMode === 'after' && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-4">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {activeOutfitForTryOn.items.map((garment) => (
                        <div
                          key={garment.id}
                          className="shrink-0 rounded-lg overflow-hidden border-2 border-white shadow-md w-12 h-12 bg-white"
                        >
                          <img
                            src={garment.image}
                            alt={garment.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-white/90 mt-1 font-medium">
                      Simulated garment layer active
                    </span>
                  </div>
                )}

                {/* Loading scanning overlay */}
                {isSimulating && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex flex-col items-center justify-center text-white space-y-2">
                    <div className="animate-scanline" />
                    <Sparkles className="h-6 w-6 animate-spin text-[#C5A059]" />
                    <p className="text-xs font-medium">Compositing garments...</p>
                  </div>
                )}

                {/* Top Toggle Pills */}
                <div className="absolute top-3 left-3 right-3 flex justify-between items-center">
                  <div className="flex bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20 text-white text-xs">
                    <button
                      onClick={() => setViewMode('before')}
                      className={`px-3 py-1 rounded-full transition-all ${
                        viewMode === 'before'
                          ? 'bg-white text-[#1C1917] font-bold shadow-xs'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      Before
                    </button>
                    <button
                      onClick={() => setViewMode('after')}
                      className={`px-3 py-1 rounded-full transition-all ${
                        viewMode === 'after'
                          ? 'bg-[#B4533C] text-white font-bold shadow-xs'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      After (Styled)
                    </button>
                  </div>

                  <span className="rounded-full bg-black/50 backdrop-blur-xs px-2.5 py-1 text-[10px] text-white font-medium">
                    {viewMode === 'after' ? 'Look Applied' : 'Base Photo'}
                  </span>
                </div>
              </div>

              {/* Outfit Breakdown Details */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#1C1917]">
                    {activeOutfitForTryOn.name}
                  </h4>
                  <p className="text-xs text-[#57534E] mt-1 leading-relaxed">
                    {activeOutfitForTryOn.reason}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-[#78716C]">
                    Garments in this combination
                  </p>
                  <div className="space-y-2">
                    {activeOutfitForTryOn.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-2 rounded-xl border border-[#E7E0D6] bg-[#FAF8F5]"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-10 w-10 rounded-lg object-cover border border-[#E7E0D6]"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-[#1C1917] truncate">{item.name}</p>
                          <p className="text-[10px] text-[#78716C]">
                            {item.color} • {item.category} • {item.formality}
                          </p>
                        </div>
                        <span className="text-[10px] text-[#5F6F52] font-semibold bg-[#5F6F52]/10 px-2 py-0.5 rounded-full">
                          Owned
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={handleSimulateRegenerate}
                    disabled={isSimulating}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#E7E0D6] bg-white py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
                  >
                    <Eye className="h-4 w-4 text-[#78716C]" />
                    Re-render Preview
                  </button>
                  <button
                    onClick={closeTryOn}
                    className="flex-1 rounded-xl bg-[#B4533C] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
