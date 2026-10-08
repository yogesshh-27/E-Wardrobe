# WARDROBE AI — REST API v1 Specification

All endpoints are versioned under `/api/v1/`.

## 1. Global Standards & Authentication

### Headers
| Header | Description | Required |
|---|---|---|
| `Authorization` | Bearer token format: `Bearer <token>` | Yes (for protected routes) |
| `Content-Type` | `application/json` | Yes (for mutating requests) |
| `Idempotency-Key`| Optional UUID for idempotent operations | Recommended |

### Standard Error Response Format
```json
{
  "success": false,
  "error": "Descriptive error message",
  "code": "RESOURCE_FORBIDDEN"
}
```

### HTTP Status Codes
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully registered.
- `400 Bad Request`: Input validation failed against Zod schema.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated user does not own the requested resource (IDOR mitigation).
- `404 Not Found`: Resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded (includes `Retry-After` header).
- `500 Internal Server Error`: Server error (PII and secrets redacted).

---

## 2. API Endpoints

### Health & Monitoring
#### `GET /api/v1/health`
Returns system status, active version, and latency metric summaries.

---

### Authentication
#### `GET /api/v1/auth/session`
Returns authenticated user session details.

---

### Secure Object Storage & Wardrobe Ingestion
#### `POST /api/v1/wardrobe/upload-url`
Generates a short-lived presigned upload URL for direct-to-storage upload.
**Request Body:**
```json
{
  "filename": "summer_linen_shirt.jpg",
  "mimeType": "image/jpeg",
  "fileSizeBytes": 450000,
  "folderId": "optional-uuid"
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "uploadUrl": "https://storage.wardrobe-ai.internal/upload/users/usr_123/wardrobe/uuid.jpg?signature=...",
    "storageKey": "users/usr_123/wardrobe/uuid.jpg",
    "expiresInSeconds": 900
  }
}
```

---

### Wardrobe Items
#### `GET /api/v1/wardrobe/items`
Retrieves paginated wardrobe items for the authenticated user.
**Query Parameters:**
- `page`: Integer (default: 1)
- `limit`: Integer (default: 20, max: 50)
- `folderId`: UUID (optional)
- `category`: String (optional)
- `search`: String (optional)

#### `POST /api/v1/wardrobe/items`
Registers a newly uploaded garment and queues asynchronous AI vision analysis.
**Request Body:**
```json
{
  "imageStorageKey": "users/usr_123/wardrobe/uuid.jpg",
  "originalFilename": "summer_linen_shirt.jpg",
  "mimeType": "image/jpeg",
  "folderId": "optional-folder-uuid",
  "imageBase64": "optional-base64-for-sync-demo"
}
```

#### `GET /api/v1/wardrobe/items/:id`
Retrieves a single wardrobe item by ID. Enforces ownership check.

#### `PATCH /api/v1/wardrobe/items/:id`
Updates or confirms extracted attributes for an item.

#### `DELETE /api/v1/wardrobe/items/:id`
Deletes a wardrobe item. Enforces ownership check.

---

### Custom Folders
#### `GET /api/v1/wardrobe/folders`
Lists all folders belonging to the authenticated user.

#### `POST /api/v1/wardrobe/folders`
Creates a new gender-neutral folder.
**Request Body:**
```json
{
  "name": "Summer Vacation Linen",
  "icon": "Sun"
}
```

#### `PATCH /api/v1/wardrobe/folders/:id`
Renames or updates folder icon.

#### `DELETE /api/v1/wardrobe/folders/:id`
Deletes a folder.

---

### AI Travel Wardrobe Planner (Primary USP)
#### `POST /api/v1/travel/plan`
Generates a day-wise travel wardrobe and smart luggage packing analysis.
**Request Body:**
```json
{
  "destination": "Kyoto, Japan",
  "startDate": "2026-10-15",
  "endDate": "2026-10-18",
  "dailyItinerary": [
    { "day": 1, "activity": "Temple walking & tea ceremonies" },
    { "day": 2, "activity": "Bamboo forest hike & mountain view" },
    { "day": 3, "activity": "Fine dining Kaiseki evening" }
  ]
}
```
**Response (200):**
```json
{
  "success": true,
  "data": {
    "destination": "Kyoto, Japan",
    "durationDays": 3,
    "dailyPlans": [
      {
        "day": 1,
        "activity": "Temple walking & tea ceremonies",
        "outfit": ["Relaxed button-down oxford shirt", "Tailored relaxed selvedge denim"],
        "footwear": "Minimalist white leather low-top sneakers",
        "accessories": ["Architectural tote bag"],
        "reason": "Versatile contemporary balance between casual street wandering and café stops."
      }
    ],
    "luggage": {
      "packingItems": ["Tailored blazer", "Oxford shirt", "Trousers", "Sneakers"],
      "reusableItems": ["Relaxed straight-leg denim (Day 1 & Day 3)"],
      "unnecessaryItems": ["Heavy overcoat"],
      "missingItemsToBuy": ["Packable lightweight rain shell"]
    }
  }
}
```

---

### Occasion Stylist
#### `POST /api/v1/occasions/style`
Synthesizes a complete head-to-toe look for specific occasions.
**Request Body:**
```json
{
  "occasion": "Contemporary Art Gallery Opening",
  "formality": "smart-casual",
  "vibe": "Monochrome Minimalist"
}
```

---

### Recommendations & Style Learning
#### `GET /api/v1/recommendations`
Runs the multi-stage recommendation pipeline combining rule engine scoring and LLM styling explanation.

#### `POST /api/v1/recommendations/:id/feedback`
Submits user feedback (`liked`, `disliked`, `saved`, `skipped`, `purchased`) to adjust style weight preference vectors.
**Request Body:**
```json
{
  "action": "liked",
  "userComment": "Love the minimalist color palette"
}
```

---

### Style Profile Management
#### `GET /api/v1/profile/style`
Retrieves the user's active style DNA and category weights.

#### `PUT /api/v1/profile/style`
Allows manual editing and fine-tuning of style preferences and weights.
