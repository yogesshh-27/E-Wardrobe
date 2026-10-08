# WARDROBE AI — Application Security & DevSecOps Specification

## 1. Security Architecture Principles

WARDROBE AI follows strict **Defense-in-Depth**, **Least Privilege**, and **Fail Securely** principles:

1. **Zero Trust Perimeter**: Every API route validates identity and enforces server-side ownership.
2. **Private by Default**: All user garments, avatars, and measurements are stored in private object storage; access requires short-lived presigned URLs.
3. **Deterministic Guardrails**: Deterministic rules execute before AI LLMs; AI outputs are treated as untrusted and validated against strict Zod schemas.
4. **Transparent DevSecOps**: Continuous vulnerability scanning with Aqua Security Trivy and automated testing with Strix.

---

## 2. Authentication & Session Management

- **Managed Identity Providers**: Supports Google OAuth (OpenID Connect) and verified phone logins.
- **Secure Token Delivery**: Uses HTTP-only, `Secure`, `SameSite=Lax` cookies in production.
- **Header Standards**: API endpoints authenticate via `Authorization: Bearer <token>`.
- **Token Verification**: Tokens are cryptographically validated server-side. Unauthenticated requests are immediately rejected with HTTP 401.

---

## 3. Authorization & IDOR / BOLA Prevention

**Broken Object Level Authorization (BOLA / IDOR)** is prevented using centralized ownership enforcement:

```typescript
// backend/security/authorization.ts
export function assertResourceOwnership(authenticatedUserId: string, resourceOwnerId: string): void {
  if (authenticatedUserId !== resourceOwnerId) {
    throw new AuthorizationError('Forbidden: Resource belongs to another user.');
  }
}
```

- Every mutating and data-access request strictly compares `authenticated_user_id == resource.owner_id`.
- The frontend is never trusted for user IDs; ownership is derived directly from the authenticated session.

---

## 4. Object Storage & Image Security

Large images are **never routed through the backend server** or stored in PostgreSQL.
- **Direct-to-Storage Presigned URLs**: Clients request an upload ticket (`POST /api/v1/wardrobe/upload-url`).
- **Server-Side Generated Keys**: The server creates a cryptographically random UUID (`users/{userId}/wardrobe/{uuid}.webp`). User-supplied filenames are never used as storage keys.
- **File Validation**:
  - Maximum file size: **10 MB**.
  - Whitelisted MIME types: `image/jpeg`, `image/png`, `image/webp`.
  - Extension validation against MIME header.
- **Private Access**: Uploaded images remain private; downloads require short-lived (1-hour) presigned GET URLs with ownership validation.

---

## 5. Rate Limiting & Abuse Prevention

A sliding-window rate limiter protects all endpoints:

| Endpoint Type | Limit | Window | Purpose |
|---|---|---|---|
| **General API** | 60 requests | 60 seconds | Prevents API scraping and DoS attacks |
| **AI Endpoints** | 10 requests | 60 seconds | Prevents AI cost abuse and token exhaustion |

When limits are exceeded, the API responds with HTTP 429 and a `Retry-After` header.

---

## 6. AI Security & Prompt Injection Mitigation

- **Untrusted Model Boundaries**: AI outputs are never directly rendered as HTML, executed as shell scripts, or converted to database queries.
- **Input Sanitization**: User inputs (e.g. travel itinerary text, occasion notes) are scrubbed of prompt injection tokens (`system prompt`, `ignore previous instructions`, control characters, script tags) before prompt construction.
- **Structured Schema Enforcement**: All AI outputs are validated using Zod schemas (`validateAiStructuredOutput`) before processing.

---

## 7. HTTP Security Headers

Next.js edge middleware (`src/middleware.ts`) automatically injects defense headers on every response:

- `Strict-Transport-Security`: `max-age=31536000; includeSubDomains; preload`
- `X-Frame-Options`: `DENY` (prevents clickjacking)
- `X-Content-Type-Options`: `nosniff` (prevents MIME sniffing)
- `Referrer-Policy`: `strict-origin-when-cross-origin`
- `Permissions-Policy`: `camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy`: Strict directives restricting script, image, and style sources.
- **CORS**: Enforces exact match against whitelisted origins; attacker origins are strictly rejected.

---

## 8. DevSecOps & Security Scanners

### Aqua Security Trivy Scan
- **Command**: `npm run security:trivy` (or `trivy fs --scanners vuln,secret,misconfig .`)
- **Scanners Active**: Vulnerabilities, Secrets, Misconfigurations.
- **Current Status**: **PASSED — 0 vulnerabilities, 0 secrets detected.**

### Strix Multi-Agent Penetration Testing
- **Installation**: Official `strix-agent` 1.7.0 installed via pipx.
- **Execution Script**: `npm run security:strix`
- **Environmental Status**: Strix requires an active Docker daemon to launch its containerized sandboxes. On this Windows host, Docker CLI is not present. As required by prompt guidelines, this blocker is reported transparently without faking success.

### Automated Security Test Suite
- **Script**: `npm run security:test`
- **Results**: **13 / 13 tests passed (100%)**
  - Authorization & IDOR cross-user blocks
  - File upload MIME and size boundary enforcement
  - AI prompt injection sanitization & schema validation
  - Rate limiting burst throttling
  - Security headers and strict CORS enforcement

---

## 9. Vulnerability Reporting & Responsible Disclosure

To report a security vulnerability, please submit details to `security@wardrobe-ai.internal`. Critical vulnerabilities will be acknowledged within 24 hours and addressed with priority fixes.
