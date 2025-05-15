"use client";

import { CartProvider } from '@/store/cartContext';
import { WishlistProvider } from '@/store/wishlistContext';

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
