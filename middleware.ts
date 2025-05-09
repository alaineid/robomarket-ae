import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from './src/utils/types/database.types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient<Database>({ req, res });
  
  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();
  
  return res;
}

// Optionally specify paths that should always use this middleware
// export const config = {
//   matcher: [
//     // Required for SUPABASE_URL/auth/v1 routes
//     '/((?!_next/static|_next/image|favicon.ico).*)',
//   ],
// };