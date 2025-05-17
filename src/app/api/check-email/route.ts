// src/app/api/check-email/route.ts

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase.types";

// Create an admin client—this runs only on the server
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { email } = await req.json();

  // Server-side check in your "customers" table, bypassing RLS
  const { data: customer, error } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Error checking customer existence:", error);
    // Treat errors as "not exists", so signup still proceeds
    return NextResponse.json({ exists: false });
  }

  return NextResponse.json({ exists: customer !== null });
}
