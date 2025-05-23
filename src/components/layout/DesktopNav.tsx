"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import { FiChevronDown, FiShoppingBag } from "react-icons/fi";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

const DesktopNav: React.FC = () => {
  return (
    <nav className="hidden md:flex items-center space-x-6 justify-end">
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#4DA9FF] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#3d99ef] hover:shadow-lg focus:ring-2 focus:ring-[#4DA9FF]/50 focus:outline-none transition-all text-base"
      >
        <FiShoppingBag className="w-4 h-4" />
        Shop
      </Link>

      <Link
        href="/"
        className="text-gray-700 hover:text-[#4DA9FF] font-medium text-base group relative"
      >
        <span className="relative">
          Home
          <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
        </span>
      </Link>

      <Menu as="div" className="relative">
        {({ open }) => (
          <>
            <MenuButton className="text-gray-700 hover:text-[#4DA9FF] font-medium text-base flex items-center group relative">
              <span className="relative">
                Company
                <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
              </span>
              <FiChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <MenuItems className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200 focus:outline-none">
                <div>
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/about-us"
                        className={`${focus ? "bg-gray-100 text-[#4DA9FF]" : "text-gray-700"} block px-4 py-2 text-sm`}
                      >
                        About Us
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/terms-of-service"
                        className={`${focus ? "bg-gray-100 text-[#4DA9FF]" : "text-gray-700"} block px-4 py-2 text-sm`}
                      >
                        Terms of Service
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/privacy-policy"
                        className={`${focus ? "bg-gray-100 text-[#4DA9FF]" : "text-gray-700"} block px-4 py-2 text-sm`}
                      >
                        Privacy Policy
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem>
                    {({ focus }) => (
                      <Link
                        href="/support"
                        className={`${focus ? "bg-gray-100 text-[#4DA9FF]" : "text-gray-700"} block px-4 py-2 text-sm`}
                      >
                        Support
                      </Link>
                    )}
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </>
        )}
      </Menu>
    </nav>
  );
};

export default DesktopNav;
