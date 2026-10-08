# WARDROBE AI — Master Platform & System Architecture

> **"Your wardrobe. Your style. AI-powered."**
> A gender-neutral digital wardrobe and AI personal styling platform built for editorial sophistication, zero-trust security, and high-performance scalability.

---

## 🌟 Executive Summary

**WARDROBE AI** is an AI-powered e-wardrobe and personal styling platform featuring a modular monolith architecture with asynchronous workers, relational modeling with `pgvector`, direct-to-storage signed uploads, a deterministic rule engine, and defense-in-depth DevSecOps.

### Primary USP: AI Travel Wardrobe Planner
The user enters destination, dates, daily itinerary, and activities. The system analyzes their existing wardrobe and produces:
- **Day-wise outfits**, footwear, and accessories
- **4-Quadrant Smart Luggage Dashboard**:
  - 🎒 **PACK**: Essential versatile pieces
  - 🔄 **REUSE**: Cross-day multi-wear items
  - 🚫 **SKIP**: Unnecessary bulky garments
  - 🛍️ **MISSING**: Capsule items to consider purchasing

---

## 🏛 System Architecture & Modular Monolith

The application combines a high-performance Next.js 16 frontend with domain-separated backend modules under `backend/`:

```
backend/
├── auth/            # Managed identity & session tokens (Google & Phone)
├── users/           # User lifecycle & data deletion privacy controls
├── profiles/        # Style preferences & optional biometric measurements
├── wardrobe/        # Garment items, attributes & bounded pagination
├── folders/         # Gender-neutral custom folders (Tops, Pants, Custom)
├── outfits/         # Multi-item outfit combinations & roles
├── travel/          # AI Travel Planner engine & luggage optimizer
├── occasions/       # Complete occasion look synthesis
├── recommendations/ # Multi-stage pipeline (Rule Engine + LLM Explanation)
├── ai/              # Google Gemini 2.5 Vision & 1536-dim pgvector embeddings
├── storage/         # Direct-to-storage short-lived presigned upload URLs
├── security/        # IDOR/BOLA protection, Zod validation, sliding-window rate limiter
├── workers/         # Idempotent async job queue with exponential backoff
├── database/        # Relational PostgreSQL 16 schema + pgvector DDL
└── monitoring/      # Secure structured logger & latency/error metrics
```

---

## 🔒 Security & DevSecOps Engineering

WARDROBE AI implements multi-layered security controls verified through continuous automated scanning:

1. **Authorization & IDOR/BOLA Prevention**:
   Every request enforces `authenticated_user_id == resource.owner_id`. Frontend-supplied IDs are never trusted.
2. **Secure Direct-to-Storage Uploads**:
   Images never pass through backend memory. The client receives short-lived presigned URLs with server-generated random UUID keys, MIME whitelisting, and a 10MB ceiling.
3. **Sliding-Window Rate Limiting**:
   - General API: 60 req/min/user
   - AI Endpoints: 10 req/min/user (protects against token exhaustion and cost abuse)
4. **AI Prompt Injection Defenses**:
   Sanitizes user input to defang prompt injection attacks and validates model outputs against strict Zod schemas.
5. **Security Headers**:
   CSP, HSTS (`31536000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and strict CORS.
6. **Aqua Security Trivy**:
   Scans filesystem, dependencies, and secrets. **0 vulnerabilities, 0 secrets detected.**
7. **Strix Automated Penetration Testing**:
   Integrates `strix-agent` 1.7.0 for authorized local white-box security testing.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: 20+ (tested on Node 20 & 24)
- **npm**: 9+
- **Python**: 3.12+ (for Strix agent)

### 2. Installation
```bash
git clone https://github.com/yogesshh-27/E-Wardrobe.git
cd E-Wardrobe
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```
Add your `GEMINI_API_KEY` to `.env.local`.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Security & Quality Audit Commands

```bash
# Run comprehensive automated security test suite (13/13 passing)
npm run security:test

# Run Trivy filesystem, dependency, and secret scan
npm run security:trivy

# Run Strix automated penetration tester
npm run security:strix

# Run linting
npm run lint

# Build production bundle
npm run build
```

---

## 📚 Technical Documentation Suite

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — System design, data flows, pgvector pipeline, and caching.
- [`SECURITY.md`](./SECURITY.md) — Security controls, IDOR mitigation, signed uploads, and vulnerability disclosure.
- [`THREAT_MODEL.md`](./THREAT_MODEL.md) — STRIDE threat matrix, assets, threat actors, and technical mitigations.
- [`API.md`](./API.md) — Versioned REST API v1 endpoints, schemas, and status codes.
- [`backend/database/schema.sql`](./backend/database/schema.sql) — PostgreSQL + pgvector relational schema.
