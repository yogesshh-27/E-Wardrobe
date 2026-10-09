import { UserProfile } from '@/types';
import { IAuthService } from './interfaces';
import { createClient } from '@/lib/supabase/client';

const DEFAULT_MOCK_USER: UserProfile = {
  id: 'usr-101',
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  phone: '+91 98765 43210',
  genderPreference: 'Prefer not to say',
  stylePreferences: ['Old Money', 'Minimalist', 'Smart Casual', 'Traditional'],
  fitPreferences: ['Fitted', 'Relaxed'],
  colorPreferences: ['White', 'Black', 'Beige', 'Blue', 'Olive Green'],
  patternPreferences: ['Solid', 'Minimal patterns'],
  clothingPreferences: ['Shirts', 'Trousers', 'Blazers', 'Kurtas', 'Jeans'],
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
  hairLength: 'Medium',
  hairType: 'Wavy',
  height: '178 cm',
  bodyMeasurements: {
    chest: '40',
    waist: '32',
    hips: '38',
    unit: 'inches',
  },
  createdAt: '2026-01-15T08:00:00Z',
};

const STORAGE_KEY = 'e_wardrobe_user_session';

export class AuthService implements IAuthService {
  async getCurrentUser(): Promise<UserProfile | null> {
    if (typeof window === 'undefined') return null;

    try {
      const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const userMeta = session.user.user_metadata || {};
          const user: UserProfile = {
            ...DEFAULT_MOCK_USER,
            id: session.user.id,
            name: userMeta.full_name || userMeta.name || session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            profileImage: userMeta.avatar_url || userMeta.picture || DEFAULT_MOCK_USER.profileImage,
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
          return user;
        }
      } catch (err) {
        console.warn('[Supabase Session] Checking session fallback:', err);
      }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  async loginWithGoogle(): Promise<UserProfile> {
    if (typeof window !== 'undefined') {
      const callbackUrl = encodeURIComponent(`${window.location.origin}/auth/callback?next=/wardrobe`);
      const targetUrl = `https://ohqkjihpnxhorzdowzza.supabase.co/auth/v1/authorize?provider=google&redirect_to=${callbackUrl}`;
      window.location.href = targetUrl;
      return new Promise<UserProfile>(() => {});
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    const user: UserProfile = {
      ...DEFAULT_MOCK_USER,
      name: 'Priya Patel',
      email: 'priya.patel@gmail.com',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }


  async loginWithEmail(email: string, _password?: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const namePart = email.split('@')[0] || 'User';
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const user: UserProfile = {
      ...DEFAULT_MOCK_USER,
      email,
      name: capitalized,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
    return user;
  }

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        try {
          const supabase = createClient();
          await supabase.auth.signOut();
        } catch (err) {
          console.warn('[Supabase SignOut] Error:', err);
        }
      }
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async updateProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    const current = (await this.getCurrentUser()) || DEFAULT_MOCK_USER;
    const updated = { ...current, ...profile };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  async deleteAccount(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
}

export const authService = new AuthService();
