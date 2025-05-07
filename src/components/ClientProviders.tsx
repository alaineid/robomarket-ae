"use client";

import React, { useState, useEffect } from 'react';
import { CartProvider } from '@/utils/cartContext';
import { WishlistProvider } from '@/utils/wishlistContext';

export default function ClientProviders({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [hydrated, setHydrated] = useState(false);

  // Set hydrated to true once the component mounts on the client
  useEffect(() => {
    setHydrated(true);
  }, []);

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