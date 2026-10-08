import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { runRecommendationPipeline } from '@backend/recommendations/recommendationPipeline';
import { CandidateItem } from '@backend/recommendations/ruleEngine';
import { getPaginatedWardrobeItems } from '@backend/wardrobe/wardrobeService';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const { searchParams } = new URL(req.url);
    const occasion = searchParams.get('occasion') || 'Daily Elevated';
    const tempParam = searchParams.get('temperature');
    const temperature = tempParam ? parseFloat(tempParam) : 22;

    // Fetch user items
    const { items } = await getPaginatedWardrobeItems(session.userId, { page: 1, limit: 50 });

    const candidatePool: CandidateItem[] = items.map((i) => ({
      id: i.id,
      name: i.attributes?.subcategory || i.originalFilename,
      category: i.attributes?.category || 'Tops',
      color: i.attributes?.primaryColor || 'Neutral',
      style: i.attributes?.style || 'Minimalist',
      fit: i.attributes?.fit,
      material: i.attributes?.material,
      formalityLevel: i.attributes?.formalityLevel || 5,
    }));

    const recommendation = await runRecommendationPipeline(
      candidatePool,
      { occasion, temperatureCelsius: temperature },
      { primaryStyle: 'Minimalist Contemporary', preferredFit: 'Relaxed' }
    );

    return NextResponse.json({
      success: true,
      data: recommendation,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
