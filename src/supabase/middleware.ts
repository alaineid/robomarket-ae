import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/supabase/server";

/**
 * Refreshes the Supabase session and sets updated cookies.
 */
export async function updateSession(_request?: NextRequest) {
  try {
    // reads cookies via `cookies()` in supabaseServer,
    // refreshes tokens if needed, and writes new cookies.
    const supabaseServer = await createClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    // Log for debugging
    console.log(
      "Middleware user check:",
      user ? "Authenticated" : "Not authenticated",
    );

    return NextResponse.next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.next();
  }
}
