'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Heart,
  Eye,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
  Bookmark,
  Check,
  XCircle,
  ThumbsDown,
  Info,
} from 'lucide-react';
import { useWardrobeStore } from '@/store/useWardrobeStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Card3D } from '@/components/ui/Card3D';
import { RecommendationFeedbackCard } from '@/components/ui/RecommendationFeedbackCard';
import { ProductItem } from '@/types';

interface CuratedRecommendation {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
  styleTags: string[];
  whyItMatches: string;
  link: string;
  saved: boolean;
  category: string;
}

const INITIAL_RECOMMENDATIONS: CuratedRecommendation[] = [
  {
    id: 'rec-1',
    name: 'Tailored Heavyweight Linen Overshirt',
    brand: 'Studio Nicholson',
    price: 4999,
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    styleTags: ['CLASSIC', 'STREETWEAR', 'LINEN'],
    whyItMatches: 'Matches your Classic + Streetwear style and fills missing lightweight layering.',
    link: 'https://www.myntra.com',
    saved: false,
    category: 'Outerwear',
  },
  {
    id: 'rec-2',
    name: 'Relaxed Pleated Italian Chino',
    brand: 'Arket Minimal',
    price: 3499,
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80',
    styleTags: ['CASUAL', 'OLD MONEY', 'TAILORED'],
    whyItMatches: 'Matches your relaxed fit preferences and pairs seamlessly with your 3 existing tees.',
    link: 'https://www.ajio.com',
    saved: false,
    category: 'Bottoms',
  },
  {
    id: 'rec-3',
    name: 'Low-Top Minimalist Court Leather Sneakers',
    brand: 'Common Projects Alt',
    price: 6499,
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    styleTags: ['STREETWEAR', 'MINIMAL', 'LEATHER'],
    whyItMatches: 'Matches your neutral footwear palette and transitions between casual day and travel.',
    link: 'https://www.amazon.in',
    saved: true,
    category: 'Footwear',
  },
  {
    id: 'rec-4',
    name: 'Textured Waffle Boxy Tee',
    brand: 'Uniqlo U Line',
    price: 1999,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    styleTags: ['STREETWEAR', 'CASUAL', 'OVERSIZED'],
    whyItMatches: 'Matches your Classic + Streetwear style with effortless heavyweight drape.',
    link: 'https://www.myntra.com',
    saved: false,
    category: 'Tops',
  },
  {
    id: 'rec-5',
    name: 'Structured Calfskin Crossbody Messenger',
    brand: 'Marni Atelier',
    price: 7999,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    styleTags: ['OLD MONEY', 'CLASSIC', 'LEATHER'],
    whyItMatches: 'Matches your preference for minimalist accessories and smart casual travel capsules.',
    link: 'https://www.flipkart.com',
    saved: false,
    category: 'Accessories',
  },
  {
    id: 'rec-6',
    name: 'Raw Selvedge Straight Leg Jeans',
    brand: 'Nudie Denim',
    price: 5499,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80',
    styleTags: ['STREETWEAR', 'CASUAL', 'HERITAGE'],
    whyItMatches: 'Matches your durable streetwear DNA while maintaining sharp tailored proportions.',
    link: 'https://www.ajio.com',
    saved: false,
    category: 'Bottoms',
  },
];

export default function RecommendationsPage() {
  const { user } = useAuthStore();
  const [recommendations, setRecommendations] = useState<CuratedRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Accessories'];

  const filteredRecs = recommendations.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleSaveToggle = (id: string) => {
    setRecommendations((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const newState = !r.saved;
          setFeedbackNotice(newState ? `Saved to Wishlist • Style DNA reinforced` : `Removed from Wishlist`);
          setTimeout(() => setFeedbackNotice(null), 2500);
          return { ...r, saved: newState };
        }
        return r;
      })
    );
  };

  const handleNotForMe = (id: string, name: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    setFeedbackNotice(`"${name}" removed • Personalization engine updated your preferences`);
    setTimeout(() => setFeedbackNotice(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E7E0D6] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#B4533C]/10 px-3 py-1 text-xs font-bold text-[#B4533C] uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Style Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1917]">
            Picked For You
          </h1>
          <p className="text-xs sm:text-sm text-[#57534E] mt-1 font-sans">
            Personalized clothing recommendations designed to complete your capsule and match your unique Style DNA.
          </p>
        </div>

        {/* Style DNA Chip */}
        <Link
          href="/style-profile"
          className="flex items-center gap-2 rounded-2xl bg-white border border-[#E7E0D6] px-4 py-2 text-xs font-bold text-[#1C1917] hover:border-[#B4533C] shadow-2xs transition-colors"
        >
          <span className="text-[#B4533C]">Style DNA:</span>
          <span>{user?.stylePreferences?.slice(0, 2).join(' + ') || 'Classic + Streetwear'}</span>
          <ArrowRight className="h-3.5 w-3.5 text-[#78716C]" />
        </Link>
      </div>

      {/* Floating Feedback Notification */}
      {feedbackNotice && (
        <div className="rounded-2xl bg-[#1C1917] text-white px-5 py-3 text-xs flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-[#5F6F52]" />
            <span>{feedbackNotice}</span>
          </div>
          <span className="text-[10px] text-white/60">AI Feedback Loop Active</span>
        </div>
      )}

      {/* Category Pills Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#B4533C] text-white shadow-xs'
                : 'bg-white border border-[#E7E0D6] text-[#57534E] hover:border-[#D5CCC0]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Cards Grid */}
      {filteredRecs.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E7E0D6] p-12 text-center space-y-3 card-shadow">
          <ShoppingBag className="h-10 w-10 text-[#B4533C] mx-auto" />
          <h3 className="font-serif text-xl font-bold text-[#1C1917]">
            All recommendations reviewed in this category.
          </h3>
          <p className="text-xs text-[#57534E]">
            Your feedback has updated the recommendation algorithm. Check back soon for fresh picks.
          </p>
          <button
            onClick={() => setRecommendations(INITIAL_RECOMMENDATIONS)}
            className="text-xs font-bold text-[#B4533C] hover:underline pt-2 block mx-auto"
          >
            Reset Catalog
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecs.map((prod) => (
            <Card3D depth={8} key={prod.id}>
              <RecommendationFeedbackCard
                item={prod}
                onLike={(id) => {
                  setFeedbackNotice(`❤️ Liked "${prod.name}" • AI Taste calibrated for ${prod.brand}`);
                  setTimeout(() => setFeedbackNotice(null), 3000);
                }}
                onSave={(id) => handleSaveToggle(id)}
                onNotForMe={(id) => handleNotForMe(id, prod.name)}
              />
            </Card3D>
          ))}
        </div>
      )}
    </div>
  );
}
