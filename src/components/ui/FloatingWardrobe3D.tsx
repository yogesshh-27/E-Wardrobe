'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface FloatingItem {
  id: string;
  name: string;
  category: string;
  image: string;
  x: number; // percentage
  y: number; // percentage
  z: number; // z-depth in px
  rotate: number; // initial rotation in deg
  delay: number; // animation delay in seconds
  scale: number;
}

const LUXURY_3D_ITEMS: FloatingItem[] = [
  {
    id: 'jacket',
    name: 'Tailored Linen Blazer',
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop&q=80',
    x: 48,
    y: 32,
    z: 40,
    rotate: -4,
    delay: 0,
    scale: 1.15,
  },
  {
    id: 'shirt',
    name: 'Crisp Cotton Oversized Shirt',
    category: 'Tops',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
    x: 20,
    y: 18,
    z: 25,
    rotate: 6,
    delay: 1.2,
    scale: 0.95,
  },
  {
    id: 'sneakers',
    name: 'Minimalist Leather Court Sneaker',
    category: 'Footwear',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
    x: 72,
    y: 54,
    z: 35,
    rotate: -8,
    delay: 0.8,
    scale: 0.92,
  },
  {
    id: 'handbag',
    name: 'Structured Calfskin Tote',
    category: 'Leather Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
    x: 22,
    y: 58,
    z: 20,
    rotate: 5,
    delay: 1.8,
    scale: 0.88,
  },
  {
    id: 'accessories',
    name: 'Chrono Minimalist Timepiece',
    category: 'Timepieces',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&auto=format&fit=crop&q=80',
    x: 68,
    y: 14,
    z: 50,
    rotate: -12,
    delay: 2.2,
    scale: 0.85,
  },
];

export const FloatingWardrobe3D: React.FC<{ interactive?: boolean; className?: string }> = ({
  interactive = true,
  className = '',
}) => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: x * 20, y: y * 20 });
  };

  const handleMouseLeave = () => {
    setMouseOffset({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-[380px] sm:h-[460px] md:h-[520px] rounded-3xl overflow-hidden bg-gradient-to-br from-[#FAF8F5] via-[#F0F7FD] to-[#EAE3D9] border border-[#E2E8F0] shadow-xl ${className}`}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Ambient Lighting & Atmosphere */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-[#0284C7]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#38BDF8]/12 blur-3xl pointer-events-none" />

      {/* Center 3D Coordinate Anchor */}
      <div
        className="absolute inset-0 transition-transform duration-500 ease-out pointer-events-none"
        style={{
          transform: `rotateY(${mouseOffset.x}deg) rotateX(${-mouseOffset.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {LUXURY_3D_ITEMS.map((item) => (
          <div
            key={item.id}
            className="absolute pointer-events-auto cursor-pointer group transition-all duration-300"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `translate(-50%, -50%) translateZ(${item.z}px) rotate(${item.rotate}deg) scale(${item.scale})`,
              transformStyle: 'preserve-3d',
              animation: `float3D 6s ease-in-out infinite alternate`,
              animationDelay: `${item.delay}s`,
            }}
          >
            {/* Card Frame */}
            <div className="relative w-36 sm:w-44 md:w-52 rounded-2xl bg-white/90 backdrop-blur-md p-2.5 sm:p-3 border border-white/60 shadow-2xl transition-all duration-300 group-hover:scale-108 group-hover:border-[#0284C7]/60 group-hover:shadow-[0_25px_50px_-12px_rgba(28,25,23,0.25)]">
              {/* Product Image */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#F0F7FD] mb-2 shadow-inner">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute top-1.5 left-1.5 rounded-full bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold tracking-wider text-white uppercase">
                  {item.category}
                </span>
              </div>

              {/* Card Meta */}
              <div className="space-y-0.5">
                <h4 className="text-[11px] sm:text-xs font-bold text-[#1C1917] truncate leading-tight">
                  {item.name}
                </h4>
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-[#78716C]">
                  <span>AI Cataloged</span>
                  <span className="text-[#0284C7] font-semibold flex items-center gap-0.5">
                    <Sparkles className="h-2.5 w-2.5" /> 3D
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Center Badge */}
      <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between pointer-events-none">
        <div className="rounded-full bg-white/80 backdrop-blur-md px-3.5 py-1.5 border border-[#E2E8F0] shadow-sm flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#E87A90] animate-pulse" />
          <span className="text-[11px] font-semibold text-[#1C1917] tracking-wide">
            WARDROBE AI • 3D Real-time Composition
          </span>
        </div>
        <span className="text-[10px] font-medium text-[#78716C] hidden sm:inline-block">
          Interactive Perspective • Drag or Move Cursor
        </span>
      </div>
    </div>
  );
};
