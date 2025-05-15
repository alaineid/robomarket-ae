"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Add Image import
import { motion } from 'framer-motion';
import { FaShoppingCart, FaTrash, FaArrowLeft, FaArrowRight, FaInfoCircle } from 'react-icons/fa';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { commonButtonStyles } from '@/styles/commonStyles';
import { useCart } from '@/store/cartContext';

// Fix the function name destructuring from useCart()
export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
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
  
  // Calculate order subtotal - using cartTotal from context with fallback to prevent NaN
  const subtotal = isNaN(cartTotal) ? 
    cartItems.reduce((sum, item) => sum + ((item.product?.best_vendor?.price || 0) * item.quantity), 0) : 
    cartTotal;
  
  // Estimated shipping cost - free over $100, otherwise $15
  const shippingCost = subtotal > 100 ? 0 : 15;
  
  // Tax calculation (5%)
  const taxAmount = subtotal * 0.05;
  
  // Total order amount
  const totalAmount = subtotal + shippingCost + taxAmount;
  
  // Handle quantity change via the context
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
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
      
      <main className="flex-grow bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Page Title & Breadcrumb with improved styling */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Your Shopping Cart</h1>
            <Breadcrumbs />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items - Left Column - Improved styling */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                {/* Cart Headers - Improved contrast */}
                <div className="bg-blue-50 p-5 border-b border-blue-100 hidden sm:grid grid-cols-12 gap-4">
                  <div className="col-span-6 text-gray-700 font-semibold">Product</div>
                  <div className="col-span-2 text-gray-700 font-semibold text-center">Price</div>
                  <div className="col-span-2 text-gray-700 font-semibold text-center">Quantity</div>
                  <div className="col-span-2 text-gray-700 font-semibold text-right">Total</div>
                </div>
                
                {/* Cart Items List - Improved visual styling */}
                <div className="divide-y divide-gray-100">
                  {cartItems.map((item, index) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      key={index} 
                      className="p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors duration-150"
                    >
                      {/* Product Info - Enhanced layout */}
                      <div className="col-span-6 flex items-center space-x-4">
                        {/* Product Image - Enhanced styling */}
                        <div className="w-24 h-24 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 bg-white overflow-hidden shadow-sm">
                          {item.product?.images && item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0].url}
                              alt={item.product.images[0].alt_text || item.product?.name || 'Product image'}
                              width={96}
                              height={96}
                              className="object-contain w-full h-full p-1"
                            />
                          ) : (
                            <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                              <FaShoppingCart size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          {/* Product Name - Enhanced typography */}
                          {item.product ? (
                            <Link href={`/product/${item.product.id}`} className="font-medium text-gray-800 hover:text-[#4DA9FF] transition-colors line-clamp-2 text-lg">
                              {item.product.name}
                            </Link>
                          ) : (
                            <span className="font-medium text-gray-800">Product unavailable</span>
                          )}
                          
                          {/* Product Brand & Category - Enhanced styling */}
                          <div className="text-sm text-gray-500 mt-1 mb-2">
                            <span className="font-medium text-gray-600">{item.product?.brand}</span> 
                            {item.product?.categories && item.product.categories.length > 0 && (
                              <>
                                <span className="mx-1.5 text-gray-300">•</span> 
                                <span className="text-[#4DA9FF]">{item.product.categories[0].name}</span>
                              </>
                            )}
                          </div>
                          
                          {/* Remove Button - Mobile Only - Enhanced styling */}
                          <button
                            onClick={() => removeFromCart(item.productId)} 
                            className="sm:hidden text-gray-500 hover:text-red-500 text-sm flex items-center transition-colors mt-1 group"
                          >
                            <FaTrash size={12} className="mr-1.5 group-hover:text-red-500" /> 
                            <span className="group-hover:underline">Remove</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Price - Enhanced styling */}
                      <div className="col-span-2 text-center">
                        <span className="sm:hidden font-medium mr-2 text-gray-700">Price:</span>
                        <span className="text-gray-800 font-semibold">${item.product?.best_vendor?.price.toLocaleString() || '0.00'}</span>
                      </div>
                      
                      {/* Quantity Selector - Enhanced styling */}
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="sm:hidden font-medium mr-2 text-gray-700">Quantity:</span>
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
                          <button 
                            onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-blue-50 transition-colors rounded-l-lg"
                            disabled={item.quantity <= 1}
                          >
                            <span className="text-xl font-medium">−</span>
                          </button>
                          <input
                            type="number"
                            min="1"
                            max={item.product?.best_vendor?.stock || 10}
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border-x border-gray-300 h-9 focus:outline-none focus:ring-1 focus:ring-[#4DA9FF] text-gray-700"
                          />
                          <button 
                            onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-blue-50 transition-colors rounded-r-lg"
                            disabled={item.quantity >= (item.product?.best_vendor?.stock || 10)}
                          >
                            <span className="text-xl font-medium">+</span>
                          </button>
                        </div>
                      </div>
                      
                      {/* Total for this line - Enhanced styling */}
                      <div className="col-span-2">
                        <span className="sm:hidden font-semibold mr-2 text-gray-700">Total:</span>
                        <div className="text-right">
                          <span className="font-bold text-[#4DA9FF] text-lg">
                            ${((item.product?.best_vendor?.price || 0) * item.quantity).toLocaleString()}
                          </span>
                          
                          {/* Remove Button - Desktop Only - Enhanced styling */}
                          <motion.button
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => removeFromCart(item.productId)} 
                            className="hidden sm:inline-block ml-4 text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full hover:bg-red-50"
                            aria-label="Remove item"
                          >
                            <FaTrash size={14} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Continue Shopping Link - Enhanced styling */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <Link 
                    href="/shop" 
                    className="inline-flex items-center text-[#4DA9FF] hover:underline hover:text-blue-600 transition-colors font-medium group"
                  >
                    <motion.span 
                      className="mr-2" 
                      animate={{ x: [0, -4, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <FaArrowLeft size={14} />
                    </motion.span> 
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary - Right Column - Enhanced styling */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <h2 className="font-bold text-xl text-gray-800 flex items-center">
                    <FaShoppingCart className="mr-2 text-[#4DA9FF]" size={16} />
                    Order Summary
                  </h2>
                </div>
                
                <div className="p-6">
                  {/* Order calculations - Enhanced styling */}
                  <div className="space-y-4 text-gray-700">
                    <div className="flex justify-between">
                      <span>Subtotal <span className="text-sm text-gray-500">({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span></span>
                      <span className="font-medium">${isNaN(subtotal) ? '0.00' : subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Shipping</span>
                      <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : ''}`}>
                        {shippingCost === 0 ? 'Free' : `$${shippingCost.toLocaleString()}`}
                      </span>
                    </div>
                    
                    {shippingCost > 0 && (
                      <div className="text-sm text-gray-500">
                        <p>Free shipping on orders over $100</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span className="font-medium">${isNaN(taxAmount) ? '0.00' : taxAmount.toFixed(2)}</span>
                    </div>
                    
                    {promoCodeValid === true && (
                      <div className="flex justify-between text-green-600">
                        <span className="flex items-center">
                          <FaInfoCircle size={14} className="mr-1.5" />
                          Promo Code (ROBO20)
                        </span>
                        <span className="font-medium">-$20.00</span>
                      </div>
                    )}
                    
                    <div className="pt-4 mt-2 border-t border-dashed border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-gray-800 text-lg">Total</span>
                        <span className="font-bold text-xl text-[#4DA9FF]">
                          ${isNaN(totalAmount) ? '0.00' : (promoCodeValid === true ? (totalAmount - 20).toFixed(2) : totalAmount.toFixed(2))}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Promo Code Input - Enhanced styling */}
                  <div className="mt-8">
                    <form onSubmit={handlePromoCodeSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <label htmlFor="promo-code" className="block text-sm font-semibold text-gray-700 mb-2">Have a Promo Code?</label>
                      <div className="flex">
                        <input 
                          type="text" 
                          id="promo-code"
                          value={promoCode} 
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-grow rounded-l-lg border border-r-0 border-gray-300 px-4 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent bg-white shadow-sm"
                        />
                        <button 
                          type="submit"
                          className="bg-[#4DA9FF] hover:bg-blue-600 text-white font-medium px-4 rounded-r-lg transition-colors shadow-sm"
                        >
                          Apply
                        </button>
                      </div>
                      
                      {promoCodeValid === true && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-green-600 flex items-center"
                        >
                          <FaInfoCircle size={12} className="mr-1.5" />
                          Promo code applied successfully!
                        </motion.p>
                      )}
                      
                      {promoCodeValid === false && (
                        <motion.p 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-600 flex items-center"
                        >
                          <FaInfoCircle size={12} className="mr-1.5" />
                          Invalid promo code. Try &quot;ROBO20&quot; for demo.
                        </motion.p>
                      )}
                    </form>
                  </div>
                  
                  {/* Checkout Button - Enhanced styling */}
                  <div className="mt-6">
                    <Link href="/checkout">
                      <motion.button 
                        whileHover={{ scale: 1.01, boxShadow: "0 8px 20px -5px rgba(77, 169, 255, 0.35)" }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full flex items-center justify-center bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] text-white font-bold py-3.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        Proceed to Checkout 
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="ml-2"
                        >
                          <FaArrowRight size={14} />
                        </motion.div>
                      </motion.button>
                    </Link>
                  </div>
                  
                  {/* Security Notice - Enhanced styling */}
                  <div className="mt-5 text-sm text-center text-gray-500 flex items-center justify-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-[#4DA9FF]" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Secure checkout • 256-bit encryption
                  </div>

                  {/* Accepted Payment Methods */}
                  <div className="mt-5">
                    <div className="text-xs text-gray-500 text-center mb-2">We Accept</div>
                    <div className="flex justify-center space-x-3">
                      <div className="w-10 h-7 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-center">
                        <svg className="h-5 w-auto" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                          <path fill="#FFB600" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                          <path fill="#000" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
                          <path fill="#FFF" d="M15 19h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/>
                          <path className="svg-stroke" stroke="#FFF" strokeWidth="2" d="M18.5 7v9M16.8 11.2l3.5-4.4M16.8 11.8l3.5 4.4"/>
                        </svg>
                      </div>
                      <div className="w-10 h-7 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-center">
                        <svg className="h-4 w-auto" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
                          <path opacity=".07" d="M35 0H5C2.3 0 0 2.3 0 5v14c0 2.7 2.4 5 5 5h30c2.8 0 5-2.2 5-5V5c0-2.7-2.3-5-5-5z"/>
                          <path fill="#fff" d="M35 1c2.3 0 4 1.8 4 4v14c0 2.2-1.8 4-4 4H5c-2.2 0-4-1.8-4-4V5c0-2.2 1.7-4 4-4h30"/>
                          <path fill="#EB001B" d="M15 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/>
                          <path fill="#F79E1B" d="M31 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"/>
                          <path fill="#FF5F00" d="M22 12c0-2.4 1.2-4.5 3-5.7-1.8-1.2-4-2-6.2-2-6.2 0-11.2 5-11.2 11.2 0 6.2 5 11.2 11.2 11.2 2.2 0 4.2-.7 6-2-1.8-1.2-3-3.3-3-5.7z"/>
                        </svg>
                      </div>
                      <div className="w-10 h-7 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-center">
                        <svg className="h-3 w-auto" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
                          <path opacity=".07" d="M35 0H5C2.3 0 0 2.3 0 5v14c0 2.7 2.4 5 5 5h30c2.8 0 5-2.2 5-5V5c0-2.7-2.3-5-5-5z"/>
                          <path fill="#fff" d="M35 1c2.3 0 4 1.8 4 4v14c0 2.2-1.8 4-4 4H5c-2.2 0-4-1.8-4-4V5c0-2.2 1.7-4 4-4h30"/>
                          <path fill="#006FCF" d="M12.5 12.4c-.3-.2-.8-.4-1.3-.4H9.7v3.7h1.5c.5 0 .9-.2 1.2-.4.3-.3.5-.7.5-1.4.1-.7-.1-1.3-.4-1.5zm.2-3.5c.2-.2.6-.4 1-.4h1.1V5h-1.3c-.5 0-.8.1-1 .3-.2.3-.4.6-.4 1 0 .5.1.8.2 1 .2.3.6.4.9.4h1.5V4.5h-1.2c-.4 0-.8.1-1 .3-.2.2-.3.5-.3.8 0 .3.1.6.3.8zM9.7 9.9h-.5V4.5h.5v5.4zm15.2.2s-.1.2-.2.3c-.2.2-.5.3-.9.3-.8 0-1.4-.5-1.5-1.3h4.1v-.6c0-1-.3-1.8-.8-2.3-.5-.5-1.1-.8-1.9-.8s-1.4.3-2 .8c-.5.6-.8 1.4-.8 2.3s.3 1.7.9 2.3c.6.6 1.3.9 2.2.9.7 0 1.3-.2 1.7-.5.4-.3.7-.8.9-1.3l-1.7-.1zm-2.6-2.2c.1-.3.2-.6.4-.8.2-.2.5-.3.9-.3s.7.1.9.4c.2.2.3.4.3.7h-2.5zM26.6 10h2V4.5h-2V10zm-3.9 0h2V2.6h-2V10zm-7.2-3c.7 0 1.2.5 1.2 1.3 0 .7-.6 1.3-1.2 1.3h-2V7h2zm0-2.5h-2v-2h2c.7 0 1.2.5 1.2 1.1 0 .5-.5 1-1.2.9z"/>
                        </svg>
                      </div>
                      <div className="w-10 h-7 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-center">
                        <svg className="h-5 w-auto" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                          <path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                          <path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
                          <path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"/>
                          <path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"/>
                          <path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"/>
                        </svg>
                      </div>
                      <div className="w-10 h-7 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-center">
                        <svg className="h-4 w-auto" viewBox="0 0 40 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M30 7l-3.3 10h-3.6L26.4 7h3.6zm10 0c-1.3 0-2.5.8-2.5 2.5 0 1.9 2.1 2.1 2.1 3.2 0 .4-.3.8-1 .8-.8 0-1.7-.4-2.3-.8l-.4 2c.6.3 1.5.6 2.5.6 2.1 0 3.4-1 3.4-2.7 0-2-2.2-2.2-2.2-3.2 0-.3.3-.7.9-.7.6 0 1.2.2 1.7.5l.4-1.9c-.5-.2-1.1-.3-1.8-.3h.2zm-13.8 0c-1.1 0-1.8.2-2.3.9L21.7 17h3.6l.4-1.1h2.4l.3 1.1h3.2L29 7h-2.8zm-2.8 0L20.1 17h-3.4L14.5 9c-.1-.6-.5-.8-1.2-1L10 7.5v-.2h5.2c.7 0 1.3.5 1.3 1.2l1.2 6.5L21.3 7h3.7l-.6 2.6c.3-.8.7-2 1.5-2.6H33z" fill="#172B85"/>
                          <path d="M0 7.2c0-.2.2-.4.5-.4h7c1 0 1.7.3 2 1.2l.5 2.2c-.6-.4-1.3-.6-2.2-.6H3.2L2.4 13h3.3c1.3 0 2-.2 2.5-.5l-.6 3.2c-.2.2-.7.3-1.3.3H0V7.2z" fill="#F9A533"/>
                          <path d="M8 10c0 .3-.2.5-.5.5H4.6l-.7 3.2h2.8c.5 0 1 0 1.3-.3l.6-3.2c-.5.3-1.2.5-2.5.5H2.8l.8-3.4h4.7c.9 0 1.5.2 2.2.6C9.2 6.8 8 7.8 8 10z" fill="#172B85"/>
                        </svg>
                      </div>
                    </div>
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