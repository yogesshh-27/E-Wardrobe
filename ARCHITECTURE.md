# WARDROBE AI — System Architecture & Technical Design

## 1. Executive Architecture Overview

WARDROBE AI is engineered as a **Modular Monolith with Asynchronous Background Workers**. It avoids the operational complexity of premature microservices while maintaining strict domain separation, strong boundaries, and high testability suitable for high-growth scaling and zero-downtime production deployment.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Next.js)                         │
│  • Editorial UI / 3D Floating Wardrobe • Virtual Try-On Modal         │
│  • Travel Itinerary Planner            • Style Profile Visualizer      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (TLS 1.3)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EDGE & SECURITY MIDDLEWARE                      │
│  • Security Headers (CSP, HSTS, X-Frame DENY)                          │
│  • Strict CORS Protection             • Correlation Request IDs        │
│  • Sliding-Window Rate Limiting       • Authentication & Session Gate  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         MODULAR MONOLITH CORE                          │
│  ┌───────────────┐  ┌───────────────────┐  ┌─────────────────────────┐ │
│  │ Auth & Users  │  │ Wardrobe & Folders│  │ Travel & Occasions      │ │
│  └───────┬───────┘  └─────────┬─────────┘  └────────────┬────────────┘ │
│          │                    │                         │              │
│  ┌───────▼────────────────────▼─────────────────────────▼────────────┐ │
│  │ Multi-Stage Recommendation Pipeline & Deterministic Rule Engine   │ │
│  └────────────────────────────┬──────────────────────────────────────┘ │
│                               │                                        │
│  ┌────────────────────────────▼──────────────────────────────────────┐ │
│  │ AI Service (Gemini Multimodal 2.5) & Prompt Sanitization Engine   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└───────────────┬───────────────────────────────┬────────────────────────┘
                │ Direct Upload Tickets         │ Background Jobs
                ▼                               ▼
┌──────────────────────────────┐ ┌──────────────────────────────────────┐
│  OBJECT STORAGE (S3 / GCS)   │ │  ASYNC WORKERS (BullMQ / Queue Engine│
│  • Private-by-Default Bucket │ │  • Idempotent Garment Vision Analysis│
│  • Short-Lived Presigned URLs│ │  • Vector Embedding Computation      │
│  • Server-Side UUID Keys     │ │  • Exponential Backoff & Retries     │
└───────────────┬──────────────┘ └──────────────────┬───────────────────┘
                │                                   │
                ▼                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     PERSISTENCE & VECTOR STORAGE                       │
│  • PostgreSQL 16 Relational Schema                                     │
│  • pgvector: 1536-Dimensional Semantic Garment & Style Embeddings      │
│  • Redis 7: Cache Layer (Style Profiles, Rate Limits, Job Queues)      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Breakdown & Domain Organization

The codebase organizes domain logic into discrete modules under `backend/`:

| Module | Directory | Responsibility |
|---|---|---|
| **Auth** | `backend/security/auth.ts` | Session verification, token parsing, Google/Phone OAuth handling |
| **Security** | `backend/security/` | Server-side authorization (`assertResourceOwnership`), Zod input schemas, headers |
| **Database** | `backend/database/` | Relational schema, indexes, pgvector definitions, parameterized queries |
| **Storage** | `backend/storage/` | Direct-to-storage presigned upload URLs, private key generation |
| **Wardrobe** | `backend/wardrobe/` | Garment CRUD, bounded pagination, metadata management |
| **Folders** | `backend/folders/` | Gender-neutral custom folders (Tops, Pants, Outerwear, Custom) |
| **AI Vision** | `backend/ai/geminiService.ts` | Single-pass attribute extraction using Gemini Vision with JSON schema |
| **Vector Engine**| `backend/ai/vectorEmbeddings.ts`| Cosine similarity and pgvector 1536-dimensional semantic representation |
| **Rule Engine** | `backend/recommendations/ruleEngine.ts` | Deterministic rules (temperature, activity, formality, fit) |
| **Recommender** | `backend/recommendations/recommendationPipeline.ts` | Multi-stage pipeline with LLM explanation generation |
| **Style Learning**| `backend/recommendations/styleLearning.ts` | Exponential moving average style preference vector updater |
| **Travel** | `backend/travel/travelEngine.ts` | Primary USP travel engine & 4-quadrant smart luggage packing planner |
| **Occasions** | `backend/occasions/occasionEngine.ts` | Complete occasion look synthesis (clothing, shoes, accessories, grooming) |
| **Workers** | `backend/workers/` | Idempotent background job processing with backoff and retry limits |
| **Monitoring** | `backend/monitoring/` | Secure structured logging with credential sanitization and latency metrics |

---

## 3. End-to-End Data Flows

### A. Secure Direct-to-Storage Garment Ingestion Flow
```
User Client               Backend API               Object Storage           Worker Queue
    │                          │                           │                       │
    │ 1. POST /upload-url      │                           │                       │
    ├─────────────────────────►│                           │                       │
    │                          │ 2. Validate MIME & Size   │                       │
    │                          │ 3. Gen Server UUID Key    │                       │
    │ 4. Presigned Upload URL  │                           │                       │
    │◄─────────────────────────┤                           │                       │
    │                                                      │                       │
    │ 5. Direct PUT to Storage                             │                       │
    ├─────────────────────────────────────────────────────►│                       │
    │                                                      │                       │
    │ 6. POST /wardrobe/items (confirm upload)             │                       │
    ├─────────────────────────►│                           │                       │
    │                          │ 7. Create Pending Item    │                       │
    │                          │ 8. Enqueue Idempotent Job │                       │
    │                          ├──────────────────────────────────────────────────►│
    │ 9. HTTP 201 Created      │                                                   │
    │◄─────────────────────────┤                                                   │
                                                                                   │ 10. Worker invokes
                                                                                   │     Gemini Vision (ONCE)
                                                                                   │ 11. Stores attributes &
                                                                                   │     generates vector
```

### B. Multi-Stage Recommendation Engine Flow
Rather than delegating raw outfit hallucination to an LLM, WARDROBE AI implements an 8-stage deterministic and semantic pipeline:

1. **User Request & Context Extraction**: Weather, formality, destination, or occasion parameters.
2. **Hard Filtering**: Enforces hard user constraints (disliked colors, zero-compatibility pieces).
3. **Candidate Generation**: Retrieves eligible items per wardrobe category.
4. **pgvector Similarity Search**: Compares user style preference vector against wardrobe item embeddings.
5. **Deterministic Rule Engine**: Applies fashion rules:
   - *Rule 1*: Temp > 30°C → Boost breathable linen/cotton (+25), penalize heavy wool (-30).
   - *Rule 2*: Activity = Trekking/Walking → Boost support sneakers (+35), penalize heels (-40).
   - *Rule 3*: Formality Alignment → Penalize formality discrepancies.
   - *Rule 4*: Silhouette Match → Boost items matching user fit preference (e.g. Oversized).
6. **Outfit Ranking**: Sorts candidate combinations by composite score.
7. **LLM Editorial Explanation**: Gemini explains the rationale and styling notes.
8. **Final Result Return**: Validated structured payload delivered to client.

---

## 4. Database & pgvector Design

PostgreSQL is configured with relational tables and the `vector` extension:
- `users`: Authenticated user accounts.
- `profiles`: Gender-neutral preferences, optional personal details.
- `style_preferences`: Style weights and `style_embedding vector(1536)`.
- `wardrobe_folders`: Custom user-defined folders.
- `wardrobe_items`: Image storage keys, file metadata, and `embedding vector(1536)`.
- `wardrobe_item_attributes`: Extracted material, formality, color, fit, season.
- `outfits` & `outfit_items`: Combinations and roles (top, bottom, shoes, accessory).
- `trips` & `trip_days`: Travel itineraries and day-wise outfit allocations.
- `recommendations`: Past generated recommendation outputs.
- `recommendation_feedback`: Weighted feedback (`liked`, `disliked`, `saved`, `purchased`).
- `user_events`: Audit log for security tracking.

Indexes are established on `user_id`, `folder_id`, `category`, `created_at`, and an HNSW vector index (`vector_cosine_ops`) for sub-millisecond nearest-neighbor lookups.

---

## 5. Caching & Performance Strategy

- **Redis Caching**: Caches user style profiles (TTL: 1h), recommendations (TTL: 30m), and rate limiting buckets.
- **Frontend Optimization**:
  - CSS 3D transforms (`preserve-3d`, `rotateX/Y`) over heavy WebGL.
  - Image compression (WebP/AVIF format).
  - Virtualized list rendering for large wardrobe collections.
  - Reduced motion detection (`prefers-reduced-motion`) with static fallbacks.
