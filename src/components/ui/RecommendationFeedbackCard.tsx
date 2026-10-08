'use client';

import React, { useState } from 'react';
import { Heart, ThumbsDown, Bookmark, ExternalLink, Sparkles, Check } from 'lucide-react';

export interface RecommendationItemData {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  styleTags: string[];
  whyItMatches: string;
  link: string;
  saved?: boolean;
  category: string;
}

interface RecommendationFeedbackCardProps {
  item: RecommendationItemData;
  onLike?: (id: string) => void;
  onNotForMe?: (id: string) => void;
  onSave?: (id: string) => void;
}

/**
 * RecommendationFeedbackCard
 * Inspired by 21st.dev community components:
 * - https://21st.dev/@sean0205/components/card/accent
 * - https://21st.dev/@dillionverma/components/shine-border
 * Adapted to WARDROBE AI luxury aesthetic with interactive AI feedback loop.
 */
export const RecommendationFeedbackCard: React.FC<RecommendationFeedbackCardProps> = ({
  item,
  onLike,
  onNotForMe,
  onSave,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(item.saved || false);
  const [feedbackFeedback, setFeedbackFeedback] = useState<string | null>(null);

  const handleLike = () => {
    const next = !isLiked;
    setIsLiked(next);
    if (next) {
      setFeedbackFeedback('❤️ AI Style Affinity: +5% match recorded');
      setTimeout(() => setFeedbackFeedback(null), 2500);
    }
    onLike?.(item.id);
  };

  const handleSave = () => {
    const next = !isSaved;
    setIsSaved(next);
    setFeedbackFeedback(next ? '🔖 Saved to Curation' : 'Removed from Saved');
    setTimeout(() => setFeedbackFeedback(null), 2000);
    onSave?.(item.id);
  };

  const handleDislike = () => {
    setFeedbackFeedback('👎 Taste refined: Downranking similar silhouettes');
    setTimeout(() => setFeedbackFeedback(null), 2500);
    onNotForMe?.(item.id);
  };

  return (
    <div className="relative rounded-3xl bg-white border border-[#E7E0D6] p-5 shadow-md card-shadow flex flex-col justify-between h-full space-y-4 hover:border-[#B4533C]/60 hover:shadow-xl transition-all duration-300 group">
      {/* Dynamic Taste Learning Pill Banner */}
      {feedbackFeedback && (
        <div className="absolute top-3 left-3 right-3 z-30 rounded-xl bg-[#1C1917]/95 backdrop-blur-md px-3 py-2 text-center text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-top-2 border border-white/20">
          <span>{feedbackFeedback}</span>
        </div>
      )}

      <div className="space-y-3">
        {/* Product Image Frame */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#FAF8F5]">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Brand Pill */}
          <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-[#1C1917] shadow-xs border border-white">
            {item.brand}
          </span>

          {/* Price Pill */}
          <span className="absolute bottom-3 left-3 rounded-full bg-black/80 backdrop-blur-md px-3 py-1 text-xs font-bold text-white shadow-xs border border-white/10">
            ₹{item.price.toLocaleString('en-IN')}
          </span>

          {/* Floating Heart Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all shadow-md ${
              isLiked
                ? 'bg-[#B4533C] text-white scale-110 ring-2 ring-white'
                : 'bg-white/90 text-[#78716C] hover:text-[#B4533C] hover:bg-white'
            }`}
            title="Like this recommendation"
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Title & Style Tags */}
        <div>
          <h3 className="font-serif text-lg font-bold text-[#1C1917] leading-snug group-hover:text-[#B4533C] transition-colors">
            {item.name}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#78716C] mt-1">
            {item.styleTags.join(' · ')}
          </p>
        </div>

        {/* Why It Matches AI Analysis */}
        <div className="rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] p-3 text-xs text-[#57534E] leading-relaxed">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="h-3 w-3 text-[#C5A059]" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B4533C]">
              Why It Matches Your DNA
            </span>
          </div>
          &ldquo;{item.whyItMatches}&rdquo;
        </div>
      </div>

      {/* 3 Interactive UX Action Buttons: View, Save, Not for me */}
      <div className="pt-3 border-t border-[#F4EFEA] space-y-2">
        <div className="flex gap-2">
          {/* View Boutique */}
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#1C1917] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-[#B4533C] transition-all"
          >
            <span>View Piece</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Bookmark / Save */}
          <button
            type="button"
            onClick={handleSave}
            className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold border transition-all ${
              isSaved
                ? 'border-[#5F6F52] bg-[#5F6F52] text-white shadow-xs'
                : 'border-[#E7E0D6] bg-white text-[#1C1917] hover:bg-[#FAF8F5]'
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* 👎 Not for me */}
        <button
          type="button"
          onClick={handleDislike}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-semibold text-[#78716C] hover:text-red-700 hover:bg-red-50/70 transition-colors"
        >
          <ThumbsDown className="h-3 w-3" />
          <span>Not for me • Refine Taste</span>
        </button>
      </div>
    </div>
  );
};
