"use client";

import { useState } from 'react';
import Link from 'next/link';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface LoginFormProps {
  onSuccess?: () => void;
  onHideModal?: () => void;
}

export default function LoginForm({ onSuccess, onHideModal }: LoginFormProps = {}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted:', { email, password, rememberMe });
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
            {"Don't have an account?"}{' '}
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