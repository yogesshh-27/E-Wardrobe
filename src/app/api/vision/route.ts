import { NextResponse } from 'next/server';
import { analyzeGarmentWithGemini } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { image, mimeType } = body;

    if (!image) {
      return NextResponse.json({ error: 'Image data is required' }, { status: 400 });
    }

    // Attempt Real Gemini AI Analysis
    const geminiResult = await analyzeGarmentWithGemini(image, mimeType || 'image/jpeg');

    if (geminiResult) {
      return NextResponse.json({
        source: 'gemini-ai',
        analysis: geminiResult,
      });
    }

    // Graceful fallback if no API key is yet configured
    const sampleItems = [
      {
        name: 'Oversized Poplin Oxford Shirt',
        category: 'Shirts',
        color: 'White',
        style: 'Casual',
        fit: 'Relaxed',
        pattern: 'Solid',
        material: 'Cotton',
        formality: 'Smart Casual',
        occasion: ['Casual Outing', 'Office', 'Dinner'],
        tags: 'WHITE · CASUAL · RELAXED',
        confidence: 96,
      },
      {
        name: 'Relaxed Pleated Chino Trousers',
        category: 'Trousers',
        color: 'Beige',
        style: 'Classic',
        fit: 'Relaxed',
        pattern: 'Solid',
        material: 'Linen Blend',
        formality: 'Smart Casual',
        occasion: ['Casual Outing', 'Travel', 'Dinner'],
        tags: 'BEIGE · CASUAL · RELAXED',
        confidence: 94,
      },
      {
        name: 'Minimalist Leather Low-Top Sneakers',
        category: 'Sneakers',
        color: 'White',
        style: 'Streetwear',
        fit: 'Standard',
        pattern: 'Solid',
        material: 'Calfskin Leather',
        formality: 'Casual',
        occasion: ['Casual Outing', 'Travel'],
        tags: 'WHITE · CASUAL · LOW-TOP',
        confidence: 98,
      },
    ];

    const fallback = sampleItems[Math.floor(Math.random() * sampleItems.length)];

    return NextResponse.json({
      source: 'simulated-adapter (configure GEMINI_API_KEY for live AI)',
      analysis: fallback,
    });
  } catch (err: any) {
    console.error('Vision API Route error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
