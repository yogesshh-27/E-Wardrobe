# MASTER PROMPT: AI E-WARDROBE & PERSONAL STYLING PLATFORM

## 0. HOW TO WORK (read first)

You are a senior full-stack engineer and product designer. Build a **fully interactive, production-feeling web prototype** of an AI-powered E-Wardrobe and Personal Styling Platform.

Working rules:
1. **Plan first.** Before writing code, produce an implementation plan (architecture, folder structure, routes, data model, phases). Then execute phase by phase.
2. **Build in the phases listed in Section 16.** After each phase, run the app, verify it works, and fix errors before moving on.
3. **Do not stop at scaffolding.** Every screen described below must be navigable and functional with mock data.
4. **Be honest.** Anything simulated (AI vision, outfit generation, virtual try-on, weather, products) must be built behind a service layer with mock adapters, and the UI must never claim real AI image generation is happening when it is a simulation.
5. At the end, run a final QA pass in the browser at desktop, tablet and mobile widths and report any known gaps.

Tagline: **"Your wardrobe. Your style. AI-powered."**

---

## 1. PRODUCT SUMMARY

An AI-powered digital wardrobe. A user can:
- Sign up / log in, then complete a short, skippable onboarding.
- Upload clothes **one item at a time** (gallery, camera, drag and drop); AI auto-tags each item and the user confirms or edits.
- Organize clothes into default and custom folders.
- Get outfit recommendations for occasions, trips and daily looks, **built from their own wardrobe first**.
- Preview outfits on their own full-body photo ("See it on you").
- When something is missing, see shopping recommendations that link out to Myntra, Amazon, Flipkart, Meesho, etc.

The platform is **gender-neutral and inclusive**. Never restrict recommendations solely by gender preference.

**Core UX rule:** never force users to upload their whole wardrobe. The wardrobe grows gradually, and recommendations improve as it grows. Every feature must work (with graceful messaging) when the wardrobe has 0, 3 or 50 items.

---

## 2. TECH STACK AND ARCHITECTURE

- **Next.js (App Router) + TypeScript + Tailwind CSS**. Use shadcn/ui or Radix primitives, **Framer Motion** for animation, **lucide-react** for icons, **Zustand** for state.
- **Persistence for the prototype:** localStorage for structured data, IndexedDB (e.g. `idb-keyval`) for images. Wrap persistence in a repository layer so it can be swapped for a real DB and cloud storage later.
- **Service layer** (`/src/services/*`), each with an interface plus a mock implementation, selected via env config:
  - `authService` (Google, phone OTP, email)
  - `visionService` (clothing auto-tagging from image)
  - `stylistService` (outfit generation, chat replies)
  - `tryOnService` (virtual try-on)
  - `weatherService`
  - `locationService`
  - `productService` (shopping catalog / affiliate links)
  - `storageService` (image upload)
  - `notificationService`
- **Security:** no API keys in frontend code. Provide `.env.example` listing placeholders (`AI_API_KEY`, `PRODUCT_API_KEY`, `WEATHER_API_KEY`, `AUTH_SECRET`, `GOOGLE_CLIENT_ID`, etc.). Any real third-party call goes through Next.js route handlers (`/app/api/*`), never directly from the client. Validate uploaded file type and size, and strip EXIF metadata where practical.
- Keep code modular: `components/`, `features/`, `services/`, `lib/`, `data/` (mock data), `types/`, `store/`.
- Include a short `README.md`: how to run, architecture, and a table of "what is mocked vs. what to plug in".

---

## 3. DESIGN LANGUAGE

Premium fashion-tech. It must feel like a real consumer product, not an admin dashboard or college demo.

- Clean, minimal, elegant, soft, sophisticated, lots of whitespace.
- Palette: off-white, cream, soft beige, charcoal, black, light grey, plus **one subtle accent** (e.g. warm terracotta, sage or muted gold) used for primary buttons, highlights and AI elements.
- Pairing: an elegant serif for headlines (e.g. Playfair Display / Cormorant) with a clean sans for UI (e.g. Inter / DM Sans).
- Rounded cards, subtle shadows, consistent icon set, smooth hover and page transitions.
- Fashion-style placeholder imagery (use curated Unsplash-style URLs or generated neutral placeholders; never broken images).
- Fully responsive: desktop sidebar, **bottom navigation on mobile**, touch-friendly targets (min 44px), easy upload on mobile.
- Accessibility: keyboard navigation, focus states, alt text, sufficient contrast, `prefers-reduced-motion` respected.
- Light theme by default; dark mode optional if time allows.

---

## 4. USER JOURNEY (end to end)

Login → Onboarding (gender, styles, fit, colors/patterns/clothing, optional photo, optional hair/body) → Dashboard → My Wardrobe → Upload clothes → Organize into folders → AI learns style → Travel Planner / Occasion Stylist / Daily Recommendations → AI generates outfits → Preview on user → Save outfit → Shop missing items → External shopping platform.

---

## 5. LOGIN / LANDING

- Header: logo, "E-Wardrobe", minimal nav.
- Hero headline: **"Your wardrobe, intelligently styled."**
- Subheadline: "Organize your wardrobe, discover your personal style, and let AI help you dress for every occasion."
- Options: **Continue with Google** (with Google icon), **Continue with Mobile Number** (phone input, then OTP UI with 6-digit input, resend timer; mock accepts any code, e.g. `123456`), email alternative, "New here? Create account", Terms and Privacy links.
- Login must function in the prototype (mock auth, session persisted). New users go to onboarding; returning users go to the dashboard.
- Subtle entrance animation.

---

## 6. ONBOARDING (6 steps, progress indicator, Back, Continue, Skip where appropriate, animated transitions, state saved to profile)

1. **Gender:** "How do you identify your fashion preferences?" Male / Female / Prefer not to say.
2. **Styles (multi-select):** "What styles do you love?" Traditional, Western, Indo-Western, South Indian, North Indian, Trendy, Sporty, Old Money, Streetwear, Casual, Classic, Minimalist, Elegant, Formal, Smart Casual, Bohemian, Y2K, Athleisure, Festive, Ethnic, Party Wear, plus "Mixed / I like experimenting". Helper text: "Choose as many as you like. Your AI stylist will learn from your choices."
3. **Fit (multi-select):** "What kind of fit do you usually prefer?" Fitted, Relaxed, Oversized, Slim, Loose, Depends on the outfit, Mixed, plus "I like experimenting with different fits."
4. **Personal style details (all optional):**
   - Colors: Black, White, Beige, Brown, Blue, Green, Pink, Red, Purple, Yellow, Grey, Pastel, Earth tones, No preference (show color swatches).
   - Patterns: Solid, Stripes, Checks, Floral, Printed, Graphic, Minimal patterns, No preference.
   - Clothing preferences: Jeans, Trousers, Cargo pants, Skirts, Dresses, Kurtas, Sarees, Shirts, T-shirts, Hoodies, Blazers, Suits, Jackets, Ethnic wear, Sportswear.
5. **Full-body photo (optional):** "Add a full-body photo." Copy: "Your photo helps us create a personalized visual preview of outfits and understand how different styles may look on you." Upload from gallery, take photo (camera input), replace, **Skip for now**. If skipped: "You can add your photo later from Profile." Never block progress.
6. **Optional personal details:** "Help your AI stylist understand you better." Hair length (Short/Medium/Long/Very Long), hair type (Straight/Wavy/Curly/Coily/Other/Prefer not to say), height, body measurements. All optional, with a prominent **Skip for now** and the note "You can update these details anytime from your profile." Never mandatory.

---

## 7. APP SHELL

- Collapsible sidebar behind a hamburger menu (animated open/close): Home, My Wardrobe, Upload Clothes, Travel Planner, Occasion Stylist, AI Recommendations, My Outfits, Favorites, Shopping Recommendations, Profile, Settings, Help & Support, Logout.
- Mobile: bottom navigation (Home, Wardrobe, Upload (center action), Stylist, Profile) with the rest in the menu.
- Top bar: global search, notification bell with unread badge and dropdown, profile avatar.
- **Floating "✨ Ask Your AI Stylist" button** on every dashboard screen, opening a chat panel.
- Page transitions and consistent empty states.

---

## 8. HOME DASHBOARD

Greeting: "Good morning / afternoon / evening, [Name]" (time-aware). Subheading: "What are you dressing for today?"

Four large action cards:
1. **Travel Planner**, suitcase icon, "Plan outfits and packing with AI.", button *Plan My Trip*.
2. **Add to Wardrobe**, camera/upload icon, "Upload your clothes one at a time.", button *Upload Item*.
3. **Occasion Stylist**, sparkle icon, "Get the perfect outfit for any occasion.", button *Style Me*.
4. **For You**, AI icon, "Discover outfits selected for your style.", button *View Recommendations*.

Below: today's look teaser, recent wardrobe items, wardrobe progress nudge (gentle, never pushy), and upcoming trips/occasions.

---

## 9. MY WARDROBE

- Header "My Wardrobe", subheading "Everything you own, organized your way."
- Search bar and filters: Category, Color, Style, Season, Occasion, Brand, Recently Added.
- Folder system. Defaults: T-Shirts, Shirts, Tops, Jeans, Pants, Trousers, Skirts, Dresses, Kurtas, Sarees, Suits, Blazers, Jackets, Hoodies, Sweaters, Shoes, Sandals, Sneakers, Accessories, Bags, Watches, Jewellery, Other.
- **+ Create New Folder** (user names it anything), plus rename and delete folder, and move items between folders.
- Grid/list toggle, item count per folder, smooth hover effects.
- Empty state: "Your wardrobe is waiting for you." / "Start by uploading your first clothing item." / button **Upload My First Item**.

---

## 10. UPLOAD CLOTHING (critical flow)

- One item at a time. Methods: gallery, take photo (camera), desktop drag and drop.
- Show image preview and an AI analysis animation (clearly labelled as the AI analyzing).
- `visionService.analyze(image)` returns: category, color, pattern, style, material (if detectable), occasion(s), season, formality, fit (if detectable). The mock should return plausible, varied results (e.g. based on filename or random from a rich set), never the same every time.
- **Editable confirmation screen**, e.g. "AI detected: White Shirt, Color: White, Style: Casual/Formal, Pattern: Solid, Occasion: Casual, Office, Dinner". Every field editable (chips and dropdowns), with name, folder selection (auto-suggested from category) and notes.
- Button **Add to Wardrobe**, then success animation, then offer "Add another" or "View in wardrobe".
- Validate file type and size, with friendly error messages.

---

## 11. CLOTHING ITEM DETAILS

Modal or page: large image, name, category, color, style, occasion, season, fit, notes. Actions: Edit, Move to folder, Add to Favorites, Create Outfit, Delete (with confirmation). Section **"AI Outfit Ideas"**, e.g. "This white shirt works well with: Black trousers, Blue jeans, Beige chinos, Formal blazer", showing matching items from the user's wardrobe where available and suggestions otherwise.

---

## 12. TRAVEL PLANNER

Form "Where are you going?":
- Destination (autocomplete: Delhi, Goa, Jaipur, Mumbai, Paris, etc.), start and end dates, weather (auto-fetched via `weatherService` when available, otherwise manual/mock), activities (multi-select: Sightseeing, Beach, Hiking, Shopping, Dinner, Party, Business, Religious visit, Casual exploration, Wedding, Adventure), trip style (Relaxed, Stylish, Minimal luggage, Fashion-focused, Comfortable).
- Button **Generate My Travel Wardrobe**, with the elegant loading state "Your AI stylist is creating your look...".

**Output:**
- Day-by-day plan (e.g. "DAY 1: Arrival + Casual Exploration") listing Top, Bottom, Shoes, Accessories, Outerwear. Each item is tagged **"From Your Wardrobe"** (with thumbnail) or flagged **"You may want to add:"** (e.g. "Lightweight beige jacket") with shopping recommendations.
- Reuse and mix items intelligently across days to honour "Minimal luggage".
- **Smart packing list** grouped into Clothing, Footwear, Accessories (counts like "4 tops, 2 trousers, 1 jacket, 1 ethnic outfit, 1 formal outfit"). Users can add, remove, mark packed/unpacked, with a progress bar ("8/12 items packed").
- Save trip, regenerate, and edit individual days.

---

## 13. OCCASION STYLIST

- "What are you dressing for?" Choices: Wedding, Party, Dandiya Night, College Event, Office, Interview, Date, Dinner, Festival, Puja, Family Function, Birthday, Casual Outing, Beach, Formal Event, Business Meeting, Other, plus **custom free-text occasion**.
- Optional customization: occasion type, location (Indoor/Outdoor), time (Morning/Afternoon/Evening/Night), weather (auto-detect if possible), dress code, desired look (Elegant, Traditional, Trendy, Minimal, Bold, Comfortable, Festive, Classy, Experimental).
- Button **Style Me**, then AI loading animation, then 2 to 3 complete outfit options.
- **Each outfit card:** Top, Bottom, Footwear, Accessories, Outerwear; a **"Why this works"** explanation (occasion, user's styles, color combination, weather, aesthetic); and buttons **Try This Look**, **Save Outfit**, **Shop Missing Items**.

---

## 14. VIRTUAL PREVIEW ("See it on you")

- If the user has a full-body photo, show the preview screen: user photo, selected outfit items, garment overlay/preview region, **Before / After toggle**.
- Implement through `tryOnService` with a mock that composites a clearly-labelled simulated preview (layered garment images over the photo). Show a visible label like **"Preview simulation. Real AI try-on coming soon."** Do **not** claim real image generation.
- Design the interface and service contract (`tryOn(userImage, garmentImages[]) → imageUrl`) so a real virtual try-on API can be dropped in.
- If no photo: empty state "Add your photo to unlock personalized outfit previews." with button **Add Photo**.

---

## 15. REMAINING FEATURES

**Shopping Recommendations ("Complete your look")**
- Product cards: image, name, price (₹), platform badge (Myntra / Amazon / Flipkart / Meesho / other), rating placeholder, AI reason, **Shop Now**.
- `productService` returns a typed `Product` with `platform`, `price`, `imageUrl`, `link`, `reason`, `category`. **Shop Now opens the external URL in a new tab (`rel="noopener noreferrer"`) when a valid URL exists**; for mock products, link to the platform's search page for that product query. Structure for affiliate link injection later.
- Shopping page tabs: Recommended for You, Complete Your Wardrobe, Trending, Occasion Wear, Travel Essentials, Footwear, Accessories. Filters by platform and price.

**For You (AI Recommendations)**
- "TODAY'S LOOK" with a theme name (e.g. "Minimal Monday"), outfit, and "WHY YOU'LL LIKE IT" based on the user's profile. Plus "Trending For You" outfits and products driven by style, wardrobe, occasion history, colors, fit and saved outfits. Refreshes daily (date-seeded mock).

**My Outfits / Favorites ("My Looks")**
- Saved outfit cards: composite image, item list, occasion, date saved, favorite toggle. Actions: Wear This, Edit, Delete, Shop Missing Item. Favorites page includes favorite items and outfits.

**AI Stylist chat**
- Floating button opens a chat panel with suggested prompts: "What should I wear tomorrow?", "What should I wear to a wedding?", "Make an outfit using my black jeans.", "I am going to Goa. What should I pack?", "I need a casual college outfit.", "What shoes go with this?", "Suggest an outfit under ₹3000.", "I want an old-money look."
- Replies use profile and wardrobe data, can render outfit cards inline, typing indicator, and conversation history. Route through `stylistService.chat()` (mock now, LLM later via a server route).

**Search (global)**
- Searches clothing, folders, outfits and occasions. Example: "black" returns black jeans, shirt, blazer, shoes, accessories, grouped by type.

**Notifications**
- Bell with list: daily outfit, packing reminder, new AI recommendation, saved outfit reminder, shopping recommendation, occasion reminder (e.g. "Your Dandiya Night is tomorrow. Want an outfit suggestion?"). Mark read / clear all.

**Profile and Privacy**
- Editable: name, email, mobile; style profile (gender, styles, fits, colors, patterns); optional appearance (full-body image, hair length/type, height, measurements).
- **Privacy and data control section:** explains that users control their images, can delete wardrobe images, replace or delete their profile photo, delete their account, and that optional/body info is never required. Actions: **Delete Photo**, **Delete Wardrobe Item**, **Delete Account** (each with confirmation; delete account wipes all local data). Settings: notifications, units, theme, export my data (JSON).
- Help and Support page: FAQ and contact form (mock).

---

## 16. AI RECOMMENDATION LOGIC (implement in `stylistService`)

Factors: style prefs, fit prefs, wardrobe inventory, item colors and categories, saved outfits, occasion, weather, destination, time of day, dress code, preferred aesthetics, missing wardrobe items.

Rules:
1. **Wardrobe first.** Always try to compose outfits from owned items.
2. Use a scoring function (color harmony, formality match, season/weather fit, style match, fit match, recency/variety) over category slots (top, bottom, footwear, accessories, outerwear; one-piece items such as dresses, sarees and kurta sets fill multiple slots).
3. If a slot cannot be filled well, mark it **missing** and ask `productService` for matching products.
4. Handle sparse wardrobes gracefully ("Add 2 more items for better looks") without blocking output.
5. Keep the scoring pure and unit-testable, with a clean interface for swapping in an LLM later.

---

## 17. DATA MODEL (TypeScript types)

- **User:** id, name, email, phone, genderPreference, stylePreferences, fitPreferences, colorPreferences, patternPreferences, clothingPreferences, profileImage, hairLength, hairType, height, bodyMeasurements, createdAt.
- **WardrobeItem:** id, userId, image, name, category, color, pattern, style, material, occasion[], season[], formality, fit, folderId, notes, favorite, createdAt.
- **WardrobeFolder:** id, userId, name, category, isDefault.
- **Outfit:** id, userId, items[], occasion, style, saved, favorite, generatedByAI, reason, missingItems[], createdAt.
- **Trip:** id, userId, destination, startDate, endDate, activities[], tripStyle, weather, generatedOutfits[], packingList[].
- **Recommendation / Product:** id, userId, product, platform, price, imageUrl, reason, category, link.
- **Notification:** id, userId, type, title, body, read, createdAt.

---

## 18. BUILD PHASES

1. **Foundation:** project setup, design tokens, layout shell, routing, state, service-layer interfaces plus mock adapters, seed/mock data.
2. **Auth and onboarding:** login (Google/phone OTP/email mock), 6-step onboarding, profile store.
3. **Wardrobe:** wardrobe page, folders, upload flow with AI tagging mock, item details, search and filters.
4. **Stylist engine:** outfit scoring, Occasion Stylist, outfit cards, save/favorites, My Outfits.
5. **Travel:** planner form, day-by-day output, packing list.
6. **Discovery:** For You, shopping, product cards and external links, notifications.
7. **AI chat and virtual preview.**
8. **Polish:** micro-interactions (login, onboarding transitions, upload completion, AI generation, saving outfit, favoriting, sidebar, card hover, page transitions), empty states, responsive QA, accessibility, README.

---

## 19. SEED / DEMO DATA

Include a **"Load demo wardrobe"** option in Settings (about 20 varied items across tops, bottoms, ethnic wear, footwear and accessories with realistic images) so every feature can be demonstrated instantly, plus a "Reset app" action. Demo data must be clearly separate from user data and removable.

---

## 20. DEFINITION OF DONE

- All screens above are reachable and functional using mock services.
- New user can go from login through onboarding, upload an item, get an outfit, save it, plan a trip and click through to a shopping link without errors.
- Works at 375px, 768px and 1280px+ widths.
- No API keys in client code; `.env.example` and README present.
- Simulated features are labelled honestly in the UI.
- No console errors; TypeScript passes with no type errors; lint is clean.
- Final report lists what is mocked, what to integrate (vision, LLM, try-on, weather, maps, product APIs, auth, cloud storage, database), and any known limitations.

Start by outputting the implementation plan, then begin Phase 1.
