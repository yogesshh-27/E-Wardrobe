import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { ItemAttributeConfirmSchema } from '@backend/security/validation';
import { getWardrobeItemById, deleteWardrobeItem } from '@backend/wardrobe/wardrobeService';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const item = await getWardrobeItemById(session.userId, id);
    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 404 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const item = await getWardrobeItemById(session.userId, id);
    const body = await req.json();
    const validatedAttributes = ItemAttributeConfirmSchema.parse(body);

    item.attributes = {
      ...item.attributes,
      ...validatedAttributes,
      subcategory: validatedAttributes.subcategory || item.attributes?.subcategory || 'Custom Item',
      pattern: validatedAttributes.pattern || item.attributes?.pattern || 'Solid',
      style: validatedAttributes.style || item.attributes?.style || 'Casual',
      fit: validatedAttributes.fit || item.attributes?.fit || 'Regular',
      material: validatedAttributes.material || item.attributes?.material || 'Textile',
      season: validatedAttributes.season || item.attributes?.season || ['All Season'],
      occasions: validatedAttributes.occasions || item.attributes?.occasions || ['Daily'],
      formalityLevel: validatedAttributes.formalityLevel || item.attributes?.formalityLevel || 5,
      confidence: item.attributes?.confidence || 0.95,
      versatilityScore: item.attributes?.versatilityScore || 8,
      pairingNotes: item.attributes?.pairingNotes || 'Confirmed by user.',
      accentColors: validatedAttributes.accentColors || [],
    };
    item.status = 'confirmed';
    item.updatedAt = new Date().toISOString();

    return NextResponse.json({ success: true, data: item });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    await deleteWardrobeItem(session.userId, id);
    return NextResponse.json({ success: true, message: 'Item deleted safely' });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 403 }
    );
  }
}
