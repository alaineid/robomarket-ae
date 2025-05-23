"use client";

import React from "react";
import {
  FaShoppingCart,
  FaLock,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { usePayment } from "@/stores/paymentContext";
import { useCart } from "@/stores/cartContext";
import Link from "next/link";
import Image from "next/image";

interface OrderSummaryProps {
  showPromoCodeInput?: boolean;
  showCheckoutButton?: boolean;
  isCheckoutPage?: boolean;
  showPaymentMethods?: boolean;
  showCheckoutActions?: boolean;
  isSubmitting?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  showCheckoutButton = false,
  isCheckoutPage = false,
  showPaymentMethods = false,
  showCheckoutActions = false,
  isSubmitting = false,
  onSubmit,
}) => {
  const { cartItems } = useCart();
  const {
    subtotal,
    shipping,
    tax,
    total,
    selectedPaymentMethod,
    setPaymentMethod,
  } = usePayment();

  // Set Stripe as default payment method when component mounts
  React.useEffect(() => {
    if (!selectedPaymentMethod) {
      setPaymentMethod("stripe");
    }
  }, [selectedPaymentMethod, setPaymentMethod]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24 h-full flex flex-col">
      <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="font-bold text-xl text-gray-800 flex items-center">
          <FaShoppingCart className="mr-2 text-[#4DA9FF]" size={16} />
          Order Summary
        </h2>
      </div>

      <div className="p-6 flex-grow flex flex-col justify-between">
        {/* Order calculations */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between">
            <span>
              Subtotal{" "}
              <span className="text-sm text-gray-500">
                ({cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                items)
              </span>
            </span>
            <span className="font-medium">
              ${isNaN(subtotal) ? "0.00" : subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span>Shipping</span>
            <span
              className={`font-medium ${shipping === 0 ? "text-green-600" : ""}`}
            >
              {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            </span>
          </div>

          {shipping > 0 && (
            <div className="text-sm text-gray-500">
              <p>Free shipping on orders over $100</p>
            </div>
          )}

          <div className="flex justify-between">
            <span>Tax (5%)</span>
            <span className="font-medium">
              ${isNaN(tax) ? "0.00" : tax.toFixed(2)}
            </span>
          </div>

          <div className="pt-4 mt-2 border-t border-dashed border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-800 text-lg">Total</span>
              <span className="font-bold text-xl text-[#4DA9FF]">
                ${isNaN(total) ? "0.00" : total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        {showPaymentMethods && (
          <div className="mt-6">
            <h3 className="block text-sm font-medium text-gray-700 mb-2">
              Continue With
            </h3>
            <div className="space-y-2">
              <div
                key="stripe"
                onClick={() => setPaymentMethod("stripe")}
                className={`flex items-center p-3 border h-14 ${
                  selectedPaymentMethod === "stripe"
                    ? "border-[#4DA9FF] bg-blue-50"
                    : "border-gray-300 hover:border-[#4DA9FF]"
                } rounded-md cursor-pointer transition-colors`}
              >
                <Image
                  src="/images/stripe.svg"
                  alt="Stripe"
                  width={40}
                  height={30}
                  className="mr-2"
                />
                <span className="font-medium text-sm">
                  Continue with Stripe
                </span>
                {selectedPaymentMethod === "stripe" && (
                  <span className="ml-auto text-[#4DA9FF]">&#10003;</span>
                )}
              </div>
              <div
                key="paypal"
                onClick={() => setPaymentMethod("paypal")}
                className={`flex items-center p-3 border h-14 ${
                  selectedPaymentMethod === "paypal"
                    ? "border-[#4DA9FF] bg-blue-50"
                    : "border-gray-300 hover:border-[#4DA9FF]"
                } rounded-md cursor-pointer transition-colors`}
              >
                <Image
                  src="/images/paypal.svg"
                  alt="PayPal"
                  width={40}
                  height={30}
                  className="mr-2"
                />
                <span className="font-medium text-sm">
                  Continue with PayPal
                </span>
                {selectedPaymentMethod === "paypal" && (
                  <span className="ml-auto text-[#4DA9FF]">&#10003;</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Checkout button */}
        {showCheckoutButton && (
          <div className="mt-6">
            <Link
              href="/checkout"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#4DA9FF] text-white font-bold rounded-lg hover:bg-[#3d97e8] transition-all duration-300"
            >
              Proceed to Checkout
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 ml-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        )}

        {/* Payment methods */}
        {isCheckoutPage && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              We Accept
            </h3>
            <div className="flex flex-wrap gap-2">
              <Image src="/images/visa.svg" alt="Visa" width={50} height={32} />
              <Image
                src="/images/mastercard.svg"
                alt="Mastercard"
                width={50}
                height={32}
              />

              <Image
                src="/images/applepay.svg"
                alt="Apple Pay"
                width={50}
                height={32}
              />
              <Image
                src="/images/googlepay.svg"
                alt="Google Pay"
                width={50}
                height={32}
              />
            </div>
          </div>
        )}

        {/* Checkout Action Buttons */}
        {showCheckoutActions && (
          <div className="mt-6 space-y-4">
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={(e) => onSubmit && onSubmit(e)}
              className={`inline-flex items-center justify-center w-full px-6 py-3 bg-[#4DA9FF] text-white font-bold rounded-lg hover:bg-[#3d97e8] transition-all duration-300 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaLock className="mr-2" /> Continue to Payment{" "}
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </button>

            <Link
              href="/cart"
              className="inline-flex items-center justify-center w-full px-4 py-2 text-[#4DA9FF] border border-[#4DA9FF] font-medium rounded-lg hover:bg-blue-50 transition-all duration-300"
            >
              <FaArrowLeft className="mr-2" /> Back to Cart
            </Link>

            <div className="flex items-center justify-center mt-3 text-xs text-gray-500  hover:text-[#4DA9FF]">
              <FaLock className="mr-1 text-green-600" size={10} /> Secure
              payment processed with 256-bit encryption
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderSummary;
