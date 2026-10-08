'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useChatStore } from '@/store/useChatStore';

export const FloatingStylistButton: React.FC = () => {
  const { toggleOpen, isOpen } = useChatStore();

  if (isOpen) return null;

  return (
    <button
      onClick={toggleOpen}
      className="fixed bottom-20 lg:bottom-8 right-5 z-40 flex items-center gap-2 rounded-full bg-[#1C1917] px-4 py-3 text-xs font-semibold text-white shadow-xl hover:bg-[#B4533C] hover:scale-105 active:scale-95 transition-all group"
      aria-label="Ask Your AI Stylist"
    >
      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[#C5A059] group-hover:text-white transition-colors">
        <Sparkles className="h-3 w-3 animate-pulse" />
      </div>
      <span className="tracking-wide">Ask AI Stylist</span>
    </button>
  );
};
