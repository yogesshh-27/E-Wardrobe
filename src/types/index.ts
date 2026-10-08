export type GenderPreference = 'Male' | 'Female' | 'Prefer not to say';

export type ClothingCategory =
  | 'T-Shirts'
  | 'Shirts'
  | 'Tops'
  | 'Jeans'
  | 'Pants'
  | 'Trousers'
  | 'Skirts'
  | 'Dresses'
  | 'Kurtas'
  | 'Sarees'
  | 'Suits'
  | 'Blazers'
  | 'Jackets'
  | 'Hoodies'
  | 'Sweaters'
  | 'Shoes'
  | 'Sandals'
  | 'Sneakers'
  | 'Accessories'
  | 'Bags'
  | 'Watches'
  | 'Jewellery'
  | 'Other';

export interface BodyMeasurements {
  chest?: string;
  waist?: string;
  hips?: string;
  unit: 'cm' | 'inches';
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  genderPreference: GenderPreference;
  stylePreferences: string[];
  fitPreferences: string[];
  colorPreferences: string[];
  patternPreferences: string[];
  clothingPreferences: string[];
  profileImage?: string; // full-body or avatar
  hairLength?: 'Short' | 'Medium' | 'Long' | 'Very Long';
  hairType?: 'Straight' | 'Wavy' | 'Curly' | 'Coily' | 'Other' | 'Prefer not to say';
  height?: string; // e.g. "172 cm" or "5'8"
  bodyMeasurements?: BodyMeasurements;
  createdAt: string;
}

export interface WardrobeFolder {
  id: string;
  userId: string;
  name: string;
  category?: ClothingCategory | string;
  isDefault: boolean;
  itemCount?: number;
}

export interface WardrobeItem {
  id: string;
  userId: string;
  image: string; // Base64 or URL
  name: string;
  category: ClothingCategory;
  color: string;
  secondaryColors?: string[];
  pattern: string;
  style: string;
  material?: string;
  occasion: string[];
  season: string[];
  formality: 'Casual' | 'Smart Casual' | 'Formal' | 'Festive' | 'Athletic';
  fit?: string;
  folderId: string;
  notes?: string;
  favorite: boolean;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  brand?: string;
  platform: 'Myntra' | 'Amazon' | 'Flipkart' | 'Meesho' | 'Ajio' | 'Other';
  price: number; // in INR
  originalPrice?: number;
  imageUrl: string;
  reason: string;
  category: string;
  link: string;
  rating?: number;
  reviewsCount?: number;
}

export interface MissingOutfitItem {
  category: ClothingCategory | string;
  suggestedName: string;
  reason: string;
  productRecommendations: ProductItem[];
}

export interface Outfit {
  id: string;
  userId: string;
  name: string;
  items: WardrobeItem[];
  occasion: string;
  style: string;
  saved: boolean;
  favorite: boolean;
  generatedByAI: boolean;
  reason: string;
  missingItems?: MissingOutfitItem[];
  previewOverlayUrl?: string;
  createdAt: string;
}

export interface PackingListItem {
  id: string;
  name: string;
  category: 'Clothing' | 'Footwear' | 'Accessories' | 'Toiletries' | 'Documents';
  isPacked: boolean;
  itemRefId?: string; // Wardrobe item ID if matched
  imageUrl?: string;
  quantity?: number;
}

export interface DayOutfitPlan {
  dayNumber: number;
  dateStr: string;
  activityTitle: string;
  vibe: string;
  temperature?: string;
  top?: WardrobeItem | null;
  bottom?: WardrobeItem | null;
  outerwear?: WardrobeItem | null;
  footwear?: WardrobeItem | null;
  accessories?: WardrobeItem | null;
  missingSuggestion?: {
    name: string;
    category: string;
    productLink?: string;
    reason: string;
  };
}

export interface Trip {
  id: string;
  userId: string;
  destination: string;
  startDate: string;
  endDate: string;
  activities: string[];
  tripStyle: 'Relaxed' | 'Stylish' | 'Minimal luggage' | 'Fashion-focused' | 'Comfortable';
  weather?: {
    summary: string;
    temperatureRange: string;
    icon: string;
  };
  generatedOutfits: DayOutfitPlan[];
  packingList: PackingListItem[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'daily_look' | 'packing_reminder' | 'ai_recommendation' | 'saved_outfit' | 'shopping' | 'occasion';
  title: string;
  body: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedOutfits?: Outfit[];
  suggestedProducts?: ProductItem[];
}

export interface VisionAnalysisResult {
  category: ClothingCategory;
  name: string;
  color: string;
  pattern: string;
  style: string;
  material: string;
  occasion: string[];
  season: string[];
  formality: 'Casual' | 'Smart Casual' | 'Formal' | 'Festive' | 'Athletic';
  fit: string;
  confidence: number;
}
