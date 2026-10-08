import { GoogleGenAI } from '@google/genai';

/**
 * Returns an instance of GoogleGenAI if an API key is available in environment variables.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY ||
    process.env.AI_API_KEY ||
    process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your-gemini-or-llm-api-key') {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

export const GEMINI_MODEL = process.env.AI_MODEL_NAME || 'gemini-2.5-flash';

export interface GarmentVisionOutput {
  name: string;
  category: string;
  color: string;
  style: string;
  fit: string;
  pattern: string;
  material: string;
  formality: 'Casual' | 'Smart Casual' | 'Formal' | 'Festive' | 'Athletic';
  occasion: string[];
  tags: string;
  confidence: number;
}

/**
 * Real AI Computer Vision: Analyze garment from image buffer / base64
 */
export async function analyzeGarmentWithGemini(
  base64Data: string,
  mimeType: string = 'image/jpeg'
): Promise<GarmentVisionOutput | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `You are an expert luxury fashion archivist and computer vision model for WARDROBE AI.
Analyze this single clothing item image carefully and return a JSON object with:
- "name": an elegant, descriptive title for the item (e.g. "Crisp Cotton Oxford Shirt", "Relaxed Pleated Chino")
- "category": one of ["Shirts", "T-Shirts", "Tops", "Trousers", "Jeans", "Pants", "Skirts", "Dresses", "Kurtas", "Sarees", "Suits", "Blazers", "Jackets", "Hoodies", "Sweaters", "Shoes", "Sandals", "Sneakers", "Accessories", "Bags", "Watches", "Jewellery", "Other"]
- "color": primary dominant color in standard English (e.g. "White", "Black", "Navy Blue", "Olive Green", "Beige", "Burgundy")
- "style": primary fashion aesthetic (e.g. "Casual", "Streetwear", "Classic", "Minimalist", "Old Money", "Traditional", "Trendy")
- "fit": silhouette cut (e.g. "Relaxed", "Fitted", "Oversized", "Slim", "Tailored")
- "pattern": pattern type (e.g. "Solid", "Stripes", "Checks", "Floral", "Graphic", "Textured")
- "material": estimated textile (e.g. "Cotton", "Linen", "Denim", "Silk", "Wool", "Leather")
- "formality": one of ["Casual", "Smart Casual", "Formal", "Festive", "Athletic"]
- "occasion": array of 2-4 appropriate occasions (e.g. ["Casual Outing", "Office", "Dinner", "Travel"])
- "tags": uppercase 3-word string in format "COLOR · FORMALITY · FIT" (e.g. "WHITE · CASUAL · RELAXED")
- "confidence": confidence integer between 90 and 99

Respond ONLY with valid JSON. Do not add markdown backticks if possible, or format as strict JSON.`;

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: mimeType || 'image/jpeg',
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text?.trim() || '';
    const cleanJson = responseText.replace(/^```json/, '').replace(/```$/, '').trim();
    return JSON.parse(cleanJson) as GarmentVisionOutput;
  } catch (error) {
    console.error('Gemini Vision analysis error:', error);
    return null;
  }
}
