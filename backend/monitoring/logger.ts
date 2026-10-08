/**
 * WARDROBE AI - Secure Structured Logger
 * Sanitizes sensitive credentials, tokens, PII, and private keys from logs.
 */

const SENSITIVE_KEYS = [
  'password',
  'token',
  'authorization',
  'secret',
  'api_key',
  'apikey',
  'gemini_api_key',
  'private_key',
  'signature',
  'body_measurements',
];

function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);

  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.some((s) => lowerKey.includes(s))) {
      clean[key] = '[REDACTED_SECRET]';
    } else if (typeof value === 'object' && value !== null) {
      clean[key] = sanitizeObject(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    const sanitized = context ? sanitizeObject(context) : undefined;
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message,
        context: sanitized,
      })
    );
  },

  warn: (message: string, context?: Record<string, any>) => {
    const sanitized = context ? sanitizeObject(context) : undefined;
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'WARN',
        message,
        context: sanitized,
      })
    );
  },

  error: (message: string, error?: any, context?: Record<string, any>) => {
    const sanitizedContext = context ? sanitizeObject(context) : undefined;
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'ERROR',
        message,
        error: error?.message || error,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
        context: sanitizedContext,
      })
    );
  },

  security: (event: string, context?: Record<string, any>) => {
    const sanitized = context ? sanitizeObject(context) : undefined;
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: 'SECURITY_AUDIT',
        event,
        context: sanitized,
      })
    );
  },
};
