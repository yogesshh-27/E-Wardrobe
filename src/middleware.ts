/**
 * WARDROBE AI - Next.js Global Security Middleware
 * Enforces production security headers, CORS origin verification, and request correlation IDs.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SECURITY_HEADERS, getCorsHeaders } from '@backend/security/headers';

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  // Handle preflight OPTIONS requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        ...SECURITY_HEADERS,
        ...corsHeaders,
      },
    });
  }

  const response = NextResponse.next();

  // Attach Defense-in-Depth Security Headers
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }

  // Attach CORS Headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
    // Add request correlation ID for observability
    response.headers.set('X-Request-Id', crypto.randomUUID());
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
