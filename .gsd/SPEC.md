# SPEC.md — Project Specification: WARDROBE AI

> **Status**: `FINALIZED`
> **Project**: WARDROBE AI
> **Tagline**: "Your wardrobe. Your style. Your AI stylist." / "YOUR WARDROBE, INTELLIGENTLY STYLED."

## Vision
WARDROBE AI is a premium, modern, highly optimized 3D-inspired fashion-tech web application prototype and personal styling platform. It empowers users to digitally organize their physical wardrobe, define their unique style DNA, receive intelligent outfit recommendations for trips and occasions, preview outfits on their personal avatar, and discover curated fashion recommendations that complement their wardrobe.

## Goals
1. **Editorial Fashion-Tech Aesthetics**: Build a high-end luxury fashion aesthetic using warm ivory/charcoal/soft black and burgundy/bronze accents, editorial typography, and high-performance CSS 3D & micro-interactions.
2. **Complete Frictionless Onboarding**: 5-step wizard (Profile → Style → Fit → Image → Details) with gender-neutral styling, visual style cards, fit preferences, full-body photo upload with privacy messaging, and optional personal attributes.
3. **Interactive 3D Dashboard**: Collapsible navigation, greeting hero, 3 interactive 3D feature cards (Travel, Occasion, Recommendations), wardrobe overview, custom folder manager, and floating 3D fashion composition.
4. **Core USP — Travel Planner**: "Pack Smarter. Let your wardrobe plan the trip." Day-wise itinerary planner, multi-day AI outfit generator with reasoning, and smart packing analytics (Pack, Reuse, Skip, Missing items).
5. **Occasion Stylist**: Event-based look generator (Weddings, Dandiya Night, Dates, Interviews, Parties) generating complete looks (Clothing + Footwear + Accessories + Hair + Makeup) prioritizing user-owned items.
6. **Virtual Try-On / "See the Look"**: Interactive avatar layer displaying user photo with layered wardrobe garments and virtual try-on preview UI.
7. **Personalized Recommendations & Style DNA**: "Picked For You" recommendation feed with interactive feedback loops ("Save", "Not for me") and a dedicated "Style DNA" analytics page with breakdown percentages, style preferences, and avoidance patterns.

## Non-Goals (Out of Scope)
- Real server-side heavyweight 3D rendering engines (avoids 100MB+ WebGL memory bloat; uses optimized lightweight CSS 3D and Motion transforms).
- Real generative diffusion model server backend (simulated with realistic modular service architecture and ready-to-plug API contracts).
- Real payment gateway / commercial checkout (external affiliate links and product exploration only).

## Users
Fashion-conscious individuals, busy travelers, and style explorers seeking an effortless, intelligent digital wardrobe management and outfit planning experience.

## Constraints
- Next.js 16 App Router + React 19 + Tailwind CSS + Framer Motion / Motion.
- Highly performant: client-side persistence via `idb-keyval` and `localStorage`, fast loading times, zero lag.
- Respect `prefers-reduced-motion` and responsive mobile/tablet/desktop layouts.

## Success Criteria
- [x] Complete end-to-end hackathon demo flow executable without dead ends.
- [x] Rich 3D cards and floating clothing compositions on hero and dashboard.
- [x] Travel Planner delivers comprehensive day-wise outfit plans and smart packing analysis.
- [x] Style DNA visualization with dynamic breakdown.
- [x] Full mobile responsiveness with collapsible sidebar and bottom navigation bar.
