"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Product, getProductById } from './productData';

// Define the structure of a cart item
export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
}

// Define the cart context structure
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (productId: number, quantity: number) => void;
  updateQuantity: (index: number, newQuantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

// Create context with default values
const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeItem: () => {},
  clearCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

// Custom hook to use the cart context
export const useCart = () => useContext(CartContext);

// Cart Provider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('robomarket-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Fetch product details for each item
        const itemsWithProducts = parsedCart.map((item: CartItem) => {
          const product = getProductById(item.productId);
          return { ...item, product };
        });
        setCartItems(itemsWithProducts);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCartItems([]);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('robomarket-cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  // Add an item to cart
  const addToCart = (productId: number, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
    
    if (existingItemIndex !== -1) {
      // Item already exists in cart, update quantity
      const updatedItems = [...cartItems];
      const newQuantity = updatedItems[existingItemIndex].quantity + quantity;
      
      // Make sure we don't exceed stock
      const product = getProductById(productId);
      if (product && newQuantity > product.stock) {
        alert(`Sorry, only ${product.stock} units available in stock.`);
        return;
      }
      
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: newQuantity
      };
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      const product = getProductById(productId);
      if (product) {
        setCartItems([...cartItems, { productId, quantity, product }]);
      }
    }
  };

  // Update quantity of an item
  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const item = cartItems[index];
    if (!item.product) return;
    
    if (newQuantity > item.product.stock) {
      alert(`Sorry, only ${item.product.stock} units available in stock.`);
      return;
    }
    
    const updatedItems = [...cartItems];
    updatedItems[index] = { ...item, quantity: newQuantity };
    setCartItems(updatedItems);
  };

  // Remove an item from cart
  const removeItem = (index: number) => {
    const updatedItems = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedItems);
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total number of items in cart
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate total price of cart
  const cartTotal = cartItems.reduce((sum, item) => {
    return sum + (item.product?.price || 0) * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
        cartTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}