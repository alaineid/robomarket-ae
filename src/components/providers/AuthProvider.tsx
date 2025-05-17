// providers/AuthProvider.tsx
"use client";

import { useEffect, useMemo } from "react";
import { createClient } from "@/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { Toaster } from "react-hot-toast";
import type { User } from "@supabase/supabase-js";

interface AuthProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

export function AuthProvider({ initialUser, children }: AuthProviderProps) {
  // Memoize the client so it's the same instance across renders
  const supabase = useMemo(() => createClient(), []);

  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  // Hydrate from the server-provided user exactly once
  useEffect(() => {
    setUser(initialUser);
    setLoading(false);
  }, [initialUser, setUser, setLoading]);

  // Subscribe once to auth changes
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => sub.subscription.unsubscribe();
  }, [supabase, setUser]);

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
}
