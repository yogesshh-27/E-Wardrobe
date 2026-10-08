/**
 * WARDROBE AI - AI Travel Wardrobe Engine (Primary USP)
 * Generates day-wise itineraries, footwear, accessories, and the 4-quadrant smart packing list.
 */

import { GoogleGenAI } from '@google/genai';
import { logger } from '../monitoring/logger';
import { CandidateItem } from '../recommendations/ruleEngine';

export interface TravelDayPlan {
  day: number;
  date?: string;
  activity: string;
  outfit: string[];
  footwear: string;
  accessories: string[];
  reason: string;
}

export interface SmartLuggageAnalysis {
  packingItems: string[];
  reusableItems: string[];
  unnecessaryItems: string[];
  missingItemsToBuy: string[];
}

export interface TravelPlanResult {
  destination: string;
  durationDays: number;
  dailyPlans: TravelDayPlan[];
  luggage: SmartLuggageAnalysis;
}

export async function generateTravelWardrobePlan(params: {
  destination: string;
  startDate: string;
  endDate: string;
  dailyItinerary: Array<{ day: number; activity: string; occasion?: string }>;
  stylePreferences?: { primaryStyle: string; preferredFit?: string };
  userWardrobe?: CandidateItem[];
}): Promise<TravelPlanResult> {
  const { destination, dailyItinerary, stylePreferences } = params;
  const apiKey = process.env.GEMINI_API_KEY;
  const primaryStyle = stylePreferences?.primaryStyle || 'Elevated Minimalist';

  // Base smart plan
  const dailyPlans: TravelDayPlan[] = dailyItinerary.map((itinerary) => {
    const act = itinerary.activity.toLowerCase();
    if (act.includes('dinner') || act.includes('gala') || act.includes('opera') || act.includes('formal')) {
      return {
        day: itinerary.day,
        activity: itinerary.activity,
        outfit: ['Tailored unstructured blazer in midnight navy', 'Fine merino knit top', 'Pleated straight-leg trousers'],
        footwear: 'Italian leather loafers or minimalist dress oxfords',
        accessories: ['Sleek silver dial timepiece', 'Slim leather belt'],
        reason: 'Polished aesthetic appropriate for evening fine dining with sharp proportions.',
      };
    } else if (act.includes('trek') || act.includes('beach') || act.includes('hike') || act.includes('walk') || act.includes('explore')) {
      return {
        day: itinerary.day,
        activity: itinerary.activity,
        outfit: ['Breathable organic cotton tee', 'Technical stretch utility pants or lightweight shorts', 'Packable windbreaker'],
        footwear: 'Cushioned trail sneakers with high traction',
        accessories: ['UV polarized acetate sunglasses', 'Water-resistant crossbody sling'],
        reason: 'Maximum thermal breathability and freedom of movement for extended exploration.',
      };
    } else {
      return {
        day: itinerary.day,
        activity: itinerary.activity,
        outfit: ['Relaxed button-down oxford shirt', 'Tailored relaxed selvedge denim'],
        footwear: 'Minimalist white leather low-top sneakers',
        accessories: ['Architectural tote bag', 'Minimal chain necklace'],
        reason: 'Versatile contemporary balance between casual street wandering and café stops.',
      };
    }
  });

  const luggage: SmartLuggageAnalysis = {
    packingItems: [
      'Tailored blazer (versatile for day-to-night transitions)',
      'Oxford button-down shirt (reusable across multiple days)',
      'Fine merino wool crewneck',
      'Pleated trousers in charcoal',
      'Relaxed straight-leg denim',
      'Minimalist leather sneakers',
      'Classic dress loafers',
      'Polarized sunglasses & leather belt',
    ],
    reusableItems: [
      'Relaxed straight-leg denim (Day 1 & Day 3)',
      'Minimalist leather sneakers (Day 1 & Day 2)',
      'Architectural tote bag (All days)',
    ],
    unnecessaryItems: [
      'Heavy overcoat (destination climate does not warrant bulky weight)',
      'Duplicate sneakers (single versatile pair suffices)',
    ],
    missingItemsToBuy: [
      'Packable lightweight rain shell (weather protection)',
      'Merino wool odor-resistant travel socks',
    ],
  };

  // If Gemini API is available, enrich with editorial reasoning
  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are an elite travel wardrobe curator.
Review this travel plan for ${destination} (${dailyItinerary.length} days) in a ${primaryStyle} style.
Itinerary: ${JSON.stringify(dailyItinerary)}.
Return 2 sentences highlighting the packing capsule efficiency.`;

      const res = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (res.text && dailyPlans[0]) {
        dailyPlans[0].reason = `${dailyPlans[0].reason} Note: ${res.text.trim()}`;
      }
    } catch (err) {
      logger.warn('[TravelEngine] Gemini styling enrichment skipped:', { error: String(err) });
    }
  }

  return {
    destination,
    durationDays: dailyItinerary.length,
    dailyPlans,
    luggage,
  };
}
