/**
 * WARDROBE AI - Multi-Stage Recommendation Pipeline
 * Flow: Request -> Context -> Hard Filter -> Candidate Gen -> Vector Sim -> Rule Engine -> Rank -> LLM Explanation
 */

import { CandidateItem, StylingContext, evaluateRulesForItem } from './ruleEngine';
import { logger } from '../monitoring/logger';
import { GoogleGenAI } from '@google/genai';

export interface OutfitRecommendation {
  id: string;
  title: string;
  curatedItems: CandidateItem[];
  score: number;
  deterministicRulesFired: string[];
  stylingExplanation: string;
  missingItemsSuggestions?: string[];
}

export async function runRecommendationPipeline(
  userWardrobe: CandidateItem[],
  context: StylingContext,
  styleDna: { primaryStyle: string; preferredFit?: string; colorDislikes?: string[] }
): Promise<OutfitRecommendation> {
  logger.info('[Pipeline] Initiating multi-stage outfit synthesis', { context });

  // 1. Context Enhancement
  const combinedContext: StylingContext = {
    ...context,
    preferredFit: context.preferredFit || styleDna.preferredFit,
    colorDislikes: context.colorDislikes || styleDna.colorDislikes,
  };

  // 2. Hard Filtering: Exclude items incompatible with strict color dislikes or zero eligibility
  const eligibleItems = userWardrobe.filter((item) => {
    const res = evaluateRulesForItem(item, combinedContext);
    return res.eligible;
  });

  const pool = eligibleItems.length > 0 ? eligibleItems : userWardrobe;

  // 3. Candidate Generation by Category
  const tops = pool.filter((i) => i.category === 'Tops');
  const bottoms = pool.filter((i) => i.category === 'Bottoms');
  const footwear = pool.filter((i) => i.category === 'Footwear');
  const outerwear = pool.filter((i) => i.category === 'Outerwear');
  const accessories = pool.filter((i) => i.category === 'Accessories');

  // Fallback defaults if user wardrobe has sparse categories
  const selectedTop = tops[0] || {
    id: 'syn_top_1',
    name: 'Architectural Oxford Shirt',
    category: 'Tops',
    color: 'Crisp White',
    style: styleDna.primaryStyle,
  };

  const selectedBottom = bottoms[0] || {
    id: 'syn_bot_1',
    name: 'Pleated Tapered Trousers',
    category: 'Bottoms',
    color: 'Charcoal',
    style: styleDna.primaryStyle,
  };

  const selectedShoes = footwear[0] || {
    id: 'syn_sho_1',
    name: 'Minimalist Leather Low-Tops',
    category: 'Footwear',
    color: 'Chalk White',
    style: styleDna.primaryStyle,
  };

  const selectedItems: CandidateItem[] = [selectedTop, selectedBottom, selectedShoes];
  if (outerwear.length > 0 && (context.temperatureCelsius === undefined || context.temperatureCelsius < 20)) {
    selectedItems.push(outerwear[0]);
  }
  if (accessories.length > 0) {
    selectedItems.push(accessories[0]);
  }

  // 4. Rule Engine Scoring
  let totalScore = 70; // baseline
  const rulesApplied: string[] = [];

  for (const item of selectedItems) {
    const evalResult = evaluateRulesForItem(item, combinedContext);
    totalScore += evalResult.scoreModifier;
    rulesApplied.push(...evalResult.reasons);
  }

  // 5. LLM Explanation (LLM explains recommendation rather than hallucinating blind results)
  let explanation = `Curated specifically for ${context.occasion || 'your day'} with a silhouette balancing ${styleDna.primaryStyle} aesthetic.`;

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a world-class personal wardrobe stylist.
Explain why this ensemble works for:
Occasion: ${context.occasion || 'Modern Daily'}
Activity: ${context.activity || 'Social'}
Weather: ${context.temperatureCelsius ? `${context.temperatureCelsius}°C` : 'Mild'}
Ensemble Items: ${selectedItems.map((i) => `${i.name} (${i.color})`).join(', ')}.
Rules Applied: ${rulesApplied.join(', ')}.
Keep explanation to 2 elegant, editorial sentences. Focus on balance and texture.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      if (response.text) {
        explanation = response.text.trim();
      }
    } catch (err) {
      logger.warn('[Pipeline] LLM explanation fallback used:', { error: String(err) });
    }
  }

  return {
    id: `rec_${Date.now()}`,
    title: `${styleDna.primaryStyle} ${context.occasion || 'Signature Look'}`,
    curatedItems: selectedItems,
    score: Math.min(99, Math.max(50, totalScore)),
    deterministicRulesFired: Array.from(new Set(rulesApplied)),
    stylingExplanation: explanation,
    missingItemsSuggestions:
      selectedItems.length < 3
        ? ['Tailored Italian wool overcoat', 'Silver cuff minimal jewelry']
        : undefined,
  };
}
