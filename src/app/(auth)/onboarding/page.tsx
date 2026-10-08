'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Camera,
  UploadCloud,
  User,
  Ruler,
  Scissors,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { GenderPreference } from '@/types';
import { storageService } from '@/services/storageService';

const STYLES_LIST = [
  'Traditional',
  'Western',
  'Indo-Western',
  'South Indian',
  'North Indian',
  'Trendy',
  'Sporty',
  'Old Money',
  'Streetwear',
  'Casual',
  'Classic',
  'Minimalist',
  'Elegant',
  'Formal',
  'Smart Casual',
  'Bohemian',
  'Y2K',
  'Athleisure',
  'Festive',
  'Ethnic',
  'Party Wear',
  'Mixed / I like experimenting',
];

const FITS_LIST = [
  'Fitted',
  'Relaxed',
  'Oversized',
  'Slim',
  'Loose',
  'Depends on the outfit',
  'Mixed',
  'I like experimenting with different fits',
];

const COLORS_LIST = [
  { name: 'Black', hex: '#1C1917' },
  { name: 'White', hex: '#FFFFFF', border: true },
  { name: 'Beige', hex: '#E6D7C3' },
  { name: 'Brown', hex: '#78350F' },
  { name: 'Blue', hex: '#1E40AF' },
  { name: 'Green', hex: '#166534' },
  { name: 'Pink', hex: '#F472B6' },
  { name: 'Red', hex: '#DC2626' },
  { name: 'Purple', hex: '#7C3AED' },
  { name: 'Yellow', hex: '#FACC15' },
  { name: 'Grey', hex: '#6B7280' },
  { name: 'Pastel', hex: '#BAE6FD' },
  { name: 'Earth tones', hex: '#92400E' },
  { name: 'No preference', hex: '#E5E7EB' },
];

const PATTERNS_LIST = [
  'Solid',
  'Stripes',
  'Checks',
  'Floral',
  'Printed',
  'Graphic',
  'Minimal patterns',
  'No preference',
];

const CLOTHING_PREFS = [
  'Jeans',
  'Trousers',
  'Cargo pants',
  'Skirts',
  'Dresses',
  'Kurtas',
  'Sarees',
  'Shirts',
  'T-shirts',
  'Hoodies',
  'Blazers',
  'Suits',
  'Jackets',
  'Ethnic wear',
  'Sportswear',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();

  const [step, setStep] = useState(1);

  // Form State
  const [gender, setGender] = useState<GenderPreference>('Prefer not to say');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Smart Casual', 'Minimalist']);
  const [selectedFits, setSelectedFits] = useState<string[]>(['Fitted', 'Relaxed']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['Black', 'White', 'Beige']);
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>(['Solid']);
  const [selectedClothing, setSelectedClothing] = useState<string[]>(['Shirts', 'Trousers', 'Jeans']);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user?.profileImage);
  const [hairLength, setHairLength] = useState<'Short' | 'Medium' | 'Long' | 'Very Long'>('Medium');
  const [hairType, setHairType] = useState<
    'Straight' | 'Wavy' | 'Curly' | 'Coily' | 'Other' | 'Prefer not to say'
  >('Wavy');
  const [height, setHeight] = useState('175 cm');
  const [chest, setChest] = useState('38');
  const [waist, setWaist] = useState('32');
  const [hips, setHips] = useState('38');

  const toggleItem = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await storageService.storeImage(file);
      setPhotoUrl(dataUrl);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to upload photo');
    }
  };

  const handleFinish = async () => {
    await completeOnboarding({
      genderPreference: gender,
      stylePreferences: selectedStyles,
      fitPreferences: selectedFits,
      colorPreferences: selectedColors,
      patternPreferences: selectedPatterns,
      clothingPreferences: selectedClothing,
      profileImage: photoUrl,
      hairLength,
      hairType,
      height,
      bodyMeasurements: {
        chest,
        waist,
        hips,
        unit: 'inches',
      },
    });
    router.push('/');
  };

  const nextStep = () => {
    if (step < 6) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between p-4 sm:p-8">
      {/* Header with Progress Bar */}
      <div className="max-w-2xl mx-auto w-full pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B4533C] text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-lg text-[#1C1917]">E-Wardrobe</span>
          </div>
          <span className="text-xs font-semibold text-[#78716C]">
            Step {step} of 6
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full rounded-full bg-[#E7E0D6] overflow-hidden">
          <div
            className="h-full bg-[#B4533C] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Questionnaire Card */}
      <main className="max-w-2xl mx-auto w-full my-6">
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-10 shadow-lg card-shadow">
          {/* STEP 1: GENDER PREFERENCE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  How do you identify your fashion preferences?
                </h2>
                <p className="text-xs text-[#57534E] mt-1.5">
                  E-Wardrobe is gender-neutral and inclusive. Your selections guide silhouettes and fits, never restricting styling creativity.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {(['Male', 'Female', 'Prefer not to say'] as GenderPreference[]).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setGender(opt)}
                    className={`flex items-center justify-between p-4 rounded-2xl border text-sm font-semibold transition-all ${
                      gender === opt
                        ? 'border-[#B4533C] bg-[#B4533C]/5 text-[#B4533C] shadow-xs'
                        : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:border-[#D5CCC0]'
                    }`}
                  >
                    <span>{opt}</span>
                    {gender === opt && <Check className="h-4 w-4 text-[#B4533C]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: STYLES (MULTI-SELECT) */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  What styles do you love?
                </h2>
                <p className="text-xs text-[#57534E] mt-1.5">
                  Choose as many as you like. Your AI stylist will learn from your choices.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 max-h-80 overflow-y-auto pr-1">
                {STYLES_LIST.map((style) => {
                  const isSelected = selectedStyles.includes(style);
                  return (
                    <button
                      key={style}
                      onClick={() => toggleItem(selectedStyles, setSelectedStyles, style)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'border-[#B4533C] bg-[#B4533C] text-white shadow-xs'
                          : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:bg-white hover:border-[#D5CCC0]'
                      }`}
                    >
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: FIT PREFERENCES */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  What kind of fit do you usually prefer?
                </h2>
                <p className="text-xs text-[#57534E] mt-1.5">
                  Helps calculate garment proportions and silhouettes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {FITS_LIST.map((fit) => {
                  const isSelected = selectedFits.includes(fit);
                  return (
                    <button
                      key={fit}
                      onClick={() => toggleItem(selectedFits, setSelectedFits, fit)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-[#B4533C] bg-[#B4533C]/5 text-[#B4533C]'
                          : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E] hover:border-[#D5CCC0]'
                      }`}
                    >
                      <span>{fit}</span>
                      {isSelected && <Check className="h-4 w-4 text-[#B4533C]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: COLORS, PATTERNS & CLOTHING TYPES */}
          {step === 4 && (
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  Personal style details
                </h2>
                <p className="text-xs text-[#57534E] mt-1.5">
                  All selections here are optional and refine our harmony algorithm.
                </p>
              </div>

              {/* Colors Swatches */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
                  Preferred Colors
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLORS_LIST.map((col) => {
                    const isSelected = selectedColors.includes(col.name);
                    return (
                      <button
                        key={col.name}
                        onClick={() => toggleItem(selectedColors, setSelectedColors, col.name)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-[#B4533C] bg-[#B4533C]/10 text-[#B4533C] font-bold'
                            : 'border-[#E7E0D6] bg-white text-[#57534E]'
                        }`}
                      >
                        <span
                          className={`h-3 w-3 rounded-full shrink-0 ${
                            col.border ? 'border border-[#D5CCC0]' : ''
                          }`}
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Patterns */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
                  Preferred Patterns
                </label>
                <div className="flex flex-wrap gap-2">
                  {PATTERNS_LIST.map((pat) => {
                    const isSelected = selectedPatterns.includes(pat);
                    return (
                      <button
                        key={pat}
                        onClick={() => toggleItem(selectedPatterns, setSelectedPatterns, pat)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-[#B4533C] bg-[#B4533C] text-white font-semibold'
                            : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E]'
                        }`}
                      >
                        {pat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Clothing Preferences */}
              <div className="space-y-2 pt-2">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C]">
                  Go-To Garment Types
                </label>
                <div className="flex flex-wrap gap-2">
                  {CLOTHING_PREFS.map((garment) => {
                    const isSelected = selectedClothing.includes(garment);
                    return (
                      <button
                        key={garment}
                        onClick={() => toggleItem(selectedClothing, setSelectedClothing, garment)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-[#B4533C] bg-[#B4533C] text-white font-semibold'
                            : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E]'
                        }`}
                      >
                        {garment}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: FULL-BODY PHOTO (OPTIONAL) */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  Add a full-body photo
                </h2>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  Your photo helps us create a personalized visual preview of outfits and understand how different styles may look on you.
                </p>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-[#E7E0D6] bg-[#FAF8F5] p-6 text-center space-y-4">
                {photoUrl ? (
                  <div className="space-y-3">
                    <img
                      src={photoUrl}
                      alt="Uploaded Preview"
                      className="mx-auto h-48 w-36 rounded-xl object-cover shadow-md border border-[#E7E0D6]"
                    />
                    <div className="flex justify-center gap-3">
                      <label className="cursor-pointer text-xs font-semibold text-[#B4533C] hover:underline">
                        Replace Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => setPhotoUrl(undefined)}
                        className="text-xs text-[#78716C] hover:text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 py-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xs text-[#B4533C]">
                      <Camera className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#1C1917]">
                        Upload full-body photo from device
                      </p>
                      <p className="text-[11px] text-[#78716C] mt-0.5">
                        Clear front-facing photo with good lighting works best
                      </p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1C1917] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#B4533C] transition-colors">
                      <UploadCloud className="h-4 w-4" />
                      <span>Choose Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-[#78716C] text-center italic">
                You can always add or change your photo later in your Profile.
              </p>
            </div>
          )}

          {/* STEP 6: OPTIONAL APPEARANCE & MEASUREMENTS */}
          {step === 6 && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1917]">
                  Help your AI stylist understand you better
                </h2>
                <p className="text-xs text-[#57534E] mt-1.5 leading-relaxed">
                  All details here are completely optional. You can update these details anytime from your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
                    Hair Length
                  </label>
                  <select
                    value={hairLength}
                    onChange={(e) => setHairLength(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
                  >
                    <option value="Short">Short</option>
                    <option value="Medium">Medium</option>
                    <option value="Long">Long</option>
                    <option value="Very Long">Very Long</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
                    Hair Type
                  </label>
                  <select
                    value={hairType}
                    onChange={(e) => setHairType(e.target.value as any)}
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
                  >
                    <option value="Straight">Straight</option>
                    <option value="Wavy">Wavy</option>
                    <option value="Curly">Curly</option>
                    <option value="Coily">Coily</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
                    Height
                  </label>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175 cm or 5'9"
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1.5">
                    Waist (inches)
                  </label>
                  <input
                    type="text"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="e.g. 32"
                    className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#B4533C] focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls (Back, Skip for now, Continue) */}
          <div className="flex items-center justify-between border-t border-[#E7E0D6] mt-8 pt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {(step === 4 || step === 5 || step === 6) && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="text-xs font-medium text-[#78716C] hover:text-[#1C1917] px-2"
                >
                  Skip for now
                </button>
              )}

              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-all"
              >
                <span>{step === 6 ? 'Complete & Open Wardrobe' : 'Continue'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="text-center text-[11px] text-[#A8A29E]">
        Your personal styling data is private, encrypted, and stored locally on your device.
      </div>
    </div>
  );
}
