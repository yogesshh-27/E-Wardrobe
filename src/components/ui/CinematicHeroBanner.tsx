'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Plane,
  Compass,
  Shirt,
  Play,
  Pause,
  Film,
  ArrowRight,
  Eye,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { useOutfitStore } from '@/store/useOutfitStore';

interface VideoScene {
  id: string;
  name: string;
  url: string;
  tagline: string;
}

const FASHION_SCENES: VideoScene[] = [
  {
    id: 'silk',
    name: 'Fluid Silk Atelier',
    url: 'https://cdn.coverr.co/videos/coverr-flowing-silk-fabric-4471/1080p.mp4',
    tagline: 'Textile physics & tactile draping in motion',
  },
  {
    id: 'studio',
    name: 'Editorial Runway',
    url: 'https://cdn.coverr.co/videos/coverr-fashion-model-in-the-studio-5254/1080p.mp4',
    tagline: 'Contemporary silhouette choreography',
  },
  {
    id: 'lookbook',
    name: 'Haute Lookbook',
    url: 'https://cdn.coverr.co/videos/coverr-woman-in-fashion-clothing-posing-5253/1080p.mp4',
    tagline: 'Sculptural proportions & structured tailoring',
  },
];

export function CinematicHeroBanner() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { openTryOn } = useOutfitStore();

  const currentScene = FASHION_SCENES[activeSceneIndex];

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const switchScene = (idx: number) => {
    setVideoLoaded(false);
    setActiveSceneIndex(idx);
    setIsPlaying(true);
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-[#E2E8F0]/80 shadow-2xl bg-[#1C1917] text-white">
      {/* 1. BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          ref={videoRef}
          key={currentScene.url}
          src={currentScene.url}
          autoPlay
          loop
          muted
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-55 scale-100' : 'opacity-0 scale-105'
          }`}
        />

        {/* Fallback Animated Gradient Mesh if video is loading or unsupported */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#2A2421] to-[#1C1917] opacity-60 pointer-events-none -z-10" />

        {/* Cinematic Vignette & Text Readability Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917] via-[#1C1917]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1917] via-[#1C1917]/75 to-transparent" />
      </div>

      {/* 2. FOREGROUND CONTENT */}
      <div className="relative z-10 p-6 sm:p-8 md:p-12 space-y-8">
        {/* Top Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2.5 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-xs font-semibold tracking-wider text-amber-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="uppercase">Editorial Runway Mode • AI Active</span>
          </div>

          {/* Video Scene Switcher & Playback Control */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 text-xs">
            {FASHION_SCENES.map((scene, idx) => (
              <button
                key={scene.id}
                onClick={() => switchScene(idx)}
                className={`px-3 py-1 rounded-full transition-all duration-300 font-medium ${
                  activeSceneIndex === idx
                    ? 'bg-white text-[#1C1917] shadow-sm'
                    : 'text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {scene.name.split(' ')[0]}
              </button>
            ))}

            <button
              onClick={togglePlay}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Main Editorial Headline */}
        <div className="max-w-2xl space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
          >
            Where Haute Couture Meets{' '}
            <span className="bg-gradient-to-r from-amber-200 via-stone-100 to-amber-300 bg-clip-text text-transparent italic">
              Multimodal AI.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
            className="text-sm sm:text-base md:text-lg text-stone-300 font-light leading-relaxed max-w-xl"
          >
            Organize your physical pieces, discover day-by-day travel wardrobes, and simulate 3D virtual try-ons. Your wardrobe, engineered for effortless elegance.
          </motion.p>
        </div>

        {/* Live Feature Highlights Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-3xl">
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3">
            <div className="h-9 w-9 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
              <Plane className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Smart Travel Engine</div>
              <div className="text-[10px] text-stone-400">Zero baggage waste packing</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3">
            <div className="h-9 w-9 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center shrink-0">
              <Shirt className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Gemini 2.5 Vision</div>
              <div className="text-[10px] text-stone-400">Single-pass fabric & fit tags</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Style DNA Vector</div>
              <div className="text-[10px] text-stone-400">Learns your personal taste</div>
            </div>
          </div>
        </div>

        {/* Quick Launch Action Pills */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/travel"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#1C1917] font-semibold text-xs sm:text-sm hover:bg-stone-200 transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plane className="h-4 w-4 text-[#0284C7]" />
            <span>Plan Travel Capsule</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>

          <Link
            href="/occasions"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Style an Occasion</span>
          </Link>

          <button
            onClick={() =>
              openTryOn({
                id: 'featured_editorial_look',
                userId: 'usr_demo',
                name: 'Haute Editorial Atelier Look',
                items: [],
                occasion: 'Gala & Runway Contemporary',
                style: 'Editorial Minimal',
                saved: true,
                favorite: false,
                generatedByAI: true,
                reason: 'Refined silhouette combining structured tailoring with effortless fluid drape.',
                createdAt: new Date().toISOString(),
              })
            }
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs sm:text-sm hover:bg-white/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Eye className="h-4 w-4 text-emerald-300" />
            <span>Virtual Try-On</span>
          </button>

          <Link
            href="/wardrobe/upload"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0284C7] text-white font-semibold text-xs sm:text-sm hover:bg-[#0369A1] transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>+ Add Garment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
