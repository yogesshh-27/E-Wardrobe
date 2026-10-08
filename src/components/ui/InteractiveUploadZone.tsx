'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, Camera, Sparkles, Image as ImageIcon, X, CheckCircle2, FileUp } from 'lucide-react';

interface InteractiveUploadZoneProps {
  onFileSelect: (file: File) => void;
  isAnalyzing?: boolean;
  analyzingProgress?: number;
  previewUrl?: string | null;
  onClearPreview?: () => void;
  className?: string;
}

/**
 * InteractiveUploadZone
 * Inspired by 21st.dev community components:
 * - https://21st.dev/@ephraimduncan/components/file-upload-04
 * - https://21st.dev/@uilayout.contact/components/imgpreview-dropzone
 * Adapted to WARDROBE AI luxury atelier aesthetic.
 */
export const InteractiveUploadZone: React.FC<InteractiveUploadZoneProps> = ({
  onFileSelect,
  isAnalyzing = false,
  analyzingProgress = 0,
  previewUrl = null,
  onClearPreview,
  className = '',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
          setFileDetails({ name: file.name, size: formatFileSize(file.size) });
          onFileSelect(file);
        }
      }
    },
    [onFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileDetails({ name: file.name, size: formatFileSize(file.size) });
      onFileSelect(file);
    }
  };

  const triggerBrowse = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={handleInputChange}
      />

      {!previewUrl ? (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={triggerBrowse}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              triggerBrowse();
            }
          }}
          className={`relative group cursor-pointer rounded-3xl border-2 border-dashed p-10 sm:p-14 text-center transition-all duration-300 flex flex-col items-center justify-center overflow-hidden ${
            isDragOver
              ? 'border-[#B4533C] bg-[#B4533C]/5 scale-[1.01] shadow-xl'
              : 'border-[#E7E0D6] bg-white hover:border-[#B4533C]/60 hover:bg-[#FAF8F5]'
          }`}
        >
          {/* Subtle Ambient Hover Radial */}
          <div className="pointer-events-none absolute inset-0 bg-radial from-[#C5A059]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Icon Badge */}
          <div
            className={`mb-5 flex h-20 w-20 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 ${
              isDragOver
                ? 'bg-[#B4533C] text-white scale-110 shadow-md'
                : 'bg-[#FAF8F5] text-[#B4533C] group-hover:bg-[#B4533C] group-hover:text-white group-hover:shadow-md'
            }`}
          >
            <UploadCloud className="h-10 w-10 transition-transform group-hover:-translate-y-1" />
          </div>

          <h3 className="font-serif text-2xl font-bold text-[#1C1917] tracking-tight mb-2">
            {isDragOver ? 'Drop Image Here' : 'Drag & Drop Garment Photo'}
          </h3>
          <p className="max-w-md text-xs sm:text-sm text-[#78716C] leading-relaxed mb-6 font-sans">
            Support high-res PNG, JPEG, WEBP or AVIF up to 10MB. AI Vision will automatically detect category,
            silhouette, color harmony, and fit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerBrowse();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-[#1C1917] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#332E29] transition-all"
            >
              <FileUp className="h-4 w-4 text-[#C5A059]" />
              <span>Browse Files</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerBrowse();
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E7E0D6] bg-white px-5 py-2.5 text-xs font-semibold text-[#1C1917] shadow-xs hover:bg-[#FAF8F5] transition-all"
            >
              <Camera className="h-4 w-4 text-[#B4533C]" />
              <span>Use Camera</span>
            </button>
          </div>

          <div className="mt-8 flex items-center gap-2 text-[11px] text-[#A8A29E]">
            <Sparkles className="h-3 w-3 text-[#C5A059]" />
            <span>AI Automated Background Extraction & Taxonomy Inference</span>
          </div>
        </div>
      ) : (
        /* Preview with 21st.dev Inspired Status & Progress */
        <div className="relative rounded-3xl border border-[#E7E0D6] bg-white p-6 shadow-xl overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Image Preview Box */}
            <div className="relative h-44 w-44 sm:h-52 sm:w-52 shrink-0 rounded-2xl overflow-hidden border border-[#E7E0D6] bg-[#FAF8F5] shadow-inner group">
              <img
                src={previewUrl}
                alt="Uploaded garment preview"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Scanline Animation if Analyzing */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#B4533C]/20 via-transparent to-[#B4533C]/20 animate-pulse pointer-events-none">
                  <div className="h-1 w-full bg-[#B4533C] shadow-[0_0_12px_#B4533C] animate-scanline" />
                </div>
              )}
            </div>

            {/* Meta & Status Details */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded-full bg-[#B4533C]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#B4533C] uppercase tracking-wider">
                    {isAnalyzing ? 'Analyzing Neural Attributes' : 'Image Ready'}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#1C1917] mt-1 truncate max-w-xs sm:max-w-md">
                    {fileDetails?.name || 'Garment Photograph'}
                  </h4>
                  {fileDetails?.size && (
                    <p className="text-xs text-[#78716C] mt-0.5">{fileDetails.size} • High Fidelity</p>
                  )}
                </div>

                {onClearPreview && !isAnalyzing && (
                  <button
                    type="button"
                    onClick={onClearPreview}
                    className="p-2 rounded-full text-[#78716C] hover:bg-[#FAF8F5] hover:text-[#1C1917] transition-colors"
                    title="Replace Image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Progress Bar (21st.dev inspired animated bar) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#57534E] font-medium">
                  <span>{isAnalyzing ? 'Extracting Silhouette & Colorway...' : 'Vision Analysis Complete'}</span>
                  <span>{isAnalyzing ? `${Math.round(analyzingProgress)}%` : '100%'}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#FAF8F5] overflow-hidden border border-[#E7E0D6]">
                  <div
                    className="h-full bg-gradient-to-r from-[#B4533C] to-[#C5A059] transition-all duration-300"
                    style={{ width: `${isAnalyzing ? analyzingProgress : 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs text-[#78716C]">
                {isAnalyzing ? (
                  <Sparkles className="h-4 w-4 animate-spin text-[#C5A059]" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-[#5F6F52]" />
                )}
                <span>
                  {isAnalyzing
                    ? 'Gemini 2.5 Vision running zero-shot category classification'
                    : 'Garment attributes mapped to digital wardrobe taxonomy'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
