import { UserProfile } from '@/types';
import { IAuthService } from './interfaces';

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
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  async loginWithGoogle(): Promise<UserProfile> {
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

  async requestPhoneOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return {
      success: true,
      message: `A 6-digit OTP has been sent to ${phone}. (Mock demo code: 123456)`,
    };
  }

  async verifyPhoneOtp(phone: string, otp: string): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 700));
    // Accept 123456 or any 6-digit code for mock
    if (otp.length !== 6) {
      throw new Error('Please enter a valid 6-digit verification code.');
    }
    const user: UserProfile = {
      ...DEFAULT_MOCK_USER,
      phone,
      name: 'Style Enthusiast',
      email: undefined,
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
