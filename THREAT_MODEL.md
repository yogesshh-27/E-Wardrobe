# WARDROBE AI — Threat Model & Risk Analysis

## 1. System Assets

| Asset ID | Asset Name | Sensitivity Level | Description |
|---|---|---|---|
| **AST-01** | User Accounts & Credentials | Critical | Google OAuth tokens, phone verification records, session IDs |
| **AST-02** | Personal Images & Try-On Photos | High | Private wardrobe photos, try-on avatars, user likeness |
| **AST-03** | Wardrobe Inventory & Outfits | Medium | Garments, custom folders, outfit combinations |
| **AST-04** | Body Measurements & Hair Details | High (PII) | Sensitive biometric sizing and physical attributes |
| **AST-05** | Style Profile & Vector Embeddings | Low-Medium | Categorical style weights and 1536-dim preference vectors |
| **AST-06** | AI Provider API Credentials | Critical | Google Gemini API keys, Cloud Storage service accounts |
| **AST-07** | Database & Cache Store | Critical | PostgreSQL tables and Redis instances |

---

## 2. Threat Actors & Motivations

1. **Unauthenticated Public Attackers**: Opportunistic scanning, credential stuffing, scraping wardrobe images, DoS attacks.
2. **Malicious Authenticated Users**: Attempting horizontal privilege escalation (IDOR/BOLA) to view other users' wardrobes or avatars.
3. **Malicious Prompt Injectors**: Attempting to bypass AI safety guardrails, extract internal system prompts, or induce arbitrary execution.
4. **Automated Bots & Scrapers**: High-frequency API abuse leading to AI token exhaustion and financial cost denial of service.

---

## 3. Attack Surface & Trust Boundaries

```
[Untrusted Internet / Public Web]
              │
══════════════╪══════════════════════════════════════════════ [Boundary 1: Edge TLS]
              ▼
   [Next.js Middleware & Security Headers]
   • CSP, CORS, X-Frame DENY
   • Sliding Window Rate Limiting (General & AI)
              │
══════════════╪══════════════════════════════════════════════ [Boundary 2: Authentication]
              ▼
   [Server Route Handlers & Zod Schemas]
   • Strict Input Validation
   • Server-Side Authorization (assertResourceOwnership)
              │
══════════════╪══════════════════════════════════════════════ [Boundary 3: AI & Storage]
       ┌──────┴──────┐
       ▼             ▼
[AI Model Client]   [Object Storage & DB]
 • Sanitized Prompts • Short-Lived Signed URLs
 • Schema Validation • Parameterized Queries
```

---

## 4. Threat Matrix & Technical Mitigations

| Threat ID | Threat Category | Target Asset | Technical Control / Mitigation | Verification Status |
|---|---|---|---|---|
| **THR-01** | **Account Takeover** | AST-01 | Managed Google OAuth & E.164 phone verification; secure HTTP-only cookies; token verification. | **Mitigated** |
| **THR-02** | **IDOR / BOLA** (Cross-User Access) | AST-02, AST-03, AST-04 | Strict server-side ownership enforcement (`assertResourceOwnership`) comparing authenticated ID with resource owner. | **Verified via Test Suite** |
| **THR-03** | **Private Image Exposure** | AST-02 | Images stored in private object storage; access strictly through short-lived presigned download URLs; no public bucket ACLs. | **Mitigated by Design** |
| **THR-04** | **Malicious File Uploads** | AST-07, AST-02 | MIME whitelist (`jpeg`, `png`, `webp`), extension verification, 10MB ceiling, server-side UUID keys preventing directory traversal. | **Verified via Test Suite** |
| **THR-05** | **AI Prompt Injection** | AST-06, AST-07 | Regex neutralization of jailbreak phrases; strip control chars; XSS defanging; strict Zod schema validation on model outputs. | **Verified via Test Suite** |
| **THR-06** | **AI Token & Cost Abuse** | AST-06 | Strict sliding-window rate limit (10 req/min/user); deterministic rule engine filters out 60%+ unnecessary AI calls; single-pass image caching. | **Verified via Test Suite** |
| **THR-07** | **SQL Injection** | AST-07 | All queries strictly parameterized through pg client and typed query layer; zero string interpolation. | **Mitigated by Design** |
| **THR-08** | **Clickjacking & XSS** | AST-01, AST-02 | Content-Security-Policy, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. | **Verified via Test Suite** |
| **THR-09** | **Dependency Vulnerabilities** | AST-07 | Continuous Trivy filesystem and dependency audit in CI/CD pipeline. | **Verified (0 Vulns)** |
| **THR-10** | **Credential & Secret Leakage** | AST-06 | `.env*` excluded from git; structured logger redacts all passwords, API keys, and sensitive tokens automatically. | **Verified via Trivy & Logger** |
| **THR-11** | **BOLA on Folders & Items** | AST-03 | Custom folder update/delete routes verify ownership before mutating database. | **Verified via Test Suite** |
