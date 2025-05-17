"use client";

import { FC } from "react";
import { createClient } from "@/supabase/client";
import toast from "react-hot-toast";

interface ResendVerificationProps {
  email?: string;
}

const ResendVerification: FC<ResendVerificationProps> = ({ email }) => {
  const supabase = createClient();

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address is missing. Please try signing up again.");
      return;
    }

    const loadingToast = toast.loading("Sending verification email...");

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        }
      });

      if (error) {
        toast.dismiss(loadingToast);
        toast.error(error.message);
        return;
      }

      toast.dismiss(loadingToast);
      toast.success("Verification email sent! Please check your inbox.");
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error("Failed to send verification email. Please try again later.");
      console.error("Error sending verification email:", err);
    }
  };

  return (
    <button
      onClick={handleResend}
      className="font-medium text-[#4DA9FF] hover:text-[#3D89FF]"
    >
      Resend verification email
    </button>
  );
};

export default ResendVerification;
