"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaTrash,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/stores/cartContext";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/layout/Container";
import OrderSummary from "@/components/shop/OrderSummary";

// Fix the function name destructuring from useCart()
export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Short delay to ensure cart is loaded from localStorage
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Handle quantity change via the context
  const handleQuantityChange = (productId: number, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
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
          <div className="container mx-auto px-4 max-w-[2400px]">
            <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl shadow-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart size={36} className="text-gray-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">
                Your Cart is Empty
              </h1>
              <p className="text-gray-600 mb-8">
                {"Looks like you haven't added any robots to your cart yet."}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-[#4DA9FF] text-white font-bold rounded-lg hover:bg-[#3d97e8] transition-all duration-300"
              >
                Start Shopping <FaArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Breadcrumb items for the PageHero component
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart", active: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageHero
          title="Your Shopping Cart"
          description="Review your selected robots and proceed to checkout."
          breadcrumbItems={breadcrumbItems}
        />

        <Container className="py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column - Enhanced styling */}
            <div className="lg:col-span-2">
              {/* Cart header */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                  <h2 className="font-bold text-xl text-gray-800 flex items-center">
                    <FaShoppingCart className="mr-2 text-[#4DA9FF]" size={16} />
                    Cart Items{" "}
                    <span className="ml-2 text-gray-500 font-normal text-sm">
                      ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {/* Cart Items List - Enhanced styling */}
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4">
                        {/* Product Image & Details - Enhanced styling */}
                        <div className="col-span-12 sm:col-span-8 flex">
                          <div className="flex-shrink-0 mr-4 relative">
                            {/* Image with animation - Enhanced styling */}
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                              className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-lg overflow-hidden border border-gray-200 bg-white"
                            >
                              {item.product?.images &&
                              item.product.images[0] ? (
                                <Image
                                  src={item.product.images[0].url}
                                  alt={item.product.name}
                                  fill
                                  sizes="(max-width: 768px) 6rem, 7rem"
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <FaShoppingCart
                                    size={24}
                                    className="text-gray-300"
                                  />
                                </div>
                              )}
                            </motion.div>
                          </div>

                          <div className="flex-1">
                            {/* Product Name with Link - Enhanced styling */}
                            <Link
                              href={`/product/${item.productId}`}
                              className="text-gray-800 font-medium hover:text-[#4DA9FF] transition-colors line-clamp-2 text-lg"
                            >
                              {item.product?.name || "Unnamed Product"}
                            </Link>

                            {/* Product Rating - Enhanced styling */}
                            {item.product?.ratings && (
                              <div className="flex items-center mt-1 text-amber-400">
                                {Array.from({ length: 5 }, (_, i) => i + 1).map(
                                  (star) => (
                                    <svg
                                      key={star}
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                      className={`w-4 h-4 ${
                                        star <= item.product!.ratings!.average
                                          ? "text-amber-400"
                                          : "text-gray-200"
                                      }`}
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  ),
                                )}
                                <span className="ml-1 text-xs text-gray-500">
                                  ({item.product.ratings.count} reviews)
                                </span>
                              </div>
                            )}

                            {/* Product Brand & Category - Enhanced styling */}
                            <div className="text-sm text-gray-500 mt-1 mb-2">
                              <span className="font-medium text-gray-600">
                                {item.product?.brand}
                              </span>
                              {item.product?.categories &&
                                item.product.categories.length > 0 && (
                                  <>
                                    <span className="mx-1.5 text-gray-300">
                                      •
                                    </span>
                                    <span className="text-[#4DA9FF]">
                                      {item.product.categories[0].name}
                                    </span>
                                  </>
                                )}
                            </div>

                            {/* Remove Button - Mobile Only - Enhanced styling */}
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="sm:hidden text-gray-500 hover:text-red-500 text-sm flex items-center transition-colors mt-1 group"
                            >
                              <FaTrash
                                size={12}
                                className="mr-1.5 group-hover:text-red-500"
                              />
                              <span className="group-hover:underline">
                                Remove
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Price - Enhanced styling */}
                        <div className="col-span-2 text-center">
                          <span className="sm:hidden font-medium mr-2 text-gray-700">
                            Price:
                          </span>
                          <span className="text-gray-800 font-semibold">
                            $
                            {item.product?.best_vendor?.price.toLocaleString() ||
                              "0.00"}
                          </span>
                        </div>

                        {/* Quantity Selector - Enhanced styling */}
                        <div className="col-span-2 flex items-center justify-center">
                          <span className="sm:hidden font-medium mr-2 text-gray-700">
                            Qty:
                          </span>
                          <div className="flex items-center">
                            <button
                              className="w-8 h-8 rounded-l-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center border border-gray-300"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              aria-label="Decrease quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 text-gray-600"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <div className="w-10 h-8 bg-white flex items-center justify-center border-t border-b border-gray-300">
                              {item.quantity}
                            </div>
                            <button
                              className="w-8 h-8 rounded-r-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center border border-gray-300"
                              onClick={() =>
                                handleQuantityChange(
                                  item.productId,
                                  item.quantity + 1,
                                )
                              }
                              aria-label="Increase quantity"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-4 h-4 text-gray-600"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Item Subtotal - Enhanced styling */}
                        <div className="col-span-6 sm:col-span-2 text-right">
                          <span className="sm:hidden font-medium mr-2 text-gray-700">
                            Subtotal:
                          </span>
                          <div className="text-[#4DA9FF] font-bold">
                            $
                            {(
                              (item.product?.best_vendor?.price || 0) *
                              item.quantity
                            ).toLocaleString()}
                          </div>

                          {/* Remove Button - Desktop Only - Enhanced styling */}
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="hidden sm:flex text-gray-500 hover:text-red-500 text-sm items-center transition-colors mt-2 group ml-auto"
                          >
                            <FaTrash
                              size={12}
                              className="mr-1.5 group-hover:text-red-500"
                            />
                            <span className="group-hover:underline">
                              Remove
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping Button - Enhanced styling */}
                <div className="p-5 border-t border-gray-100 bg-gray-50">
                  <Link
                    href="/shop"
                    className="inline-flex items-center text-[#4DA9FF] hover:text-blue-700 font-medium transition-colors"
                  >
                    <FaArrowLeft className="mr-2" />
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <OrderSummary
                showPromoCodeInput={true}
                showCheckoutButton={true}
              />
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
