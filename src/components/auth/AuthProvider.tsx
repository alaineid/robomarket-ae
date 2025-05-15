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
  const { setUser, setLoading, sessionChecked, setSessionChecked, synchronizeAuthState } = useAuthStore();
  const initialised = useRef(false); // To prevent useEffect running twice in strict mode during dev

  // Effect to initialize the store with server-side user data
  // and mark the session as checked if serverUser is provided.
  useEffect(() => {
    if (!initialised.current) {
      if (!sessionChecked) { // Only set from serverUser if not already checked by onAuthStateChange
        if (serverUser) {
          setUser(serverUser);
          console.log('AuthProvider: Initialized with server user:', serverUser.email);
        } else {
          setUser(null); // Ensure it's null if no serverUser
          console.log('AuthProvider: Initialized with null server user');
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
      async (event, session) => {
        console.log(`AuthProvider: Auth state event: ${event}`);
        
        // `event` can be INITIAL_SESSION, SIGNED_IN, SIGNED_OUT, PASSWORD_RECOVERY, TOKEN_REFRESHED, USER_UPDATED
        // `session` contains the user object if authenticated
        
        // Special handling for SIGNED_OUT events to ensure UI updates immediately
        if (event === 'SIGNED_OUT') {
          console.log('AuthProvider: User signed out, clearing auth state');
          // Forcefully set user to null immediately for sign out
          setUser(null);
        } else {
          // For other events, use the session data
          setUser(session?.user ?? null);
        }
        
        setLoading(false); // Auth state determined, stop loading
        setSessionChecked(true); // Mark that client-side check has occurred

        // Important: Refresh the UI when auth state changes to ensure components
        // like Header immediately reflect the latest auth state
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          console.log(`AuthProvider: Important auth state changed: ${event}`);
          
          // Explicitly broadcast an auth state change event that components can listen for
          window.dispatchEvent(new Event('supabase-auth-state-changed'));
          
          // Force synchronization across the app
          await synchronizeAuthState();
          
          // Force a router refresh when auth state changes
          // This is crucial for Next.js to re-render server components with the new auth state
          const { pathname } = window.location;
          if (pathname !== '/login' && pathname !== '/signup') {
            try {
              // Force a refresh of the current page to update server components
              window.location.href = pathname;
            } catch (e) {
              console.error('Navigation error:', e);
            }
          }
        }
      }
    );

    // Cleanup: Unsubscribe from the auth state listener when the component unmounts.
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, setUser, setLoading, sessionChecked, setSessionChecked]); // Add router if used

  return <>{children}</>;
}
