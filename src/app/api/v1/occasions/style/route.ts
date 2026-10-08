import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { OccasionStyleRequestSchema } from '@backend/security/validation';
import { rateLimiter, AI_ENDPOINT_LIMIT } from '@backend/security/rateLimiter';
import { sanitizeUserInputForPrompt } from '@backend/security/aiSanitizer';
import { generateOccasionLook } from '@backend/occasions/occasionEngine';
import { logger } from '@backend/monitoring/logger';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    // AI Rate limit
    const rateCheck = rateLimiter.check(`ai_occasion:${session.userId}`, AI_ENDPOINT_LIMIT.max, AI_ENDPOINT_LIMIT.windowSeconds);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'AI styling rate limit reached. Please wait before generating another look.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetTimeSeconds) } }
      );
    }

    const body = await req.json();
    const validated = OccasionStyleRequestSchema.parse(body);

    const sanitizedOccasion = sanitizeUserInputForPrompt(validated.occasion);
    const sanitizedVibe = validated.vibe ? sanitizeUserInputForPrompt(validated.vibe) : undefined;

    const result = await generateOccasionLook({
      occasion: sanitizedOccasion,
      formality: validated.formality,
      vibe: sanitizedVibe,
    });

    logger.info('[Occasion] Occasion look synthesized', {
      userId: session.userId,
      occasion: sanitizedOccasion,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    logger.error('[Occasion] Occasion stylist error', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
