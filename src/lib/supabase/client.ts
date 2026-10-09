import { createBrowserClient } from '@supabase/ssr';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ohqkjihpnxhorzdowzza.supabase.co';

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ocWtqaWhwbnhob3J6ZG93enphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NjYyMDAsImV4cCI6MjEwNzE0MjIwMH0.3uY48YDM2orAIQcAtAzGpofZ2PzF-Fbu1TSo3wrAazc';

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
