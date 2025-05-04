"use client";

import { useEffect } from 'react';
import { CartProvider } from '@/utils/cartContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Any client-side functionality you need
  useEffect(() => {
    // Client-side effects
  }, []);

  return (
    <CartProvider>
      <div className="app-wrapper">
        {children}
      </div>
    </CartProvider>
  );
}
