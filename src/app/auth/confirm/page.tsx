"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/supabase/client";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineCheckCircle } from "react-icons/ai";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import toast from "react-hot-toast";

export default function EmailConfirmPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const next = searchParams.get("next") || "/shop";
  const urlError = searchParams.get("error");
  const urlErrorCode = searchParams.get("error_code");
  const urlErrorDescription = searchParams.get("error_description");

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        if (urlError || urlErrorCode) {
          const errorMessage = urlErrorDescription
            ? decodeURIComponent(urlErrorDescription.replace(/\+/g, " "))
            : "Verification failed";

          setError(errorMessage);
          toast.error("Email verification failed: " + errorMessage);
          setIsVerifying(false);
          return;
        }

        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log("Session data:", session);

        if (session) {
          setVerificationSuccess(true);
          toast.success("Email verified successfully!");
          setTimeout(() => {
            router.push(next);
          }, 5000);
        } else {
          setError(
            "No active session found. The verification link may be invalid or expired.",
          );
          toast.error(
            "Email verification failed. Please try again or request a new link.",
          );
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [next, router, urlError, urlErrorCode, urlErrorDescription]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <PageHero
          title="Email Verification"
          description="Verifying your account email"
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Verification", href: "/auth/confirm" },
          ]}
        />
        <div className="container mx-auto px-4 py-12 mb-16">
          <div className="max-w-md mx-auto  rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center">
              <div className="mb-6">
                <Image
                  src="/images/robot3.png"
                  alt="Robot Assistant"
                  width={120}
                  height={120}
                  className="object-contain drop-shadow-lg"
                />
              </div>

              {isVerifying ? (
                <div className="text-center">
                  <div className="animate-pulse w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Verifying Your Email
                  </h2>
                  <p className="text-gray-600">
                    Please wait while we verify your email address...
                  </p>
                </div>
              ) : verificationSuccess ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <AiOutlineCheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Email Verified!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your email has been successfully verified. You can now
                    access all features of your RoboMarket account.
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    You will be redirected to the shop shortly...
                  </p>
                  <Link
                    href="/shop"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DA9FF]"
                  >
                    Go to Shop
                  </Link>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-10 h-10 text-red-500"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Verification Failed
                  </h2>
                  <p className="text-gray-600 mb-2">
                    {"We couldn't verify your email address."}
                  </p>
                  {error && (
                    <p className="text-red-600 mb-6 text-sm">
                      {urlErrorCode
                        ? `Error (${urlErrorCode}): ${error}`
                        : `Error: ${error}`}
                    </p>
                  )}
                  <p className="text-gray-600 mb-8">
                    Please try again or contact support if the problem persists.
                  </p>
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/auth/confirmation"
                      className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DA9FF]"
                    >
                      Request New Link
                    </Link>
                    <Link
                      href="/support"
                      className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DA9FF]"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
