"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useCart } from "./cartContext";

type PaymentMethod =
  | "visa"
  | "mastercard"
  | "amex"
  | "apple-pay"
  | "google-pay"
  | "stripe"
  | "paypal";

interface PaymentCalculation {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  promoDiscount: number;
  promoCode: string | null;
  isPromoValid: boolean | null;
  applyPromoCode: (code: string) => void;
  selectedPaymentMethod: PaymentMethod | null;
  setPaymentMethod: (method: PaymentMethod) => void;
  availablePaymentMethods: PaymentMethod[];
}

interface PaymentProviderProps {
  children: ReactNode;
}

const TAX_RATE = 0.05; // 5% tax rate
const SHIPPING_THRESHOLD = 100; // Free shipping over $100
const STANDARD_SHIPPING = 15; // $15 standard shipping

const PaymentContext = createContext<PaymentCalculation | undefined>(undefined);

export function PaymentProvider({ children }: PaymentProviderProps) {
  const { cartItems, cartTotal } = useCart();
  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [isPromoValid, setIsPromoValid] = useState<boolean | null>(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [mounted, setMounted] = useState(false);

  // Available payment methods
  const availablePaymentMethods: PaymentMethod[] = ["stripe", "paypal"];

  // Load saved promo code from localStorage
  useEffect(() => {
    setMounted(true);
    const savedPromo = localStorage.getItem("promoCode");
    const savedDiscount = localStorage.getItem("promoDiscount");

    if (savedPromo) {
      setPromoCode(savedPromo);
      setIsPromoValid(true);
    }

    if (savedDiscount) {
      setPromoDiscount(Number(savedDiscount));
    }
  }, []);

  // Calculate subtotal from cart
  const subtotal =
    typeof cartTotal === "number"
      ? cartTotal
      : cartItems.reduce(
          (sum, item) =>
            sum + (item.product?.best_vendor?.price || 0) * item.quantity,
          0,
        );

  // Calculate shipping
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;

  // Calculate tax
  const tax = subtotal * TAX_RATE;

  // Apply promo code
  const applyPromoCode = (code: string) => {
    // Simple validation for demo purposes
    if (code.toLowerCase() === "robo20") {
      setPromoCode(code);
      setIsPromoValid(true);
      setPromoDiscount(20); // $20 discount

      // Save to localStorage if we're in the browser
      if (mounted) {
        localStorage.setItem("promoCode", code);
        localStorage.setItem("promoDiscount", "20");
      }
    } else if (code.toLowerCase() === "freeship") {
      setPromoCode(code);
      setIsPromoValid(true);
      // This would typically set free shipping, but that's already handled by the threshold
      // Could set a custom value, but we'll use a different approach for this demo
      setPromoDiscount(STANDARD_SHIPPING); // Equivalent to free shipping

      if (mounted) {
        localStorage.setItem("promoCode", code);
        localStorage.setItem("promoDiscount", STANDARD_SHIPPING.toString());
      }
    } else {
      setPromoCode(code);
      setIsPromoValid(false);
      setPromoDiscount(0);

      if (mounted) {
        localStorage.removeItem("promoCode");
        localStorage.removeItem("promoDiscount");
      }
    }
  };

  // Set payment method
  const setPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method);
  };

  // Calculate total
  const total = subtotal + shipping + tax - promoDiscount;

  const value = {
    subtotal,
    shipping,
    tax,
    total,
    promoDiscount,
    promoCode,
    isPromoValid,
    applyPromoCode,
    selectedPaymentMethod,
    setPaymentMethod,
    availablePaymentMethods,
  };

  return (
    <PaymentContext.Provider value={value}>{children}</PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
}
