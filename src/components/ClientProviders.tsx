"use client";

import React from 'react';
import { CartProvider } from '@/utils/cartContext';
import { WishlistProvider } from '@/utils/wishlistContext';

export default function ClientProviders({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  // Return children directly to ensure consistent server/client rendering
  // The providers themselves handle their initialization logic
  return (
    <>
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    </>
  );
}