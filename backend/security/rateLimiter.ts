/**
 * WARDROBE AI - Sliding Window Rate Limiter
 * Provides memory and Redis-compatible sliding window rate limiting.
 * Protects against API denial-of-service and expensive AI endpoint cost abuse.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class InMemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();

  /**
   * Check and record a request.
   * @param key Unique client/user identifier (e.g. `user_123:ai` or `ip_456:general`)
   * @param maxRequests Maximum allowed requests in the time window
   * @param windowSeconds Window duration in seconds
   * @returns Object with allowed status and remaining requests
   */
  public check(key: string, maxRequests: number, windowSeconds: number): {
    allowed: boolean;
    remaining: number;
    resetTimeSeconds: number;
  } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out timestamps outside window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= maxRequests) {
      const oldestInWindow = record.timestamps[0];
      const resetTimeSeconds = Math.ceil((oldestInWindow + windowMs - now) / 1000);
      return {
        allowed: false,
        remaining: 0,
        resetTimeSeconds: Math.max(1, resetTimeSeconds),
      };
    }

    // Record this request
    record.timestamps.push(now);
    return {
      allowed: true,
      remaining: maxRequests - record.timestamps.length,
      resetTimeSeconds: windowSeconds,
    };
  }

  // Periodic garbage collection to prevent memory leaks
  public cleanup(maxAgeMs = 3600000) {
    const cutoff = Date.now() - maxAgeMs;
    for (const [key, record] of this.store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => ts > cutoff);
      if (record.timestamps.length === 0) {
        this.store.delete(key);
      }
    }
  }
}

export const rateLimiter = new InMemoryRateLimiter();

// General API rate limits: 60 req/min
export const GENERAL_API_LIMIT = { max: 60, windowSeconds: 60 };

// Strict AI rate limits: 10 req/min
export const AI_ENDPOINT_LIMIT = { max: 10, windowSeconds: 60 };
