'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Phone, Mail, ArrowRight, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isOnboarded, loginWithGoogle, verifyPhoneOtp, loginWithEmail, isLoading } =
    useAuthStore();

  const [authMethod, setAuthMethod] = useState<'options' | 'phone' | 'otp' | 'email'>('options');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (isOnboarded) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
    }
  }, [isAuthenticated, isOnboarded, user, router]);

  // Resend OTP Countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (authMethod === 'otp' && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [authMethod, resendTimer]);

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage('');
      const loggedUser = await loginWithGoogle();
      if (loggedUser.stylePreferences?.length > 0) {
        router.push('/');
      } else {
        router.push('/onboarding');
      }
    } catch {
      setErrorMessage('Google authentication failed. Please try again.');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setResendTimer(30);
    setAuthMethod('otp');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    // Auto advance focus to next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpCode.join('');
    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the code.');
      return;
    }
    try {
      setErrorMessage('');
      await verifyPhoneOtp(phoneNumber, fullOtp);
      router.push('/onboarding');
    } catch {
      setErrorMessage('Invalid verification code. (Hint: enter 123456 for demo)');
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
      router.push('/onboarding');
    } catch {
      setErrorMessage('Email login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-between selection:bg-[#B4533C]/20">
      {/* Top Header */}
      <header className="flex h-20 items-center justify-between px-6 sm:px-12 border-b border-[#E7E0D6]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#B4533C] text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#1C1917]">
            E-Wardrobe
          </span>
        </Link>
        <span className="text-xs text-[#78716C] hidden sm:inline-block">
          Your wardrobe. Your style. AI-powered.
        </span>
      </header>

      {/* Main Hero Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md rounded-3xl bg-white border border-[#E7E0D6] p-8 sm:p-10 shadow-xl card-shadow">
          {/* Hero Headlines */}
          <div className="text-center space-y-2 mb-8">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1917] tracking-tight leading-tight">
              Your wardrobe, intelligently styled.
            </h1>
            <p className="text-xs sm:text-sm text-[#57534E] max-w-sm mx-auto leading-relaxed">
              Organize your wardrobe, discover your personal style, and let AI help you dress for every occasion.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-600 text-center">
              {errorMessage}
            </div>
          )}

          {/* Options View */}
          {authMethod === 'options' && (
            <div className="space-y-3.5">
              {/* Google Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#E7E0D6] bg-white py-3.5 px-4 text-xs font-semibold text-[#1C1917] hover:bg-[#FAF8F5] hover:border-[#D5CCC0] active:scale-[0.99] transition-all shadow-xs"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>

              {/* Mobile Phone Option */}
              <button
                onClick={() => setAuthMethod('phone')}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#1C1917] py-3.5 px-4 text-xs font-semibold text-white hover:bg-[#B4533C] active:scale-[0.99] transition-all shadow-sm"
              >
                <Phone className="h-4 w-4" />
                <span>Continue with Mobile Number</span>
              </button>

              {/* Email Option */}
              <button
                onClick={() => setAuthMethod('email')}
                className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-transparent py-2.5 text-xs font-semibold text-[#57534E] hover:text-[#1C1917] hover:bg-[#FAF8F5] transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>Sign in with Email</span>
              </button>
            </div>
          )}

          {/* Phone Input View */}
          {authMethod === 'phone' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-2">
                  Mobile Number
                </label>
                <div className="flex items-center rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-3.5 py-3 focus-within:border-[#B4533C] focus-within:bg-white transition-all">
                  <span className="text-xs font-bold text-[#57534E] mr-2">+91</span>
                  <input
                    type="tel"
                    placeholder="98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    autoFocus
                    className="flex-1 bg-transparent text-sm text-[#1C1917] focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#B4533C] py-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-all"
              >
                <span>Send 6-Digit Code</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('options')}
                className="w-full text-center text-xs text-[#78716C] hover:text-[#1C1917] pt-1"
              >
                Back to all options
              </button>
            </form>
          )}

          {/* 6-Digit OTP View */}
          {authMethod === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center">
                <p className="text-xs text-[#57534E]">
                  Enter code sent to <span className="font-bold text-[#1C1917]">+91 {phoneNumber}</span>
                </p>
                <p className="text-[11px] text-[#B4533C] mt-1 font-medium">
                  Mock prototype code: any 6 digits (e.g. 123456)
                </p>
              </div>

              {/* 6 Boxes */}
              <div className="flex justify-between gap-2">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="h-12 w-11 text-center rounded-xl border border-[#E7E0D6] bg-[#FAF8F5] text-lg font-bold text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden transition-all"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-2xl bg-[#B4533C] py-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-all"
              >
                Verify & Continue
              </button>

              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <button
                  type="button"
                  onClick={() => setAuthMethod('phone')}
                  className="hover:text-[#1C1917]"
                >
                  Change number
                </button>
                {resendTimer > 0 ? (
                  <span>Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setResendTimer(30)}
                    className="text-[#B4533C] font-semibold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Resend Code
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Email View */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#78716C] block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  className="w-full rounded-2xl border border-[#E7E0D6] bg-[#FAF8F5] px-4 py-3 text-xs text-[#1C1917] focus:border-[#B4533C] focus:bg-white focus:outline-hidden transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-[#B4533C] py-3.5 text-xs font-semibold text-white shadow-sm hover:bg-[#9E4530] transition-all"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={() => setAuthMethod('options')}
                className="w-full text-center text-xs text-[#78716C] hover:text-[#1C1917] pt-1"
              >
                Back to all options
              </button>
            </form>
          )}

          {/* Quick Demo Bypass */}
          <div className="mt-8 pt-6 border-t border-[#E7E0D6] text-center">
            <button
              onClick={handleGoogleLogin}
              className="text-xs font-semibold text-[#B4533C] hover:underline"
            >
              ⚡ Explore with demo profile (1-click login)
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#78716C] space-y-1">
        <p>By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        <p className="text-[10px] text-[#A8A29E]">
          E-Wardrobe • AI-Powered Fashion Intelligence
        </p>
      </footer>
    </div>
  );
}
