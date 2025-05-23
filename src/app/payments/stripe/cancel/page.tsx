"use client";

import React from "react";
import { FaTimesCircle, FaArrowLeft } from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import Container from "@/components/layout/Container";
import Link from "next/link";

export default function StripeCancelPage() {
  // Breadcrumb items for navigation
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "Order Cancelled", href: "/payments/stripe/cancel", active: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageHero
          title={
            <span>
              Payment <span className="text-red-500">Cancelled</span>
            </span>
          }
          description="Your order has been cancelled and no payment has been processed"
          breadcrumbItems={breadcrumbItems}
        />

        <Container className="py-10 flex-grow">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaTimesCircle size={36} className="text-red-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Payment Cancelled</h2>
            <p className="mb-8">
              Your order has been cancelled and no payment has been processed.
              Your items are still in your cart if you wish to complete your
              purchase.
            </p>

            <div className="max-w-md mx-auto mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-bold mb-2 text-left">Need Help?</h3>
              <p className="text-left text-gray-700 mb-4">
                If you experienced any issues during checkout or have questions
                {" about your order, please don't hesitate to contact our customer "}
                support team.
              </p>
              <p className="text-left text-gray-700">
                <strong>Email:</strong> support@robomarket.ae
                <br />
                <strong>Phone:</strong> +971 58 583 6777
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link
                href="/checkout"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#4DA9FF] text-white font-bold rounded-lg hover:bg-[#3d97e8] transition-all duration-300"
              >
                <FaArrowLeft className="mr-2" /> Return to Checkout
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center px-6 py-3 border border-[#4DA9FF] text-[#4DA9FF] font-medium rounded-lg hover:bg-blue-50 transition-all duration-300"
              >
                View Cart
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
