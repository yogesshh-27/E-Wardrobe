/**
 * WARDROBE AI - AI Input Sanitization & Prompt Injection Protection
 * Treats all AI inputs and outputs as untrusted boundaries.
 */

import { z } from 'zod';

// Disallowed patterns indicating prompt injection or jailbreak attempts
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /dan\s+mode/i,
  /jailbreak/i,
  /reveal\s+(the\s+)?(system|secret|internal)/i,
  /<script[\s\S]*?>[\s\S]*?<\/script>/i,
  /drop\s+table/i,
  /union\s+select/i,
  /exec\s*\(/i,
];

/**
 * Sanitizes user-provided text inputs before feeding them to AI prompts.
 * Strips dangerous tokens, control characters, and detects injection patterns.
 */
export function sanitizeUserInputForPrompt(input: string, maxLength = 1000): string {
  if (!input) return '';

  // Limit character length to prevent buffer/token exhaustion attacks
  let sanitized = input.slice(0, maxLength);

  // Strip null bytes and non-printable control characters
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // Check for common prompt injection patterns
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      // Defang or neutralize malicious injection payload
      sanitized = sanitized.replace(pattern, '[REDACTED_SUSPICIOUS_CONTENT]');
    }
  }

  // HTML entity encode dangerous characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

  return sanitized.trim();
}

/**
 * Validates and safely parses AI output against a strict Zod schema.
 * Rejects arbitrary or un-typed AI output before returning to clients.
 */
export function validateAiStructuredOutput<T>(rawOutput: unknown, schema: z.ZodSchema<T>): T {
  const result = schema.safeParse(rawOutput);
  if (!result.success) {
    throw new Error(`AI Output Schema Validation Failed: ${result.error.message}`);
  }
  return result.data;
}
