import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/client';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Handled when headers committed
          }
        },
      },
    });

    // Sign out from Supabase server session
    await supabase.auth.signOut();

    // Explicitly delete any sb- and auth related cookies
    const allCookies = cookieStore.getAll();
    allCookies.forEach((c) => {
      if (
        c.name.startsWith('sb-') ||
        c.name.includes('supabase') ||
        c.name.includes('auth-token')
      ) {
        try {
          cookieStore.delete(c.name);
        } catch {
          // ignore
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error('[Server Logout Route] Error:', err);
    return NextResponse.json(
      { success: false, error: (err as Error)?.message || 'Logout failed' },
      { status: 500 }
    );
  }
}
