import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { StylePreferenceSchema } from '@backend/security/validation';

const profileStore: Record<string, any> = {
  usr_demo_wardrobe_001: {
    primaryStyle: 'Quiet Luxury & Minimalist',
    styleWeights: {
      Classic: 0.35,
      Casual: 0.30,
      Streetwear: 0.20,
      Formal: 0.10,
      Traditional: 0.05,
    },
    fitPreferences: ['Oversized', 'Tailored Straight'],
    colorDislikes: ['Neon Yellow', 'Hot Pink'],
    aesthetics: ['Minimal', 'Monochrome', 'Quiet Luxury'],
  },
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const profile = profileStore[session.userId] || profileStore['usr_demo_wardrobe_001'];
    return NextResponse.json({ success: true, data: profile });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    const body = await req.json();
    const validated = StylePreferenceSchema.parse(body);

    profileStore[session.userId] = {
      ...profileStore[session.userId],
      ...validated,
    };

    return NextResponse.json({
      success: true,
      message: 'Style profile updated successfully',
      data: profileStore[session.userId],
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: err.statusCode || 400 }
    );
  }
}
