import { type NextRequest } from 'next/server';
import { updateSession } from '@/supabase/middleware'; // Adjust path if your project structure differs

/**
 * The main middleware function for the Next.js application.
 * It calls the `updateSession` utility to handle Supabase session management.
 *
 * @param request - The incoming NextRequest object.
 * @returns A Promise resolving to a NextResponse object.
 */
export async function middleware(request: NextRequest) {
  // `updateSession` function handles Supabase session refreshing and cookie management.
  return await updateSession(request);
}

/**
 * Configuration for the middleware.
 * The `matcher` property defines which paths the middleware should run on.
 * It's crucial to exclude static assets and image optimization files to avoid
 * unnecessary processing and potential issues.
 */
export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any files with common image extensions (svg, png, jpg, jpeg, gif, webp)
     * This helps to ensure the middleware only runs on actual pages and API routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
