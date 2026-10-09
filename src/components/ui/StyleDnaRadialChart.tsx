'use client';

import React, { useState } from 'react';
import { Sparkles, Dna, Info } from 'lucide-react';

export interface StyleTaxonomyItem {
  name: string;
  percentage: number;
  color: string;
  description?: string;
}

interface StyleDnaRadialChartProps {
  metrics: StyleTaxonomyItem[];
  dominantArchetype?: string;
  className?: string;
}

/**
 * StyleDnaRadialChart
 * Inspired by 21st.dev community components:
 * - https://21st.dev/@dillionverma/components/animated-circular-progress-bar
 * - https://21st.dev/@ephraimduncan/components/stats-cards-with-links/stats-cards-with-circular-progress
 * Adapted to WARDROBE AI luxury aesthetic.
 */
export const StyleDnaRadialChart: React.FC<StyleDnaRadialChartProps> = ({
  metrics,
  dominantArchetype = 'Classic Atelier',
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Concentric circle radius calculation
  const size = 260;
  const strokeWidth = 10;
  const center = size / 2;

  return (
    <div className={`rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xl ${className}`}>
      <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Circular Concentric Rings SVG */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="rotate-[-90deg] transition-all duration-500"
            role="img"
            aria-label="Style DNA Radial Composition Gauge"
          >
            {metrics.map((metric, i) => {
              const radius = 105 - i * 16;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (metric.percentage / 100) * circumference;
              const isHovered = hoveredIdx === i;

              return (
                <g key={metric.name} className="transition-all duration-300">
                  {/* Background Track Ring */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke="#F0F7FD"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                  />

                  {/* Active Animated Progress Arc */}
                  <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={metric.color}
                    strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                    style={{
                      opacity: hoveredIdx === null || isHovered ? 1 : 0.4,
                      filter: isHovered ? `drop-shadow(0 0 6px ${metric.color}80)` : 'none',
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Archetype Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#78716C]">
              Dominant Style
            </span>
            <span className="font-serif text-lg sm:text-xl font-bold text-[#1C1917] mt-0.5">
              {hoveredIdx !== null ? metrics[hoveredIdx].name : dominantArchetype}
            </span>
            <span className="rounded-full bg-[#0284C7]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0284C7] mt-1">
              {hoveredIdx !== null ? `${metrics[hoveredIdx].percentage}% Weight` : `${metrics[0]?.percentage || 32}% Core`}
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Legend Cards (21st.dev Style Segmented Bars) */}
        <div className="flex-1 w-full space-y-3.5">
          <div className="flex items-center justify-between pb-1 border-b border-[#F0F7FD]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">
              Archetype Breakdown
            </span>
            <span className="text-xs text-[#A8A29E] font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#38BDF8]" />
              Multi-factor synthesis
            </span>
          </div>

          {metrics.map((metric, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={metric.name}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'border-[#0284C7] bg-[#FAF8F5] shadow-xs translate-x-1'
                    : 'border-transparent bg-[#FAF8F5]/60 hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="h-3 w-3 rounded-full transition-transform"
                      style={{
                        backgroundColor: metric.color,
                        transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                    <span className="font-serif font-bold text-sm text-[#1C1917]">
                      {metric.name}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#1C1917]">
                    {metric.percentage}%
                  </span>
                </div>

                {/* Segmented Bar */}
                <div className="h-2 w-full rounded-full bg-[#E2E8F0]/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${metric.percentage}%`,
                      backgroundColor: metric.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
