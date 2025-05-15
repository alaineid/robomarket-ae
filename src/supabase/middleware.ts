import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

/**
 * Middleware utility to update the user's session.
 * This function is called by the main `middleware.ts` file.
 * It refreshes the Supabase session token if necessary and ensures
 * cookies are correctly passed between the browser and server.
 *
 * @param request - The incoming NextRequest object.
 * @returns A NextResponse object, potentially with updated cookies.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  // Ensure environment variables are defined
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Supabase URL or Anon Key is not defined in environment variables for middleware.");
    // Potentially redirect to an error page or return a specific error response
    // For now, we'll let it proceed, but Supabase client creation will fail.
    // It's better to throw or handle this explicitly in a production app.
    return supabaseResponse; // Or throw new Error(...)
  }

  // Create a Supabase client specifically for middleware context
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  // Get the user without redirecting - the auth flow will handle redirections
  await supabase.auth.getUser();
  
  // Don't redirect in middleware - let the auth flow handle redirections
  return supabaseResponse;
}
