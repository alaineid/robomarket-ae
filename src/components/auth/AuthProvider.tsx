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
        
        // For SIGNED_OUT event, immediately clear the customer data as well
        if (event === 'SIGNED_OUT') {
          console.log('AuthProvider: User signed out, clearing all user data');
          // Clear the entire user state including customer data
          useAuthStore.setState({
            user: null,
            customer: null,
            isLoading: false,
            sessionChecked: true
          });
        } else {
          // For other events, just update the user
          setUser(session?.user ?? null);
        }
        
        // Update loading and session checked state
        setLoading(false);
        setSessionChecked(true);

        // For important auth state changes, update UI components
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          // Notify other components about auth state change
          window.dispatchEvent(new Event('supabase-auth-state-changed'));
          
          // Synchronize auth state across the app
          await synchronizeAuthState();
        }
      }
    );

    // Cleanup: Unsubscribe from the auth state listener when the component unmounts.
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, setUser, setLoading, sessionChecked, setSessionChecked, synchronizeAuthState]); // Added synchronizeAuthState to dependency array

  return <>{children}</>;
}
