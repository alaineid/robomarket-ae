// providers/AuthProvider.tsx
"use client";
import { useEffect } from "react";
import { createClient } from "@/supabase/client";
import { useAuthStore } from "@/stores/authStore";
import { Toaster } from "react-hot-toast";
import type { User } from "@supabase/supabase-js";

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const supabaseBrowser = createClient();
  const setUser = useAuthStore(
    (s: { setUser: (user: User | null) => void }) => s.setUser,
  );
  const setLoading = useAuthStore(
    (s: { setLoading: (loading: boolean) => void }) => s.setLoading,
  );

  // On first render, hydrate from the server-passed user
  useEffect(() => {
    setUser(initialUser);
    setLoading(false);
  }, [initialUser, setUser, setLoading]);

  // Then subscribe to any auth changes client-side
  useEffect(() => {
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => sub.subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      <Toaster position="top-right" />
      {children}
    </>
  );
}
