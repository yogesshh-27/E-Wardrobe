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
  ShieldCheck,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Info,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { GenderPreference } from '@/types';
import { storageService } from '@/services/storageService';

interface StyleOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

const STYLE_CARDS: StyleOption[] = [
  {
    id: 'Traditional',
    name: 'Traditional',
    description: 'Timeless ethnic heritage & classic craftsmanship',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Western',
    name: 'Western',
    description: 'Contemporary European & American silhouettes',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Indo-Western',
    name: 'Indo-Western',
    description: 'Fusion styling blending drapes with modern cuts',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'South Indian',
    name: 'South Indian',
    description: 'Silk textures, temple borders & elegant drapes',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'North Indian',
    name: 'North Indian',
    description: 'Regal motifs, layered jackets & festive embroidery',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Trendy',
    name: 'Trendy',
    description: 'Runway-forward colors & viral seasonal pieces',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Sporty',
    name: 'Sporty',
    description: 'Athleisure performance, technical comfort & kicks',
    image: 'https://images.unsplash.com/photo-1483721074576-90f77977a4a9?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Old Money',
    name: 'Old Money',
    description: 'Quiet luxury, cashmere, linen & tailored neutrals',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Streetwear',
    name: 'Streetwear',
    description: 'Graphic statements, oversized outerwear & urban culture',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Casual',
    name: 'Casual',
    description: 'Relaxed denim, daily tees & understated ease',
    image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Classic',
    name: 'Classic',
    description: 'Crisp shirting, structured blazers & sharp tailoring',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Minimalist',
    name: 'Minimalist',
    description: 'Monochrome palettes, clean lines & zero clutter',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Mixed',
    name: 'Mixed',
    description: 'Eclectic mood, multi-genre experimental capsule',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop&q=80',
  },
];

interface FitOption {
  id: string;
  name: string;
  description: string;
  image: string;
}

const FIT_CARDS: FitOption[] = [
  {
    id: 'Fitted',
    name: 'Fitted',
    description: 'Structured silhouette accentuating natural body contours',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Relaxed',
    name: 'Relaxed',
    description: 'Effortless breathing room with refined proportions',
    image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Oversized',
    name: 'Oversized',
    description: 'Voluminous, drop-shoulder drape with modern street edge',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Depends on the outfit',
    name: 'Depends on the outfit',
    description: 'Fitted tops paired with wide bottoms or balanced layers',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
  },
  {
    id: 'Mixed',
    name: 'Mixed',
    description: 'Versatile freedom across tight, tailored and slouchy fits',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80',
  },
];

const ONBOARDING_STEPS = ['PROFILE', 'STYLE', 'FIT', 'IMAGE', 'DETAILS'] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useAuthStore();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [gender, setGender] = useState<GenderPreference>('Prefer not to say');
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Classic', 'Streetwear']);
  const [selectedFits, setSelectedFits] = useState<string[]>(['Relaxed']);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user?.profileImage);

  // Optional details
  const [hairLength, setHairLength] = useState<'Short' | 'Medium' | 'Long' | 'Very Long' | 'Prefer not to say'>('Medium');
  const [hairType, setHairType] = useState<
    'Straight' | 'Wavy' | 'Curly' | 'Coily' | 'Other' | 'Prefer not to say'
  >('Wavy');
  const [height, setHeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');

  const toggleStyle = (id: string) => {
    if (selectedStyles.includes(id)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== id));
      }
    } else {
      setSelectedStyles([...selectedStyles, id]);
    }
  };

  const toggleFit = (id: string) => {
    if (selectedFits.includes(id)) {
      if (selectedFits.length > 1) {
        setSelectedFits(selectedFits.filter((f) => f !== id));
      }
    } else {
      setSelectedFits([...selectedFits, id]);
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

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await storageService.storeImage(file);
      setPhotoUrl(dataUrl);
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to process file');
    }
  };

  const handleFinish = async () => {
    await completeOnboarding({
      genderPreference: gender,
      stylePreferences: selectedStyles,
      fitPreferences: selectedFits,
      profileImage: photoUrl,
      hairLength: hairLength === 'Prefer not to say' ? undefined : (hairLength as any),
      hairType,
      height: height || undefined,
      bodyMeasurements: chest || waist || hips ? {
        chest: chest || undefined,
        waist: waist || undefined,
        hips: hips || undefined,
        unit: 'inches',
      } : undefined,
    });
    router.push('/');
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
    else handleFinish();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header & Step Indicator */}
      <div className="max-w-4xl mx-auto w-full pt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#B4533C] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-[#1C1917]">
              WARDROBE AI
            </span>
          </div>

          <div className="text-xs font-semibold text-[#78716C] uppercase tracking-wider">
            Step {step} of 5
          </div>
        </div>

        {/* Step Progression Breadcrumb Bar */}
        <div className="bg-white border border-[#E7E0D6] rounded-2xl p-2.5 shadow-xs flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          {ONBOARDING_STEPS.map((label, idx) => {
            const stepNumber = idx + 1;
            const isCompleted = step > stepNumber;
            const isCurrent = step === stepNumber;

            return (
              <React.Fragment key={label}>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isCurrent
                      ? 'bg-[#B4533C] text-white shadow-xs'
                      : isCompleted
                      ? 'text-[#5F6F52] bg-[#5F6F52]/10'
                      : 'text-[#A8A29E]'
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-white text-[#B4533C]'
                        : isCompleted
                        ? 'bg-[#5F6F52] text-white'
                        : 'bg-[#E7E0D6] text-[#78716C]'
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : stepNumber}
                  </span>
                  <span>{label}</span>
                </div>
                {idx < ONBOARDING_STEPS.length - 1 && (
                  <span className="text-[#D5CCC0] text-xs font-bold shrink-0">→</span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Questionnaire Card Container */}
      <main className="max-w-4xl mx-auto w-full my-6 flex-1 flex flex-col justify-center">
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-6 sm:p-10 shadow-xl card-shadow">
          {/* STEP 1: GENDER & IDENTITY */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
                  Step 1 • Profile
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  How do you identify your fashion preferences?
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E]">
                  WARDROBE AI is strictly inclusive and gender-neutral. Your choice guides fit proportion templates without restricting which garments or categories you can wear.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['Male', 'Female', 'Prefer not to say'] as GenderPreference[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setGender(opt)}
                    className={`p-6 rounded-2xl border text-center transition-all ${
                      gender === opt
                        ? 'border-[#B4533C] bg-[#FAF8F5] text-[#1C1917] shadow-sm ring-2 ring-[#B4533C]/20'
                        : 'border-[#E7E0D6] bg-white text-[#57534E] hover:border-[#D5CCC0] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div
                      className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${
                        gender === opt ? 'bg-[#B4533C] text-white' : 'bg-[#FAF8F5] text-[#78716C]'
                      }`}
                    >
                      <User className="h-6 w-6" />
                    </div>
                    <span className="font-serif text-lg font-bold block">{opt}</span>
                    <span className="text-[11px] text-[#78716C] mt-1 block">
                      {opt === 'Male' && 'Tailored mens & unisex cuts'}
                      {opt === 'Female' && 'Curated womens & unisex cuts'}
                      {opt === 'Prefer not to say' && 'Unrestricted universal styling'}
                    </span>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6] p-4 flex items-start gap-3 text-xs text-[#57534E]">
                <Info className="h-4 w-4 text-[#B4533C] shrink-0 mt-0.5" />
                <span>
                  <strong>Gender-Neutral Guarantee:</strong> All wardrobe categories, skirts, kurtas, suits, sarees, and accessories remain permanently available to everyone regardless of selection.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: STYLE PREFERENCES (VISUAL CARDS) */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
                  Step 2 • Style
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  What kind of style do you prefer?
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E]">
                  Select all that inspire you. If you choose &ldquo;Mixed&rdquo;, feel free to select multiple aesthetics. Your AI stylist combines them into your unique Style DNA.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[460px] overflow-y-auto pr-1">
                {STYLE_CARDS.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <div
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 flex flex-col ${
                        isSelected
                          ? 'border-[#B4533C] ring-2 ring-[#B4533C]/30 shadow-md'
                          : 'border-[#E7E0D6] hover:border-[#D5CCC0] opacity-85 hover:opacity-100'
                      }`}
                    >
                      <div className="relative aspect-4/3 w-full overflow-hidden bg-[#FAF8F5]">
                        <img
                          src={style.image}
                          alt={style.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {isSelected && (
                          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#B4533C] text-white shadow-md">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        )}
                        <span className="absolute bottom-2 left-2 right-2 font-serif text-sm font-bold text-white tracking-wide truncate">
                          {style.name}
                        </span>
                      </div>
                      <div className="p-2.5 bg-white flex-1 flex flex-col justify-between">
                        <p className="text-[10px] text-[#78716C] leading-snug line-clamp-2">
                          {style.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span>Selected: <strong className="text-[#1C1917]">{selectedStyles.join(', ')}</strong></span>
                <span>Select multiple</span>
              </div>
            </div>
          )}

          {/* STEP 3: FIT PREFERENCE (VISUAL CARDS) */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
                  Step 3 • Fit
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  How do you usually prefer your clothes to fit?
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E]">
                  Choose your typical drape and silhouette. This informs how AI pairs layered clothing items and recommends sizes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FIT_CARDS.map((fit) => {
                  const isSelected = selectedFits.includes(fit.id);
                  return (
                    <div
                      key={fit.id}
                      onClick={() => toggleFit(fit.id)}
                      className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 p-3.5 flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#B4533C] bg-[#FAF8F5] ring-2 ring-[#B4533C]/20 shadow-md'
                          : 'border-[#E7E0D6] bg-white hover:border-[#D5CCC0] hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden mb-3 bg-[#E7E0D6]">
                        <img
                          src={fit.image}
                          alt={fit.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {isSelected && (
                          <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#B4533C] text-white shadow-md">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="font-serif text-base font-bold text-[#1C1917]">
                          {fit.name}
                        </h4>
                        <p className="text-xs text-[#78716C] mt-1 leading-relaxed">
                          {fit.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: PERSONAL IMAGE */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
                  Step 4 • Image
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  Add a photo so WARDROBE AI can personalize your styling experience.
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E]">
                  A full-body photo allows you to preview outfits virtually on your silhouette. This image is stored securely on your device and is never shared publicly.
                </p>
              </div>

              {/* Upload Drop Zone / Preview */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all ${
                  photoUrl
                    ? 'border-[#5F6F52] bg-[#5F6F52]/5'
                    : 'border-[#D5CCC0] bg-[#FAF8F5] hover:border-[#B4533C] hover:bg-white'
                }`}
              >
                {photoUrl ? (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <div className="relative aspect-3/4 w-44 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
                      <img
                        src={photoUrl}
                        alt="Uploaded preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-3 text-left">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#5F6F52]">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Silhouette Photo Loaded</span>
                      </div>
                      <p className="text-xs text-[#78716C] max-w-xs">
                        Your photo is ready for the &ldquo;See the Look&rdquo; virtual try-on preview room.
                      </p>
                      <div className="flex gap-2 pt-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E7E0D6] text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5]">
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Replace</span>
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
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-xs font-semibold text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#E7E0D6] text-[#B4533C] shadow-sm">
                      <UploadCloud className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1C1917]">
                        Drag and drop your full-body photo here
                      </p>
                      <p className="text-xs text-[#78716C] mt-1">
                        Supported formats: JPEG, PNG, WebP (up to 10MB)
                      </p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-[#1C1917] px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#B4533C] transition-all">
                      <Camera className="h-4 w-4" />
                      <span>Upload from Device</span>
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

              {/* Privacy Notice */}
              <div className="rounded-2xl bg-[#FAF8F5] border border-[#E7E0D6] p-4 flex items-center gap-3 text-xs text-[#57534E]">
                <ShieldCheck className="h-5 w-5 text-[#5F6F52] shrink-0" />
                <span>
                  <strong>Privacy First:</strong> Your photo is never shared with third parties or used for public training. It is strictly used for client-side styling overlays.
                </span>
              </div>
            </div>
          )}

          {/* STEP 5: OPTIONAL DETAILS */}
          {step === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#B4533C]">
                  Step 5 • Details
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917]">
                  Optional Personal Details
                </h2>
                <p className="text-xs sm:text-sm text-[#57534E]">
                  These details are completely optional and can be added or adjusted anytime from your profile.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Hair Length */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
                    Hair Length
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Short', 'Medium', 'Long', 'Prefer not to say'] as const).map((len) => (
                      <button
                        key={len}
                        type="button"
                        onClick={() => setHairLength(len)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          hairLength === len
                            ? 'border-[#B4533C] bg-[#B4533C]/10 text-[#B4533C] font-bold'
                            : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E]'
                        }`}
                      >
                        {len}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hair Type */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#78716C] block">
                    Hair Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Straight', 'Wavy', 'Curly', 'Coily', 'Prefer not to say'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setHairType(t)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                          hairType === t
                            ? 'border-[#B4533C] bg-[#B4533C]/10 text-[#B4533C] font-bold'
                            : 'border-[#E7E0D6] bg-[#FAF8F5] text-[#57534E]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Body Measurements (Optional) */}
              <div className="space-y-3 pt-3 border-t border-[#E7E0D6]">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
                    Body Measurements (Optional)
                  </h4>
                  <p className="text-[11px] text-[#78716C] mt-0.5">
                    Helps tailor fit recommendations. Feel free to leave blank.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-[#78716C] block mb-1">Height (cm)</label>
                    <input
                      type="text"
                      placeholder="e.g. 175"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716C] block mb-1">Chest (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 38"
                      value={chest}
                      onChange={(e) => setChest(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716C] block mb-1">Waist (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 32"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#78716C] block mb-1">Hips (in)</label>
                    <input
                      type="text"
                      placeholder="e.g. 38"
                      value={hips}
                      onChange={(e) => setHips(e.target.value)}
                      className="w-full rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls (Back, Skip, Continue) */}
          <div className="flex items-center justify-between border-t border-[#E7E0D6] pt-6 mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 rounded-2xl border border-[#E7E0D6] px-5 py-3 text-xs font-semibold text-[#57534E] hover:bg-[#FAF8F5] transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {(step === 4 || step === 5) && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-2xl px-5 py-3 text-xs font-semibold text-[#78716C] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-all"
                >
                  Skip for now
                </button>
              )}

              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 rounded-2xl bg-[#B4533C] px-8 py-3 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] active:scale-[0.99] transition-all"
              >
                <span>{step === 5 ? 'Open Wardrobe Dashboard' : 'Continue'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-[#78716C] py-2">
        WARDROBE AI Onboarding • Designed for privacy, effortless personalization and gender inclusion.
      </footer>
    </div>
  );
}
