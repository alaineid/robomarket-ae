"use client";

import { useState, useEffect, FormEvent } from "react";
import * as EmailValidator from "email-validator";
import zxcvbn from "zxcvbn";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Check email validity on change
  useEffect(() => {
    if (email) {
      setEmailValid(EmailValidator.validate(email));
    } else {
      setEmailValid(true); // Don't show error when field is empty
    }
  }, [email]);

  // Check password strength and requirements on change
  useEffect(() => {
    if (password) {
      // Check zxcvbn strength
      const result = zxcvbn(password);
      setPasswordStrength(result.score); // 0-4 (0=weak, 4=strong)

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

    // Form validation
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!EmailValidator.validate(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Check password requirements
    if (!hasMinLength || !hasSpecialChar || !hasCapital || !hasNumber) {
      setError("Your password must meet all the requirements listed below");
      return;
    }

    if (passwordStrength < 2) {
      setError("Password is too weak. Please choose a stronger password.");
      return;
    }

    // Show loading toast while signing up
    const loadingToast = toast.loading("Creating your account...");
    
    try {
      // Sign up the user with Supabase
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/confirm`
        },
      });

      // Handle any errors from Supabase
      if (error) {
        toast.dismiss(loadingToast);
        console.error("Signup error:", error);
        setError(error.message);
        return;
      }

      // Success! Show confirmation message and redirect
      toast.dismiss(loadingToast);
      toast.success("Account created successfully! Please check your email for verification.");
      
      // Redirect to confirmation page
      router.push("/auth/confirmation?email=" + encodeURIComponent(email));
    } catch (err) {
      toast.dismiss(loadingToast);
      console.error("Unexpected error during signup:", err);
      setError("An unexpected error occurred. Please try again.");
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
    <div className="bg-white p-8 rounded-lg shadow-md">
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
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name
          </label>
          <input
            id="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent"
            placeholder="Enter your first name"
            required
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
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent"
            placeholder="Enter your last name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-2 border ${!emailValid && email ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent`}
            placeholder="Enter your email"
            required
          />
          {!emailValid && email && (
            <p className="text-xs text-red-600 mt-1">
              Please enter a valid email address
            </p>
          )}
        </div>

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
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent"
              placeholder="Create a password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
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
                      className={`mr-2 text-${hasMinLength ? "green" : "gray"}-500`}
                    >
                      {hasMinLength ? "✓" : "○"}
                    </span>
                    At least 8 characters
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 text-${hasCapital ? "green" : "gray"}-500`}
                    >
                      {hasCapital ? "✓" : "○"}
                    </span>
                    At least 1 uppercase letter
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 text-${hasNumber ? "green" : "gray"}-500`}
                    >
                      {hasNumber ? "✓" : "○"}
                    </span>
                    At least 1 number
                  </li>
                  <li className="flex items-center">
                    <span
                      className={`mr-2 text-${hasSpecialChar ? "green" : "gray"}-500`}
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
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-2 border ${
                confirmPassword && password !== confirmPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent`}
              placeholder="Confirm your password"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center"
        >
          Sign Up
        </button>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => router.push("/login")}
              className="text-[#4DA9FF] hover:text-[#3D89FF] font-medium">
              Log In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
