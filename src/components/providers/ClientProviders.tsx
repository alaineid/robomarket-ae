"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from "@/stores/cartContext";
import { WishlistProvider } from "@/stores/wishlistContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import type { User } from "@supabase/supabase-js";

// configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

interface ClientProvidersProps {
  children: React.ReactNode;
  initialUser: User | null;
}

export default function ClientProviders({
  children,
  initialUser,
}: ClientProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          {/* hydrate auth store on first paint */}
          <AuthProvider initialUser={initialUser}>
            {children}
          </AuthProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}
