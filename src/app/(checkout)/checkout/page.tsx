"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaCreditCard,
  FaPaypal,
  FaApplePay,
  FaCheckCircle,  
  FaShoppingCart,
  FaInfoCircle,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { Country, State, City } from "country-state-city";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import { useCart } from "@/stores/cartContext";
import { useAuthStore } from "@/stores/authStore";
import { CartItem } from '@/types/product.types';

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
  paymentMethod: "credit-card" | "paypal" | "apple-pay";
}

export default function CheckoutPage() {
  const { cartItems }: { cartItems: CartItem[] } = useCart();
  const { cartTotal, clearCart } = useCart();
  const { user } = useAuthStore();
  const router = useRouter();

  // Function to navigate to login page
  const showLogin = () => {
    router.push('/login');
  };

  // Track the current checkout step
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form state
  const [shippingInfo, setShippingInfo] = useState<
    ShippingInfo & { saveAddress?: boolean }
  >({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United Arab Emirates",
    saveAddress: false,
  });

  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
    paymentMethod: "credit-card",
  });

  // Order summary calculations
  const subtotal = cartTotal || 0; // Ensure subtotal is not NaN
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
    if (!shippingInfo.zipCode) errors.zipCode = "Postal code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePaymentForm = () => {
    const errors: Record<string, string> = {};

    if (paymentInfo.paymentMethod === "credit-card") {
      if (!paymentInfo.cardNumber)
        errors.cardNumber = "Card number is required";
      if (!paymentInfo.cardholderName)
        errors.cardholderName = "Cardholder name is required";
      if (!paymentInfo.expiryDate)
        errors.expiryDate = "Expiry date is required";
      if (!paymentInfo.cvv) errors.cvv = "CVV is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form changes
  const handleShippingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (method: PaymentInfo["paymentMethod"]) => {
    setPaymentInfo((prev) => ({ ...prev, paymentMethod: method }));
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
    console.log("Order placed!", {
      shippingInfo,
      paymentInfo,
      orderItems: cartItems,
      orderTotal: totalAmount,
    });

    // Simulate successful order
    setCurrentStep(4);
    clearCart();
    window.scrollTo(0, 0);
  };

  // Set initial state for selected country (UAE)
  useEffect(() => {
    // Find the UAE country object
    const uaeCountry = Country.getAllCountries().find(
      (country) => country.isoCode === "AE",
    );
    if (uaeCountry) {
      setShippingInfo((prev) => ({
        ...prev,
        country: "AE", // Store ISO code for better state management
        countryName: uaeCountry.name, // Store name for display purposes
      }));
    }
  }, []);

  // Handle country change to update states/emirates accordingly
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryCode = e.target.value;
    const countryObj = Country.getAllCountries().find(
      (c) => c.isoCode === countryCode,
    );

    setShippingInfo((prev) => ({
      ...prev,
      country: countryCode,
      countryName: countryObj?.name || "",
      state: "", // Reset state when country changes
    }));
  };

  // Empty cart check
  if (cartItems.length === 0 && currentStep !== 4) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow bg-gray-50 py-12">
          <div className="container mx-auto px-4 max-w-[2400px]">
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart size={36} className="text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                You need to add items to your cart before checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-[2400px]">
          {/* Page Title & Breadcrumb - Enhanced styling */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              {currentStep === 4 ? "Order Confirmation" : "Checkout"}
            </h1>
            <Breadcrumbs />
          </div>

          {/* Checkout Progress Steps - Completely redesigned */}
          {currentStep < 4 && (
            <div className="mb-10 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="relative flex justify-between">
                {["Shipping", "Payment", "Review", "Confirmation"].map(
                  (step, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center relative z-10 flex-1"
                    >
                      {/* Step indicator */}
                      <div
                        className={`h-12 w-12 rounded-full flex items-center justify-center mb-2 transition-all
                        ${
                          currentStep > index + 1
                            ? "bg-green-100 text-green-600 border-2 border-green-500"
                            : currentStep === index + 1
                              ? "bg-blue-100 text-[#4DA9FF] border-2 border-[#4DA9FF]"
                              : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                      >
                        {currentStep > index + 1 ? (
                          <FaCheckCircle size={20} />
                        ) : (
                          <span className="font-semibold text-lg">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      {/* Step label */}
                      <div
                        className={`text-sm font-medium transition-all
                      ${
                        currentStep === index + 1
                          ? "text-[#4DA9FF]"
                          : currentStep > index + 1
                            ? "text-green-600"
                            : "text-gray-400"
                      }`}
                      >
                        {step}
                      </div>
                    </div>
                  ),
                )}

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
                          stiffness: 200,
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
                        Thank you for your purchase. Your order has been
                        received and is being processed. We&apos;ll send you
                        updates about your delivery soon.
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gray-50 p-6 md:p-8 rounded-xl border border-gray-200 mb-8 max-w-lg mx-auto"
                      >
                        <p className="font-medium text-xl mb-2 text-gray-800">
                          Order #RBM-
                          {Math.floor(100000 + Math.random() * 900000)}
                        </p>
                        <p className="text-gray-600 mb-4">May 10, 2025</p>

                        <div className="flex items-center justify-center space-x-3 mb-6">
                          <hr className="flex-grow border-dashed border-gray-300" />
                          <span className="text-gray-500 text-sm px-3">
                            ORDER DETAILS
                          </span>
                          <hr className="flex-grow border-dashed border-gray-300" />
                        </div>

                        <div className="space-y-4 mb-6">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">
                              ${subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="font-medium">
                              {shippingCost === 0
                                ? "Free"
                                : `$${shippingCost.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax</span>
                            <span className="font-medium">
                              ${taxAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between pt-3 border-t border-gray-200">
                            <span className="font-semibold">Total</span>
                            <span className="font-bold text-[#4DA9FF]">
                              ${totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <p className="text-gray-700 mt-6">
                          We`&apos;`ve sent a confirmation email to{" "}
                          <span className="font-medium">
                            {shippingInfo.email}
                          </span>{" "}
                          with all the details.
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
                <div className="lg:col-span-3">
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
                        <h2 className="font-bold text-2xl text-gray-800">
                          Shipping Information
                        </h2>
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
                                Have an account?{" "}
                                <button
                                  onClick={() => showLogin()}
                                  className="font-medium underline hover:text-blue-800"
                                  type="button"
                                >
                                  Sign in
                                </button>{" "}
                                to save your shipping details for future
                                purchases.
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                You can continue as a guest. Your information
                                will be saved for this order only.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            First Name *
                          </label>
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
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Last Name *
                          </label>
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
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Address *
                          </label>
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
                              <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
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
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Email Address *
                          </label>
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
                              <FaEnvelope className="h-5 w-5 text-gray-400" />
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
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Phone Number
                          </label>
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
                              <FaPhone className="h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Country *
                          </label>
                          <div className="relative">
                            <select
                              id="country"
                              name="country"
                              value={shippingInfo.country}
                              onChange={(e) => {
                                handleCountryChange(e);
                                // Reset state and city when country changes
                                setShippingInfo((prev) => ({
                                  ...prev,
                                  country: e.target.value,
                                  state: "",
                                  city: "",
                                }));
                              }}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 appearance-none pl-10 pr-10 bg-white"
                            >
                              {/* Filter only GCC countries */}
                              {Country.getAllCountries()
                                .filter((country) =>
                                  ["AE", "SA", "KW", "QA", "BH", "OM"].includes(
                                    country.isoCode,
                                  ),
                                )
                                .map((country) => (
                                  <option
                                    key={country.isoCode}
                                    value={country.isoCode}
                                  >
                                    {country.name}
                                  </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 009 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                                  clipRule="evenodd"
                                />
                            </svg>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Emirate/Province *
                          </label>
                          <div className="relative">
                            <select
                              id="state"
                              name="state"
                              value={shippingInfo.state}
                              onChange={(e) => {
                                handleShippingChange(e);
                                // Reset city when state changes
                                setShippingInfo((prev) => ({
                                  ...prev,
                                  state: e.target.value,
                                  city: "",
                                }));
                              }}
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150 appearance-none pl-10"
                            >
                              <option value="">Select Emirate/Province</option>
                              {State.getStatesOfCountry(
                                shippingInfo.country,
                              ).map((region) => (
                                <option
                                  key={region.isoCode}
                                  value={region.isoCode}
                                >
                                  {region.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                            </svg>
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
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
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            City *
                          </label>
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
                                shippingInfo.state,
                              )?.map((city) => (
                                <option key={city.name} value={city.name}>
                                  {city.name}
                                </option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                            </svg>
                            </div>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <svg
                                className="w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 9l-7 7-7-7"
                                ></path>
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
                          <label
                            htmlFor="zipCode"
                            className="block text-sm font-medium text-gray-700 mb-1.5"
                          >
                            Postal Code *
                          </label>
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
                            <label
                              htmlFor="save-address"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Save this address for future orders
                            </label>
                          </div>
                        </div>
                      )}

                      {/* Shipping Note */}
                      <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-100 flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-blue-500 mt-0.5 mr-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm text-gray-700">
                            {shippingCost === 0 ? (
                              <span>
                                You qualify for{" "}
                                <span className="font-semibold text-green-600">
                                  FREE shipping
                                </span>
                                !
                              </span>
                            ) : (
                              <span>
                                Add ${(100 - subtotal).toFixed(2)} more to your
                                cart to qualify for{" "}
                                <span className="font-semibold">
                                  FREE shipping
                                </span>
                                .
                              </span>
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
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
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Payment Information - Revamped design */}
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
                        <h2 className="font-bold text-2xl text-gray-800">
                          Payment Information
                        </h2>
                      </div>

                      <div className="grid grid-cols-1 gap-6 mb-6">
                        {/* Payment method selection - Enhanced UI */}
                        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Select Payment Method
                            </h3>
                            <div className="flex-shrink-0">
                              <span className="text-xs font-medium text-gray-500">
                                Step 2 of 3
                              </span>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* Credit Card Option */}
                            <div
                              onClick={() => handlePaymentMethodChange("credit-card")}
                              className={`cursor-pointer p-4 rounded-lg flex items-center transition-all
                              ${
                                paymentInfo.paymentMethod === "credit-card"
                                  ? "bg-blue-50 border border-[#4DA9FF] shadow-md"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <FaCreditCard className="text-[#4DA9FF] w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  Credit Card
                                </p>
                                <p className="text-xs text-gray-500">
                                  Pay securely using your credit card
                                </p>
                              </div>
                              {paymentInfo.paymentMethod === "credit-card" && (
                                <div className="flex-shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-[#4DA9FF]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 12v2a4 4 0 01-8 0v-2m8 0a4 4 0 00-8 0m8 0H8"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* PayPal Option */}
                            <div
                              onClick={() => handlePaymentMethodChange("paypal")}
                              className={`cursor-pointer p-4 rounded-lg flex items-center transition-all
                              ${
                                paymentInfo.paymentMethod === "paypal"
                                  ? "bg-blue-50 border border-[#4DA9FF] shadow-md"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <FaPaypal className="text-[#4DA9FF] w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  PayPal
                                </p>
                                <p className="text-xs text-gray-500">
                                  Quick and secure payment via PayPal
                                </p>
                              </div>
                              {paymentInfo.paymentMethod === "paypal" && (
                                <div className="flex-shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-[#4DA9FF]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 12v2a4 4 0 01-8 0v-2m8 0a4 4 0 00-8 0m8 0H8"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* Apple Pay Option */}
                            <div
                              onClick={() => handlePaymentMethodChange("apple-pay")}
                              className={`cursor-pointer p-4 rounded-lg flex items-center transition-all
                              ${
                                paymentInfo.paymentMethod === "apple-pay"
                                  ? "bg-blue-50 border border-[#4DA9FF] shadow-md"
                                  : "bg-gray-50 border border-gray-200"
                              }`}
                            >
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                <FaApplePay className="text-[#4DA9FF] w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">
                                  Apple Pay
                                </p>
                                <p className="text-xs text-gray-500">
                                  Easy payment with your Apple devices
                                </p>
                              </div>
                              {paymentInfo.paymentMethod === "apple-pay" && (
                                <div className="flex-shrink-0">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-[#4DA9FF]"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M16 12v2a4 4 0 01-8 0v-2m8 0a4 4 0 00-8 0m8 0H8"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Credit Card Details - Conditional rendering based on payment method */}
                        {paymentInfo.paymentMethod === "credit-card" && (
                          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                            <div className="mb-4">
                              <label
                                htmlFor="cardNumber"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                              >
                                Card Number *
                              </label>
                              <input
                                type="text"
                                id="cardNumber"
                                name="cardNumber"
                                value={paymentInfo.cardNumber}
                                onChange={handlePaymentChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                                placeholder="1234 5678 9012 3456"
                              />
                              {formErrors.cardNumber && (
                                <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                  {formErrors.cardNumber}
                                </p>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                              <div>
                                <label
                                  htmlFor="cardholderName"
                                  className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                  Cardholder Name *
                                </label>
                                <input
                                  type="text"
                                  id="cardholderName"
                                  name="cardholderName"
                                  value={paymentInfo.cardholderName}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                                  placeholder="John Doe"
                                />
                                {formErrors.cardholderName && (
                                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                    {formErrors.cardholderName}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label
                                  htmlFor="expiryDate"
                                  className="block text-sm font-medium text-gray-700 mb-1.5"
                                >
                                  Expiry Date *
                                </label>
                                <input
                                  type="text"
                                  id="expiryDate"
                                  name="expiryDate"
                                  value={paymentInfo.expiryDate}
                                  onChange={handlePaymentChange}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                                  placeholder="MM/YY"
                                />
                                {formErrors.expiryDate && (
                                  <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                    <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                    {formErrors.expiryDate}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <label
                                htmlFor="cvv"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                              >
                                CVV *
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                name="cvv"
                                value={paymentInfo.cvv}
                                onChange={handlePaymentChange}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] transition-shadow duration-150"
                                placeholder="123"
                              />
                              {formErrors.cvv && (
                                <p className="text-red-600 text-xs mt-1.5 flex items-center">
                                  <span className="inline-block w-1 h-1 bg-red-600 rounded-full mr-1.5"></span>
                                  {formErrors.cvv}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* PayPal and Apple Pay do not require additional details */}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                          <button
                            onClick={handlePrevStep}
                            className="text-[#4DA9FF] hover:text-blue-700 transition-colors flex items-center"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                              />
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
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 ml-2"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Order Review - Polished layout */}
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
                        <h2 className="font-bold text-2xl text-gray-800">
                          Review Your Order
                        </h2>
                      </div>

                      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                          <div className="flex-1 mb-4 md:mb-0">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Shipping Address
                            </h3>
                            <p className="text-sm text-gray-600">
                              {shippingInfo.firstName} {shippingInfo.lastName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {shippingInfo.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              {shippingInfo.city}, {shippingInfo.state},{" "}
                              {shippingInfo.zipCode}
                            </p>
                            <p className="text-sm text-gray-600">
                              {shippingInfo.countryName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {shippingInfo.phone}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Order Summary
                          </h3>

                          <div className="space-y-4">
                            {cartItems.map((item) => (
                              <div
                                key={item.product.id}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center">
                                  <Image
                                    src={item.product.images[0]?.url}
                                    alt={item.product.name}
                                    className="w-16 h-16 rounded-md object-cover mr-4"
                                    width={64}
                                    height={64}
                                  />
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">
                                      {item.product.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Quantity: {item.quantity}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  <p className="text-sm font-medium text-gray-800">
                                    ${item.product.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}

                            <div className="flex justify-between text-sm font-medium text-gray-800 border-t border-gray-200 pt-4 mt-4">
                              <span>Subtotal</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-gray-800 border-t border-gray-200 pt-4">
                              <span>Shipping</span>
                              <span>
                                {shippingCost === 0
                                  ? "Free"
                                  : `$${shippingCost.toFixed(2)}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm font-medium text-gray-800 border-t border-gray-200 pt-4">
                              <span>Tax</span>
                              <span>${taxAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-lg font-semibold text-gray-800 border-t border-gray-200 pt-4 mt-4">
                              <span>Total</span>
                              <span>${totalAmount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between mt-8">
                        <button
                          onClick={handlePrevStep}
                          className="text-[#4DA9FF] hover:text-blue-700 transition-colors flex items-center"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Back to Payment
                        </button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePlaceOrder}
                          className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:shadow transition-all duration-200 inline-flex items-center"
                        >
                          Place Order
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 ml-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  );
}
