import {
  Outfit,
  WardrobeItem,
  UserProfile,
  Trip,
  DayOutfitPlan,
  PackingListItem,
  MissingOutfitItem,
  ChatMessage,
  ProductItem,
} from '@/types';
import { IStylistService } from './interfaces';
import { productService } from './productService';
import {
  scoreItemForOccasion,
  scoreItemForUserProfile,
  calculateColorHarmony,
} from '@/lib/scoringEngine';

export class StylistService implements IStylistService {
  async generateOccasionOutfits(params: {
    occasion: string;
    customOccasion?: string;
    venue?: 'Indoor' | 'Outdoor';
    timeOfDay?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
    dressCode?: string;
    desiredLook?: string;
    wardrobe: WardrobeItem[];
    userProfile: UserProfile;
  }): Promise<Outfit[]> {
    const { occasion, customOccasion, desiredLook, timeOfDay, wardrobe, userProfile } = params;
    const occName = customOccasion?.trim() || occasion;

    // Artificial inference delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Handle sparse or empty wardrobe gracefully
    if (wardrobe.length === 0) {
      const mockMissing: MissingOutfitItem[] = [
        {
          category: 'Shirts',
          suggestedName: 'Crisp White Linen Shirt',
          reason: 'A versatile foundation item suitable for any occasion.',
          productRecommendations: await productService.getRecommendationsForMissingCategory('Shirts'),
        },
        {
          category: 'Trousers',
          suggestedName: 'Tailored Neutral Trousers',
          reason: 'Pairs effortlessly across casual and formal occasions.',
          productRecommendations: await productService.getRecommendationsForMissingCategory('Trousers'),
        },
      ];

      return [
        {
          id: `outfit-${Date.now()}-1`,
          userId: userProfile.id,
          name: `${occName} Curated Capsule`,
          items: [],
          occasion: occName,
          style: desiredLook || 'Minimalist / Elegant',
          saved: false,
          favorite: false,
          generatedByAI: true,
          reason: `We designed this tailored aesthetic for ${occName}. Once you upload items to your wardrobe, we will prioritize what you already own.`,
          missingItems: mockMissing,
          createdAt: new Date().toISOString(),
        },
      ];
    }

    // Categorize wardrobe
    const tops = wardrobe.filter((i) => ['Shirts', 'T-Shirts', 'Tops', 'Kurtas', 'Sweaters'].includes(i.category));
    const bottoms = wardrobe.filter((i) => ['Trousers', 'Jeans', 'Pants', 'Skirts'].includes(i.category));
    const onePieces = wardrobe.filter((i) => ['Dresses', 'Sarees'].includes(i.category));
    const outerwear = wardrobe.filter((i) => ['Blazers', 'Suits', 'Jackets', 'Hoodies'].includes(i.category));
    const footwear = wardrobe.filter((i) => ['Shoes', 'Sneakers', 'Sandals'].includes(i.category));
    const accessories = wardrobe.filter((i) => ['Accessories', 'Bags', 'Watches', 'Jewellery'].includes(i.category));

    // Score all items
    const scoreItem = (item: WardrobeItem) =>
      scoreItemForOccasion(item, occName) * 0.6 + scoreItemForUserProfile(item, userProfile) * 0.4;

    const sortedTops = [...tops].sort((a, b) => scoreItem(b) - scoreItem(a));
    const sortedBottoms = [...bottoms].sort((a, b) => scoreItem(b) - scoreItem(a));
    const sortedFootwear = [...footwear].sort((a, b) => scoreItem(b) - scoreItem(a));
    const sortedOuterwear = [...outerwear].sort((a, b) => scoreItem(b) - scoreItem(a));
    const sortedAccessories = [...accessories].sort((a, b) => scoreItem(b) - scoreItem(a));
    const sortedOnePieces = [...onePieces].sort((a, b) => scoreItem(b) - scoreItem(a));

    const outfits: Outfit[] = [];

    // --- Outfit Option 1: Primary Polished Match ---
    const chosenTop1 = sortedTops[0];
    const chosenBottom1 = sortedBottoms[0];
    const items1: WardrobeItem[] = [];
    const missing1: MissingOutfitItem[] = [];

    if (sortedOnePieces.length > 0 && (occName.toLowerCase().includes('wedding') || occName.toLowerCase().includes('festival') || occName.toLowerCase().includes('date'))) {
      items1.push(sortedOnePieces[0]);
    } else {
      if (chosenTop1) items1.push(chosenTop1);
      if (chosenBottom1) items1.push(chosenBottom1);
    }

    if (sortedOuterwear.length > 0 && (timeOfDay === 'Evening' || timeOfDay === 'Night' || occName.toLowerCase().includes('formal') || occName.toLowerCase().includes('office'))) {
      items1.push(sortedOuterwear[0]);
    }

    if (sortedFootwear.length > 0) {
      items1.push(sortedFootwear[0]);
    } else {
      missing1.push({
        category: 'Footwear',
        suggestedName: 'Classic Leather Footwear',
        reason: 'A structured shoe grounds the silhouette for a complete aesthetic.',
        productRecommendations: await productService.getRecommendationsForMissingCategory('Footwear'),
      });
    }

    if (sortedAccessories.length > 0) {
      items1.push(sortedAccessories[0]);
    }

    const colorHarm = items1.length >= 2 ? calculateColorHarmony(items1[0].color, items1[1].color) : 0.8;
    const harmonyNote = colorHarm > 0.8 ? 'harmonious neutral balance' : 'subtle contrast';

    outfits.push({
      id: `outfit-${Date.now()}-1`,
      userId: userProfile.id,
      name: `Sophisticated ${occName} Ensemble`,
      items: items1,
      occasion: occName,
      style: desiredLook || 'Elegant / Contemporary',
      saved: false,
      favorite: false,
      generatedByAI: true,
      reason: `Engineered for ${occName} during ${timeOfDay || 'the day'}. Features ${items1.map((i) => i.name).slice(0, 2).join(' with ')}, emphasizing ${harmonyNote} and tailoring suited for ${desiredLook || 'a polished look'}.`,
      missingItems: missing1.length > 0 ? missing1 : undefined,
      createdAt: new Date().toISOString(),
    });

    // --- Outfit Option 2: Relaxed Contemporary Match ---
    const chosenTop2 = sortedTops[1] || sortedTops[0];
    const chosenBottom2 = sortedBottoms[1] || sortedBottoms[0];
    const items2: WardrobeItem[] = [];
    const missing2: MissingOutfitItem[] = [];

    if (chosenTop2) items2.push(chosenTop2);
    if (chosenBottom2 && chosenBottom2.id !== chosenTop2?.id) items2.push(chosenBottom2);

    const altShoes = sortedFootwear[1] || sortedFootwear[0];
    if (altShoes) items2.push(altShoes);

    const altAcc = sortedAccessories[1] || sortedAccessories[0];
    if (altAcc) items2.push(altAcc);

    if (items2.length < 3) {
      missing2.push({
        category: 'Accessories',
        suggestedName: 'Minimalist Watch or Leather Bag',
        reason: 'Adds an understated luxury accent to complete the ensemble.',
        productRecommendations: await productService.getRecommendationsForMissingCategory('Accessories'),
      });
    }

    outfits.push({
      id: `outfit-${Date.now()}-2`,
      userId: userProfile.id,
      name: `Effortless ${occName} Expression`,
      items: items2,
      occasion: occName,
      style: 'Smart Casual / Minimalist',
      saved: false,
      favorite: false,
      generatedByAI: true,
      reason: `A relaxed, modern interpretation for ${occName}. Blends comfort and refined proportions with high versatility.`,
      missingItems: missing2.length > 0 ? missing2 : undefined,
      createdAt: new Date().toISOString(),
    });

    // --- Outfit Option 3: Statement / Festive / Distinct Match ---
    if (sortedOuterwear[1] || sortedOnePieces[0] || sortedTops[2]) {
      const items3: WardrobeItem[] = [];
      if (sortedOnePieces[0] && !items1.includes(sortedOnePieces[0])) {
        items3.push(sortedOnePieces[0]);
      } else {
        if (sortedTops[2] || sortedTops[0]) items3.push(sortedTops[2] || sortedTops[0]);
        if (sortedBottoms[0]) items3.push(sortedBottoms[0]);
        if (sortedOuterwear[1] || sortedOuterwear[0]) items3.push(sortedOuterwear[1] || sortedOuterwear[0]);
      }

      if (sortedFootwear[0]) items3.push(sortedFootwear[0]);

      outfits.push({
        id: `outfit-${Date.now()}-3`,
        userId: userProfile.id,
        name: `Elevated Statement Look`,
        items: items3,
        occasion: occName,
        style: 'Modern Luxe',
        saved: false,
        favorite: false,
        generatedByAI: true,
        reason: `Designed for memorable presence at ${occName}. Balances rich tactile textures with refined styling.`,
        createdAt: new Date().toISOString(),
      });
    }

    return outfits;
  }

  async generateDailyLook(params: {
    wardrobe: WardrobeItem[];
    userProfile: UserProfile;
    date?: Date;
  }): Promise<{ theme: string; outfit: Outfit; whyYoullLikeIt: string }> {
    const { wardrobe, userProfile, date = new Date() } = params;

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = days[date.getDay()];

    const themes: Record<string, string> = {
      Monday: 'Minimal Monday',
      Tuesday: 'Tailored Flow',
      Wednesday: 'Midweek Sophistication',
      Thursday: 'Effortless Earth Tones',
      Friday: 'Smart Casual Transition',
      Saturday: 'Relaxed Urban Luxe',
      Sunday: 'Serene Monochrome',
    };

    const theme = themes[dayName] || 'Modern Minimalist';

    // Wardrobe-first look
    const tops = wardrobe.filter((i) => ['Shirts', 'T-Shirts', 'Tops', 'Kurtas', 'Sweaters'].includes(i.category));
    const bottoms = wardrobe.filter((i) => ['Trousers', 'Jeans', 'Pants', 'Skirts'].includes(i.category));
    const shoes = wardrobe.filter((i) => ['Sneakers', 'Shoes', 'Sandals'].includes(i.category));
    const accessories = wardrobe.filter((i) => ['Watches', 'Bags', 'Accessories', 'Jewellery'].includes(i.category));

    const top = tops[0] || null;
    const bottom = bottoms[0] || null;
    const shoe = shoes[0] || null;
    const acc = accessories[0] || null;

    const items: WardrobeItem[] = [top, bottom, shoe, acc].filter(Boolean) as WardrobeItem[];

    const outfit: Outfit = {
      id: `daily-${date.toISOString().split('T')[0]}`,
      userId: userProfile.id,
      name: `${theme} Look`,
      items,
      occasion: 'Daily Chic',
      style: userProfile.stylePreferences?.[0] || 'Clean & Tailored',
      saved: false,
      favorite: false,
      generatedByAI: true,
      reason: `Calibrated for ${dayName} weather and your aesthetic affinity for ${userProfile.stylePreferences?.slice(0, 2).join(' and ') || 'tailored neutrals'}.`,
      createdAt: new Date().toISOString(),
    };

    const whyYoullLikeIt = `You naturally gravitate towards ${userProfile.colorPreferences?.[0] || 'crisp neutrals'} and ${userProfile.fitPreferences?.[0] || 'clean tailored'} silhouettes. This ensemble balances effortless movement for daytime commitments with subtle luxury details.`;

    return { theme, outfit, whyYoullLikeIt };
  }

  async generateTravelWardrobe(params: {
    destination: string;
    startDate: string;
    endDate: string;
    activities: string[];
    tripStyle: string;
    wardrobe: WardrobeItem[];
    userProfile: UserProfile;
  }): Promise<Trip> {
    const { destination, startDate, endDate, activities, tripStyle, wardrobe, userProfile } = params;

    try {
      const res = await fetch('/api/stylist/travel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.source === 'gemini-ai' && data.plan) {
          const p = data.plan;
          const dayPlans: DayOutfitPlan[] = (p.dayOutfits || []).map((d: any) => ({
            dayNumber: d.dayNumber,
            dateStr: `Day ${d.dayNumber}`,
            activityTitle: d.themeTitle,
            vibe: d.reason,
            temperature: '26°C',
            top: wardrobe.find((w) => w.name.toLowerCase().includes(d.topName?.toLowerCase())) || wardrobe[0] || null,
            bottom: wardrobe.find((w) => w.name.toLowerCase().includes(d.bottomName?.toLowerCase())) || wardrobe[1] || null,
            footwear: wardrobe.find((w) => w.name.toLowerCase().includes(d.shoesName?.toLowerCase())) || wardrobe[2] || null,
            accessories: wardrobe.find((w) => w.name.toLowerCase().includes(d.accessoriesName?.toLowerCase())) || null,
            reason: d.reason,
          }));

          return {
            id: `trip-${Date.now()}`,
            userId: userProfile.id,
            destination,
            startDate,
            endDate,
            activities,
            tripStyle: (tripStyle as any) || 'Stylish',
            weather: {
              summary: 'Sunny & Pleasant',
              temperatureRange: '22°C - 29°C',
              icon: 'Sun',
            },
            generatedOutfits: dayPlans,
            packingList: (p.smartPacking?.packingList || []).map((item: any, idx: number) => ({
              id: `pack-${idx + 1}`,
              name: item.name,
              category: item.category || 'Clothing',
              isPacked: item.isPacked || false,
              quantity: 1,
            })),
            createdAt: new Date().toISOString(),
          };
        }
      }
    } catch (e) {
      console.warn('Live AI travel endpoint fallback:', e);
    }

    // Calculate trip length (default 3 days if missing)
    const start = new Date(startDate);
    const end = new Date(endDate);
    let diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    if (isNaN(diffDays) || diffDays < 1) diffDays = 3;
    if (diffDays > 7) diffDays = 7; // Cap demo at 7 days for clean UI

    const tops = wardrobe.filter((i) => ['Shirts', 'T-Shirts', 'Tops', 'Kurtas', 'Sweaters'].includes(i.category));
    const bottoms = wardrobe.filter((i) => ['Trousers', 'Jeans', 'Pants', 'Skirts'].includes(i.category));
    const shoes = wardrobe.filter((i) => ['Sneakers', 'Shoes', 'Sandals'].includes(i.category));
    const outerwear = wardrobe.filter((i) => ['Blazers', 'Jackets', 'Hoodies'].includes(i.category));
    const accessories = wardrobe.filter((i) => ['Accessories', 'Bags', 'Watches'].includes(i.category));

    const dayPlans: DayOutfitPlan[] = [];

    for (let day = 1; day <= diffDays; day++) {
      const act = activities[(day - 1) % activities.length] || 'Casual exploration';
      const curDate = new Date(start);
      curDate.setDate(curDate.getDate() + (day - 1));
      const dateStr = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Reuse bottoms and shoes to honor minimal luggage rule!
      const dayTop = tops[(day - 1) % (tops.length || 1)] || null;
      const dayBottom = bottoms[Math.floor((day - 1) / 2) % (bottoms.length || 1)] || null;
      const dayShoe = shoes[(day - 1) % (shoes.length || 1)] || null;
      const dayOuter = outerwear[(day - 1) % (outerwear.length || 1)] || null;
      const dayAcc = accessories[(day - 1) % (accessories.length || 1)] || null;

      dayPlans.push({
        dayNumber: day,
        dateStr,
        activityTitle: `Day ${day}: ${act}`,
        vibe: `${act} in ${destination}`,
        temperature: '26°C',
        top: dayTop,
        bottom: dayBottom,
        footwear: dayShoe,
        outerwear: day % 2 === 0 ? dayOuter : null,
        accessories: dayAcc,
        missingSuggestion:
          !dayOuter && destination.toLowerCase().includes('paris')
            ? {
                name: 'Lightweight Trench Coat',
                category: 'Outerwear',
                productLink: 'https://www.myntra.com/trench-coat',
                reason: 'Protects from unexpected evening breezes while keeping luggage light.',
              }
            : undefined,
      });
    }

    // Build intelligent packing list
    const packingList: PackingListItem[] = [
      { id: 'pack-1', name: 'White Poplin Shirt', category: 'Clothing', isPacked: true, quantity: 1 },
      { id: 'pack-2', name: 'Charcoal Pleated Trousers', category: 'Clothing', isPacked: true, quantity: 1 },
      { id: 'pack-3', name: 'Relaxed Indigo Jeans', category: 'Clothing', isPacked: true, quantity: 1 },
      { id: 'pack-4', name: 'Mandarin Linen Kurta', category: 'Clothing', isPacked: false, quantity: 1 },
      { id: 'pack-5', name: 'Boxy Heavyweight Tee', category: 'Clothing', isPacked: false, quantity: 2 },
      { id: 'pack-6', name: 'Camel Wool Blazer', category: 'Clothing', isPacked: false, quantity: 1 },
      { id: 'pack-7', name: 'Italian White Leather Sneakers', category: 'Footwear', isPacked: true, quantity: 1 },
      { id: 'pack-8', name: 'Tan Leather Oxford Shoes', category: 'Footwear', isPacked: false, quantity: 1 },
      { id: 'pack-9', name: 'Vintage Chronograph Watch', category: 'Accessories', isPacked: true, quantity: 1 },
      { id: 'pack-10', name: 'Leather Crossbody Bag', category: 'Accessories', isPacked: true, quantity: 1 },
      { id: 'pack-11', name: 'UV Protection Sunglasses', category: 'Accessories', isPacked: false, quantity: 1 },
      { id: 'pack-12', name: 'Travel Steamer & Toiletry Kit', category: 'Toiletries', isPacked: true, quantity: 1 },
    ];

    return {
      id: `trip-${Date.now()}`,
      userId: userProfile.id,
      destination,
      startDate,
      endDate,
      activities,
      tripStyle: (tripStyle as Trip['tripStyle']) || 'Stylish',
      weather: {
        summary: 'Pleasant & Sunny',
        temperatureRange: '22°C - 29°C',
        icon: 'Sun',
      },
      generatedOutfits: dayPlans,
      packingList,
      createdAt: new Date().toISOString(),
    };
  }

  async getOutfitIdeasForItem(
    item: WardrobeItem,
    wardrobe: WardrobeItem[]
  ): Promise<{ matchingItems: WardrobeItem[]; suggestionRules: string[] }> {
    const isTop = ['Shirts', 'T-Shirts', 'Tops', 'Kurtas', 'Sweaters'].includes(item.category);
    const isBottom = ['Trousers', 'Jeans', 'Pants', 'Skirts'].includes(item.category);

    let matchingItems: WardrobeItem[] = [];

    if (isTop) {
      matchingItems = wardrobe.filter(
        (i) => ['Trousers', 'Jeans', 'Pants', 'Blazers', 'Shoes', 'Sneakers'].includes(i.category) && i.id !== item.id
      );
    } else if (isBottom) {
      matchingItems = wardrobe.filter(
        (i) => ['Shirts', 'T-Shirts', 'Sweaters', 'Blazers', 'Sneakers', 'Shoes'].includes(i.category) && i.id !== item.id
      );
    } else {
      matchingItems = wardrobe.filter((i) => i.id !== item.id).slice(0, 4);
    }

    const rules = [
      `Pair with neutral bottom wear (Charcoal or Beige) for an effortless Old Money balance.`,
      `Layer with a structured blazer to transition from daytime casual to evening dining.`,
      `Style with minimalist white court sneakers for contemporary street presence.`,
    ];

    return { matchingItems: matchingItems.slice(0, 4), suggestionRules: rules };
  }

  async chat(
    userMessage: string,
    history: ChatMessage[],
    wardrobe: WardrobeItem[],
    userProfile: UserProfile
  ): Promise<{ reply: string; outfits?: Outfit[]; products?: ProductItem[] }> {
    try {
      const res = await fetch('/api/stylist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...history, { sender: 'user', text: userMessage }],
          userProfile,
          wardrobe,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          return { reply: data.reply };
        }
      }
    } catch (e) {
      console.warn('Live chat API fallback:', e);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    const msg = userMessage.toLowerCase();

    if (msg.includes('wedding')) {
      const festiveOutfits = await this.generateOccasionOutfits({
        occasion: 'Wedding',
        wardrobe,
        userProfile,
        timeOfDay: 'Evening',
        desiredLook: 'Festive & Elegant',
      });
      return {
        reply: `For a wedding celebration, I have put together an ensemble prioritizing your traditional pieces with rich color harmony. Here is a curated option from your wardrobe:`,
        outfits: festiveOutfits.slice(0, 1),
      };
    }

    if (msg.includes('goa') || msg.includes('pack') || msg.includes('trip')) {
      const products = await productService.getRecommendationsForMissingCategory('Shirts');
      return {
        reply: `For Goa, focus on breathable natural fibers like pure linen and relaxed cuts. I recommend packing light neutral resort shirts, relaxed denim, and versatile footwear. You can also generate a full day-by-day packing plan in our Travel Planner!`,
        products: products.slice(0, 2),
      };
    }

    if (msg.includes('jean') || msg.includes('pants')) {
      return {
        reply: `Your relaxed selvedge jeans pair best with a clean white poplin shirt or an oversized boxy tee. Add your camel blazer over the top if you're stepping out for a casual dinner!`,
      };
    }

    if (msg.includes('tomorrow') || msg.includes('today') || msg.includes('wear')) {
      const daily = await this.generateDailyLook({ wardrobe, userProfile });
      return {
        reply: `Here is your personalized look for tomorrow based on your style preferences (${userProfile.stylePreferences?.slice(0, 2).join(', ') || 'Smart Casual'}):`,
        outfits: [daily.outfit],
      };
    }

    // Default intelligent stylist response
    return {
      reply: `I analyzed your wardrobe inventory of ${wardrobe.length} pieces and your preference for ${userProfile.stylePreferences?.join(', ') || 'versatile luxury'}. Let me know if you would like me to style a specific garment, plan an upcoming event, or find missing pieces to complete your capsule!`,
    };
  }
}

export const stylistService = new StylistService();
