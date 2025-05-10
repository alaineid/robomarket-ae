'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/utils/types/product.types';

interface WishlistContextType {
  wishlistItems: Product[];
  isInWishlist: (id: number) => boolean;
  toggleWishlistItem: (product: Product) => void;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  
  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Failed to parse wishlist from localStorage', error);
        setWishlistItems([]);
      }
    }
  }, []);
  
  // Save wishlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);
  
  // Check if product is in wishlist
  const isInWishlist = (id: number): boolean => {
    return wishlistItems.some(item => item.id === id);
  };
  
  // Toggle product in wishlist (add or remove)
  const toggleWishlistItem = (product: Product): void => {
    setWishlistItems(prevItems => {
      if (isInWishlist(product.id)) {
        return prevItems.filter(item => item.id !== product.id);
      } else {
        return [...prevItems, product];
      }
    });
  };
  
  // Clear wishlist
  const clearWishlist = (): void => {
    setWishlistItems([]);
  };
  
  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        isInWishlist, 
        toggleWishlistItem,
        clearWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

// Custom hook to use the wishlist context
export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};