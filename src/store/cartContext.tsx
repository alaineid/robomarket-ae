"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/types/product.types';

interface CartItem {
  productId: number;
  quantity: number;
  price: number;
}

interface CartContextProps {
  cart: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartItems: (CartItem & { product: Product })[];
  isLoading: boolean;
}

// Initial empty state for SSR
const defaultCartContext: CartContextProps = {
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
  cartItems: [],
  isLoading: false,
};

const CartContext = createContext<CartContextProps>(defaultCartContext);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize cart from localStorage only after component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        console.error("Failed to parse cart from localStorage");
        setCart([]);
      }
    }
    setMounted(true);
  }, []);
  
  // Update cart items whenever the cart changes
  useEffect(() => {
    if (!mounted) return;
    
    // Fetch product details from the API for each item in cart
    const fetchCartProducts = async () => {
      setIsLoading(true);
      
      try {
        const productPromises = cart.map(async (item) => {
          try {
            const response = await fetch(`/api/products/${item.productId}`);
            
            if (!response.ok) {
              console.error(`Failed to fetch product ${item.productId}: ${response.statusText}`);
              return null;
            }
            
            const product = await response.json();
            return { ...item, product };
          } catch (error) {
            console.error(`Error fetching product ${item.productId}:`, error);
            return null;
          }
        });
        
        const results = await Promise.all(productPromises);
        setCartItems(results.filter(Boolean) as (CartItem & { product: Product })[]);
      } catch (error) {
        console.error("Error fetching cart products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (cart.length > 0) {
      fetchCartProducts();
    } else {
      setCartItems([]);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, mounted]);

  // Calculate cart total and count
  const cartTotal = cartItems.reduce((sum, item) => {
    // Use the product's vendor price if available, otherwise fall back to the stored price
    const price = item.product?.best_vendor?.price || item.price;
    return sum + (price * item.quantity);
  }, 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Cart operations
  const addToCart = async (productId: number, quantity: number) => {
    if (!mounted) return;
    
    try {
      // Fetch the product to get its current price
      const response = await fetch(`/api/products/${productId}`);
      
      if (!response.ok) {
        console.error(`Failed to fetch product ${productId}: ${response.statusText}`);
        return;
      }
      
      const product = await response.json();
      
      setCart(prevCart => {
        const existingItem = prevCart.find(item => item.productId === productId);
        
        if (existingItem) {
          return prevCart.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + quantity } 
              : item
          );
        } else {
          return [...prevCart, { productId, quantity, price: product.price }];
        }
      });
    } catch (error) {
      console.error(`Error adding product ${productId} to cart:`, error);
    }
  };

  const removeFromCart = (productId: number) => {
    if (!mounted) return;
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (!mounted) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      return prevCart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    if (!mounted) return;
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartTotal,
      cartCount,
      cartItems,
      isLoading
    }}>
      {children}
    </CartContext.Provider>
  );
};