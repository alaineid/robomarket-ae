"use client";

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CartProvider } from '@/store/cartContext';
import { WishlistProvider } from '@/store/wishlistContext';
import { AuthProvider } from '@/store/authContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function ClientProviders({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Return children directly to ensure consistent server/client rendering
  // The providers themselves handle their initialization logic
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}