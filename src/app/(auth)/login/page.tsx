'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ChevronRight,
  User,
  Heart,
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { BubbleLogo } from '@/components/showcase/BubbleLogo';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    loginWithGoogle,
    loginWithEmail,
    setUser,
    isLoading,
  } = useAuthStore();

  const [authMethod, setAuthMethod] = useState<'options' | 'email'>('options');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isGoogleConnecting, setIsGoogleConnecting] = useState(false);

  useEffect(() => {
    try {
      const supabase = createClient();

      // Check if session was already completed or returned from OAuth
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          useAuthStore.getState().checkSession().then(() => {
            router.replace('/wardrobe');
          });
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await useAuthStore.getState().checkSession();
          router.replace('/wardrobe');
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.warn('[Login Auth Listener] Warning:', err);
    }
  }, [router]);

  const handleQuickDemoEnter = () => {
    setUser({
      id: 'demo-user-1',
      name: 'Alex Rivera',
      email: 'alex@wardrobe.ai',
      stylePreferences: ['Smart Casual', 'Minimalist', 'Aesthetic'],
      genderPreference: 'Prefer not to say',
      fitPreferences: ['Relaxed', 'Tailored'],
      colorPreferences: ['Sky Blue', 'Blush Rose', 'White'],
      patternPreferences: ['Solid', 'Minimal'],
      clothingPreferences: ['Sweaters', 'Blazers', 'Bags'],
      profileImage: '/images/showcase/editorial_smart_casual_1791561468361.jpg',
      createdAt: new Date().toISOString(),
    });
    router.push('/wardrobe');
  };

  const handleGoogleLogin = async () => {
    setIsGoogleConnecting(true);
    setErrorMessage('');
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/wardrobe`,
        },
      });
      if (error) {
        setErrorMessage(error.message);
        setIsGoogleConnecting(false);
      } else if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error)?.message || 'Google authentication failed. Please try again.');
      setIsGoogleConnecting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    try {
      setErrorMessage('');
      await loginWithEmail(email);
      router.push('/wardrobe');
    } catch {
      setErrorMessage('Email login failed. Please verify your address.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col justify-between selection:bg-[#38BDF8]/20 selection:text-[#0284C7] relative overflow-hidden">
      {/* Ambient Blush & Ice Blue Glow */}
      <div className="absolute top-0 -left-20 w-96 h-96 rounded-full bg-[#FCE7EB] blur-3xl pointer-events-none opacity-70" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 rounded-full bg-[#E0F2FE] blur-3xl pointer-events-none opacity-70" />

      {/* Top Header */}
      <header className="flex h-20 items-center justify-between px-6 sm:px-12 border-b border-[#E2E8F0] bg-white/75 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <BubbleLogo text="WARDROBE" variant="dual" size="sm" />
          <span className="text-[10px] text-[#64748B] hidden sm:inline-block font-sans font-semibold uppercase tracking-widest pl-2 border-l border-[#CBD5E1]">
            AI Styling Atelier
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-[#64748B] hidden md:inline-block font-sans font-medium">
            Contemporary smart casual for boys &amp; girls
          </span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E2E8F0] shadow-2xs">
            <span className="h-2 w-2 rounded-full bg-[#38BDF8] animate-pulse" />
            <span className="text-[11px] font-bold text-[#0284C7]">Live Studio</span>
          </div>
        </div>
      </header>

      {/* Main Two-Column Editorial Experience */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 relative z-10">
        
        {/* Left Side: Contemporary Editorial Collage & Philosophy */}
        <div className="w-full lg:w-7/12 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FCE7EB] to-[#E0F2FE] border border-[#E2E8F0] px-3.5 py-1 text-xs font-bold text-[#0284C7] uppercase tracking-wider shadow-2xs">
              <Sparkles className="h-3.5 w-3.5 text-[#E87A90]" />
              <span>Contemporary Smart Casual Edition</span>
            </div>

            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1C1917] leading-[1.08]">
              YOUR WARDROBE. <br />
              <span className="bg-gradient-to-r from-[#E87A90] via-[#C084FC] to-[#0284C7] bg-clip-text text-transparent">
                EFFORTLESSLY
              </span> STYLED.
            </h1>

            <p className="text-base sm:text-lg text-[#475569] max-w-xl font-sans leading-relaxed">
              Curated for both boys and girls in soft blush and crisp ice sky blue. Digitally catalog your clothes,
              generate day-wise travel capsules, and preview outfits on your silhouette.
            </p>
          </div>

          {/* Visual Showcase Feature Card */}
          <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E2E8F0] p-4 shadow-lg flex flex-col sm:flex-row items-center gap-6">
            <div className="w-40 sm:w-48 aspect-[3/4] rounded-2xl overflow-hidden shrink-0 border border-[#E2E8F0]">
              <img
                src="/images/showcase/editorial_smart_casual_1791561468361.jpg"
                alt="Contemporary smart casual styling"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-3 p-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[10px] font-bold uppercase tracking-wider">
                <span>Inclusive Styling</span>
              </div>
              <h3 className="text-lg font-bold text-[#1C1917]">
                Dual Aesthetic Taxonomy
              </h3>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Whether you prefer relaxed sky blue knits or structured blush tailoring, your AI atelier harmonizes your personal style DNA.
              </p>
              <div className="flex items-center gap-3 pt-1 text-xs font-bold text-[#0284C7]">
                <span>✓ Travel Capsules</span>
                <span>✓ Event Looks</span>
                <span>✓ AI Try-On</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Elegant Login Card with Theme Gradients */}
        <div className="w-full lg:w-5/12 max-w-md">
          <div className="rounded-3xl bg-white border border-[#E2E8F0] p-8 sm:p-10 shadow-xl relative overflow-hidden">
            {/* Top decorative gradient line in blush & sky blue */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#E87A90] via-[#C084FC] to-[#38BDF8]" />

            <div className="text-center space-y-2 mb-6">
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#0284C7]">
                Welcome In
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#1C1917] tracking-tight font-sans">
                Sign In to Atelier
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                Connect your account to access your digital wardrobe and personal stylist.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-3.5 text-xs text-rose-600 text-center font-medium">
                {errorMessage}
              </div>
            )}

            {/* Options View */}
            {authMethod === 'options' && (
              <div className="space-y-3.5">
                {/* Active Session Notice if already logged in */}
                {isAuthenticated && user && (
                  <div className="rounded-2xl bg-gradient-to-r from-[#FCE7EB] to-[#E0F2FE] border border-[#E2E8F0] p-4 space-y-3 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-xs shrink-0 bg-white">
                        <img
                          src={user.profileImage || '/images/showcase/editorial_smart_casual_1791561468361.jpg'}
                          alt={user.name || 'User'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          <p className="text-xs font-bold text-[#1C1917] truncate">{user.name}</p>
                        </div>
                        <p className="text-[11px] text-[#64748B] truncate">{user.email || 'Active Studio Session'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => router.push('/wardrobe')}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#1C1917] py-2 px-3 text-xs font-bold text-white shadow-xs hover:bg-[#334155] active:scale-[0.99] transition-all"
                      >
                        <span>Open Wardrobe Studio</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          await useAuthStore.getState().logout();
                        }}
                        className="rounded-xl border border-[#CBD5E1] bg-white py-2 px-3 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-all shadow-xs"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}

                {/* 1-Click Guest Demo Button */}
                <button
                  onClick={handleQuickDemoEnter}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#E87A90] to-[#0284C7] py-3.5 px-4 text-xs font-bold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition-all"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Enter Guest Stylist Studio (1-Click)</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-[#E2E8F0]" />
                  <span className="shrink-0 mx-3 text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                    Or sign in with
                  </span>
                  <div className="flex-grow border-t border-[#E2E8F0]" />
                </div>

                {/* Google Button - PKCE OAuth Flow */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleConnecting}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white py-3.5 px-4 text-xs font-semibold text-[#1C1917] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] active:scale-[0.99] transition-all shadow-xs cursor-pointer disabled:opacity-70"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{isGoogleConnecting ? 'Connecting to Google...' : 'Continue with Google'}</span>
                </button>

                {/* Email Option */}
                <button
                  onClick={() => setAuthMethod('email')}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1C1917] py-3.5 px-4 text-xs font-semibold text-white hover:bg-[#334155] active:scale-[0.99] transition-all shadow-sm"
                >
                  <Mail className="h-4 w-4 text-[#38BDF8]" />
                  <span>Continue with Email</span>
                </button>
              </div>
            )}

            {/* Email Form View */}
            {authMethod === 'email' && (
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B] block mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center rounded-2xl border border-[#E2E8F0] bg-[#FAF8F5] px-3.5 py-3 focus-within:border-[#0284C7] focus-within:bg-white transition-all">
                    <Mail className="h-4 w-4 text-[#64748B] mr-2 shrink-0" />
                    <input
                      type="email"
                      placeholder="alex@wardrobe.ai"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      className="flex-1 bg-transparent text-xs text-[#1C1917] focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] py-3.5 text-xs font-semibold text-white shadow-sm transition-all"
                >
                  <span>{isLoading ? 'Signing in...' : 'Sign in with Email'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setAuthMethod('options')}
                  className="w-full text-center text-xs text-[#64748B] hover:text-[#1C1917] pt-1"
                >
                  ← Back to login options
                </button>
              </form>
            )}

            {/* Security Guarantee */}
            <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex items-center justify-center gap-2 text-[11px] text-[#64748B]">
              <Lock className="h-3.5 w-3.5 text-[#38BDF8]" />
              <span>Private &amp; confidential personal wardrobe data</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#E2E8F0] px-6 text-center text-xs text-[#64748B] bg-white/40">
        <p>© 2026 WARDROBE AI. Styled for contemporary smart casual elegance in blush &amp; sky blue.</p>
      </footer>
    </div>
  );
}
