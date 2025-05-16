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
    try {
      console.log('LoginModal: handleHideLogin called');
      
      // Ensure loading state is reset when modal is closed
      useAuthStore.setState({ isLoading: false });
      
      // Hide the login modal
      console.log('LoginModal: Calling hideLogin');
      hideLogin();
      
      console.log('LoginModal: Modal should now be closed');
    } catch (error) {
      console.error('Error in handleHideLogin:', error);
      // Try again if there was an error
      hideLogin();
    }
  };

  // Handler for successful login
  const handleLoginSuccess = async () => {
    try {
      console.log('LoginModal: handleLoginSuccess called');
      
      // We'll immediately hide the modal instead of waiting
      console.log('LoginModal: Hiding login modal');
      hideLogin();
      
      console.log('LoginModal: Login successful, modal closed');
    } catch (error) {
      console.error('Error handling login success:', error);
      // Still hide the modal even if there's an error
      hideLogin();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoginOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleHideLogin}
        >
          <motion.div
            key="modal-content"
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
      )}
    </AnimatePresence>
  );
}
