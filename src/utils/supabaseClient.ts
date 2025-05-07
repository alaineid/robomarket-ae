"use client";

import { createClient } from '@supabase/supabase-js';

// These are meant to be exposed to the client, so NEXT_PUBLIC_ is correct
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase credentials.');
}

// This client is safe to use in client components
export const supabase = createClient(supabaseUrl, supabaseAnonKey);