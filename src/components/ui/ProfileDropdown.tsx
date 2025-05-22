"use client";

import React, { Fragment } from "react";
import Link from "next/link";
import { FiUser, FiLogIn, FiUserPlus, FiLogOut } from "react-icons/fi";
import { useAuthStore } from "@/stores/authStore";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";

const ProfileDropdown: React.FC = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const loadingToast = toast.loading("Logging out...");

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast.dismiss(loadingToast);
        toast.error("Error logging out. Please try again.");
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Successfully logged out!");
      router.push("/");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Menu as="div" className="relative">
      {({}) => (
        <>
          <MenuButton
            className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 group"
            aria-label="Account"
          >
            <div className="relative">
              <FiUser className="text-2xl transform group-hover:scale-110 transition-transform duration-200" />
              {user && (
                <span
                  className="absolute top-1 right-0 translate-x-1/2 -translate-y-1/2 bg-green-500 text-white text-xs rounded-full w-2 h-2 flex items-center justify-center shadow-sm transition-all duration-200 group-hover:scale-110"
                  title="Logged in"
                ></span>
              )}
              <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
            </div>
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
            <MenuItems className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-lg border border-gray-100 focus:outline-none z-50">
              {user ? (
                <>
                  {/* User info section */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.full_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>

                  {/* Menu options */}
                  <div className="py-2">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          href="/account"
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 ${
                            focus ? "bg-gray-50" : ""
                          }`}
                        >
                          <FiUser className="mr-2" /> My Account
                        </Link>
                      )}
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 ${
                            focus ? "bg-gray-50" : ""
                          }`}
                          onClick={handleLogout}
                        >
                          <FiLogOut className="mr-2" /> Logout
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </>
              ) : (
                <>
                  <div className="py-2">
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          href="/auth/login"
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 ${
                            focus ? "bg-gray-50" : ""
                          }`}
                        >
                          <FiLogIn className="mr-2" /> Login
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ focus }) => (
                        <Link
                          href="/auth/signup"
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 ${
                            focus ? "bg-gray-50" : ""
                          }`}
                        >
                          <FiUserPlus className="mr-2" /> Sign Up
                        </Link>
                      )}
                    </MenuItem>
                    <div className="border-t border-gray-100 my-1"></div>
                    <MenuItem>
                      {({ focus }) => (
                        <button
                          onClick={async () => {
                            const loadingToast = toast.loading(
                              "Signing in with Google...",
                            );
                            try {
                              const { error } =
                                await supabase.auth.signInWithOAuth({
                                  provider: "google",
                                  options: {
                                    redirectTo: `${window.location.origin}`,
                                  },
                                });

                              if (error) {
                                toast.dismiss(loadingToast);
                                toast.error(error.message);
                                console.error("Google sign-in error:", error);
                              }
                            } catch (err) {
                              toast.dismiss(loadingToast);
                              toast.error("Failed to sign in with Google");
                              console.error(
                                "Unexpected Google sign-in error:",
                                err,
                              );
                            }
                          }}
                          className={`flex items-center px-4 py-2 text-sm text-gray-700 ${
                            focus ? "bg-gray-50" : ""
                          } w-full`}
                        >
                          <Image
                            src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
                            alt="Google logo"
                            className="w-4 h-4 mr-2"
                            width={16}
                            height={16}
                          />
                          Sign in with Google
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </>
              )}
            </MenuItems>
          </Transition>
        </>
      )}
    </Menu>
  );
};

export default ProfileDropdown;
