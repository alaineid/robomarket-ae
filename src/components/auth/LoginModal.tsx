"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import LoginForm from './LoginForm';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';

export default function LoginModal() {
  const { isLoginOpen, hideLogin } = useModalStore();
  const { synchronizeAuthState } = useAuthStore();
  
  // Handler for when modal closes
  const handleHideLogin = () => {
    // Ensure loading state is reset when modal is closed
    useAuthStore.setState({ isLoading: false });
    hideLogin();
  };

  // Handler for successful login
  const handleLoginSuccess = async () => {
    await synchronizeAuthState();
    hideLogin();
  };

  if (!isLoginOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleHideLogin}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative p-6">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              onClick={handleHideLogin}
              aria-label="Close login modal"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
            
            <LoginForm onSuccess={handleLoginSuccess} onHideModal={handleHideLogin} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
