/**
 * WARDROBE AI - Style Learning & Weighted Preference Evolution Engine
 * Adjusts style weight vectors smoothly using exponential moving averages.
 */

export interface StyleWeights {
  Classic: number;
  Casual: number;
  Streetwear: number;
  Formal: number;
  Traditional: number;
  [key: string]: number;
}

export type FeedbackAction = 'liked' | 'disliked' | 'saved' | 'skipped' | 'purchased';

// Action weight influence
const ACTION_WEIGHTS: Record<FeedbackAction, number> = {
  purchased: 0.08,
  saved: 0.05,
  liked: 0.03,
  skipped: -0.01,
  disliked: -0.04,
};

/**
 * Updates user style weights smoothly using fractional feedback adjustments.
 * Ensures all weights remain positive and sum normalized to 1.0 (100%).
 */
export function updateStyleWeights(
  currentWeights: StyleWeights,
  targetCategory: keyof StyleWeights,
  action: FeedbackAction
): StyleWeights {
  const delta = ACTION_WEIGHTS[action] || 0.02;
  const updated: StyleWeights = { ...currentWeights };

  if (updated[targetCategory] !== undefined) {
    updated[targetCategory] = Math.max(0.01, updated[targetCategory] + delta);
  }

  // Re-normalize to 1.0 (100%)
  const total = Object.values(updated).reduce((sum, val) => sum + val, 0);
  for (const key of Object.keys(updated)) {
    updated[key] = Number((updated[key] / total).toFixed(4));
  }

  return updated;
}
