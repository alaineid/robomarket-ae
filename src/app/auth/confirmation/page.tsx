"use client";

import Image from "next/image";
import Link from "next/link";
import { AiOutlineCheck } from "react-icons/ai";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import ResendVerification from "@/components/auth/ResendVerification";

// Metadata is handled by layout.tsx in client components
export default function ConfirmationPage({
  searchParams,
}: {
  searchParams: { email: string };
}) {
  const email = searchParams.email || "";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <PageHero
          title="Email Verification"
          description="Please verify your email to complete your RoboMarket registration"
          breadcrumbItems={[
            { label: "Home", href: "/" },
            { label: "Sign Up", href: "/signup" },
            { label: "Confirmation", href: "/auth/confirmation" },
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

              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <AiOutlineCheck className="h-8 w-8 text-green-600" />
              </div>

              <h2 className="mt-2 text-center text-2xl font-bold text-gray-900">
                Check your email
              </h2>

              <div className="mt-4 text-center">
                <p className="text-gray-600">
                  We sent a verification link to:
                </p>
                <p className="font-medium text-gray-800 mt-1">{email}</p>
              </div>

              <div className="mt-6 text-center text-sm">
                <p className="text-gray-600">
                  Click the link in the email to verify your account and complete the
                  registration process.
                </p>
              </div>

              <div className="mt-8 text-center text-sm">
                <p className="text-gray-600">
                  Didn't receive an email?{" "}
                  <ResendVerification email={email} />
                </p>
              </div>

              <div className="mt-8 w-full">
                <Link
                  href="/login"
                  className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4DA9FF]"
                >
                  Go to login
                </Link>
              </div>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Return to home page
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
