"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import {
  FiHome,
  FiShoppingBag,
  FiUser,
  FiShoppingCart,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore";
import { useCart } from "@/stores/cartContext";
import MobileProfileLinks from "../ui/MobileProfileLinks";

const drawerLinks = [
  { href: "/about-us", label: "About Us" },
  { href: "/terms-of-service", label: "Terms of Service" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/support", label: "Support" },
];

export default function MobileNav() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useAuthStore();
  const { cartCount } = useCart(); // Get cart count from context

  // Dynamic navigation items based on authentication state
  const navItems = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/shop", label: "Shop", icon: FiShoppingBag },
    {
      href: user ? "/account" : "/auth/login",
      label: "Account",
      icon: FiUser,
    },
    { href: "/cart", label: "Cart", icon: FiShoppingCart, badge: cartCount },
  ];

  return (
    <>
      {/* Hamburger menu (top-right) */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden p-2 text-gray-700 hover:text-[#4DA9FF]"
        aria-label="Open menu"
        onClick={() => setDrawerOpen(true)}
        type="button"
      >
        <FiMenu size={24} />
      </button>

      {/* Side Drawer */}
      <Transition show={drawerOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={setDrawerOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex justify-end">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative w-80 max-w-xs bg-white h-full shadow-xl flex flex-col">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Menu
                    </h2>
                    <button
                      className="text-gray-500 hover:text-[#4DA9FF] transition-colors"
                      aria-label="Close menu"
                      onClick={() => setDrawerOpen(false)}
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                </div>
                <nav className="flex-1 p-6 overflow-y-auto">
                  {/* Profile Links - Conditional based on auth state */}
                  <div className="mb-6">
                    <MobileProfileLinks
                      onLinkClick={() => setDrawerOpen(false)}
                    />
                  </div>

                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Shop Now Button */}
                  <Link
                    href="/shop"
                    className="flex items-center justify-center w-full py-3 px-4 bg-[#4DA9FF] text-white rounded-lg font-medium hover:bg-[#3d99ef] transition-colors mb-4"
                    onClick={() => setDrawerOpen(false)}
                  >
                    <FiShoppingBag className="mr-2" size={18} />
                    Shop Now
                  </Link>

                  {/* Separator */}
                  <div className="border-t border-gray-100 my-4"></div>

                  {/* Regular navigation links */}
                  {drawerLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center py-3 px-2 rounded-lg text-base font-medium transition-colors border-l-4 ${
                        pathname === item.href
                          ? "border-[#4DA9FF] bg-[#4DA9FF]/5 text-[#4DA9FF]"
                          : "border-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-200"
                      }`}
                      onClick={() => setDrawerOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="p-6 border-t border-gray-100">
                  {/* Footer content if needed */}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex justify-around items-center h-16 md:hidden shadow-t transition-all">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? "text-[#4DA9FF]"
                  : "text-gray-500 hover:text-[#4DA9FF]"
              }`}
              aria-label={item.label}
            >
              <div className="relative">
                <Icon size={22} />
                {item.label === "Cart" && (
                  <span className="absolute -top-1 -right-2 bg-gradient-to-r from-[#4DA9FF] to-[#3d99ef] text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-semibold shadow-sm transform transition-all duration-300 hover:scale-110">
                    {item.badge}
                  </span>
                )}
                {item.label === "Account" && user && (
                  <span
                    className="absolute -top-1 -right-2 h-2 w-2 rounded-full bg-green-500"
                    title="Logged in"
                  ></span>
                )}
              </div>
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
