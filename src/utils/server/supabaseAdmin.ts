import { createClient } from '@supabase/supabase-js';

// Server-side supabase client that uses the service role key
// Only import this in server components or API routes!

// Non-NEXT_PUBLIC_ env vars are only available server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase credentials for admin operations');
}

// This client has admin privileges and should only be used server-side
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);