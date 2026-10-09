import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';
import { authService } from '@/services/authService';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  checkSession: () => Promise<UserProfile | null>;
  loginWithGoogle: () => Promise<UserProfile>;
  loginWithEmail: (email: string) => Promise<UserProfile>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<UserProfile>;
  completeOnboarding: (data: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isOnboarded: !!user && (user.stylePreferences?.length > 0 || false),
        }),

      checkSession: async () => {
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            set({
              user,
              isAuthenticated: true,
              isOnboarded: user.stylePreferences?.length > 0 || false,
            });
            return user;
          }
        } catch (err) {
          console.warn('[AuthStore] Session check warning:', err);
        }
        return null;
      },

      loginWithGoogle: async () => {
        set({ isLoading: true });
        try {
          const user = await authService.loginWithGoogle();
          return user;
        } finally {
          // Keep loading state until external redirect completes
        }
      },

      loginWithEmail: async (email) => {
        set({ isLoading: true });
        try {
          const user = await authService.loginWithEmail(email);
          set({
            user,
            isAuthenticated: true,
            isOnboarded: false,
            isLoading: false,
          });
          return user;
        } finally {
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        const currentUser = get().user;
        if (!currentUser) throw new Error('Not authenticated');
        const updated = await authService.updateProfile(data);
        set({ user: updated });
        return updated;
      },

      completeOnboarding: async (data) => {
        const currentUser = get().user;
        if (!currentUser) return;
        const updated = await authService.updateProfile({
          ...data,
        });
        set({
          user: updated,
          isOnboarded: true,
        });
      },

      logout: async () => {
        await authService.logout();
        set({ user: null, isAuthenticated: false, isOnboarded: false });
      },

      deleteAccount: async () => {
        await authService.deleteAccount();
        set({ user: null, isAuthenticated: false, isOnboarded: false });
      },
    }),
    {
      name: 'ewardrobe_auth_store',
    }
  )
);
