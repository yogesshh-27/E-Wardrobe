import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { TravelPlanRequestSchema } from '@backend/security/validation';
import { rateLimiter, AI_ENDPOINT_LIMIT } from '@backend/security/rateLimiter';
import { sanitizeUserInputForPrompt } from '@backend/security/aiSanitizer';
import { generateTravelWardrobePlan } from '@backend/travel/travelEngine';
import { logger } from '@backend/monitoring/logger';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    // Strict AI rate limit enforcement
    const rateCheck = rateLimiter.check(`ai_travel:${session.userId}`, AI_ENDPOINT_LIMIT.max, AI_ENDPOINT_LIMIT.windowSeconds);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'AI styling rate limit reached. Please wait before generating additional itineraries.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetTimeSeconds) } }
      );
    }

    const body = await req.json();
    const validated = TravelPlanRequestSchema.parse(body);

    // Sanitize user-provided text inputs against prompt injection
    const sanitizedDestination = sanitizeUserInputForPrompt(validated.destination);
    const sanitizedItinerary = validated.dailyItinerary.map((item) => ({
      ...item,
      activity: sanitizeUserInputForPrompt(item.activity),
      occasion: item.occasion ? sanitizeUserInputForPrompt(item.occasion) : undefined,
    }));

    const result = await generateTravelWardrobePlan({
      destination: sanitizedDestination,
      startDate: validated.startDate,
      endDate: validated.endDate,
      dailyItinerary: sanitizedItinerary,
      stylePreferences: { primaryStyle: 'Minimalist Contemporary' },
    });

    logger.info('[Travel] Travel wardrobe generated', {
      userId: session.userId,
      destination: sanitizedDestination,
      durationDays: result.durationDays,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    logger.error('[Travel] Travel generation error', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
