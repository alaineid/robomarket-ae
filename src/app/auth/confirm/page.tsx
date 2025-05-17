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

  // Get token parameters from URL
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/login";

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        if (!token || !type) {
          setError("Missing confirmation parameters");
          setIsVerifying(false);
          return;
        }

        if (type !== "signup") {
            setError("Invalid confirmation type");
            setIsVerifying(false);
            return;
        }

        // Verify the user's email
        const supabase = createClient();
        const { error } = await supabase.auth.verifyOtp({
          type: "signup",
          token_hash: token
        });

        if (error) {
          setError(error.message);
          toast.error("Email verification failed: " + error.message);
        } else {
          setVerificationSuccess(true);
          toast.success("Email verified successfully!");
          
          // Optional: redirect after a few seconds
          setTimeout(() => {
            router.push(next);
          }, 5000);
        }
      } catch (err) {
        console.error("Verification error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setIsVerifying(false);
      }
    };

    handleEmailConfirmation();
  }, [token, type, next, router]);

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
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
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
                    Your email has been successfully verified. You can now access all features of your RoboMarket account.
                  </p>
                  <p className="text-sm text-gray-500 mb-8">
                    You will be redirected to login shortly...
                  </p>
                  <Link
                    href="/login"
                    className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DA9FF]"
                  >
                    Go to Login
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
                      Error: {error}
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
                      className="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DA9FF]"
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
