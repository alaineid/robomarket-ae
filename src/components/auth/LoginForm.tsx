"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

interface LoginFormProps {
  onSuccess?: () => void;
  onHideModal?: () => void;
}

export default function LoginForm({
  onSuccess,
  onHideModal,
}: LoginFormProps = {}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailValid, setEmailValid] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("rememberMe") === "true";
    if (saved) setRememberMe(true);
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!email) return setEmailValid(true);
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(regex.test(email));
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    if (!emailValid) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Signing in...");

    try {
      const { data, error: supabaseError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (supabaseError) {
        toast.dismiss(loadingToast);
        throw supabaseError;
      }

      if (data?.user) {
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("rememberMe");
        }

        toast.dismiss(loadingToast);
        toast.success("Login successful!");

        if (onSuccess) {
          onSuccess();
        } else {
          router.replace("/");
        }
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      toast.dismiss(loadingToast);

      // Type guard to check if err is an Error object
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please check your credentials and try again.";

      toast.error(errorMessage || "Failed to sign in");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="fixed inset-0 /80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className=" p-4 rounded-xl shadow-lg flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-t-[#4DA9FF] border-r-[#4DA9FF]/30 border-b-[#4DA9FF]/70 border-l-[#4DA9FF]/50 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Signing in...</p>
          </div>
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6">Sign In to Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className={`w-full px-4 py-2 border ${!emailValid ? "border-red-400" : "border-gray-300"} rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF] text-gray-800 text-sm`}
            required
            ref={emailInputRef}
          />
          {!emailValid && (
            <p className="mt-1 text-xs text-red-500">
              Please enter a valid email address.
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <button
              type="button"
              className="text-xs text-[#4DA9FF] hover:text-[#3D89FF]"
              onClick={() => router.push("/auth/reset-password")}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF] text-gray-800 text-sm"
              required
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-[#4DA9FF] rounded border-gray-300 focus:ring-[#4DA9FF]"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-700"
            >
              Remember my credentials
            </label>
          </div>
        </div>

        <div className="text-xs text-gray-600 mb-4 text-center">
          By logging in you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="text-[#4DA9FF] hover:text-[#3D89FF]"
            onClick={onHideModal}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-[#4DA9FF] hover:text-[#3D89FF]"
            onClick={onHideModal}
          >
            Privacy Policy
          </Link>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !emailValid}
            className={`w-full bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg ${
              loading || !emailValid ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {"Don't have an account?"}{" "}
            <Link
              href="/auth/signup"
              className="text-[#4DA9FF] hover:text-[#3D89FF] font-medium"
              onClick={onHideModal}
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <div className="mx-4 text-gray-500 text-sm">or</div>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <button
          type="button"
          onClick={async () => {
            const loadingToast = toast.loading("Signing in with Google...");
            try {
              const { error } = await supabase.auth.signInWithOAuth({
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
              console.error("Unexpected Google sign-in error:", err);
            }
          }}
          className="w-full flex items-center justify-center  border border-gray-300 rounded-lg px-4 py-2.5 text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
        >
          <Image
            src="https://cdn.cdnlogo.com/logos/g/35/google-icon.svg"
            alt="Google logo"
            className="w-5 h-5 mr-2"
            width={16} // Add width
            height={16} // Add height
          />
          Continue with Google
        </button>
      </form>
    </div>
  );
}
