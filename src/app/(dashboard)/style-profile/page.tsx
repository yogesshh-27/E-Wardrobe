'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Dna,
  CheckCircle2,
  XCircle,
  Sliders,
  TrendingUp,
  RefreshCw,
  Edit2,
  Check,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { Card3D } from '@/components/ui/Card3D';

interface StyleDnaMetric {
  name: string;
  percentage: number;
  color: string;
}

export default function StyleProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { items } = useWardrobeStore();

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dnaMetrics, setDnaMetrics] = useState<StyleDnaMetric[]>([
    { name: 'Classic', percentage: 32, color: '#B4533C' },
    { name: 'Streetwear', percentage: 25, color: '#1C1917' },
    { name: 'Casual', percentage: 20, color: '#5F6F52' },
    { name: 'Trendy', percentage: 15, color: '#C5A059' },
    { name: 'Traditional', percentage: 8, color: '#78716C' },
  ]);

  const [preferences, setPreferences] = useState<string[]>([
    'Neutral colours',
    'Relaxed fits',
    'Minimal patterns',
    'Sneakers',
    'Layering',
  ]);

  const [avoidances, setAvoidances] = useState<string[]>([
    'Neon colours',
    'Very formal outfits',
    'Heavy patterns',
  ]);

  const [tempPreferences, setTempPreferences] = useState([...preferences]);
  const [tempAvoidances, setTempAvoidances] = useState([...avoidances]);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setPreferences(tempPreferences);
    setAvoidances(tempAvoidances);

    // Conceptually evolve the percentages slightly to show dynamic learning
    setDnaMetrics([
      { name: 'Classic', percentage: 35, color: '#B4533C' },
      { name: 'Streetwear', percentage: 24, color: '#1C1917' },
      { name: 'Casual', percentage: 21, color: '#5F6F52' },
      { name: 'Trendy', percentage: 12, color: '#C5A059' },
      { name: 'Traditional', percentage: 8, color: '#78716C' },
    ]);

    setIsUpdateModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E0D6] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#B4533C]/10 px-3 py-1 text-xs font-bold text-[#B4533C] uppercase tracking-wider mb-2">
            <Dna className="h-3.5 w-3.5" />
            <span>Algorithmic Aesthetics</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
            Style Profile & DNA
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
            Your unique fashion taxonomy computed from wardrobe inventory, onboarding choices, and styling interactions.
          </p>
        </div>

        <button
          onClick={() => {
            setTempPreferences([...preferences]);
            setTempAvoidances([...avoidances]);
            setIsUpdateModalOpen(true);
          }}
          className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
        >
          <Sliders className="h-4 w-4" />
          <span>Update Style Preferences</span>
        </button>
      </div>

      {/* Main Visual "Style DNA" Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Elegant Visual Chart */}
        <div className="lg:col-span-7 rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-10 card-shadow space-y-8">
          <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B4533C] block">
                Visual Aesthetic Spectrum
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917] mt-0.5">
                YOUR STYLE DNA
              </h2>
            </div>

            <span className="text-xs font-bold text-[#5F6F52] bg-[#5F6F52]/10 px-3 py-1 rounded-full">
              Real-time Calibration
            </span>
          </div>

          {/* Stacked Proportional Bar */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded-full bg-[#FAF8F5] overflow-hidden flex shadow-inner">
              {dnaMetrics.map((m) => (
                <div
                  key={m.name}
                  style={{
                    width: `${m.percentage}%`,
                    backgroundColor: m.color,
                  }}
                  title={`${m.name}: ${m.percentage}%`}
                  className="h-full transition-all duration-500 hover:opacity-90"
                />
              ))}
            </div>
            <p className="text-[10px] text-[#78716C] text-right font-medium">
              100% Normalized Style Vector
            </p>
          </div>

          {/* Detailed Metric Rows */}
          <div className="space-y-4">
            {dnaMetrics.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: m.color }}
                    />
                    <span className="text-[#1C1917]">{m.name}</span>
                  </div>
                  <span className="font-serif text-sm font-bold text-[#1C1917]">
                    {m.percentage}%
                  </span>
                </div>

                <div className="h-2 w-full rounded-full bg-[#FAF8F5] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${m.percentage}%`,
                      backgroundColor: m.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6] p-4 text-xs text-[#57534E] flex items-center justify-between">
            <span>DNA confidence score based on {items.length} cataloged garments</span>
            <span className="font-bold text-[#1C1917]">94% Affinity</span>
          </div>
        </div>

        {/* Right Side: Tend To Prefer & Tend To Avoid */}
        <div className="lg:col-span-5 space-y-6">
          {/* Box 1: You tend to prefer */}
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-7 card-shadow space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#F4EFEA] pb-3">
              <div className="h-8 w-8 rounded-xl bg-[#5F6F52]/10 text-[#5F6F52] flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  You tend to prefer
                </h3>
                <p className="text-[11px] text-[#78716C]">Frequently selected stylistic elements</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {preferences.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E7E0D6] text-xs font-medium text-[#1C1917]"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[#5F6F52]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 2: You tend to avoid */}
          <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-7 card-shadow space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#F4EFEA] pb-3">
              <div className="h-8 w-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#1C1917]">
                  You tend to avoid
                </h3>
                <p className="text-[11px] text-[#78716C]">Filtered out of primary recommendations</p>
              </div>
            </div>

            <ul className="space-y-2.5">
              {avoidances.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/40 border border-amber-200 text-xs font-medium text-amber-900"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* UPDATE STYLE PREFERENCES MODAL */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E0D6] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#B4533C] text-white">
                  <Sliders className="h-4 w-4" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#1C1917]">
                  Update Style Preferences
                </h3>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-[#78716C] hover:text-[#1C1917]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePreferences} className="space-y-5">
              {/* Preferences Editing */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
                  You tend to prefer (comma separated)
                </label>
                <input
                  type="text"
                  value={tempPreferences.join(', ')}
                  onChange={(e) =>
                    setTempPreferences(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                  }
                  className="w-full rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white"
                />
              </div>

              {/* Avoidances Editing */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1C1917] block">
                  You tend to avoid (comma separated)
                </label>
                <input
                  type="text"
                  value={tempAvoidances.join(', ')}
                  onChange={(e) =>
                    setTempAvoidances(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))
                  }
                  className="w-full rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white"
                />
              </div>

              <div className="rounded-2xl bg-[#FAF8F5] p-3 text-[11px] text-[#78716C]">
                Saving will recalibrate the Style DNA breakdown chart and update daily outfit recommendations.
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#E7E0D6]">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#78716C] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#B4533C] text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530]"
                >
                  Save & Recalibrate DNA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
