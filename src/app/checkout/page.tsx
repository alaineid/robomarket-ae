"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Add Image import
import { motion } from 'framer-motion';
import { 
  FaArrowLeft, 
  FaLock, 
  FaCreditCard, 
  FaPaypal, 
  FaApplePay, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaShoppingCart
} from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { commonButtonStyles } from '@/styles/commonStyles';
import { useCart } from '@/utils/cartContext';

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
  
  // Track the current checkout step
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Form state
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
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
  const subtotal = cartTotal;
  const shippingCost = subtotal > 100 ? 0 : 15;
  const taxAmount = subtotal * 0.05;
  const totalAmount = subtotal + shippingCost + taxAmount;
  
  // Form validation
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    
    if (!shippingInfo.firstName) errors.firstName = "First name is required";
    if (!shippingInfo.lastName) errors.lastName = "Last name is required";
    if (!shippingInfo.email) errors.email = "Email is required";
    if (!shippingInfo.address) errors.address = "Address is required";
    if (!shippingInfo.city) errors.city = "City is required";
    if (!shippingInfo.zipCode) errors.zipCode = "ZIP code is required";
    
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
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
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
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Page Title & Breadcrumb */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Checkout</h1>
            <Breadcrumbs />
          </div>
          
          {/* Checkout Progress Steps */}
          <div className="mb-8 bg-white rounded-xl p-4 shadow-md">
            <div className="flex justify-between items-center">
              {['Shipping', 'Payment', 'Review', 'Confirmation'].map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2
                    ${currentStep > index + 1 ? 'bg-green-500 text-white' : 
                      currentStep === index + 1 ? 'bg-[#4DA9FF] text-white' : 
                      'bg-gray-200 text-gray-500'}`}
                  >
                    {currentStep > index + 1 ? (
                      <FaCheckCircle />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <div className={`text-xs sm:text-sm font-medium 
                    ${currentStep === index + 1 ? 'text-[#4DA9FF]' : 
                      currentStep > index + 1 ? 'text-green-500' : 
                      'text-gray-500'}`}
                  >
                    {step}
                  </div>
                  
                  {/* Connection lines between steps */}
                  {index < 3 && (
                    <div className="hidden sm:block absolute h-[2px] w-[calc(25%-2rem)] 
                      bg-gray-200 top-[1.25rem] left-[calc(12.5%+1rem+index*25%)]">
                      <div className={`h-full ${currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-200'}`} 
                        style={{ width: `${currentStep <= index + 1 ? 0 : 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {currentStep === 4 ? (
              // Full-width layout for order confirmation
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
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
                </div>
              </div>
            ) : (
              <>
                {/* Main Content - Left Column */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
                    {/* Step 1: Shipping Information */}
                    {currentStep === 1 && (
                      <div className="p-6">
                        <h2 className="font-bold text-2xl text-gray-800 mb-6">Shipping Information</h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          <div>
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                            <input
                              type="text"
                              id="firstName"
                              name="firstName"
                              value={shippingInfo.firstName}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                            {formErrors.firstName && (
                              <p className="text-red-600 text-xs mt-1">{formErrors.firstName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                            <input
                              type="text"
                              id="lastName"
                              name="lastName"
                              value={shippingInfo.lastName}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                            {formErrors.lastName && (
                              <p className="text-red-600 text-xs mt-1">{formErrors.lastName}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={shippingInfo.email}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                            {formErrors.email && (
                              <p className="text-red-600 text-xs mt-1">{formErrors.email}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              value={shippingInfo.phone}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                          </div>
                          
                          <div className="sm:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <input
                              type="text"
                              id="address"
                              name="address"
                              value={shippingInfo.address}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                            {formErrors.address && (
                              <p className="text-red-600 text-xs mt-1">{formErrors.address}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                              type="text"
                              id="city"
                              name="city"
                              value={shippingInfo.city}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                            {formErrors.city && (
                              <p className="text-red-600 text-xs mt-1">{formErrors.city}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                              type="text"
                              id="state"
                              name="state"
                              value={shippingInfo.state}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                            <input
                              type="text"
                              id="zipCode"
                              name="zipCode"
                              value={shippingInfo.zipCode}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            />
                            {formErrors.zipCode && (
                              <p className="text-red-600 text-xs mt-1">{formErrors.zipCode}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                            <select
                              id="country"
                              name="country"
                              value={shippingInfo.country}
                              onChange={handleShippingChange}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="Mexico">Mexico</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                            </select>
                          </div>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                          <Link 
                            href="/cart" 
                            className="flex items-center text-[#4DA9FF] hover:underline"
                          >
                            <FaArrowLeft size={12} className="mr-2" /> Back to Cart
                          </Link>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNextStep}
                            className={commonButtonStyles.primary}
                          >
                            Continue to Payment
                          </motion.button>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 2: Payment Information */}
                    {currentStep === 2 && (
                      <div className="p-6">
                        <h2 className="font-bold text-2xl text-gray-800 mb-6">Payment Information</h2>
                        
                        {/* Payment Method Selector */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer transition-all
                                ${paymentInfo.paymentMethod === 'credit-card' 
                                  ? 'border-[#4DA9FF] bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'}`}
                              onClick={() => handlePaymentMethodChange('credit-card')}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                                  ${paymentInfo.paymentMethod === 'credit-card' ? 'border-[#4DA9FF]' : 'border-gray-400'}`}
                                >
                                  {paymentInfo.paymentMethod === 'credit-card' && (
                                    <div className="w-3 h-3 rounded-full bg-[#4DA9FF]"></div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <FaCreditCard className="text-gray-700 mr-2" />
                                  <span className="font-medium">Credit Card</span>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer transition-all
                                ${paymentInfo.paymentMethod === 'paypal' 
                                  ? 'border-[#4DA9FF] bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'}`}
                              onClick={() => handlePaymentMethodChange('paypal')}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                                  ${paymentInfo.paymentMethod === 'paypal' ? 'border-[#4DA9FF]' : 'border-gray-400'}`}
                                >
                                  {paymentInfo.paymentMethod === 'paypal' && (
                                    <div className="w-3 h-3 rounded-full bg-[#4DA9FF]"></div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <FaPaypal className="text-gray-700 mr-2" />
                                  <span className="font-medium">PayPal</span>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`border rounded-lg p-4 cursor-pointer transition-all
                                ${paymentInfo.paymentMethod === 'apple-pay' 
                                  ? 'border-[#4DA9FF] bg-blue-50' 
                                  : 'border-gray-200 hover:border-gray-300'}`}
                              onClick={() => handlePaymentMethodChange('apple-pay')}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                                  ${paymentInfo.paymentMethod === 'apple-pay' ? 'border-[#4DA9FF]' : 'border-gray-400'}`}
                                >
                                  {paymentInfo.paymentMethod === 'apple-pay' && (
                                    <div className="w-3 h-3 rounded-full bg-[#4DA9FF]"></div>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <FaApplePay className="text-gray-700 mr-2" />
                                  <span className="font-medium">Apple Pay</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Credit Card Form */}
                        {paymentInfo.paymentMethod === 'credit-card' && (
                          <div className="border rounded-lg p-6 bg-gray-50 mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                              <div className="sm:col-span-2">
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                                <input
                                  type="text"
                                  id="cardNumber"
                                  name="cardNumber"
                                  placeholder="1234 5678 9012 3456"
                                  value={paymentInfo.cardNumber}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                                />
                                {formErrors.cardNumber && (
                                  <p className="text-red-600 text-xs mt-1">{formErrors.cardNumber}</p>
                                )}
                              </div>
                              
                              <div className="sm:col-span-2">
                                <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name *</label>
                                <input
                                  type="text"
                                  id="cardholderName"
                                  name="cardholderName"
                                  value={paymentInfo.cardholderName}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                                />
                                {formErrors.cardholderName && (
                                  <p className="text-red-600 text-xs mt-1">{formErrors.cardholderName}</p>
                                )}
                              </div>
                              
                              <div>
                                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                                <input
                                  type="text"
                                  id="expiryDate"
                                  name="expiryDate"
                                  placeholder="MM/YY"
                                  value={paymentInfo.expiryDate}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                                />
                                {formErrors.expiryDate && (
                                  <p className="text-red-600 text-xs mt-1">{formErrors.expiryDate}</p>
                                )}
                              </div>
                              
                              <div>
                                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                                <input
                                  type="text"
                                  id="cvv"
                                  name="cvv"
                                  placeholder="123"
                                  value={paymentInfo.cvv}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]"
                                />
                                {formErrors.cvv && (
                                  <p className="text-red-600 text-xs mt-1">{formErrors.cvv}</p>
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
                          </div>
                        )}
                        
                        {/* PayPal Instructions */}
                        {paymentInfo.paymentMethod === 'paypal' && (
                          <div className="bg-yellow-50 border rounded-lg p-6 border-yellow-200 mb-6">
                            <p className="text-sm text-gray-700">
                              You&apos;ll be redirected to PayPal to complete your payment securely. 
                              Click &quot;Continue&quot; to proceed to PayPal.
                            </p>
                          </div>
                        )}
                        
                        {/* Apple Pay Instructions */}
                        {paymentInfo.paymentMethod === 'apple-pay' && (
                          <div className="bg-gray-50 border rounded-lg p-6 border-gray-200 mb-6">
                            <p className="text-sm text-gray-700">
                              You&apos;ll be prompted to confirm payment using Apple Pay. 
                              Make sure you&apos;re using a compatible device with Apple Pay set up.
                            </p>
                          </div>
                        )}
                        
                        {/* Secure Payment Notice */}
                        <div className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
                          <FaLock className="text-blue-500 mr-3 flex-shrink-0" />
                          <p className="text-sm text-gray-700">
                            Your payment information is encrypted and secure. We never store your full credit card details.
                          </p>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                          <button
                            onClick={handlePrevStep}
                            className="text-[#4DA9FF] hover:underline flex items-center"
                          >
                            <FaArrowLeft size={12} className="mr-2" /> Back to Shipping
                          </button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNextStep}
                            className={commonButtonStyles.primary}
                          >
                            Review Order
                          </motion.button>
                        </div>
                      </div>
                    )}
                    
                    {/* Step 3: Order Review */}
                    {currentStep === 3 && (
                      <div className="p-6">
                        <h2 className="font-bold text-2xl text-gray-800 mb-6">Review Your Order</h2>
                        
                        {/* Order Items */}
                        <div className="mb-8">
                          <h3 className="font-medium text-lg text-gray-800 mb-4">Order Items</h3>
                          <div className="border rounded-lg overflow-hidden">
                            {cartItems.map((item, index) => (
                              <div key={index} className="p-4 flex items-center border-b last:border-b-0">
                                {/* Product Image - Updated from placeholder */}
                                <div className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-200 overflow-hidden">
                                  {item.product?.image ? (
                                    <Image
                                      src={item.product.image}
                                      alt={item.product?.name || 'Product image'}
                                      width={64}
                                      height={64}
                                      className="object-contain w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-500">[{item.product?.name?.substring(0, 8) || 'Robot'}]</span>
                                  )}
                                </div>
                                
                                <div className="ml-4 flex-grow">
                                  <div className="font-medium">{item.product?.name}</div>
                                  <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                                </div>
                                
                                <div className="font-bold text-[#4DA9FF]">
                                  ${((item.product?.price || 0) * item.quantity).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Shipping Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                          <div>
                            <h3 className="font-medium text-lg text-gray-800 mb-4">Shipping Information</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                              <p>{shippingInfo.address}</p>
                              <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                              <p>{shippingInfo.country}</p>
                              <p className="mt-2">{shippingInfo.email}</p>
                              {shippingInfo.phone && <p>{shippingInfo.phone}</p>}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium text-lg text-gray-800 mb-4">Payment Method</h3>
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                              {paymentInfo.paymentMethod === 'credit-card' && (
                                <>
                                  <div className="flex items-center">
                                    <FaCreditCard className="text-gray-700 mr-2" />
                                    <span className="font-medium">Credit Card</span>
                                  </div>
                                  <p className="mt-1">Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                                  <p>{paymentInfo.cardholderName}</p>
                                </>
                              )}
                              
                              {paymentInfo.paymentMethod === 'paypal' && (
                                <div className="flex items-center">
                                  <FaPaypal className="text-gray-700 mr-2" />
                                  <span className="font-medium">PayPal</span>
                                </div>
                              )}
                              
                              {paymentInfo.paymentMethod === 'apple-pay' && (
                                <div className="flex items-center">
                                  <FaApplePay className="text-gray-700 mr-2" />
                                  <span className="font-medium">Apple Pay</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Terms & Conditions */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                          <div className="flex items-start">
                            <FaExclamationTriangle className="text-yellow-500 mr-3 mt-1 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                              By placing this order, you agree to RoboMarket&apos;s <a href="#" className="text-[#4DA9FF] hover:underline">Terms of Service</a> and <a href="#" className="text-[#4DA9FF] hover:underline">Privacy Policy</a>. 
                              Your personal data will be used to process your order, support your experience, and for other purposes described in our privacy policy.
                            </p>
                          </div>
                        </div>
                        
                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                          <button
                            onClick={handlePrevStep}
                            className="text-[#4DA9FF] hover:underline flex items-center"
                          >
                            <FaArrowLeft size={12} className="mr-2" /> Back to Payment
                          </button>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handlePlaceOrder}
                            className={`${commonButtonStyles.primary} bg-green-600 hover:bg-green-700 focus:ring-green-500`}
                          >
                            Place Order
                          </motion.button>
                        </div>
                      </div>
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
                </div>
              </>
            )}
            
            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              {currentStep < 4 && (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-24">
                  <div className="p-5 border-b border-gray-200">
                    <h2 className="font-bold text-xl text-gray-800">Order Summary</h2>
                  </div>
                  
                  <div className="p-5">
                    {/* Items Count */}
                    <div className="mb-4 text-sm">
                      <span className="text-gray-600">{cartItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
                    </div>
                    
                    {/* Order Items List */}
                    <div className="space-y-3 mb-6">
                      {cartItems.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <div className="flex items-center">
                            {/* Small image thumbnail in the order summary */}
                            {item.product?.image && (
                              <div className="w-8 h-8 mr-2 rounded overflow-hidden border border-gray-200 flex-shrink-0">
                                <Image 
                                  src={item.product.image}
                                  alt={item.product?.name || 'Product thumbnail'}
                                  width={32}
                                  height={32}
                                  className="object-contain w-full h-full"
                                />
                              </div>
                            )}
                            <span className="text-gray-700">
                              {item.quantity}x {item.product?.name && item.product.name.length > 20 
                                ? `${item.product.name.substring(0, 20)}...` 
                                : item.product?.name || 'Product'}
                            </span>
                          </div>
                          <span className="font-medium">${((item.product?.price || 0) * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Order calculations */}
                    <div className="space-y-3 text-gray-700 pt-4 border-t border-dashed border-gray-200">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
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
                      
                      <div className="pt-3 mt-3 border-t border-dashed border-gray-200 flex justify-between">
                        <span className="font-bold text-gray-800">Total</span>
                        <span className="font-bold text-xl text-[#4DA9FF]">${totalAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Security Badge */}
                    <div className="mt-6 flex items-center justify-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <FaLock className="text-gray-500 mr-2" />
                      <span className="text-xs text-gray-500">Secure Checkout • SSL Encrypted</span>
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
  );
}