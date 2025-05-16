"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAction } from '@/components/actions/authActions'; // Adjust the import based on your project structure
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { createClient } from '@/supabase/client'; // Import the Supabase client
import { useAuthStore } from '@/store/authStore'; // Import auth store

interface LoginFormProps {
  onSuccess?: () => void;
  onHideModal?: () => void;
}

export default function LoginForm({ onSuccess, onHideModal }: LoginFormProps = {}) {
  const router = useRouter();
  const { synchronizeAuthState } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginComplete, setLoginComplete] = useState(false);

  // Simple effect to load saved credentials and reset loading state
  useEffect(() => {
    // Load saved credentials if they exist
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }

    // Reset loading state
    setLoading(false);
    useAuthStore.setState({ isLoading: false });
  }, []);

  // Effect to handle post-login UI updates
  useEffect(() => {
    // This effect handles closing the modal after successful login
    if (loginComplete) {
      console.log('LoginForm: Detected login complete state, cleaning up');
      
      // Delay to ensure other processes complete
      const timer = setTimeout(() => {
        try {
          // Close the modal if we have a handler
          if (onHideModal) {
            console.log('LoginForm: Calling onHideModal from useEffect');
            onHideModal();
          }
        } catch (error) {
          console.error('Error closing modal:', error);
        } finally {
          // Always reset the login complete flag
          setLoginComplete(false);
        }
      }, 500); // Longer timeout to ensure state updates complete
      
      return () => clearTimeout(timer);
    }
  }, [loginComplete, onHideModal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    try {
      // Start loading state
      setLoading(true);
      useAuthStore.setState({ isLoading: true });
      
      // Handle remember me functionality
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

      // Call the login action
      console.log('LoginForm: Calling loginAction');
      const result = await loginAction(formData);
      console.log('LoginForm: loginAction result:', result);
      
      if (result?.error) {
        // Handle error without throwing (to prevent redirection)
        setError(result.error.message);
        // Reset loading states
        setLoading(false);
        useAuthStore.setState({ isLoading: false });
        return;
      }
      
      if (result?.success) {
        console.log('LoginForm: Login successful');
        try {
            // Reset loading states immediately
            setLoading(false);
            useAuthStore.setState({ isLoading: false });
            console.log('LoginForm: Loading states reset');
            
            // Sync auth state
            console.log('LoginForm: Synchronizing auth state');
            await synchronizeAuthState();
            
            // Mark login as complete to trigger useEffect
            console.log('LoginForm: Setting loginComplete to true');
            setLoginComplete(true);
            
            // Call onSuccess callback if provided (for any post-login actions)
            if (onSuccess) {
              console.log('LoginForm: Calling onSuccess callback');
              onSuccess();
            }
        } catch (syncError) {
          console.error('Error during auth synchronization:', syncError);
          // Reset loading states in case of error
          setLoading(false);
          useAuthStore.setState({ isLoading: false });
          
          // Still try to close the modal
          if (onHideModal) {
            onHideModal();
          }
        }
      } else {
        setError('Login failed. Please try again.');
        // Reset loading states
        setLoading(false);
        useAuthStore.setState({ isLoading: false });
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign in. Please check your credentials.');
      // Reset loading states
      setLoading(false);
      useAuthStore.setState({ isLoading: false });
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
            <div className="w-12 h-12 border-4 border-t-[#4DA9FF] border-r-[#4DA9FF]/30 border-b-[#4DA9FF]/70 border-l-[#4DA9FF]/50 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-700">Signing in...</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF] text-gray-800 text-sm"
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
              className="text-xs text-[#4DA9FF] hover:text-[#3D89FF]"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#4DA9FF] focus:border-[#4DA9FF] text-gray-800 text-sm"
              required
            />
            <button
              type="button"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
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
              className="h-4 w-4 accent-[#4DA9FF] rounded border-gray-300 text-[#4DA9FF] focus:ring-[#4DA9FF]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember my credentials
            </label>
          </div>
        </div>
        
        {/* Terms and Privacy Policy links */}
        <div className="text-xs text-gray-600 mb-4 text-center">
          By logging in you agree to our{' '}
          <Link 
            href="/terms" 
            className="text-[#4DA9FF] hover:text-[#3D89FF]"
            onClick={onHideModal}
          >
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link 
            href="/privacy" 
            className="text-[#4DA9FF] hover:text-[#3D89FF]"
            onClick={onHideModal}
          >
            Privacy Policy
          </Link>
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
            <Link 
              href="/signup" 
              className="text-[#4DA9FF] hover:text-[#3D89FF] font-medium"
              onClick={onHideModal}
            >
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}