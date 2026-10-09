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

import { StyleDnaRadialChart } from '@/components/ui/StyleDnaRadialChart';

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
    { name: 'Classic', percentage: 32, color: '#0284C7' },
    { name: 'Streetwear', percentage: 25, color: '#1C1917' },
    { name: 'Casual', percentage: 20, color: '#E87A90' },
    { name: 'Trendy', percentage: 15, color: '#38BDF8' },
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
      { name: 'Classic', percentage: 35, color: '#0284C7' },
      { name: 'Streetwear', percentage: 24, color: '#1C1917' },
      { name: 'Casual', percentage: 21, color: '#E87A90' },
      { name: 'Trendy', percentage: 12, color: '#38BDF8' },
      { name: 'Traditional', percentage: 8, color: '#78716C' },
    ]);

    setIsUpdateModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#0284C7]/10 px-3 py-1 text-xs font-bold text-[#0284C7] uppercase tracking-wider mb-2">
            <Dna className="h-3.5 w-3.5" />
            <span>Algorithmic Aesthetics • 21st.dev Radial Gauge</span>
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
          className="flex items-center gap-2 rounded-2xl bg-[#0284C7] px-5 py-3 text-xs font-semibold text-white shadow-xs hover:bg-[#0369A1] transition-colors"
        >
          <Sliders className="h-4 w-4" />
          <span>Update Style Preferences</span>
        </button>
      </div>

      {/* Main Visual "Style DNA" Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: 21st.dev Inspired Concentric Gauge & Breakdown */}
        <div className="lg:col-span-7">
          <StyleDnaRadialChart
            metrics={dnaMetrics}
            dominantArchetype="Classic Tailored"
          />
        </div>

        {/* Right Side: Tend To Prefer & Tend To Avoid */}
        <div className="lg:col-span-5 space-y-6">
          {/* Box 1: You tend to prefer */}
          <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 card-shadow space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#F0F7FD] pb-3">
              <div className="h-8 w-8 rounded-xl bg-[#E87A90]/10 text-[#E87A90] flex items-center justify-center">
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
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E2E8F0] text-xs font-medium text-[#1C1917]"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E87A90]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 2: You tend to avoid */}
          <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-7 card-shadow space-y-4">
            <div className="flex items-center gap-2.5 border-b border-[#F0F7FD] pb-3">
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
          <div className="w-full max-w-lg rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0284C7] text-white">
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
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white"
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
                  className="w-full rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white"
                />
              </div>

              <div className="rounded-2xl bg-[#FAF8F5] p-3 text-[11px] text-[#78716C]">
                Saving will recalibrate the Style DNA breakdown chart and update daily outfit recommendations.
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-medium text-[#78716C] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0284C7] text-xs font-semibold text-white shadow-xs hover:bg-[#0369A1]"
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
