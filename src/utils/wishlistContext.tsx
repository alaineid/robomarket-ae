"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, getProductById } from './productData';

interface WishlistContextProps {
  wishlist: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistProducts: Product[];
}

// Initial empty state for SSR
const defaultWishlistContext: WishlistContextProps = {
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  wishlistProducts: []
};

const WishlistContext = createContext<WishlistContextProps>(defaultWishlistContext);

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load wishlist from localStorage only after component mounts
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch {
        console.error("Failed to parse wishlist from localStorage");
        setWishlist([]);
      }
    }
    setMounted(true);
  }, []);

  // Update wishlistProducts whenever wishlist changes
  useEffect(() => {
    if (!mounted) return;
    
    const products = wishlist
      .map(productId => getProductById(productId))
      .filter((product): product is Product => product !== undefined);
    
    setWishlistProducts(products);
    
    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist, mounted]);

  const addToWishlist = (productId: number) => {
    if (!mounted) return;
    
    setWishlist(prev => {
      if (prev.includes(productId)) {
        return prev;
      }
      return [...prev, productId];
    });
  };

  const removeFromWishlist = (productId: number) => {
    if (!mounted) return;
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.includes(productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistProducts
    }}>
      {children}
    </WishlistContext.Provider>
  );
};