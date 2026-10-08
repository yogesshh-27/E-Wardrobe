# E-Wardrobe: AI-Powered Digital Wardrobe & Personal Styling Platform

> **"Your wardrobe. Your style. AI-powered."**

An interactive, luxury-tech web application built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **Zustand**. E-Wardrobe provides an intelligent digital closet where users catalog clothing pieces one item at a time, organize them into dynamic folders, generate occasion and travel outfits using their own wardrobe first, simulate virtual try-ons on their full-body photo, and discover missing capsule pieces across leading fashion retailers (Myntra, Amazon, Flipkart, Meesho).

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js 18+ (tested on Node 20 / 24)
- npm 9+

### Installation & Launch
```bash
# Clone the repository
git clone <repository-url>
cd E-Wardrobe

# Install dependencies (respecting local npm script policies)
npm install --ignore-scripts

# Start the Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏛 Architecture & Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx             # Google, Phone OTP, & Email login
│   │   └── onboarding/page.tsx        # 6-step personalized styling onboarding
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # App Shell (Navbar, Sidebar, BottomNav, Chat, Modals)
│   │   ├── page.tsx                   # Home Dashboard with 4 action cards & daily look
│   │   ├── wardrobe/
│   │   │   ├── page.tsx               # Wardrobe folder system, filters, & grid/list views
│   │   │   └── upload/page.tsx        # One-by-one upload with AI scanline & auto-tagging
│   │   ├── travel/page.tsx            # Travel Planner, day-by-day capsule, & packing list
│   │   ├── occasions/page.tsx         # Occasion Stylist with 2-3 tailored looks
│   │   ├── outfits/page.tsx           # Saved looks, wearing log, & favorite capsules
│   │   ├── recommendations/page.tsx   # "For You" daily themes & trending capsules
│   │   ├── shopping/page.tsx          # "Complete your look" affiliate search engine
│   │   ├── favorites/page.tsx         # Unified favorites (garments & outfits)
│   │   ├── profile/page.tsx           # Silhouette measurements, photo, & privacy wipe
│   │   ├── settings/page.tsx          # Load 20-item demo wardrobe & reset controls
│   │   └── help/page.tsx              # Interactive FAQs & styling concierge form
│   ├── globals.css                    # Luxury palette tokens, scanlines, glassmorphism
│   └── layout.tsx                     # Google fonts (Cormorant & Plus Jakarta Sans)
├── components/
│   ├── navigation/                    # TopNavbar, DesktopSidebar, MobileBottomNav, GlobalSearch
│   ├── wardrobe/                      # ItemDetailModal, FilterBar
│   ├── chat/                          # FloatingStylistButton, StylistChatDrawer
│   └── stylist/                       # VirtualTryOnModal
├── services/                          # Service abstraction layer with mock adapters
│   ├── interfaces.ts                  # Typed contracts for backend integration
│   ├── authService.ts                 # Session and authentication management
│   ├── visionService.ts               # Simulated neural garment auto-tagging
│   ├── stylistService.ts              # Pure scoring engine (harmony, formality, occasions)
│   ├── tryOnService.ts                # Virtual preview simulation adapter
│   ├── weatherService.ts              # Destination weather forecasts
│   ├── locationService.ts             # City autocomplete
│   ├── productService.ts              # Retailer catalog & affiliate search link builder
│   ├── storageService.ts              # Image validation and local Data URL / IndexedDB
│   └── notificationService.ts         # In-app contextual styling notifications
├── store/                             # Zustand state stores with localStorage persistence
├── data/                              # Curated seed wardrobes, destinations, products
└── types/                             # Domain TypeScript interfaces
```

---

## 🔌 What Is Mocked vs. What To Plug In

Per **Section 0 & Section 20 of the Master Prompt**, all third-party integrations are abstracted behind clean service interfaces (`src/services/interfaces.ts`) with honest UI simulation disclosures:

| Service / Feature | Current Mock Implementation | Production Integration Guide |
| :--- | :--- | :--- |
| **Authentication** (`authService`) | LocalStorage mock session; phone OTP accepts `123456`; Google login mock. | Connect NextAuth.js / Supabase Auth / Firebase Auth with Google OAuth client ID and SMS gateway (Twilio / Msg91). |
| **Vision Tagging** (`visionService`) | Simulates neural feature extraction (category, color, pattern, formality, occasions) with scanline animation. | Route image file to Gemini 1.5 Flash Vision / GPT-4o Vision route handler (`/api/vision/tag`). |
| **Outfit Engine** (`stylistService`) | Pure rule-based scoring engine calculating color harmony, formality, silhouette balance, and missing items. | Keep scoring engine as deterministic ranker or augment with Gemini 1.5 Pro prompt chain for dynamic copy. |
| **Virtual Try-On** (`tryOnService`) | Composites selected garments over full-body photo with Before/After toggle and explicit simulation disclaimer. | Connect to diffusion try-on APIs (e.g., IDM-VTON, Fashn.ai, or Replicate `try-on` models via webhook). |
| **Weather** (`weatherService`) | Destination-aware climate data for major Indian & international travel hubs. | Call OpenWeatherMap / WeatherAPI using `WEATHER_API_KEY` in Next.js API route handler. |
| **Shopping Catalog** (`productService`) | Curated catalog with INR pricing (₹); generates direct search URLs on Myntra, Amazon, Flipkart, Meesho. | Plug in retail affiliate APIs (Cuelinks, Amazon Product Advertising API, Myntra affiliate feeds). |
| **Image Storage** (`storageService`) | Validates file type/size and stores Data URLs / IndexedDB locally. | Connect Amazon S3 / Cloudflare R2 / Google Cloud Storage with presigned upload URLs. |
| **Database** | Zustand `persist` middleware in browser `localStorage`. | Swap with PostgreSQL (Prisma / Drizzle) or MongoDB with user relational schema. |

---

## 🎨 Design Philosophy & UX Highlights

1. **Luxury Fashion-Tech Aesthetic**: Off-white cream background (`#FAF8F5`), rich charcoal typography (`#1C1917`), and warm terracotta accents (`#B4533C`) paired with Cormorant Garamond editorial headlines.
2. **Wardrobe-First UX Rule**: The platform works gracefully whether a user has 0 items, 3 items, or 50 items. Users never have to upload their whole closet up front.
3. **Gender-Neutral & Inclusive**: Recommendations are tailored by silhouette, style affinity, and color theory rather than rigid gender silos.
4. **Honest Simulation Transparency**: The virtual try-on clearly labels simulated previews: *"Preview simulation. Real AI virtual try-on engine coming soon."*
5. **Instant Prototype Demo**: Go to **Settings** (`/settings`) to click **"Load 20-Item Demo Wardrobe"** to test every screen with realistic fashion flat-lays and garments.
