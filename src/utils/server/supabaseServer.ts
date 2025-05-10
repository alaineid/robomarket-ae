import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase.types';

// Server-side Supabase client with cookies
export const createServerClient = () => {
  return createServerComponentClient<Database>({
    cookies: () => Promise.resolve(cookies()),
  });
};

// Admin client (for server-side admin tasks, bypassing RLS)
export const createServerAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL');
  }

  return createSupabaseAdminClient<Database>(supabaseUrl, supabaseServiceKey);
};