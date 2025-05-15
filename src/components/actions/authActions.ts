"use server";

import { createClient } from "@/supabase/server"; // Supabase server client
import { redirect } from "next/navigation"; // Next.js navigation for redirects
import { revalidatePath } from "next/cache"; // Next.js cache revalidation
import { headers } from "next/headers"; // Get origin for email confirmation

// Define types for the action's return values with better type safety
interface ActionResult {
  error?: { message: string; type?: string };
  success?: { 
    message: string;
    user?: any; // User data when available
  };
}

/**
 * Server Action for user login.
 * @param formData - The form data containing email and password.
 * @returns An object with an error message if login fails, otherwise redirects.
 */
export async function loginAction(formData: FormData): Promise<ActionResult | void> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    return { error: { message: "Email and password are required." } };
  }
  
  try {
    // Sign in the user with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: { message: error.message } };
    }

    // Revalidate paths to ensure UI updates with new auth state
    revalidatePath("/", "layout");
    
    // Return success with the user data
    return { 
      success: { 
        message: "Login successful",
        user: data.user || null
      } 
    };
  } catch (error) {
    console.error("Login error:", error);
    return { error: { message: "An unexpected error occurred. Please try again." } };
  }
}

/**
 * Server Action for user signup.
 * @param formData - The form data containing email and password.
 * @returns An object with an error or success message.
 */
export async function signupAction(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const headersList = await headers();
  const origin = headersList.get('origin'); // Get the origin for the confirmation email link

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // You might add more fields like 'confirmPassword' and validate them here

  // Basic validation
  if (!email || !password) {
    return { error: { message: "Email and password are required." } };
  }
  if (password.length < 6) { // Example: Supabase default minimum password length
    return { error: { message: "Password should be at least 6 characters."}};
  }
  // Add more validation as needed (e.g., email format)

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Email confirmation link will be sent to the user.
      // Ensure your Supabase project has email confirmation enabled
      // and the redirect URL is set correctly.
      emailRedirectTo: `${origin}/auth/confirm`, // This matches our auth/confirm/route.ts
    },
  });

  if (error) {
    console.error("Signup Error:", error.message);
    return { error: { message: error.message, type: error.name } };
  }

  if (data.user && data.user.identities && data.user.identities.length === 0) {
    // This case can happen if "Secure email change" is enabled in Supabase
    // The email is already in use but not confirmed.
    // Supabase might return a user object but indicate that confirmation is needed for an existing unconfirmed user.
    return { error: { message: "This email address is already in use. If it's yours, please check your inbox for a confirmation email or try resetting your password.", type: "EmailExistsUnconfirmed" }};
  }

  if (data.session) {
    // User is signed up and logged in (e.g. if email confirmation is disabled)
    // RevalidatePath("/", "layout");
    // Redirect("/account/dashboard"); // Or a "please check your email page" if confirmation is required
  }

  // If email confirmation is required, data.user will exist but data.session will be null.
  // You should inform the user to check their email.
  // A redirect to a specific "check your email" page is good practice.
  // For now, returning a success message.
  revalidatePath("/", "layout"); // Revalidate to clear any cached public pages
  return { success: { message: "Signup successful! Please check your email to confirm your account." } };
  // Consider redirecting to a page: redirect('/auth/check-email');
}

/**
 * Server Action for user logout.
 * Redirects to the login page after signing out.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  
  // Sign out the user
  await supabase.auth.signOut();
  
  // Revalidate paths to update UI
  revalidatePath("/", "layout");
  
  // Redirect to login page
  return redirect("/login");
}

// You would also create route handlers for OAuth callbacks and email confirmation
// e.g., in src/app/auth/confirm/route.ts
