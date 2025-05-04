"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { commonButtonStyles } from '@/styles/commonStyles';
import { useCart } from '@/utils/cartContext';

export default function CartPage() {
  const { cartItems, updateQuantity, removeItem, cartTotal } = useCart();
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const [promoCodeValid, setPromoCodeValid] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Short delay to ensure cart is loaded from localStorage
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate order subtotal - using cartTotal from context
  const subtotal = cartTotal;
  
  // Estimated shipping cost - free over $100, otherwise $15
  const shippingCost = subtotal > 100 ? 0 : 15;
  
  // Tax calculation (5%)
  const taxAmount = subtotal * 0.05;
  
  // Total order amount
  const totalAmount = subtotal + shippingCost + taxAmount;
  
  // Handle quantity change via the context
  const handleQuantityChange = (index: number, newQuantity: number) => {
    updateQuantity(index, newQuantity);
  };
  
  // Handle promo code submit
  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation for demo purposes
    if (promoCode.toLowerCase() === 'robo20') {
      setPromoCodeValid(true);
    } else if (promoCode) {
      setPromoCodeValid(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-[#4DA9FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart size={36} className="text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven&apos;t added any robots to your cart yet.</p>
              <Link href="/shop" className={commonButtonStyles.primary}>
                Start Shopping
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Page Title & Breadcrumb */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Your Shopping Cart</h1>
            <div className="flex items-center text-sm">
              <Link href="/" className="text-gray-500 hover:text-[#4DA9FF]">Home</Link>
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-[#4DA9FF]">Cart</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                {/* Cart Headers */}
                <div className="bg-gray-50 p-5 border-b border-gray-200 hidden sm:grid grid-cols-12 gap-4">
                  <div className="col-span-6 text-gray-700 font-medium">Product</div>
                  <div className="col-span-2 text-gray-700 font-medium text-center">Price</div>
                  <div className="col-span-2 text-gray-700 font-medium text-center">Quantity</div>
                  <div className="col-span-2 text-gray-700 font-medium text-right">Total</div>
                </div>
                
                {/* Cart Items List */}
                <div>
                  {cartItems.map((item, index) => (
                    <div key={index} className="p-5 border-b border-gray-100 last:border-b-0 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center space-x-4">
                        {/* Product Image Placeholder */}
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200">
                          <span className="text-xs text-gray-500">[{item.product?.name?.substring(0, 15) || 'Robot'}]</span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Product Name */}
                          {item.product ? (
                            <Link href={`/product/${item.product.id}`} className="font-medium text-gray-800 hover:text-[#4DA9FF] line-clamp-2">
                              {item.product.name}
                            </Link>
                          ) : (
                            <span className="font-medium text-gray-800">Product unavailable</span>
                          )}
                          
                          {/* Product Brand & Category */}
                          <div className="text-sm text-gray-500 mb-2">
                            {item.product?.brand} • {item.product?.category}
                          </div>
                          
                          {/* Remove Button - Mobile Only */}
                          <button
                            onClick={() => removeItem(index)} 
                            className="sm:hidden text-gray-500 hover:text-red-500 text-sm flex items-center"
                          >
                            <FaTrash size={12} className="mr-1" /> Remove
                          </button>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="col-span-2 text-center">
                        <span className="sm:hidden font-medium mr-2 text-gray-700">Price:</span>
                        <span className="text-gray-800 font-medium">${item.product?.price.toLocaleString() || '0.00'}</span>
                      </div>
                      
                      {/* Quantity Selector */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="sm:hidden font-medium mr-2 text-gray-700">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button 
                            onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-gray-100 rounded-l-lg"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.product?.stock || 10}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border-x border-gray-300 h-8 focus:outline-none focus:ring-0 focus:border-gray-300 text-gray-700"
                          />
                          <button 
                            onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-gray-100 rounded-r-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      {/* Total for this line */}
                      <div className="col-span-2">
                        <span className="sm:hidden font-medium mr-2 text-gray-700">Total:</span>
                        <div className="text-right">
                          <span className="font-bold text-[#4DA9FF]">
                            ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                          </span>
                          
                          {/* Remove Button - Desktop Only */}
                          <button
                            onClick={() => removeItem(index)} 
                            className="hidden sm:inline-block ml-4 text-gray-400 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Continue Shopping Link */}
                <div className="p-5 bg-gray-50 border-t border-gray-200">
                  <Link 
                    href="/shop" 
                    className="text-[#4DA9FF] hover:underline flex items-center font-medium"
                  >
                    <FaArrowLeft size={12} className="mr-2" /> Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                <div className="p-5 border-b border-gray-200">
                  <h2 className="font-bold text-xl text-gray-800">Order Summary</h2>
                </div>
                
                <div className="p-5">
                  {/* Order calculations */}
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between">
                      <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                      <span className="font-medium">${subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span className="font-medium">${taxAmount.toLocaleString()}</span>
                    </div>
                    
                    {promoCodeValid === true && (
                      <div className="flex justify-between text-green-600">
                        <span>Promo Code (ROBO20)</span>
                        <span className="font-medium">-$20.00</span>
                      </div>
                    )}
                    
                    <div className="pt-3 mt-3 border-t border-dashed border-gray-200 flex justify-between">
                      <span className="font-bold text-gray-800">Total</span>
                      <span className="font-bold text-xl text-[#4DA9FF]">${(promoCodeValid === true ? totalAmount - 20 : totalAmount).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Promo Code Input */}
                  <div className="mt-6">
                    <form onSubmit={handlePromoCodeSubmit}>
                      <label htmlFor="promo-code" className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                      <div className="flex">
                        <input 
                          type="text" 
                          id="promo-code"
                          value={promoCode} 
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-grow rounded-l-lg border border-r-0 border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent"
                        />
                        <button 
                          type="submit"
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-4 rounded-r-lg border border-gray-300"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {promoCodeValid === true && (
                        <p className="mt-2 text-sm text-green-600 flex items-center">
                          <FaInfoCircle size={12} className="mr-1" />
                          Promo code applied successfully!
                        </p>
                      )}
                      
                      {promoCodeValid === false && (
                        <p className="mt-2 text-sm text-red-600 flex items-center">
                          <FaInfoCircle size={12} className="mr-1" />
                          Invalid promo code. Try &quot;ROBO20&quot; for demo.
                        </p>
                      )}
                    </form>
                  </div>
                  
                  {/* Checkout Button */}
                  <div className="mt-6">
                    <Link href="/checkout">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full flex items-center justify-center ${commonButtonStyles.primary}`}
                      >
                        Proceed to Checkout <FaArrowRight className="ml-2" />
                      </motion.button>
                    </Link>
                  </div>
                  
                  {/* Security Notice */}
                  <div className="mt-4 text-xs text-center text-gray-500 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout • Encrypted payment
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}