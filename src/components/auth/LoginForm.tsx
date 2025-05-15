"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/components/actions/authActions'; // Adjust the import based on your project structure
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createClient } from '@/supabase/client'; // Import the Supabase client
import { useAuthStore } from '@/store/authStore'; // Import auth store

export default function LoginForm() {
  const router = useRouter();
  const { synchronizeAuthState } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Load saved credentials if they exist
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    if (!acceptTerms) {
      setError('You must accept the Terms of Service and Privacy Policy');
      return;
    }
    
    try {
      setLoading(true);
      
      // Update global auth state to show loading
      useAuthStore.setState({ isLoading: true });
      
      // Save credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
      
      // Create FormData for server action
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      // Call the login action from authActions.ts
      const result = await loginAction(formData);
      
      // If there's an error, display it
      if (result?.error) {
        throw new Error(result.error.message);
      }
      
      // If login was successful, get the current session before navigating
      if (result?.success) {
        // The server action should have created a valid session
        console.log('Login successful, synchronizing auth state');
        
        try {
          // Actively synchronize the auth state to ensure the UI updates immediately
          const user = await synchronizeAuthState();
          
          // Force refresh of the current route to ensure the UI updates
          router.refresh();
          
          // Manually dispatch auth change event to update UI components
          window.dispatchEvent(new Event('supabase-auth-state-changed'));
          
          console.log('Auth state synchronized, redirecting to shop');
          // Navigate to the shop page after authentication is confirmed
          router.push('/shop');
        } catch (syncError) {
          console.error('Error synchronizing auth state after login:', syncError);
          setError('Successfully logged in but had trouble loading your profile. Redirecting...');
          // Still try to navigate after a short delay, even if synchronization fails
          setTimeout(() => {
            router.push('/shop');
          }, 2000);
        }
      } else {
        // No explicit error but also no success
        setError('Login response was invalid. Please try again.');
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.');
      // Reset global auth loading state
      useAuthStore.setState({ isLoading: false });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        throw resetError;
      }

      alert('Password reset link sent to your email');
    } catch (err: unknown) {
      console.error('Reset password error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reset password email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md relative">
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
          <div className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4DA9FF] mb-3"></div>
            <p className="text-gray-700 font-medium">Logging in...</p>
            <p className="text-xs text-gray-500 mt-1">Please wait while we verify your credentials</p>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#4DA9FF] hover:text-[#3D89FF] font-medium"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent"
              placeholder="Enter your password"
              required
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
        </div>
        
        {/* Remember me checkbox */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 accent-[#4DA9FF] rounded border-gray-300 text-[#4DA9FF] focus:ring-[#4DA9FF]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember my credentials
            </label>
          </div>
        </div>
        
        {/* Terms and Privacy Policy checkbox */}
        <div className="flex items-start mb-4">
          <input
            id="accept-terms"
            name="accept-terms"
            type="checkbox"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
            className="h-4 w-4 accent-[#4DA9FF] rounded border-gray-300 text-[#4DA9FF] focus:ring-[#4DA9FF] mt-1"
          />
          <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-700">
            I agree to the <Link href="/terms" className="text-[#4DA9FF] hover:text-[#3D89FF] font-medium">Terms of Service</Link> and <Link href="/privacy" className="text-[#4DA9FF] hover:text-[#3D89FF] font-medium">Privacy Policy</Link>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Please wait...' : 'Log In'}
        </button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-[#4DA9FF] hover:text-[#3D89FF] font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}