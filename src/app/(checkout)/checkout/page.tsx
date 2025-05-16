"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaLock, 
  FaCreditCard, 
  FaPaypal, 
  FaApplePay, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaShoppingCart,
  FaInfoCircle
} from 'react-icons/fa';
import { Country, State, City } from 'country-state-city';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { commonButtonStyles } from '@/styles/commonStyles';
import { useCart } from '@/store/cartContext';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';

// Initialize i18n-iso-countries with English locale

// Form types
interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  countryName?: string;
}

interface PaymentInfo {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
  paymentMethod: 'credit-card' | 'paypal' | 'apple-pay';
}

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuthStore();
  const { showLogin } = useModalStore();
  
  // Track the current checkout step
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo & { saveAddress?: boolean }>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United Arab Emirates',
    saveAddress: false
  });
  
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    saveCard: false,
    paymentMethod: 'credit-card'
  });
  
  // Order summary calculations
  const subtotal = cartTotal || 0; // Ensure subtotal is not NaN
  const shippingCost = subtotal > 100 ? 0 : 15;
  const taxAmount = subtotal * 0.05;
  const totalAmount = subtotal + shippingCost + taxAmount;
  
  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Auto-fill form with user data if logged in
  useEffect(() => {
    if (user && user.email) {
      // Pre-fill email from auth user
      setShippingInfo(prev => ({
        ...prev,
        email: user.email || prev.email,
        // If we have customer data from authStore, use it
        ...(useAuthStore.getState().customer ? {
          firstName: useAuthStore.getState().customer?.first_name || prev.firstName,
          lastName: useAuthStore.getState().customer?.last_name || prev.lastName,
        } : {})
      }));
    }
  }, [user]);
  
  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    
    if (!shippingInfo.firstName) errors.firstName = "First name is required";
    if (!shippingInfo.lastName) errors.lastName = "Last name is required";
    if (!shippingInfo.email) errors.email = "Email is required";
    if (!shippingInfo.address) errors.address = "Address is required";
    if (!shippingInfo.city) errors.city = "City is required";
    if (!shippingInfo.zipCode) errors.zipCode = "Postal code is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};
    
    if (paymentInfo.paymentMethod === 'credit-card') {
      if (!paymentInfo.cardNumber) errors.cardNumber = "Card number is required";
      if (!paymentInfo.cardholderName) errors.cardholderName = "Cardholder name is required";
      if (!paymentInfo.expiryDate) errors.expiryDate = "Expiry date is required";
      if (!paymentInfo.cvv) errors.cvv = "CVV is required";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setShippingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Handle payment method selection
  const handlePaymentMethodChange = (method: PaymentInfo['paymentMethod']) => {
    setPaymentInfo(prev => ({ ...prev, paymentMethod: method }));
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateShippingForm()) {
        setCurrentStep(2);
        window.scrollTo(0, 0);
      }
    } else if (currentStep === 2) {
      if (validatePaymentForm()) {
        setCurrentStep(3);
        window.scrollTo(0, 0);
      }
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  // Handle order submission
  const handlePlaceOrder = () => {
    // In a real app, this would send the order to an API
    console.log('Order placed!', {
      shippingInfo,
      paymentInfo,
      orderItems: cartItems,
      orderTotal: totalAmount
    });
    
    // Simulate successful order
    setCurrentStep(4);
    clearCart();
    window.scrollTo(0, 0);
  };
  
  // Set initial state for selected country (UAE)
  useEffect(() => {
    // Find the UAE country object
    const uaeCountry = Country.getAllCountries().find(country => country.isoCode === 'AE');
    if (uaeCountry) {
      setShippingInfo(prev => ({
        ...prev,
        country: 'AE',  // Store ISO code for better state management
        countryName: uaeCountry.name  // Store name for display purposes
      }));
    }
  }, []);
  
  // Handle country change to update states/emirates accordingly
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const countryObj = Country.getAllCountries().find(c => c.isoCode === countryCode);
    
    setShippingInfo(prev => ({
      ...prev,
      country: countryCode,
      countryName: countryObj?.name || '',
      state: '' // Reset state when country changes
    }));
  };
  
  // Empty cart check
  if (cartItems.length === 0 && currentStep !== 4) {
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
              <p className="text-gray-600 mb-8">You need to add items to your cart before checkout.</p>
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
      
      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Page Title & Breadcrumb - Enhanced styling */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              {currentStep === 4 ? 'Order Confirmation' : 'Checkout'}
            </h1>
            <Breadcrumbs />
          </div>
          
          {/* Checkout Progress Steps - Completely redesigned */}
          {currentStep < 4 && (
            <div className="mb-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="relative flex justify-between">
                {['Shipping', 'Payment', 'Review', 'Confirmation'].map((step, index) => (
                  <div key={index} className="flex flex-col items-center relative z-10 flex-1">
                    {/* Step indicator */}
                    <div 
                      className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 transition-all
                        ${currentStep > index + 1 
                          ? 'bg-green-100 text-green-600 border-2 border-green-500' 
                          : currentStep === index + 1 
                            ? 'bg-blue-100 text-[#4DA9FF] border-2 border-[#4DA9FF]' 
                            : 'bg-gray-100 text-gray-400 border border-gray-200'}`}
                    >
                      {currentStep > index + 1 ? (
                        <FaCheckCircle size={20} />
                      ) : (
                        <span className="font-semibold text-lg">{index + 1}</span>
                      )}
                    </div>
                    
                    {/* Step label */}
                    <div className={`text-sm font-medium transition-all
                      ${currentStep === index + 1 
                        ? 'text-[#4DA9FF]' 
                        : currentStep > index + 1 
                          ? 'text-green-600' 
                          : 'text-gray-400'}`}
                    >
                      {step}
                    </div>
                  </div>
                ))}
                
                {/* Progress bar */}
                <div className="absolute top-6 left-0 h-0.5 bg-gray-200 w-full z-0">
                  <div 
                    className="h-full bg-gradient-to-r from-[#4DA9FF] to-green-500 transition-all duration-500"
                    style={{ 
                      width: `${(currentStep - 1) * 33.33}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Main Content - Left Column */}
            <div className="lg:col-span-3">
              {currentStep === 4 ? (
                // Full-width layout for order confirmation
                <div className="lg:col-span-3">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6"
                  >
                    <div className="p-6 md:p-10 text-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.2,
                          type: "spring",
                          stiffness: 200
                        }}
                        className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                      >
                        <FaCheckCircle className="text-green-600 text-3xl" />
                      </motion.div>
                      
                      <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="font-bold text-3xl text-gray-800 mb-4"
                      >
                        Order Confirmed!
                      </motion.h2>
                      
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-600 mb-8 max-w-md mx-auto"
                      >
                        Thank you for your purchase. Your order has been received and is being processed.
                        We&apos;ll send you updates about your delivery soon.
                      </motion.p>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 mb-8 max-w-lg mx-auto"
                      >
                        <p className="font-medium text-xl mb-2 text-gray-800">Order #RBM-{Math.floor(100000 + Math.random() * 900000)}</p>
                        <p className="text-gray-600 mb-4">May 10, 2025</p>
                        
                        <div className="flex items-center justify-center space-x-3 mb-6">
                          <hr className="flex-grow border-dashed border-gray-300" />
                          <span className="text-gray-500 text-sm px-3">ORDER DETAILS</span>
                          <hr className="flex-grow border-dashed border-gray-300" />
                        </div>
                        
                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">${taxAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-gray-200">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-[#4DA9FF]">${totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mt-6">
                          We`&apos;`ve sent a confirmation email to <span className="font-medium">{shippingInfo.email}</span> with all the details.
                        </p>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Link href="/shop">
                          <button className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#3D89FF] text-white font-medium rounded-full px-8 py-3.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 shadow-md hover:shadow-lg">
                            Continue Shopping
                          </button>
                        </Link>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                  {/* Step 1: Shipping Information - Beautified */}
                  {currentStep === 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="p-6 md:p-8"
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#4DA9FF]">
                          <span className="font-semibold">1</span>
                        </div>
                        <h2 className="font-bold text-2xl text-gray-800">Shipping Information</h2>
                      </div>
                      
                      {/* Login prompt for guest users */}
                      {!user && (
                        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              <FaInfoCircle className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-blue-700">
                                Have an account? <button 
                                  onClick={() => showLogin()} 
                                  className="font-medium underline hover:text-blue-800"
                                  type="button"
                                >
                                  Sign in
                                </button> to save your shipping details for future purchases.
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                You can continue as a guest. Your information will be saved for this order only.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                      <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">First Name *</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={shippingInfo.firstName}
                            onChange={handleShippingChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                            placeholder="Enter first name"
                          />
                          {formErrors.firstName && (
                            <p className="text-red-600 text-xs mt-1.5 flex items-center">
                              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                              {formErrors.firstName}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">Last Name *</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={shippingInfo.lastName}
                            onChange={handleShippingChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                            placeholder="Enter last name"
                          />
                          {formErrors.lastName && (
                            <p className="text-red-600 text-xs mt-1.5 flex items-center">
                              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                              {formErrors.lastName}
                            </p>
                          )}
                        </div>
                        
                        <div className="sm:col-span-2">
                          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1.5">Address *</label>
                          <div className="relative">
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={shippingInfo.address}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 pl-10"
                              placeholder="123 Main St, Apt 4B"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          {formErrors.address && (
                            <p className="text-red-600 text-xs mt-1.5 flex items-center">
                              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                              {formErrors.address}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                          <div className="relative">
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={shippingInfo.email}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 pl-10"
                              placeholder="your@email.com"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                              </svg>
                            </div>
                          </div>
                          {formErrors.email && (
                            <p className="text-red-600 text-xs mt-1.5 flex items-center">
                              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                              {formErrors.email}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                          <div className="relative">
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={shippingInfo.phone}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 pl-10"
                              placeholder="(555) 555-5555"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1.5">Country *</label>
                          <div className="relative">
                            <select
                              id="country"
                              name="country"
                              value={shippingInfo.country}
                              onChange={(e) => {
                                handleCountryChange(e);
                                // Reset state and city when country changes
                                setShippingInfo(prev => ({
                                  ...prev,
                                  country: e.target.value,
                                  state: '',
                                  city: ''
                                }));
                              }}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 appearance-none pl-10 pr-10 bg-white"
                            >
                              {/* Filter only GCC countries */}
                              {Country.getAllCountries()
                                .filter(country => 
                                  ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'].includes(country.isoCode))
                                .map((country) => (
                                  <option key={country.isoCode} value={country.isoCode}>
                                    {country.name}
                                  </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1.5">Emirate/Province *</label>
                          <div className="relative">
                            <select
                              id="state"
                              name="state"
                              value={shippingInfo.state}
                              onChange={(e) => {
                                handleShippingChange(e);
                                // Reset city when state changes
                                setShippingInfo(prev => ({
                                  ...prev,
                                  state: e.target.value,
                                  city: ''
                                }));
                              }}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 appearance-none pl-10"
                            >
                              <option value="">Select Emirate/Province</option>
                              {State.getStatesOfCountry(shippingInfo.country).map((region) => (
                                <option key={region.isoCode} value={region.isoCode}>{region.name}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </div>
                          {formErrors.state && (
                            <p className="text-red-600 text-xs mt-1.5 flex items-center">
                              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                              {formErrors.state}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                          <div className="relative">
                            <select
                              id="city"
                              name="city"
                              value={shippingInfo.city}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 appearance-none pl-10"
                              disabled={!shippingInfo.state}
                            >
                              <option value="">Select City</option>
                              {City.getCitiesOfState(
                                shippingInfo.country,
                                shippingInfo.state
                              )?.map((city) => (
                                <option key={city.name} value={city.name}>{city.name}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                              </svg>
                            </div>
                          </div>
                          {formErrors.city && (
                            <p className="text-red-600 text-xs mt-1.5 flex items-center">
                              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                              {formErrors.city}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1.5">Postal Code *</label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={shippingInfo.zipCode}
                            onChange={handleShippingChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                            placeholder="Enter postal code"
                          />
                          {formErrors.zipCode && (
                            <p className="text-red-600 text-xs mt-1.5 flex items-center">
                              <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                              {formErrors.zipCode}
                            </p>
                          )}
                        </div>

                        
                      </div>
                      
                      {/* Save Information Checkbox for Logged-In Users */}
                      {user && (
                        <div className="mt-6 mb-6">
                          <div className="flex items-center">
                            <input
                              id="save-address"
                              name="saveAddress"
                              type="checkbox"
                              className="h-4 w-4 accent-[#4DA9FF] rounded border-gray-300 text-[#4DA9FF] focus:ring-[#4DA9FF]"
                              checked={!!shippingInfo.saveAddress}
                              onChange={handleShippingChange}
                            />
                            <label htmlFor="save-address" className="ml-2 block text-sm text-gray-700">
                              Save this address for future orders
                            </label>
                          </div>
                        </div>
                      )}
                      
                      {/* Shipping Note */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100 flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-700">
                            {shippingCost === 0 ? (
                              <span>You qualify for <span className="font-semibold text-green-600">FREE shipping</span>!</span>
                            ) : (
                              <span>Add ${(100 - subtotal).toFixed(2)} more to your cart to qualify for <span className="font-semibold">FREE shipping</span>.</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-10">
                        <Link 
                          href="/cart" 
                          className="flex items-center text-[#4DA9FF] hover:text-blue-700 transition-colors group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                          </svg>
                          Back to Cart
                        </Link>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNextStep}
                          className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow transition-all duration-200 inline-flex items-center"
                        >
                          Continue to Payment
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                    
                    {/* Step 2: Payment Information - Beautified */}
                    {currentStep === 2 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="p-6 md:p-8"
                      >
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#4DA9FF]">
                            <span className="font-semibold">2</span>
                          </div>
                          <h2 className="font-bold text-2xl text-gray-800">Payment Method</h2>
                        </div>
                        
                        {/* Payment Method Selector - Enhanced styling */}
                        <div className="mb-8">
                          <p className="text-sm text-gray-600 mb-4">Select your preferred payment method below</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div 
                              className={`border-2 rounded-lg p-4 md:p-5 cursor-pointer transition-all hover:shadow-sm
                                ${paymentInfo.paymentMethod === 'credit-card' 
                                  ? 'border-[#4DA9FF] bg-blue-50 shadow-sm' 
                                  : 'border-gray-200 hover:border-gray-300'}`}
                              onClick={() => handlePaymentMethodChange('credit-card')}
                            >
                              <div className="flex items-center mb-2">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0
                                  ${paymentInfo.paymentMethod === 'credit-card' ? 'border-[#4DA9FF]' : 'border-gray-400'}`}
                                >
                                  {paymentInfo.paymentMethod === 'credit-card' && (
                                    <div className="w-3 h-3 rounded-full bg-[#4DA9FF]"></div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-800">Credit Card</span>
                              </div>
                              
                              <div className="mt-1 pl-8 flex space-x-2">
                                <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                                  <svg className="h-3.5" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#FFB600" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/>
                                    <path fill="#000" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/>
                                    <path fill="#FFF" d="M15 19h2v-2h-2v2zm-4 0h2v-2h-2v2zm-4 0h2v-2H7v2z"/>
                                    <path stroke="#FFF" strokeWidth="2" d="M18.5 7v9M16.8 11.2l3.5-4.4M16.8 11.8l3.5 4.4"/>
                                  </svg>
                                </div>
                                <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                                  <svg className="h-3.5" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#FF5F00" d="M22.5 12.4c0-5 4-9 9-9s9 4 9 9-4 9-9 9-9-4-9-9z"/>
                                    <path fill="#EB001B" d="M22.5 12.4c0-5 4-9 9-9s9 4 9 9-4 9-9 9"/>
                                    <path fill="#F79E1B" d="M25 3.5c-5 0-9 4-9 9s4 9 9 9a9 9 0 0 0 0-18z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`border-2 rounded-lg p-4 md:p-5 cursor-pointer transition-all hover:shadow-sm
                                ${paymentInfo.paymentMethod === 'paypal' 
                                  ? 'border-[#4DA9FF] bg-blue-50 shadow-sm' 
                                  : 'border-gray-200 hover:border-gray-300'}`}
                              onClick={() => handlePaymentMethodChange('paypal')}
                            >
                              <div className="flex items-center mb-2">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0
                                  ${paymentInfo.paymentMethod === 'paypal' ? 'border-[#4DA9FF]' : 'border-gray-400'}`}
                                >
                                  {paymentInfo.paymentMethod === 'paypal' && (
                                    <div className="w-3 h-3 rounded-full bg-[#4DA9FF]"></div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-800">PayPal</span>
                              </div>
                              
                              <div className="mt-1 pl-8">
                                <div className="w-12 h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
                                  <svg className="h-4" viewBox="0 0 101 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#253B80" d="M7.266 24h2.787L10.996 7.913H8.211L7.266 24z"/>
                                    <path fill="#179BD7" d="M35.999 7.913l-2.735 16.375h2.885l2.735-16.375z"/>
                                    <path fill="#253B80" d="M18.6 7.913l-2.68 11.476-.256-1.308-.8-10.168H9.38l-.045.277c1.342 3.3 2.724 6.291 3.462 8.815L10.92 24h4.197l6.557-16.087H18.6zM55.533 19.936c-.146.49-.678 1.308-1.844 1.308-.7 0-1.254-.334-1.254-1.287 0-.257.033-.535.1-.78l.99-4.953h-1.856l-1.033 5.31c-.112.535-.19 1.107-.19 1.529 0 1.585 1.1 2.403 2.646 2.403 1.453 0 2.623-.736 3.29-1.563l-.156 1.297h1.767l1.9-8.964h-1.856l-.658 3.234a3.874 3.874 0 0 0-.846-1.218M62.791 17.534c0 2.459 1.834 3.902 4.284 3.902 1.968 0 2.868-.402 2.868-.402l.457-1.707s-1.522.603-2.847.603c-1.59 0-2.99-.646-2.99-2.56 0-2.548 1.834-2.927 3.066-2.927.8 0 1.991.29 1.991.29l.435-1.606s-1.077-.39-2.48-.39c-2.09 0-4.762.792-4.762 4.797m9.266-2.038h.9c.7 0 2.155 0 2.155-1.15 0-.468-.38-1.003-1.477-1.003h-2.201l-.522 2.153h1.145zm-.644 1.473l-.602 2.437h1.145c.456 0 2.09 0 2.09-1.34 0-.692-.735-1.097-1.522-1.097h-1.111zm2.623-5.056c2.025 0 3.28.836 3.28 2.516 0 .905-.636 1.962-1.722 2.314 0 0 .123.21.28.547.134.324.19.446.435.915h-1.9c-.078-.29-.19-.558-.301-.826-.19-.446-.28-.691-.28-.691h-.011c-.235.045-.49.045-.769.045h-.658l-.31 1.472h-1.834l1.4-6.27c0-.12 1.665-.022 2.38-.022m5.429 0c.636 0 2.592 0 2.592 1.695 0 .502-.301 1.33-1.01 1.65.636.223.938.647.938 1.272 0 1.294-1.2 1.652-2.38 1.652h-2.346l1.366-6.258 1.834-.023-.994 4.562h.59c.546 0 .903-.223.903-.658 0-.446-.368-.669-.936-.669h-.636l.412-1.874h.747c.546 0 .903-.223.903-.658 0-.458-.469-.67-.77-.67h-1.02l-.357 1.618H76.2l.379-1.652h2.89-.003zm-35.341 0c.635 0 2.591 0 2.591 1.695 0 .502-.3 1.33-1.01 1.65.636.223.938.647.938 1.272 0 1.294-1.2 1.652-2.38 1.652h-2.346l1.366-6.258 1.834-.023-.994 4.562h.59c.547 0 .905-.223.905-.658 0-.446-.368-.669-.938-.669h-.635l.412-1.874h.747c.547 0 .904-.223.904-.658 0-.458-.468-.67-.77-.67h-1.01l-.368 1.618h-1.834l.379-1.652h2.879-.003z"/>
                                    <path fill="#179BD7" d="M26.752 19.936c-.145.49-.68 1.308-1.845 1.308-.702 0-1.254-.334-1.254-1.287 0-.257.033-.535.1-.78l.904-4.953h-1.856l-1.033 5.31c-.112.535-.19 1.107-.19 1.529 0 1.585 1.1 2.403 2.646 2.403 1.453 0 2.623-.736 3.29-1.563l-.156 1.297h1.767l1.9-8.964h-1.855l-.602 3.234a3.874 3.874 0 0 0-.846-1.218m6.725-2.203h-1.9c-.19.792-.458 2.458-.458 2.458h.023c-.257-.557-1.287-2.47-1.287-2.47h-2.747l-.077.244c1.498 1.773 2.814 3.969 3.381 5.598l-1.21 5.997h1.878l4.274-11.839-1.877.012z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`border-2 rounded-lg p-4 md:p-5 cursor-pointer transition-all hover:shadow-sm
                                ${paymentInfo.paymentMethod === 'apple-pay' 
                                  ? 'border-[#4DA9FF] bg-blue-50 shadow-sm' 
                                  : 'border-gray-200 hover:border-gray-300'}`}
                              onClick={() => handlePaymentMethodChange('apple-pay')}
                            >
                              <div className="flex items-center mb-2">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0
                                  ${paymentInfo.paymentMethod === 'apple-pay' ? 'border-[#4DA9FF]' : 'border-gray-400'}`}
                                >
                                  {paymentInfo.paymentMethod === 'apple-pay' && (
                                    <div className="w-3 h-3 rounded-full bg-[#4DA9FF]"></div>
                                  )}
                                </div>
                                <span className="font-medium text-gray-800">Apple Pay</span>
                              </div>
                              
                              <div className="mt-1 pl-8">
                                <div className="w-14 h-6 bg-white border border-gray-200 rounded flex items-center justify-center">
                                  <svg className="h-4" viewBox="0 0 43 19" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.948 3.663c-.77.462-1.726.627-2.625.541-.153-1.206.432-2.206 1.12-2.898.771-.598 1.893-.683 2.682-.599.12 1.244-.363 2.223-1.177 2.956zm1.126 1.555c-1.23-.07-2.512.504-3.136.504-.668 0-1.659-.483-2.815-.462-1.453.016-2.77.825-3.5 2.121-2.055 3.554-.534 8.763.915 11.632.634 1.28 1.431 2.02 2.42 2.135.932.113 1.571-.354 2.722-.354 1.127 0 1.773.354 2.722.354.954-.015 1.72-.771 2.34-1.778.694-1.137.983-2.188.997-2.23-.056-.029-1.997-.825-1.997-3.044-.014-1.912 1.545-2.814 1.616-2.87-1.016-1.396-2.566-1.516-3.137-1.545l.353-.007zm8.067-3.427v16.675h2.539v-5.785h3.512c3.235 0 5.515-2.206 5.515-5.459 0-3.252-2.239-5.431-5.427-5.431h-6.14zm2.539 1.876h2.903c2.224 0 3.492 1.18 3.492 3.57 0 2.388-1.268 3.582-3.507 3.582h-2.888v-7.152zm12.5 14.901c1.42 0 2.742-.711 3.342-1.846h.045v1.747h2.343v-8.74c0-2.36-1.906-3.896-4.84-3.896-2.722 0-4.729 1.55-4.8 3.683h2.3c.21-.997 1.118-1.634 2.416-1.634 1.56 0 2.441.739 2.441 2.093v.916l-3.196.192c-2.975.182-4.583 1.395-4.583 3.51 0 2.135 1.675 3.528 4.532 3.975zm.77-1.763c-1.358 0-2.23-.642-2.23-1.663 0-1.036.828-1.635 2.415-1.733l2.855-.17v.925c0 1.48-1.297 2.64-3.04 2.64zm8.133 1.663h2.35v-6.179c0-1.45 1.133-2.39 2.706-2.39.41 0 1.063.077 1.257.134v-2.163a8.809 8.809 0 0 0-.969-.064c-1.436 0-2.63.868-2.932 1.99h-.087v-1.869h-2.325v10.54zm11.552.112c2.546 0 4.107-1.241 4.248-3.094h-2.222c-.183.885-.928 1.42-2.011 1.42-1.45 0-2.372-1.198-2.372-3.147 0-1.916.927-3.112 2.372-3.112 1.125 0 1.82.628 2.01 1.42h2.223c-.14-1.905-1.744-3.095-4.284-3.095-2.875 0-4.737 1.978-4.737 4.815 0 2.842 1.835 4.793 4.773 4.793z"/>
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Credit Card Form - Enhanced styling */}
                        {paymentInfo.paymentMethod === 'credit-card' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="border rounded-xl p-6 bg-gradient-to-br from-white to-gray-50 mb-8 shadow-sm"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                              <div className="sm:col-span-2">
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1.5">Card Number *</label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={paymentInfo.cardNumber}
                                    onChange={handlePaymentChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 pl-10"
                                  />
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaCreditCard className="text-gray-400" />
                                  </div>
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <div className="flex space-x-1">
                                      <div className="w-6 h-4 bg-gray-200 rounded"></div>
                                      <div className="w-6 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                  </div>
                                </div>
                                {formErrors.cardNumber && (
                                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                    {formErrors.cardNumber}
                                  </p>
                                )}
                              </div>
                              
                              <div className="sm:col-span-2">
                                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name *</label>
                                <input
                                  type="text"
                                  id="cardholderName"
                                  name="cardholderName"
                                  value={paymentInfo.cardholderName}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                                  placeholder="Name as appears on card"
                                />
                                {formErrors.cardholderName && (
                                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                    {formErrors.cardholderName}
                                  </p>
                                )}
                              </div>
                              
                              <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date *</label>
                                <input
                                  type="text"
                                  id="expiryDate"
                                  name="expiryDate"
                                  placeholder="MM/YY"
                                  value={paymentInfo.expiryDate}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                                />
                                {formErrors.expiryDate && (
                                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                    {formErrors.expiryDate}
                                  </p>
                                )}
                              </div>
                              
                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1.5">
                                  <span className="flex items-center">
                                    CVV *
                                    <span className="ml-1 group relative">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 cursor-help" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                      </svg>
                                      <span className="absolute bottom-full mb-2 w-36 rounded bg-gray-800 p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                        The 3-4 digit code on the back of your card
                                      </span>
                                    </span>
                                  </span>
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    id="cvv"
                                    name="cvv"
                                    placeholder="123"
                                    value={paymentInfo.cvv}
                                    onChange={handlePaymentChange}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                                  />
                                </div>
                                {formErrors.cvv && (
                                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                    {formErrors.cvv}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center mt-4">
                              <input
                                type="checkbox"
                                id="saveCard"
                                name="saveCard"
                                checked={paymentInfo.saveCard}
                                onChange={handlePaymentChange}
                                className="h-4 w-4 text-[#4DA9FF] focus:ring-[#4DA9FF] border-gray-300 rounded"
                              />
                              <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                                Save this card for future purchases
                              </label>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* PayPal Instructions - Enhanced styling */}
                        {paymentInfo.paymentMethod === 'paypal' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gradient-to-br from-[#f0f8ff] to-[#f5faff] border rounded-xl p-6 border-blue-100 mb-8 shadow-sm"
                          >
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                <FaPaypal className="text-[#0070BA] text-lg" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 mb-1">PayPal Checkout</h3>
                                <p className="text-sm text-gray-600">Fast, secure and convenient</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">
                              You&apos;ll be redirected to PayPal to complete your payment securely. 
                              After completing payment on PayPal, you&apos;ll return here to review your order.
                            </p>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                              <p className="font-medium mb-1">Benefits of using PayPal:</p>
                              <ul className="space-y-1 mt-2">
                                <li className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  No need to enter payment details on our site
                                </li>
                                <li className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  PayPal Purchase Protection
                                </li>
                                <li className="flex items-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                  </svg>
                                  Fast checkout process
                                </li>
                              </ul>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Apple Pay Instructions - Enhanced styling */}
                        {paymentInfo.paymentMethod === 'apple-pay' && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="bg-gradient-to-br from-gray-50 to-white border rounded-xl p-6 border-gray-200 mb-8 shadow-sm"
                          >
                            <div className="flex items-center mb-4">
                              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center mr-4">
                                <FaApplePay className="text-white text-lg" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-800 mb-1">Apple Pay</h3>
                                <p className="text-sm text-gray-600">Simple, secure one-touch payment</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-700 mb-4">
                              When you click &quot;Continue&quot;, you&apos;ll be prompted to authorize payment with Apple Pay.
                              Make sure you&apos;re using a compatible device with Apple Pay set up.
                            </p>
                            <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 flex items-start">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                              </svg>
                              <p className="text-sm text-gray-600">
                                Apple Pay works on macOS devices with Touch ID or when paired with an iPhone or Apple Watch that has Apple Pay set up.
                              </p>
                            </div>
                          </motion.div>
                        )}
                        
                        {/* Secure Payment Notice - Enhanced styling */}
                        <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 mb-8">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <FaLock className="text-[#4DA9FF]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-800 mb-1">Secure Payment</h3>
                            <p className="text-sm text-gray-600">
                              Your payment information is encrypted and secure. We never store your full credit card details.
                            </p>
                          </div>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-10">
                          <button
                            onClick={handlePrevStep}
                            className="flex items-center text-[#4DA9FF] hover:text-blue-700 transition-colors group"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Shipping
                          </button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNextStep}
                            className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow transition-all duration-200 inline-flex items-center"
                          >
                            Review Order
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Step 3: Order Review - Beautified */}
                    {currentStep === 3 && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className="p-6 md:p-8"
                      >
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-[#4DA9FF]">
                            <span className="font-semibold">3</span>
                          </div>
                          <h2 className="font-bold text-2xl text-gray-800">Review Your Order</h2>
                        </div>
                        
                        {/* Order Items - Enhanced design */}
                        <div className="mb-8">
                          <h3 className="font-medium text-lg text-gray-800 mb-4">Order Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</h3>
                          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            {cartItems.map((item, index) => (
                              <div key={index} className="p-4 md:p-5 flex items-center border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                                {/* Product Image - Updated from placeholder */}
                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden bg-white">
                                  {item.product?.images ? (
                                    <Image
                                      src={item.product.images[0]?.url || '/placeholder.png'}
                                      alt={item.product.images[0]?.alt_text || 'Product image'}
                                      width={80}
                                      height={80}
                                      className="object-contain w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-500">[{item.product?.name?.substring(0, 8) || 'Robot'}]</span>
                                  )}
                                </div>
                                
                                <div className="ml-4 md:ml-6 flex-grow">
                                  <div className="font-medium text-gray-800">{item.product?.name}</div>
                                  <div className="text-sm text-gray-600 mt-1">
                                    Quantity: <span className="font-medium">{item.quantity}</span>
                                  </div>
                                  {item.product?.best_vendor?.vendor && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Sold by: {typeof item.product.best_vendor.vendor === 'string' 
                                        ? item.product.best_vendor.vendor 
                                        : (item.product.best_vendor.vendor?.name || 'Unknown vendor')}
                                    </div>
                                  )}
                                </div>
                                
                                <div className="font-bold text-[#4DA9FF] ml-4">
                                  ${((item.product?.best_vendor?.price || 0) * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Shipping and Payment Info Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                          {/* Shipping Information */}
                          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <h3 className="font-medium text-gray-800">Shipping Information</h3>
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="text-gray-700">
                                <p className="font-medium text-gray-800">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                                <p className="mt-2">{shippingInfo.address}</p>
                                <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                                <p>{shippingInfo.country}</p>
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                  <div className="flex items-center mb-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                    <span className="text-sm">{shippingInfo.email}</span>
                                  </div>
                                  {shippingInfo.phone && (
                                    <div className="flex items-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                      </svg>
                                      <span className="text-sm">{shippingInfo.phone}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <button 
                                  onClick={() => setCurrentStep(1)}
                                  className="text-xs text-[#4DA9FF] underline hover:text-blue-700"
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          {/* Payment Method */}
                          <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-200">
                              <div className="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                                </svg>
                                <h3 className="font-medium text-gray-800">Payment Method</h3>
                              </div>
                            </div>
                            <div className="p-5">
                              <div className="flex items-center">
                                {paymentInfo.paymentMethod === 'credit-card' && (
                                  <>
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                                      <FaCreditCard className="text-gray-700" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-800">Credit Card</div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        ending in {paymentInfo.cardNumber.slice(-4)}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        {paymentInfo.cardholderName}
                                      </div>
                                    </div>
                                  </>
                                )}
                                
                                {paymentInfo.paymentMethod === 'paypal' && (
                                  <>
                                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                      <FaPaypal className="text-[#0070BA]" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-800">PayPal</div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        You`&apos;`ll be redirected to PayPal
                                      </div>
                                    </div>
                                  </>
                                )}
                                
                                {paymentInfo.paymentMethod === 'apple-pay' && (
                                  <>
                                    <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center mr-3">
                                      <FaApplePay className="text-white" />
                                    </div>
                                    <div>
                                      <div className="font-medium text-gray-800">Apple Pay</div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        One-touch payment with Apple Pay
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                              
                              <div className="mt-4 flex justify-end">
                                <button 
                                  onClick={() => setCurrentStep(2)}
                                  className="text-xs text-[#4DA9FF] underline hover:text-blue-700"
                                >
                                  Change
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Terms & Conditions - Improved styling */}
                        <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-4 mb-8 border border-blue-100">
                          <div className="flex items-start">
                            <div className="min-w-[24px]">
                              <FaExclamationTriangle className="text-amber-500 mt-1" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-gray-700">
                                By placing this order, you agree to RoboMarket&apos;s <a href="#" className="text-[#4DA9FF] font-medium hover:underline">Terms of Service</a> and <a href="#" className="text-[#4DA9FF] font-medium hover:underline">Privacy Policy</a>. 
                                Your personal data will be used to process your order, support your experience, and for other purposes described in our privacy policy.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-10">
                          <button
                            onClick={handlePrevStep}
                            className="flex items-center text-[#4DA9FF] hover:text-blue-700 transition-colors group"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                            Back to Payment
                          </button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePlaceOrder}
                            className="bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-3 px-8 rounded-lg shadow-sm hover:shadow transition-all duration-200 inline-flex items-center"
                          >
                            Place Order
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                    
                    {/* Step 4: Order Confirmation */}
                    {currentStep === 4 && (
                      <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                          <FaCheckCircle className="text-green-600 text-2xl" />
                        </div>
                        
                        <h2 className="font-bold text-2xl text-gray-800 mb-4">Order Confirmed!</h2>
                        <p className="text-gray-600 mb-8">
                          Thank you for your purchase. Your order has been received and is being processed.
                        </p>
                        
                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8">
                          <p className="font-medium text-lg mb-2">Order #12345678</p>
                          <p className="text-gray-600 mb-4">May 4, 2025</p>
                          <p className="text-gray-700">
                            We&apos;ve sent a confirmation email to <span className="font-medium">{shippingInfo.email}</span> with all the details.
                          </p>
                        </div>
                        
                        <Link href="/shop">
                          <button className="bg-[#4DA9FF] hover:bg-blue-500 text-white font-medium rounded-full px-8 py-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50">
                            Continue Shopping
                          </button>
                        </Link>
                      </div>
                    )}
                  </div>
                
              )}
            
            {/* Order Summary - Below Main Content */}
            {currentStep < 4 && (
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <h2 className="font-bold text-xl text-gray-800">Order Summary</h2>
                  </div>
                  
                  <div className="p-5">
                    {/* Items Count */}
                    <div className="mb-4 flex items-center text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#4DA9FF] mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      <span className="text-gray-600">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items in your cart</span>
                    </div>
                    
                    {/* Order Items List */}
                    <div className="space-y-3.5 mb-6">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div className="flex items-center">
                            {/* Small image thumbnail in the order summary */}
                            {item.product?.images && item.product.images.length > 0 ? (
                              <div className="w-12 h-12 mr-3 rounded-md overflow-hidden border border-gray-200 flex-shrink-0 bg-white p-1">
                                <Image 
                                  src={item.product.images[0]?.url || '/placeholder.png'}
                                  alt={item.product.images[0]?.alt_text || 'Product thumbnail'}
                                  width={40}
                                  height={40}
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 mr-3 rounded-md bg-gray-100 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                                No image
                              </div>
                            )}
                            <div>
                              <p className="text-gray-800 font-medium line-clamp-1">
                                {item.product?.name && item.product.name.length > 20 
                                  ? `${item.product.name.substring(0, 20)}...` 
                                  : item.product?.name || 'Product'}
                              </p>
                              <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="font-medium text-gray-800">${((item.product?.best_vendor?.price || 0) * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order calculations */}
                    <div className="space-y-3 text-gray-700 pt-4 border-t border-dashed border-gray-200">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span className="font-medium">${subtotal.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span className="font-medium">
                          {shippingCost === 0 ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            `$${shippingCost.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span>Tax (5%)</span>
                        <span className="font-medium">${taxAmount.toFixed(2)}</span>
                      </div>
                      
                      <div className="pt-3 mt-3 border-t border-dashed border-gray-200 flex justify-between">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="font-bold text-xl text-[#4DA9FF]">${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    {/* Shipping Note */}
                    {shippingCost === 0 ? (
                      <div className="mt-6 bg-green-50 rounded-lg p-3 border border-green-100 text-xs text-green-800">
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>Free shipping applied!</span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-6 bg-blue-50 rounded-lg p-3 border border-blue-100 text-xs text-gray-700">
                        <span>
                          Add ${(100 - subtotal).toFixed(2)} more to qualify for <span className="font-semibold">free shipping</span>
                        </span>
                      </div>
                    )}
                    
                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FaLock className="text-gray-500 mr-2" />
                      <span className="text-xs text-gray-500">Secure Checkout • SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )};