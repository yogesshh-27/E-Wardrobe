'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import LoginPage from '@/app/(auth)/login/page';

export default function RootLandingPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.replace('/wardrobe');
    }
  }, [isAuthenticated, user, router]);

  // If authenticated, show a clean transition while redirecting to the wardrobe atelier
  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
          <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">
            Entering Atelier...
          </span>
        </div>
      </div>
    );
  }

  // Landing page IS the login window
  return <LoginPage />;
}
