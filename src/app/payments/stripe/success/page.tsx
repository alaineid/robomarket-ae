"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaArrowRight } from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/layout/Container";
import Link from "next/link";
import { useCart } from "@/stores/cartContext";

export default function StripeSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [orderNumber, setOrderNumber] = useState("");
  const { clearCart } = useCart();

  useEffect(() => {
    if (!sessionId) {
      router.replace("/shop");
      return;
    }

    // Generate a random order number (in a real app, this would come from the backend)
    setOrderNumber(`RBT-${Math.floor(Math.random() * 900000) + 100000}`);

    // Clear the cart after successful payment
    clearCart();

    // Clear shipping info from localStorage
    localStorage.removeItem("shippingInfo");
  }, [sessionId, router, clearCart]);

  // Breadcrumb items for navigation
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    {
      label: "Order Confirmation",
      href: "/payments/stripe/success",
      active: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageHero
          title={
            <span>
              Order <span className="text-[#4DA9FF]">Confirmed</span>
            </span>
          }
          description="Thank you for your purchase! Your order has been confirmed"
          breadcrumbItems={breadcrumbItems}
        />

        <Container className="py-10 flex-grow">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle size={36} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
            <p className="mb-2">
              Your order number is:{" "}
              <span className="font-bold text-[#4DA9FF]">{orderNumber}</span>
            </p>
            <p className="mb-8">
              {"We've sent a confirmation email with your order details"}
            </p>

            <div className="max-w-md mx-auto mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-bold mb-2 text-left">What Happens Next?</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Your order has been received and is being processed
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  {"You'll receive shipping updates via email"}
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  Estimated delivery: 7-21 business days
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#4DA9FF] text-white font-bold rounded-lg hover:bg-[#3d97e8] transition-all duration-300"
              >
                Continue Shopping <FaArrowRight className="ml-2" />
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 border border-[#4DA9FF] text-[#4DA9FF] font-medium rounded-lg hover:bg-blue-50 transition-all duration-300"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
