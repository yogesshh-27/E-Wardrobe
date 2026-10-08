import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, userProfile, wardrobe } = body;

    const ai = getGeminiClient();

    if (ai) {
      const wardrobeList = (wardrobe || [])
        .slice(0, 15)
        .map((w: any) => `- ${w.name} (${w.category}, ${w.color}, ${w.style})`)
        .join('\n');

      const systemPrompt = `You are the lead luxury AI personal stylist for WARDROBE AI.
User Name: ${userProfile?.name || 'Stylist'}
User Style DNA: ${(userProfile?.stylePreferences || ['Classic', 'Streetwear']).join(', ')}
User Wardrobe Items:
${wardrobeList || 'No cataloged items'}

Provide encouraging, sophisticated, actionable fashion advice. Keep answers conversational, elegant, and concise (2-4 paragraphs max). Prioritize items the user owns before suggesting missing pieces.`;

      const formattedContents = (messages || []).map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] },
          ...formattedContents,
        ],
      });

      return NextResponse.json({
        reply: response.text || 'I would recommend pairing neutral tailored pieces for an effortless aesthetic.',
        source: 'gemini-ai',
      });
    }

    return NextResponse.json({
      reply:
        "Based on your Style DNA, I suggest pairing your crisp white shirting with relaxed neutral trousers and clean white sneakers. It's effortless and timeless.",
      source: 'simulated-adapter (configure GEMINI_API_KEY for live AI)',
    });
  } catch (err: any) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
