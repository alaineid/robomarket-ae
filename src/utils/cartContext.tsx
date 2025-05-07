"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, getProductById } from './productData';

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
};

const CartContext = createContext<CartContextProps>(defaultCartContext);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([]);
  const [mounted, setMounted] = useState(false);
  
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
    
    const items = cart.map(item => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    }).filter(Boolean) as (CartItem & { product: Product })[];
    
    setCartItems(items);
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart, mounted]);

  // Calculate cart total and count
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  // Cart operations
  const addToCart = (productId: number, quantity: number) => {
    if (!mounted) return;
    
    const product = getProductById(productId);
    if (!product) return;

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
      cartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};