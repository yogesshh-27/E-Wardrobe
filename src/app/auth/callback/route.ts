import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@/lib/supabase/client';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/wardrobe';

  const forwardedHost = request.headers.get('x-forwarded-host');
  const baseUrl = forwardedHost ? `https://${forwardedHost}` : origin;

  if (code) {
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
              // Expected in route handlers when headers are committed
            }
          },
        },
      });

      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data?.session) {
        return NextResponse.redirect(`${baseUrl}${next}`);
      }
      console.warn('[Supabase Auth Callback] Server exchange warning:', error?.message);
    } catch (err) {
      console.error('[Supabase Auth Callback] Server exchange error:', err);
    }
  }

  // Redirect to client callback so client can complete session exchange if PKCE is in localStorage
  return NextResponse.redirect(`${baseUrl}/auth/callback-client?next=${encodeURIComponent(next)}`);
}
