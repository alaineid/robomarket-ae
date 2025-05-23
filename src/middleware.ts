import { type NextRequest } from "next/server";
import { updateSession } from "@/supabase/middleware";

/**
 * Next.js middleware: delegates to updateSession()
 */
export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
