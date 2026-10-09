'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/wardrobe';

  useEffect(() => {
    let isMounted = true;

    async function finishAuth() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          await useAuthStore.getState().checkSession();
          router.replace(next);
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (newSession?.user && isMounted) {
            await useAuthStore.getState().checkSession();
            router.replace(next);
          }
        });

        const timeout = setTimeout(() => {
          if (isMounted) {
            router.replace('/wardrobe');
          }
        }, 3500);

        return () => {
          subscription.unsubscribe();
          clearTimeout(timeout);
        };
      } catch {
        if (isMounted) {
          router.replace('/wardrobe');
        }
      }
    }

    finishAuth();

    return () => {
      isMounted = false;
    };
  }, [router, next]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
      <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">
        Completing Atelier Sign In...
      </span>
    </div>
  );
}

export default function AuthCallbackClientPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#0284C7] border-t-transparent animate-spin" />
            <span className="text-xs font-semibold text-[#64748B] tracking-wider uppercase">
              Loading...
            </span>
          </div>
        }
      >
        <AuthCallbackContent />
      </Suspense>
    </div>
  );
}
