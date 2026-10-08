'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sliders,
  Sparkles,
  RotateCcw,
  Bell,
  Globe,
  Palette,
  Check,
  AlertCircle,
  FileDown,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';

export default function SettingsPage() {
  const router = useRouter();
  const { loadDemoWardrobe, resetWardrobe, items } = useWardrobeStore();
  const { user, deleteAccount } = useAuthStore();

  const [units, setUnits] = useState<'cm' | 'inches'>('inches');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [themeMode, setThemeMode] = useState<'light' | 'system'>('light');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoadDemo = () => {
    loadDemoWardrobe();
    showToast('Loaded 20 curated demo wardrobe items successfully!');
  };

  const handleResetApp = async () => {
    if (confirm('Are you sure you want to reset your wardrobe to an empty state?')) {
      resetWardrobe();
      showToast('Wardrobe reset to 0 items.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#E7E0D6] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          App Settings & Demo Environment
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          Configure preference toggles, measurement standards, and prototype demonstration data.
        </p>
      </div>

      {toastMessage && (
        <div className="rounded-2xl bg-[#5F6F52]/10 border border-[#5F6F52]/30 p-4 text-xs font-semibold text-[#5F6F52] flex items-center gap-2 animate-in fade-in">
          <Check className="h-4 w-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Demo Data Management Box (Section 19) */}
      <div className="rounded-3xl bg-linear-to-br from-white to-[#FAF8F5] border border-[#B4533C]/20 p-6 sm:p-8 card-shadow space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#B4533C] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Prototype Demonstration Data
            </h3>
            <p className="text-xs text-[#57534E]">
              Current wardrobe inventory: <span className="font-bold">{items.length} items</span>
            </p>
          </div>
        </div>

        <p className="text-xs text-[#57534E] leading-relaxed">
          Need to test the Occasion Stylist, Travel Planner, and Virtual Try-On instantly? You can load a curated capsule of 20 realistic fashion pieces (shirts, trousers, blazers, kurtas, sarees, outerwear, shoes, and accessories) or clear the inventory to experience the zero-state onboarding.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-2 rounded-xl bg-[#B4533C] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#9E4530] transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            <span>Load 20-Item Demo Wardrobe</span>
          </button>

          <button
            onClick={handleResetApp}
            className="flex items-center gap-2 rounded-xl border border-[#E7E0D6] bg-white px-5 py-2.5 text-xs font-semibold text-[#78716C] hover:text-red-600 hover:border-red-200 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Wardrobe to 0 Items</span>
          </button>
        </div>
      </div>

      {/* App Preferences */}
      <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-8 card-shadow space-y-6">
        <h3 className="font-serif text-xl font-bold text-[#1C1917]">
          Preferences & Notifications
        </h3>

        <div className="space-y-4 divide-y divide-[#F4EFEA]">
          {/* Unit selection */}
          <div className="flex items-center justify-between pt-2">
            <div>
              <p className="text-xs font-bold text-[#1C1917]">Measurement Units</p>
              <p className="text-[11px] text-[#78716C]">Used for silhouette sizing and garment fits</p>
            </div>
            <div className="flex rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] p-1">
              <button
                onClick={() => setUnits('inches')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  units === 'inches' ? 'bg-white text-[#1C1917] shadow-2xs' : 'text-[#78716C]'
                }`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnits('cm')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                  units === 'cm' ? 'bg-white text-[#1C1917] shadow-2xs' : 'text-[#78716C]'
                }`}
              >
                Centimeters (cm)
              </button>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs font-bold text-[#1C1917]">Styling & Occasion Reminders</p>
              <p className="text-[11px] text-[#78716C]">
                Receive morning look alerts and upcoming occasion suggestions
              </p>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`h-6 w-11 rounded-full transition-colors relative ${
                notificationsEnabled ? 'bg-[#B4533C]' : 'bg-[#E7E0D6]'
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white shadow-xs transform transition-transform ${
                  notificationsEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {/* Theme Mode */}
          <div className="flex items-center justify-between pt-4">
            <div>
              <p className="text-xs font-bold text-[#1C1917]">Interface Theme</p>
              <p className="text-[11px] text-[#78716C]">Editorial cream & terracotta luxury styling</p>
            </div>
            <span className="text-xs font-semibold text-[#57534E] bg-[#FAF8F5] px-3 py-1.5 rounded-xl border border-[#E7E0D6]">
              Light Editorial (Default)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
