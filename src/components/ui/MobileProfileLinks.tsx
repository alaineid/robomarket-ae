"use client";

import React from "react";
import Link from "next/link";
import {
  FiUser,
  FiLogIn,
  FiUserPlus,
  FiShoppingCart,
  FiLogOut,
} from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCart } from "@/stores/cartContext";

interface MobileProfileLinksProps {
  onLinkClick?: () => void;
}

const MobileProfileLinks: React.FC<MobileProfileLinksProps> = ({
  onLinkClick = () => {},
}) => {
  const { user } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();
  const { cartCount } = useCart();

  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.dismiss(loadingToast);
        toast.error("Error logging out. Please try again.");
        console.error("Logout error:", error);
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Successfully logged out!");
      router.push("/");
      onLinkClick();
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred");
      console.error("Unexpected logout error:", err);
    }
  };

  return (
    <div className="flex flex-col space-y-3 py-2">
      {user ? (
        // Logged in user links
        <>
          <div className="border-b border-gray-100 pb-2">
            <p className="text-sm font-medium text-gray-900">
              {user.user_metadata?.full_name || "Account"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          <Link
            href="/account"
            className="flex items-center text-gray-700 hover:text-[#4DA9FF]"
            onClick={onLinkClick}
          >
            <FiUser className="mr-2" /> My Account
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center text-gray-700 hover:text-[#4DA9FF] bg-transparent border-none p-0 cursor-pointer"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </>
      ) : (
        // Not logged in links
        <>
          <Link
            href="/auth/login"
            className="flex items-center text-gray-700 hover:text-[#4DA9FF]"
            onClick={onLinkClick}
          >
            <FiLogIn className="mr-2" /> Login
          </Link>

          <Link
            href="/auth/signup"
            className="flex items-center text-gray-700 hover:text-[#4DA9FF]"
            onClick={onLinkClick}
          >
            <FiUserPlus className="mr-2" /> Sign Up
          </Link>
        </>
      )}

      <Link
        href="/cart"
        className="flex items-center text-gray-700 hover:text-[#4DA9FF]"
        onClick={onLinkClick}
      >
        <FiShoppingCart className="mr-2" /> Cart ({cartCount})
      </Link>
    </div>
  );
};

export default MobileProfileLinks;
