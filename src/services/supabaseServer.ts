import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.types';

/**
 * Server-side client using anon key (with RLS)
 * Safe for SSR and server components.
 */
export function createServerAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Server-side admin client (bypasses RLS)
 * ⚠️ Use only in secure backend code (e.g. API routes, cron jobs).
 */
export function createServerAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey);
}
