"use client";

import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './types/database.types';

// This automatically uses NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
export const supabase = createPagesBrowserClient<Database>();