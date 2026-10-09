'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Camera,
  Shield,
  Trash2,
  Check,
  UploadCloud,
  FileDown,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { storageService } from '@/services/storageService';
import { GenderPreference } from '@/types';

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, deleteAccount } = useAuthStore();
  const { items, resetWardrobe } = useWardrobeStore();

  const [name, setName] = useState(user?.name || 'Aarav Sharma');
  const [email, setEmail] = useState(user?.email || 'aarav.sharma@example.com');
  const [phone, setPhone] = useState(user?.phone || '+91 98765 43210');
  const [gender, setGender] = useState<GenderPreference>(user?.genderPreference || 'Prefer not to say');
  const [height, setHeight] = useState(user?.height || '178 cm');
  const [hairLength, setHairLength] = useState(user?.hairLength || 'Medium');
  const [hairType, setHairType] = useState(user?.hairType || 'Wavy');
  const [chest, setChest] = useState(user?.bodyMeasurements?.chest || '40');
  const [waist, setWaist] = useState(user?.bodyMeasurements?.waist || '32');
  const [hips, setHips] = useState(user?.bodyMeasurements?.hips || '38');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(user?.profileImage);

  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [confirmDeletePhoto, setConfirmDeletePhoto] = useState(false);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await storageService.storeImage(file);
      setPhotoUrl(dataUrl);
      await updateProfile({ profileImage: dataUrl });
    } catch (err: unknown) {
      alert((err as Error).message || 'Failed to upload photo');
    }
  };

  const handleRemovePhoto = async () => {
    setPhotoUrl(undefined);
    await updateProfile({ profileImage: undefined });
    setConfirmDeletePhoto(false);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      email,
      phone,
      genderPreference: gender,
      height,
      hairLength,
      hairType,
      bodyMeasurements: {
        chest,
        waist,
        hips,
        unit: 'inches',
      },
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleExportData = () => {
    const data = {
      userProfile: user,
      wardrobeCount: items.length,
      wardrobeItems: items,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `e-wardrobe-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteAccount = async () => {
    resetWardrobe();
    await deleteAccount();
    router.push('/login');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-6">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
          Style Profile & Privacy Controls
        </h1>
        <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
          Manage your personal style attributes, silhouette preferences, and total privacy rights.
        </p>
      </div>

      {isSavedNotice && (
        <div className="rounded-2xl bg-[#E87A90]/10 border border-[#E87A90]/30 p-4 text-xs font-semibold text-[#E87A90] flex items-center gap-2">
          <Check className="h-4 w-4" />
          <span>Profile updates saved successfully.</span>
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Section 1: Full-Body Photo & Avatar */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Visual Silhouette & Try-On Photo
            </h3>
            <p className="text-xs text-[#57534E] mt-1">
              Used for personalized virtual outfit simulations. You can replace or remove this anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative aspect-3/4 w-32 rounded-2xl overflow-hidden border border-[#E2E8F0] bg-[#FAF8F5] shadow-sm">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#78716C] p-2 text-center">
                  <Camera className="h-6 w-6 mb-1 text-[#0284C7]" />
                  <span className="text-[10px]">No photo added</span>
                </div>
              )}
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1C1917] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0284C7] transition-colors">
                  <UploadCloud className="h-4 w-4" />
                  <span>{photoUrl ? 'Replace Photo' : 'Upload Full-Body Photo'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {photoUrl && (
                  <>
                    {confirmDeletePhoto ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600 font-bold">Remove?</span>
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-2.5 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold"
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeletePhoto(false)}
                          className="px-2.5 py-1 rounded-lg border text-xs text-[#78716C]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDeletePhoto(true)}
                        className="rounded-xl border border-[#E2E8F0] px-4 py-2 text-xs font-semibold text-[#78716C] hover:text-red-600 transition-colors"
                      >
                        Delete Photo
                      </button>
                    )}
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#78716C]">
                Photo is stored strictly on your local browser device. Never sold or shared.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Account Details */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-6">
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            Account Credentials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3.5 py-2.5 text-xs text-[#1C1917] focus:border-[#0284C7] focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Proportions (Optional) */}
        <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-6">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#1C1917]">
              Optional Silhouette Measurements
            </h3>
            <p className="text-xs text-[#57534E] mt-1">
              Purely optional details that help tailor recommendations for proportional balance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                Height
              </label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                Hair Length
              </label>
              <select
                value={hairLength}
                onChange={(e) => setHairLength(e.target.value as any)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
              >
                <option value="Short">Short</option>
                <option value="Medium">Medium</option>
                <option value="Long">Long</option>
                <option value="Very Long">Very Long</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                Hair Type
              </label>
              <select
                value={hairType}
                onChange={(e) => setHairType(e.target.value as any)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
              >
                <option value="Straight">Straight</option>
                <option value="Wavy">Wavy</option>
                <option value="Curly">Curly</option>
                <option value="Coily">Coily</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase text-[#78716C] block mb-1">
                Waist (inches)
              </label>
              <input
                type="text"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-[#FAF8F5] px-3 py-2 text-xs text-[#1C1917]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-2xl bg-[#0284C7] px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#0369A1] transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </div>
      </form>

      {/* Section 4: Privacy & Data Ownership Section (Section 15 & 20) */}
      <div className="rounded-3xl bg-white border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-6">
        <div className="flex items-center gap-2.5">
          <Shield className="h-5 w-5 text-[#E87A90]" />
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            Privacy, Security & Data Control
          </h3>
        </div>

        <div className="rounded-2xl bg-[#FAF8F5] border border-[#E2E8F0] p-4 text-xs text-[#57534E] space-y-2 leading-relaxed">
          <p>
            <strong>Your Wardrobe, Your Property:</strong> You maintain absolute ownership of your photos, garments, and styling profile.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-[11px] text-[#78716C]">
            <li>Garment photos and try-on composites are held exclusively in local encrypted storage.</li>
            <li>No biometric, full-body, or measurement data is ever required or locked behind paywalls.</li>
            <li>You can export a complete machine-readable copy of your wardrobe anytime.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#E2E8F0]">
          {/* Export Data */}
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
          >
            <FileDown className="h-4 w-4 text-[#78716C]" />
            <span>Export My Data (JSON)</span>
          </button>

          {/* Delete Account */}
          {confirmDeleteAccount ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-red-600">
                Wipe all wardrobe data & account?
              </span>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="rounded-xl bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
              >
                Yes, Delete Everything
              </button>
              <button
                type="button"
                onClick={() => setConfirmDeleteAccount(false)}
                className="rounded-xl border border-[#E2E8F0] px-3 py-1.5 text-xs font-medium text-[#78716C]"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDeleteAccount(true)}
              className="flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete Account & Wipe Data</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
