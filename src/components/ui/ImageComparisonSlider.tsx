'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Sparkles, MoveHorizontal } from 'lucide-react';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  aspectRatio?: string;
  className?: string;
}

/**
 * ImageComparisonSlider
 * Inspired by community component on 21st.dev:
 * https://21st.dev/@kuratlielia/components/image-compare
 * Adapted to WARDROBE AI luxury editorial design tokens.
 */
export const ImageComparisonSlider: React.FC<ImageComparisonSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = 'Original Silhouette',
  afterLabel = 'AI Styled Composite',
  aspectRatio = 'aspect-3/4',
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Image comparison slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      onTouchMove={handleTouchMove}
      onTouchStart={() => setIsDragging(true)}
      onTouchEnd={() => setIsDragging(false)}
      onMouseDown={() => setIsDragging(true)}
      className={`relative select-none overflow-hidden rounded-3xl border border-[#E2E8F0] bg-[#FAF8F5] shadow-2xl focus:outline-hidden focus:ring-2 focus:ring-[#0284C7]/40 ${aspectRatio} ${className} cursor-ew-resize`}
    >
      {/* Background (After / AI Styled Composite) */}
      <img
        src={afterImage}
        alt={afterLabel}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* Styled Overlay Gradient for luxury editorial depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Foreground (Before / Original Image clipped via clip-path) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="absolute inset-0 h-full w-full object-cover filter grayscale-20 brightness-95"
          draggable={false}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
      </div>

      {/* Badges */}
      <div className="pointer-events-none absolute top-4 left-4 z-10">
        <span className="rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white/90 border border-white/20 shadow-xs">
          {beforeLabel}
        </span>
      </div>
      <div className="pointer-events-none absolute top-4 right-4 z-10">
        <span className="flex items-center gap-1.5 rounded-full bg-[#0284C7]/90 backdrop-blur-md px-3 py-1 text-[11px] font-semibold text-white border border-[#0284C7]/40 shadow-xs">
          <Sparkles className="h-3 w-3 text-[#38BDF8]" />
          {afterLabel}
        </span>
      </div>

      {/* Slider Line & Handle */}
      <div
        className="absolute top-0 bottom-0 z-20 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Luxury Gold/Obsidian Center Knob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1C1917] shadow-xl border-2 border-[#38BDF8] transition-transform group-hover:scale-110 active:scale-95">
          <MoveHorizontal className="h-4 w-4 text-[#1C1917]" />
        </div>
      </div>

      {/* Bottom Percentage pill indicator */}
      <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
        <span className="rounded-full bg-black/70 backdrop-blur-md px-3 py-0.5 text-[10px] font-medium tracking-wider text-white/80 border border-white/10 uppercase">
          Drag to Reveal • {Math.round(sliderPosition)}%
        </span>
      </div>
    </div>
  );
};
