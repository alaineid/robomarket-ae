"use client";

import { CartProvider } from '@/utils/cartContext';
import { WishlistProvider } from '@/utils/wishlistContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="app-wrapper">
          {children}
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
