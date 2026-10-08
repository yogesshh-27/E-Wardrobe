import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { PaginationQuerySchema } from '@backend/security/validation';
import { getPaginatedWardrobeItems, createWardrobeItem } from '@backend/wardrobe/wardrobeService';
import { jobQueue } from '@backend/workers/queue';
import { analyzeGarmentImage } from '@backend/ai/geminiService';
import { logger } from '@backend/monitoring/logger';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const { searchParams } = new URL(req.url);
    const query = PaginationQuerySchema.parse({
      page: searchParams.get('page') || 1,
      limit: searchParams.get('limit') || 20,
      folderId: searchParams.get('folderId') || undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
    });

    const result = await getPaginatedWardrobeItems(session.userId, query);
    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: {
        page: result.page,
        limit: query.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const body = await req.json();
    const { folderId, imageStorageKey, originalFilename, mimeType, fileSizeBytes, imageBase64 } = body;

    if (!imageStorageKey || !originalFilename) {
      return NextResponse.json({ error: 'Missing required storage key or filename' }, { status: 400 });
    }

    // Step 1: Create Wardrobe Item Record (status: pending/processing)
    const item = await createWardrobeItem(session.userId, {
      folderId,
      imageStorageKey,
      originalFilename,
      mimeType: mimeType || 'image/jpeg',
      fileSizeBytes: fileSizeBytes || 100000,
    });

    // Step 2: Queue Idempotent AI Job for background vision attribute extraction
    const jobId = `garment_ai_extract:${item.id}`;
    await jobQueue.add(
      'garment_ai_extract',
      {
        itemId: item.id,
        userId: session.userId,
        imageStorageKey,
        imageBase64,
        mimeType: mimeType || 'image/jpeg',
      },
      { jobId, maxAttempts: 3 }
    );

    // If imageBase64 is provided directly in request (e.g. for instant sync client flow), analyze immediately
    let attributes;
    if (imageBase64) {
      attributes = await analyzeGarmentImage(imageBase64, mimeType || 'image/jpeg');
      item.attributes = attributes;
      item.status = 'analyzed';
    }

    logger.info('[Wardrobe] Wardrobe item registered and queued for AI analysis', { itemId: item.id });

    return NextResponse.json({
      success: true,
      data: item,
      job: { id: jobId, status: 'queued' },
    });
  } catch (err: any) {
    logger.error('[Wardrobe] Failed to create wardrobe item', err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
