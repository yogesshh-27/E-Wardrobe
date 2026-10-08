import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { RecommendationFeedbackSchema } from '@backend/security/validation';
import { updateStyleWeights, StyleWeights } from '@backend/recommendations/styleLearning';
import { logger } from '@backend/monitoring/logger';

// Default user style weights
const userStyleWeightsStore: Record<string, StyleWeights> = {
  usr_demo_wardrobe_001: {
    Classic: 0.35,
    Casual: 0.35,
    Streetwear: 0.15,
    Formal: 0.10,
    Traditional: 0.05,
  },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recommendationId } = await params;
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const body = await req.json();
    const validated = RecommendationFeedbackSchema.parse(body);

    const currentWeights = userStyleWeightsStore[session.userId] || {
      Classic: 0.35,
      Casual: 0.35,
      Streetwear: 0.15,
      Formal: 0.10,
      Traditional: 0.05,
    };

    // Update weights smoothly (e.g. adjust Streetwear or Casual based on interaction)
    const updatedWeights = updateStyleWeights(currentWeights, 'Streetwear', validated.action);
    userStyleWeightsStore[session.userId] = updatedWeights;

    logger.info('[StyleLearning] Feedback recorded and style vector adjusted', {
      userId: session.userId,
      recommendationId,
      action: validated.action,
      updatedWeights,
    });

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded and style profile vector updated',
      data: {
        recommendationId,
        action: validated.action,
        updatedStyleWeights: updatedWeights,
      },
    });
  } catch (err: any) {
    logger.error('[StyleLearning] Feedback error', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
