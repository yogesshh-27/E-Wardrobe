import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { destination, startDate, endDate, itineraryDays, activities, wardrobe, userProfile } = body;

    const ai = getGeminiClient();

    if (ai) {
      const wardrobeSummary = (wardrobe || [])
        .map((w: any) => `- [ID: ${w.id}] ${w.name} (${w.category}, ${w.color}, ${w.style}, ${w.fit || 'Relaxed'})`)
        .join('\n');

      const prompt = `You are the lead AI travel stylist for WARDROBE AI.
Generate a capsule wardrobe plan for a trip to "${destination}" from ${startDate} to ${endDate}.
Planned Itinerary: ${JSON.stringify(itineraryDays || [])}
Activities: ${(activities || []).join(', ')}
User Style DNA: ${(userProfile?.stylePreferences || ['Classic', 'Streetwear']).join(', ')}

Available User Wardrobe Garments:
${wardrobeSummary || 'No items cataloged yet'}

Generate a JSON object with:
1. "planTitle": "Your ${destination} Wardrobe Plan"
2. "dayOutfits": array of day objects matching each itinerary day with:
   - "dayNumber": number (1, 2, 3...)
   - "themeTitle": uppercase string like "DAY 1 — CITY EXPLORATION"
   - "topName": name of top (prefer user's wardrobe if matching, or stylish piece)
   - "bottomName": name of bottom
   - "shoesName": name of footwear
   - "accessoriesName": name of accessories
   - "reason": 1 sentence explaining why this outfit is tailored to the activity, weather and style.
3. "smartPacking":
   - "clothingCount": number of clothing items to pack (e.g. 6)
   - "shoesCount": number of shoes to pack (e.g. 2)
   - "accessoriesCount": number of accessories to pack (e.g. 3)
   - "reuseAdvice": e.g. "Your beige trousers work with 3 outfits."
   - "skipAdvice": e.g. "You don't need to pack another pair of sneakers."
   - "missingAdvice": e.g. "You may want one lightweight overshirt."
   - "packingList": array of items { "id": string, "name": string, "category": "Clothing"|"Shoes"|"Accessories", "isPacked": boolean }

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
        plan: aiResult,
      });
    }

    // Fallback if API key not configured yet
    return NextResponse.json({
      source: 'simulated-adapter (configure GEMINI_API_KEY for live AI)',
      plan: {
        planTitle: `Your ${destination} Wardrobe Plan`,
        dayOutfits: [
          {
            dayNumber: 1,
            themeTitle: 'DAY 1 — CITY EXPLORATION',
            topName: 'White Oversized Tee',
            bottomName: 'Blue Straight Jeans',
            shoesName: 'White Sneakers',
            accessoriesName: 'Watch + Sunglasses',
            reason: 'Comfortable for walking while matching your casual style.',
          },
          {
            dayNumber: 2,
            themeTitle: 'DAY 2 — DINNER',
            topName: 'Black Shirt',
            bottomName: 'Beige Trousers',
            shoesName: 'Loafers',
            accessoriesName: 'Minimal Watch',
            reason: 'Sophisticated evening contrast tailored for dining.',
          },
        ],
        smartPacking: {
          clothingCount: 6,
          shoesCount: 2,
          accessoriesCount: 3,
          reuseAdvice: 'Your beige trousers work with 3 outfits.',
          skipAdvice: "You don't need to pack another pair of sneakers.",
          missingAdvice: 'You may want one lightweight overshirt.',
          packingList: [],
        },
      },
    });
  } catch (err: any) {
    console.error('Travel API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
