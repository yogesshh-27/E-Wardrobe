import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@backend/security/auth';
import { logger } from '@backend/monitoring/logger';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const session = await authenticateRequest(authHeader);

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        role: session.role,
        authProvider: session.authProvider,
      },
    });
  } catch (err: any) {
    logger.warn('[Auth] Session check failed:', { error: err.message });
    return NextResponse.json(
      { authenticated: false, error: err.message },
      { status: err.statusCode || 401 }
    );
  }
}
