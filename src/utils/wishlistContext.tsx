"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from './types/product.types';

interface WishlistContextProps {
  wishlist: number[];
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistProducts: Product[];
  isLoading: boolean;
}

// Initial empty state for SSR
const defaultWishlistContext: WishlistContextProps = {
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  wishlistProducts: [],
  isLoading: false
};

const WishlistContext = createContext<WishlistContextProps>(defaultWishlistContext);

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    
    // Fetch product details from API for each item in wishlist
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setWishlistProducts([]);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const productPromises = wishlist.map(async (productId) => {
          try {
            const response = await fetch(`/api/products/${productId}`);
            
            if (!response.ok) {
              console.error(`Failed to fetch product ${productId}: ${response.statusText}`);
              return null;
            }
            
            return await response.json();
          } catch (error) {
            console.error(`Error fetching product ${productId}:`, error);
            return null;
          }
        });
        
        const products = await Promise.all(productPromises);
        setWishlistProducts(products.filter(Boolean) as Product[]);
      } catch (error) {
        console.error("Error fetching wishlist products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlistProducts();
    
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
      wishlistProducts,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};