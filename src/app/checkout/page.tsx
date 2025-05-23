"use client";

import React, { useState, useEffect } from "react";
import { FaArrowRight, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import PageHero from "../../components/layout/PageHero";
import Container from "../../components/layout/Container";
import OrderSummary from "../../components/shop/OrderSummary";
import { useCart } from "../../stores/cartContext";
import { usePayment } from "../../stores/paymentContext";
import Link from "next/link";

export default function CheckoutPage() {
  const { cartItems = [] } = useCart();
  const { selectedPaymentMethod, total, subtotal, tax, shipping } =
    usePayment();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Load saved shipping info from localStorage on component mount
  useEffect(() => {
    const savedInfo = localStorage.getItem("shippingInfo");
    if (savedInfo) {
      try {
        setFormData(JSON.parse(savedInfo));
      } catch (error) {
        console.error("Error loading saved shipping info:", error);
      }
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    const newErrors: Record<string, string> = {};
    const requiredFields = [
      { key: "firstName", label: "First name" },
      { key: "lastName", label: "Last name" },
      { key: "email", label: "Email address" },
      { key: "address", label: "Street address" },
      { key: "city", label: "City" },
      { key: "state", label: "State/Province" },
      { key: "zipCode", label: "ZIP/Postal code" },
      { key: "phone", label: "Phone number" },
    ];

    requiredFields.forEach((field) => {
      if (!formData[field.key as keyof typeof formData]) {
        newErrors[field.key] = `${field.label} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation
    if (formData.phone && !/^[0-9\-+() ]{7,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    // If there are validation errors, set them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      return;
    }

    // Save shipping info to localStorage
    localStorage.setItem("shippingInfo", JSON.stringify(formData));

    // Show loading state
    setIsSubmitting(true);

    // If Stripe is selected as the payment method
    if (selectedPaymentMethod === "stripe") {
      try {
        // Send the data to the API route
        const response = await fetch("/api/payments/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cartItems,
            shippingInfo: formData,
            customerEmail: formData.email,
            paymentDetails: {
              total,
              subtotal,
              tax,
              shipping,
            },
          }),
        });

        const data = await response.json();

        if (data.url) {
          // Redirect to Stripe checkout page
          window.location.href = data.url;
        } else {
          throw new Error("Failed to create checkout session");
        }
      } catch (error) {
        console.error("Error creating checkout session:", error);
        setIsSubmitting(false);
        alert("There was an error processing your payment. Please try again.");
      }
    } else {
      // For other payment methods (like PayPal), use the existing flow
      // This is just a placeholder for demonstration
      setTimeout(() => {
        // Generate a random order number
        const orderNum = `RBT-${Math.floor(Math.random() * 900000) + 100000}`;
        setOrderNumber(orderNum);
        setOrderPlaced(true);
        setIsSubmitting(false);
      }, 1500);
    }
  };

  // Breadcrumb items for navigation
  const breadcrumbItems = orderPlaced
    ? [
        { label: "Home", href: "/" },
        { label: "Cart", href: "/cart" },
        { label: "Checkout", href: "/checkout" },
        { label: "Order Confirmation", href: "#", active: true },
      ]
    : [
        { label: "Home", href: "/" },
        { label: "Cart", href: "/cart" },
        { label: "Checkout", href: "/checkout", active: true },
      ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-50">
        <PageHero
          title={
            orderPlaced ? (
              <span>
                Order <span className="text-[#4DA9FF]">Confirmed</span>
              </span>
            ) : (
              <span>
                Secure <span className="text-[#4DA9FF]">Checkout</span>
              </span>
            )
          }
          description={
            orderPlaced
              ? "Thank you for your purchase! Your order has been confirmed"
              : "Complete your purchase securely with our trusted payment system"
          }
          breadcrumbItems={breadcrumbItems}
        />

        <Container className="py-10 flex-grow">
          {!Array.isArray(cartItems) || cartItems.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart size={36} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="mb-8">
                Add some products to your cart to checkout.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-[#4DA9FF] text-white font-bold rounded-lg hover:bg-[#3d97e8] transition-all duration-300"
              >
                Browse Products <FaArrowRight className="ml-2" />
              </Link>
            </div>
          ) : orderPlaced ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheckCircle size={36} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
              <p className="mb-2">
                Your order number is:{" "}
                <span className="font-bold text-[#4DA9FF]">{orderNumber}</span>
              </p>
              <p className="mb-8">
                {"We've sent a confirmation email to "}
                <span className="font-medium">{formData.email}</span>
              </p>

              <div className="max-w-md mx-auto mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="font-bold mb-2 text-left">
                  Shipping Information
                </h3>
                <div className="text-left text-gray-700">
                  <p>
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p>{formData.address}</p>
                  <p>
                    {formData.city}, {formData.state} {formData.zipCode}
                  </p>
                  <p>{formData.country}</p>
                  <p>{formData.phone}</p>
                </div>
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
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
              {/* Shipping Information Form - Left column */}
              <div className="lg:col-span-2 h-full flex flex-col">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-grow h-full flex flex-col">
                  <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                    <h2 className="font-bold text-xl text-gray-800 flex items-center">
                      <FaShoppingCart
                        className="mr-2 text-[#4DA9FF]"
                        size={16}
                      />
                      Shipping Information
                    </h2>
                  </div>

                  <div className="p-6 flex-grow">
                    <form
                      onSubmit={handleSubmit}
                      className="h-full flex flex-col"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            First Name*
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${formErrors.firstName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {formErrors.firstName && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.firstName}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Last Name*
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${formErrors.lastName ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {formErrors.lastName && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email Address*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 border ${formErrors.email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formErrors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.email}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="address"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Street Address*
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 border ${formErrors.address ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formErrors.address && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            City*
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${formErrors.city ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {formErrors.city && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.city}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            State/Province*
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${formErrors.state ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {formErrors.state && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.state}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label
                            htmlFor="zipCode"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            ZIP/Postal Code*
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border ${formErrors.zipCode ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          />
                          {formErrors.zipCode && (
                            <p className="text-red-500 text-xs mt-1">
                              {formErrors.zipCode}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Country*
                          </label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="Mexico">Mexico</option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="France">France</option>
                            <option value="Japan">Japan</option>
                          </select>
                        </div>
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Phone Number*
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className={`w-full px-3 py-2 border ${formErrors.phone ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        {formErrors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {formErrors.phone}
                          </p>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* Order Summary Section */}
              <div className="lg:col-span-1 h-full flex flex-col">
                <div className="p-0 h-full flex flex-col">
                  <OrderSummary
                    showPromoCodeInput={false}
                    showCheckoutButton={false}
                    isCheckoutPage={true}
                    showPaymentMethods={true}
                    showCheckoutActions={true}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                  />
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
