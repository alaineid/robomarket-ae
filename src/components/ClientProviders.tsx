"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/utils/cartContext';
import { WishlistProvider } from '@/utils/wishlistContext';
import { GlobalProvider } from '@/lib/context/GlobalContext';

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Disable refetching on window focus
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1, // Retry failed queries once
    },
  },
});

export default function ClientProviders({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Wrap children with necessary providers
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
          </WishlistProvider>
        </CartProvider>
      </GlobalProvider>
    </QueryClientProvider>
  );
}