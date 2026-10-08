/**
 * WARDROBE AI - Security Headers & Strict CORS Engine
 * Enforces defense-in-depth HTTP security response headers.
 */

export const SECURITY_HEADERS: Record<string, string> = {
  // Prevent MIME-type sniffing attacks
  'X-Content-Type-Options': 'nosniff',

  // Prevent clickjacking by forbidding embedding in iframes
  'X-Frame-Options': 'DENY',

  // Restrict browser features and APIs
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',

  // Control referrer information leakage
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Force HTTPS in modern browsers (1 year, include subdomains)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Content Security Policy (strict script & style directives, allow self and trusted CDNs)
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.googleusercontent.com https://*.storage.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://generativelanguage.googleapis.com https://*.storage.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
};

/**
 * Validates and configures CORS headers for incoming requests.
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001')
    .split(',')
    .map((o) => o.trim());

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Idempotency-Key',
    'Access-Control-Max-Age': '86400',
  };

  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Credentials'] = 'true';
  } else {
    headers['Access-Control-Allow-Origin'] = allowedOrigins[0] || 'http://localhost:3000';
  }

  return headers;
}
