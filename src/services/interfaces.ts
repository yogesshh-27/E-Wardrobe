import {
  UserProfile,
  WardrobeItem,
  Outfit,
  Trip,
  ProductItem,
  VisionAnalysisResult,
  NotificationItem,
  ChatMessage,
  ClothingCategory
} from '@/types';

export interface IAuthService {
  loginWithGoogle(): Promise<UserProfile>;
  loginWithEmail(email: string, password?: string): Promise<UserProfile>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<UserProfile | null>;
  updateProfile(profile: Partial<UserProfile>): Promise<UserProfile>;
  deleteAccount(): Promise<void>;
}

export interface IVisionService {
  analyze(imageFileOrUrl: string | File): Promise<VisionAnalysisResult>;
}

export interface IStylistService {
  generateOccasionOutfits(params: {
    occasion: string;
    customOccasion?: string;
    venue?: 'Indoor' | 'Outdoor';
    timeOfDay?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
    dressCode?: string;
    desiredLook?: string;
    wardrobe: WardrobeItem[];
    userProfile: UserProfile;
  }): Promise<Outfit[]>;

  generateDailyLook(params: {
    wardrobe: WardrobeItem[];
    userProfile: UserProfile;
    date?: Date;
  }): Promise<{ theme: string; outfit: Outfit; whyYoullLikeIt: string }>;

  generateTravelWardrobe(params: {
    destination: string;
    startDate: string;
    endDate: string;
    activities: string[];
    tripStyle: string;
    wardrobe: WardrobeItem[];
    userProfile: UserProfile;
  }): Promise<Trip>;

  getOutfitIdeasForItem(
    item: WardrobeItem,
    wardrobe: WardrobeItem[]
  ): Promise<{ matchingItems: WardrobeItem[]; suggestionRules: string[] }>;

  chat(
    userMessage: string,
    history: ChatMessage[],
    wardrobe: WardrobeItem[],
    userProfile: UserProfile
  ): Promise<{ reply: string; outfits?: Outfit[]; products?: ProductItem[] }>;
}

export interface ITryOnService {
  simulateTryOn(
    userPhotoUrl: string,
    garments: WardrobeItem[]
  ): Promise<{ previewUrl: string; isSimulation: true; disclaimer: string }>;
}

export interface IWeatherService {
  getWeatherForCity(cityName: string, date?: string): Promise<{
    condition: string;
    temperatureCelsius: number;
    description: string;
    icon: string;
  }>;
}

export interface ILocationService {
  searchDestinations(query: string): Promise<Array<{ city: string; country: string; vibe: string }>>;
}

export interface IProductService {
  getRecommendationsForMissingCategory(
    category: ClothingCategory | string,
    style?: string,
    color?: string
  ): Promise<ProductItem[]>;

  getTrendingProducts(stylePreferences?: string[]): Promise<ProductItem[]>;

  buildAffiliateSearchUrl(query: string, platform: ProductItem['platform']): string;
}

export interface IStorageService {
  storeImage(file: File): Promise<string>;
  deleteImage(idOrUrl: string): Promise<void>;
}

export interface INotificationService {
  getNotifications(): Promise<NotificationItem[]>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  generateContextualNotification(event: string, meta?: Record<string, unknown>): Promise<NotificationItem>;
}
