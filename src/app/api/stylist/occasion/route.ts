import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { occasion, dressCode, weather, desiredLook, wardrobe, userProfile } = body;

    const ai = getGeminiClient();

    if (ai) {
      const wardrobeSummary = (wardrobe || [])
        .map((w: any) => `- [ID: ${w.id}] ${w.name} (${w.category}, ${w.color}, ${w.style}, ${w.formality})`)
        .join('\n');

      const prompt = `You are a high-end personal celebrity stylist for WARDROBE AI.
Generate a COMPLETE LOOK for the occasion "${occasion}".
Dress Code: ${dressCode || 'Smart / Festive'}
Weather: ${weather || 'Mild'}
Desired Aesthetic: ${desiredLook || 'Sophisticated & Elegant'}
User Style DNA: ${(userProfile?.stylePreferences || ['Classic']).join(', ')}
User Hair Length: ${userProfile?.hairLength || 'Medium'}
User Hair Type: ${userProfile?.hairType || 'Wavy'}

User's Existing Wardrobe Items:
${wardrobeSummary || 'No items cataloged yet'}

Generate a JSON object with:
- "outfitName": creative luxury title (e.g. "Regal Silk & Linen Dandiya Ensemble", "Minimalist Velvet Black Tie")
- "style": aesthetic genre
- "reason": 2-3 sentences explaining color harmony, silhouette proportions, and context suitability.
- "clothingPieces": array of 2-3 garment names (prioritizing user's wardrobe if suitable)
- "footwear": specific shoe recommendation
- "accessories": specific accessory pairing (timepiece, bag, jewellery)
- "hairstyleSuggestion": bespoke hairstyle advice tailored to the event and hair attributes
- "makeupSuggestion": bespoke makeup/grooming palette advice

Return ONLY valid JSON.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' },
      });

      const responseText = response.text?.trim() || '';
      const cleanJson = responseText.replace(/^```json/, '').replace(/```$/, '').trim();
      const aiResult = JSON.parse(cleanJson);

      return NextResponse.json({
        source: 'gemini-ai',
        look: aiResult,
      });
    }

    // Fallback if API key not configured yet
    return NextResponse.json({
      source: 'simulated-adapter (configure GEMINI_API_KEY for live AI)',
      look: {
        outfitName: `Curated ${occasion} Ensemble`,
        style: desiredLook || 'Elegant',
        reason: `Engineered specifically for ${occasion}. Balances texture depth and color harmony while honoring your wardrobe inventory.`,
        clothingPieces: ['Black Linen Shirt', 'Beige Tailored Trousers'],
        footwear: 'Classic Leather Loafers',
        accessories: 'Minimal Chronograph Watch',
        hairstyleSuggestion: 'Textured soft wave with subtle matte styling cream.',
        makeupSuggestion: 'Luminous dewy skin base with warm bronze neutral accents.',
      },
    });
  } catch (err: any) {
    console.error('Occasion API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
