"use client";

import { useEffect, useRef } from 'react';
import { createClient } from '@/supabase/client'; // Supabase client for browser
import { useAuthStore } from '@/store/authStore'; // Zustand store for auth state
import { type User } from '@supabase/supabase-js'; // Supabase User type

interface AuthProviderProps {
  serverUser: User | null; // User object passed from a Server Component/Layout
  children: React.ReactNode;
}

/**
 * AuthProvider component.
 * 1. Initializes the Zustand auth store with `serverUser` data (from SSR).
 * 2. Sets up a Supabase `onAuthStateChange` listener to keep client-side auth state
 * in sync with Supabase auth events (login, logout, token refresh).
 *
 * This component should wrap the main content of your application, typically in the root layout.
 */
export default function AuthProvider({ serverUser, children }: AuthProviderProps) {
  const supabase = createClient();
  const { setUser, setLoading, sessionChecked, setSessionChecked } = useAuthStore();
  const initialised = useRef(false); // To prevent useEffect running twice in strict mode during dev

  // Effect to initialize the store with server-side user data
  // and mark the session as checked if serverUser is provided.
  useEffect(() => {
    if (!initialised.current) {
      if (!sessionChecked) { // Only set from serverUser if not already checked by onAuthStateChange
        if (serverUser) {
          setUser(serverUser);
        } else {
          setUser(null); // Ensure it's null if no serverUser
        }
        // If serverUser is passed, we consider the session initially checked from the server's perspective.
        // setLoading(false) is handled by setUser
        setSessionChecked(true);
      }
      initialised.current = true;
    }
  }, [serverUser, setUser, setLoading, sessionChecked, setSessionChecked]);

  // Effect to listen for client-side auth state changes
  useEffect(() => {
    // Start loading until the first auth state event is received
    if (!sessionChecked) { // Only set loading if we haven't processed serverUser or first event
        setLoading(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // `event` can be INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, PASSWORD_RECOVERY, TOKEN_REFRESHED, USER_UPDATED
        // `session` contains the user object if authenticated
        setUser(session?.user ?? null);
        setLoading(false); // Auth state determined, stop loading
        setSessionChecked(true); // Mark that client-side check has occurred

        // Optional: You might want to call router.refresh() here if certain server components
        // need to immediately reflect a change triggered client-side, though middleware
        // and revalidatePath in Server Actions should handle most cases.
        // Example: if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') { router.refresh(); }
      }
    );

    // Cleanup: Unsubscribe from the auth state listener when the component unmounts.
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, setUser, setLoading, sessionChecked, setSessionChecked]); // Add router if used

  return <>{children}</>;
}
