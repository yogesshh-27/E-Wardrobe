'use client';

import React from 'react';
import { Calendar, MapPin, Sparkles, Sun, CheckCircle2, CloudSun } from 'lucide-react';

export interface JourneyDayStep {
  dayNumber: number;
  title: string;
  activitiesCount: number;
  highlightTheme: string;
}

interface JourneyTimelineStepperProps {
  days: JourneyDayStep[];
  activeDay: number;
  onSelectDay: (dayNumber: number) => void;
  destinationName?: string;
  className?: string;
}

/**
 * JourneyTimelineStepper
 * Inspired by 21st.dev community components:
 * - https://21st.dev/@shadcnspace/components/timeline-02
 * - https://21st.dev/@nayan_radadiya6/components/timeline-rail
 * Adapted to WARDROBE AI Travel Planner luxury aesthetic.
 */
export const JourneyTimelineStepper: React.FC<JourneyTimelineStepperProps> = ({
  days,
  activeDay,
  onSelectDay,
  destinationName = 'Destination',
  className = '',
}) => {
  return (
    <div className={`relative rounded-3xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#F0F7FD] gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0284C7] block">
            Itinerary Sequence • 21st.dev Stepper
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] mt-0.5">
            {destinationName} Day-Wise Journey
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF8F5] border border-[#E2E8F0] px-3 py-1 text-xs font-semibold text-[#57534E]">
            <CloudSun className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>AI Climate Adaptive</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E87A90]/10 px-3 py-1 text-xs font-semibold text-[#E87A90]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{days.length} Days Synced</span>
          </span>
        </div>
      </div>

      {/* Stepper Rail & Milestones */}
      <div className="relative pt-8">
        {/* Horizontal connecting rail track */}
        <div className="absolute top-[48px] left-6 right-6 h-0.5 bg-[#E2E8F0] -z-0 hidden md:block" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 relative z-10">
          {days.map((step) => {
            const isActive = activeDay === step.dayNumber;
            return (
              <button
                key={step.dayNumber}
                type="button"
                onClick={() => onSelectDay(step.dayNumber)}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative group cursor-pointer ${
                  isActive
                    ? 'border-[#0284C7] bg-[#FAF8F5] shadow-md scale-[1.02]'
                    : 'border-[#E2E8F0] bg-white hover:border-[#0284C7]/40 hover:bg-[#FAF8F5]/50'
                }`}
              >
                {/* Step Circle Marker */}
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-transform group-hover:scale-105 ${
                      isActive
                        ? 'bg-[#0284C7] text-white shadow-xs'
                        : 'bg-[#FAF8F5] text-[#78716C] border border-[#E2E8F0]'
                    }`}
                  >
                    D{step.dayNumber}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-[#0284C7]/10 text-[#0284C7]'
                        : 'bg-[#FAF8F5] text-[#A8A29E]'
                    }`}
                  >
                    {step.activitiesCount} Activities
                  </span>
                </div>

                {/* Milestone Details */}
                <h4 className="font-serif font-bold text-sm text-[#1C1917] line-clamp-1 group-hover:text-[#0284C7] transition-colors">
                  {step.title}
                </h4>
                <p className="text-[11px] text-[#78716C] mt-1 line-clamp-1">
                  {step.highlightTheme}
                </p>

                {/* Bottom Active Glow Underline */}
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-[#0284C7] to-[#38BDF8] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
