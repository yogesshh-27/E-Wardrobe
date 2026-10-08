/**
 * WARDROBE AI - Deterministic Rule Engine
 * Evaluates domain fashion rules prior to expensive LLM calls.
 * Reduces hallucinations, cuts token costs, and guarantees hard stylistic constraints.
 */

export interface CandidateItem {
  id: string;
  name: string;
  category: string;
  color: string;
  style: string;
  fit?: string;
  material?: string;
  formalityLevel?: number;
  season?: string[];
  occasions?: string[];
}

export interface StylingContext {
  temperatureCelsius?: number;
  activity?: string;
  occasion?: string;
  formalityLevel?: number; // 1-10
  preferredFit?: string;
  colorDislikes?: string[];
}

export interface RuleEvaluationResult {
  scoreModifier: number; // e.g. +20, -30
  reasons: string[];
  eligible: boolean;
}

/**
 * Applies deterministic business rules to a single candidate wardrobe item.
 */
export function evaluateRulesForItem(item: CandidateItem, context: StylingContext): RuleEvaluationResult {
  let modifier = 0;
  const reasons: string[] = [];
  let eligible = true;

  // RULE 1: Color Dislikes (Hard Constraint)
  if (context.colorDislikes && context.colorDislikes.length > 0) {
    const itemColor = item.color.toLowerCase();
    for (const disliked of context.colorDislikes) {
      if (itemColor.includes(disliked.toLowerCase())) {
        modifier -= 50;
        reasons.push(`Penalized for containing disliked color: ${disliked}`);
        // If strict match, item is down-ranked
        eligible = false;
      }
    }
  }

  // RULE 2: Temperature > 30°C -> Breathable/lightweight, penalize heavy wool/outerwear
  if (context.temperatureCelsius !== undefined && context.temperatureCelsius > 30) {
    const heavyMaterials = ['wool', 'fleece', 'velvet', 'leather', 'down', 'cashmere'];
    const breathableMaterials = ['linen', 'cotton', 'silk', 'chambray', 'viscose'];

    if (item.category === 'Outerwear') {
      modifier -= 40;
      reasons.push('Heavy outerwear penalized for hot weather (>30°C)');
    }
    if (item.material && heavyMaterials.some((m) => item.material!.toLowerCase().includes(m))) {
      modifier -= 30;
      reasons.push('Heavy fabric penalized in heat');
    }
    if (item.material && breathableMaterials.some((m) => item.material!.toLowerCase().includes(m))) {
      modifier += 25;
      reasons.push('Breathable natural fabric prioritized for warmth');
    }
  }

  // RULE 3: Temperature < 15°C -> Prioritize outerwear and layered warmth
  if (context.temperatureCelsius !== undefined && context.temperatureCelsius < 15) {
    if (item.category === 'Outerwear' || item.style.toLowerCase().includes('layer')) {
      modifier += 30;
      reasons.push('Warm layer prioritized for cool weather (<15°C)');
    }
  }

  // RULE 4: Activity = Trekking / Active Walking -> Prioritize comfortable footwear, sneakers
  if (context.activity) {
    const act = context.activity.toLowerCase();
    if (act.includes('trek') || act.includes('hiking') || act.includes('walk') || act.includes('sightsee')) {
      if (item.category === 'Footwear') {
        const itemLower = item.name.toLowerCase();
        if (itemLower.includes('sneaker') || itemLower.includes('boot') || itemLower.includes('trainer') || itemLower.includes('flat')) {
          modifier += 35;
          reasons.push('High-support, walking-friendly footwear prioritized');
        } else if (itemLower.includes('heel') || itemLower.includes('stiletto') || itemLower.includes('oxford')) {
          modifier -= 40;
          reasons.push('Unsuitable walking footwear penalized');
        }
      }
    }
  }

  // RULE 5: Formality Alignment
  if (context.formalityLevel !== undefined && item.formalityLevel !== undefined) {
    const diff = Math.abs(context.formalityLevel - item.formalityLevel);
    if (diff <= 2) {
      modifier += 20;
      reasons.push('Formality matches occasion');
    } else if (diff >= 5) {
      modifier -= 35;
      reasons.push(`Formality discrepancy (Occasion: ${context.formalityLevel}/10 vs Item: ${item.formalityLevel}/10)`);
    }
  }

  // RULE 6: User Fit Preference (e.g. Oversized)
  if (context.preferredFit && item.fit) {
    if (context.preferredFit.toLowerCase() === item.fit.toLowerCase()) {
      modifier += 20;
      reasons.push(`Matches user's ${context.preferredFit} silhouette preference`);
    }
  }

  return {
    scoreModifier: modifier,
    reasons,
    eligible,
  };
}
