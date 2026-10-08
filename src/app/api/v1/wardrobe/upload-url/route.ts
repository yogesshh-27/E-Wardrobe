import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { UploadUrlRequestSchema } from '@backend/security/validation';
import { generatePresignedUploadUrl } from '@backend/storage/signedUrls';
import { rateLimiter, GENERAL_API_LIMIT } from '@backend/security/rateLimiter';
import { logger } from '@backend/monitoring/logger';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    // Rate Limiting
    const rateCheck = rateLimiter.check(`upload_url:${session.userId}`, GENERAL_API_LIMIT.max, GENERAL_API_LIMIT.windowSeconds);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before requesting additional upload tickets.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.resetTimeSeconds) } }
      );
    }

    const body = await req.json();
    const validated = UploadUrlRequestSchema.parse(body);

    const presigned = await generatePresignedUploadUrl(
      session.userId,
      validated.filename,
      validated.mimeType,
      validated.fileSizeBytes
    );

    logger.info('[Storage] Presigned upload URL generated', {
      userId: session.userId,
      storageKey: presigned.storageKey,
    });

    return NextResponse.json({
      success: true,
      data: presigned,
    });
  } catch (err: any) {
    logger.error('[Storage] Presigned URL generation failed', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Validation or authorization error' },
      { status: err.statusCode || 400 }
    );
  }
}
