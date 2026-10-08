import { WardrobeItem, UserProfile } from '@/types';

// Color harmony matrices
const NEUTRAL_COLORS = ['white', 'black', 'grey', 'charcoal', 'beige', 'cream', 'camel', 'tan brown', 'brown'];

export function calculateColorHarmony(color1: string, color2: string): number {
  const c1 = color1.toLowerCase();
  const c2 = color2.toLowerCase();

  // Neutral with anything has great harmony
  if (NEUTRAL_COLORS.some((n) => c1.includes(n)) || NEUTRAL_COLORS.some((n) => c2.includes(n))) {
    return 0.9;
  }

  // Monochrome / tonal harmony
  if (c1 === c2) return 0.85;

  // Classic complementary pairs
  const complementaryPairs = [
    ['blue', 'brown'],
    ['blue', 'tan'],
    ['green', 'gold'],
    ['navy', 'burgundy'],
    ['olive', 'cream'],
  ];

  for (const [a, b] of complementaryPairs) {
    if ((c1.includes(a) && c2.includes(b)) || (c1.includes(b) && c2.includes(a))) {
      return 0.95;
    }
  }

  return 0.7;
}

export function calculateFormalityMatch(
  formality1: WardrobeItem['formality'],
  formality2: WardrobeItem['formality']
): number {
  if (formality1 === formality2) return 1.0;
  if (
    (formality1 === 'Smart Casual' && (formality2 === 'Formal' || formality2 === 'Casual')) ||
    (formality2 === 'Smart Casual' && (formality1 === 'Formal' || formality1 === 'Casual'))
  ) {
    return 0.8;
  }
  if (formality1 === 'Festive' || formality2 === 'Festive') {
    return formality1 === formality2 ? 1.0 : 0.6;
  }
  return 0.5;
}

export function scoreItemForOccasion(item: WardrobeItem, occasionName: string): number {
  const occLower = occasionName.toLowerCase();
  const match = item.occasion.some((o) => o.toLowerCase().includes(occLower) || occLower.includes(o.toLowerCase()));
  if (match) return 1.0;

  // Heuristics
  if (occLower.includes('wedding') || occLower.includes('puja') || occLower.includes('festival') || occLower.includes('dandiya')) {
    if (item.category === 'Kurtas' || item.category === 'Sarees' || item.formality === 'Festive') return 0.95;
    if (item.category === 'Suits' || item.category === 'Blazers') return 0.75;
  }

  if (occLower.includes('office') || occLower.includes('interview') || occLower.includes('business')) {
    if (item.formality === 'Formal' || item.formality === 'Smart Casual') return 0.9;
  }

  if (occLower.includes('casual') || occLower.includes('outing') || occLower.includes('sightseeing')) {
    if (item.formality === 'Casual' || item.formality === 'Smart Casual') return 0.95;
  }

  if (occLower.includes('party') || occLower.includes('dinner') || occLower.includes('date')) {
    if (item.formality === 'Smart Casual' || item.formality === 'Formal' || item.category === 'Dresses') return 0.9;
  }

  return 0.6;
}

export function scoreItemForUserProfile(item: WardrobeItem, userProfile: UserProfile): number {
  let score = 0.7;

  // Style preferences match
  if (userProfile.stylePreferences?.some((pref) => item.style.toLowerCase().includes(pref.toLowerCase()))) {
    score += 0.15;
  }

  // Color preferences match
  if (userProfile.colorPreferences?.some((col) => item.color.toLowerCase().includes(col.toLowerCase()))) {
    score += 0.1;
  }

  // Fit preferences match
  if (item.fit && userProfile.fitPreferences?.some((fit) => item.fit?.toLowerCase().includes(fit.toLowerCase()))) {
    score += 0.05;
  }

  return Math.min(score, 1.0);
}
