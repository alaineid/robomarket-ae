"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import * as EmailValidator from "email-validator";
import zxcvbn from "zxcvbn";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClient();

  // Define the checkEmailExists function at the very beginning to avoid reference issues
  const checkEmailExists = useCallback(
    async (emailToCheck: string): Promise<boolean> => {
      try {
        const response = await fetch("/api/check-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: emailToCheck }),
        });

        if (!response.ok) {
          throw new Error("Failed to check email");
        }

        const { exists } = await response.json();
        return exists;
      } catch (err) {
        console.error("Error checking email:", err);
        return false; // Default to not existing in case of error
      }
    },
    [],
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFeedback, setPasswordFeedback] = useState<string[]>([]);

  // Password requirements validation
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [hasCapital, setHasCapital] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasMinLength, setHasMinLength] = useState(false);

  // Validate email as user types
  const [emailValid, setEmailValid] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Check email validity and existence on change
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (email) {
      setEmailValid(EmailValidator.validate(email));

      // Only check with API if email format is valid
      if (EmailValidator.validate(email)) {
        // Debounce the API call - only check after 500ms of no typing
        setCheckingEmail(true);
        timeoutId = setTimeout(async () => {
          try {
            const exists = await checkEmailExists(email);
            setEmailExists(exists);
          } catch (error) {
            console.error("Error checking email:", error);
          } finally {
            setCheckingEmail(false);
          }
        }, 500);
      }
    } else {
      setEmailValid(true); // Don't show error when field is empty
      setEmailExists(false);
    }

    // Cleanup function to clear the timeout
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [email, checkEmailExists]);

  // Check password strength and requirements on change
  useEffect(() => {
    if (password) {
      // Check zxcvbn strength
      const result = zxcvbn(password);
      setPasswordStrength(result.score); // (0=weak, 4=strong)

      // Prepare feedback for user
      const feedback = [];
      if (result.feedback.warning) {
        feedback.push(result.feedback.warning);
      }
      if (result.feedback.suggestions.length > 0) {
        feedback.push(...result.feedback.suggestions);
      }
      setPasswordFeedback(feedback);

      // Check specific requirements
      setHasSpecialChar(/[^A-Za-z0-9]/.test(password));
      setHasCapital(/[A-Z]/.test(password));
      setHasNumber(/[0-9]/.test(password));
      setHasMinLength(password.length >= 8);
    } else {
      setPasswordStrength(0);
      setPasswordFeedback([]);
      setHasSpecialChar(false);
      setHasCapital(false);
      setHasNumber(false);
      setHasMinLength(false);
    }
  }, [password]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Form validation
      if (!firstName || !lastName || !email || !password) {
        setError("All fields are required");
        setIsLoading(false);
        return;
      }

      if (!EmailValidator.validate(email)) {
        setError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      // Check password requirements
      if (!hasMinLength || !hasSpecialChar || !hasCapital || !hasNumber) {
        setError("Your password must meet all the requirements listed below");
        setIsLoading(false);
        return;
      }

      if (passwordStrength < 2) {
        setError("Password is too weak. Please choose a stronger password.");
        setIsLoading(false);
        return;
      }

      // Check if email already exists
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        setError("This email is already registered. Please log in instead.");
        setIsLoading(false);
        return;
      }

      // Show loading toast while signing up
      const loadingToast = toast.loading("Creating your account...");

      // Sign up the user with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      // Handle any errors from Supabase
      if (error) {
        toast.dismiss(loadingToast);
        console.error("Signup error:", error);
        setError(error.message);
        setIsLoading(false);
        return;
      }

      // Success! Show confirmation message and redirect
      toast.dismiss(loadingToast);
      toast.success(
        "Account created successfully! Please check your email for verification.",
      );

      // Redirect to confirmation page
      router.push("/auth/confirmation?email=" + encodeURIComponent(email));
    } catch (err) {
      console.error("Unexpected error during signup:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Helper function to get password strength color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-gray-300";
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  // Helper function to get password strength text
  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "";
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Register Your Account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF] "
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF] "
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              className={`w-full px-4 py-2 border ${
                (!emailValid && email) || emailExists
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF] `}
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {checkingEmail && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-gray-400 border-r-transparent"></span>
              </div>
            )}
          </div>
          {!emailValid && email && (
            <p className="text-xs text-red-600 mt-1">
              Please enter a valid email address
            </p>
          )}
          {emailValid && emailExists && email && (
            <p className="text-xs text-red-600 mt-1">
              This email is already registered.{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="text-[#4DA9FF] hover:text-[#3D89FF] underline"
              >
                Log in instead
              </button>
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF]  pr-10"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400 hover:text-gray-500" />
              ) : (
                <FiEye className="text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>

          {/* Password strength indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className={`h-full rounded-full ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength + 1) * 20}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium text-gray-700">
                  {getPasswordStrengthText()}
                </span>
              </div>

              {/* Password requirements checklist */}
              <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-100">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Password must contain:
                </p>
                <ul className="text-xs space-y-1">
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${hasMinLength ? "text-green-500" : "text-gray-500"}`}
                    >
                      {hasMinLength ? "✓" : "○"}
                    </span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${hasCapital ? "text-green-500" : "text-gray-500"}`}
                    >
                      {hasCapital ? "✓" : "○"}
                    </span>
                    At least 1 uppercase letter
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${hasNumber ? "text-green-500" : "text-gray-500"}`}
                    >
                      {hasNumber ? "✓" : "○"}
                    </span>
                    At least 1 number
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 ${hasSpecialChar ? "text-green-500" : "text-gray-500"}`}
                    >
                      {hasSpecialChar ? "✓" : "○"}
                    </span>
                    At least 1 special character
                  </li>
                </ul>
              </div>

              {/* Password feedback from zxcvbn */}
              {passwordFeedback.length > 0 && (
                <div className="mt-2">
                  <ul className="text-xs text-amber-700 mt-1 list-disc pl-4">
                    {passwordFeedback.map((feedback, index) => (
                      <li key={index}>{feedback}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              className={`w-full px-4 py-2 border ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF]  pr-10`}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="text-gray-400 hover:text-gray-500" />
              ) : (
                <FiEye className="text-gray-400 hover:text-gray-500" />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || emailExists || checkingEmail}
            className="w-full bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em]"></span>
                Processing...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/auth/login")}
              className="text-[#4DA9FF] hover:text-[#3D89FF] font-medium"
            >
              Sign in
            </button>
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
