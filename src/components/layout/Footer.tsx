"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import Logo from '@/components/ui/Logo';
import { useModalStore } from '@/store/modalStore';

export default function Footer() {
  const { showLogin } = useModalStore();
  return (
    <footer className="bg-gray-900 text-white">
      {/* Footer content with React Icons instead of Font Awesome */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Logo inFooter={true} className="mb-4" />
            <p className="text-gray-400 mb-4">
              Your trusted marketplace for premium humanoid robots and accessories.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/shop" className="text-gray-400 hover:text-white">Shop</Link></li>
              <li><Link href="/signup" className="text-gray-400 hover:text-white">Sign Up</Link></li>
              <li><button onClick={() => showLogin()} className="text-gray-400 hover:text-white">Account Login</button></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-xl font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white">Support</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-[#4DA9FF]" />
                <span className="text-gray-400">Dubai, UAE</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="mr-2 text-[#4DA9FF]" />
                <span className="text-gray-400">+971 58 563 6277</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-[#4DA9FF]" />
                <span className="text-gray-400">hello@robomarket.ae</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col items-center justify-center">
          <p className="text-gray-400 mb-6">© {new Date().getFullYear()} RoboMarket. All rights reserved.</p>
          
          {/* Powered by Algorythm - repositioned to bottom center */}
          <div className="flex flex-col items-center mt-2">
            <p className="text-gray-400 mb-2">Powered by</p>
            <a 
              href="https://algorythm.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <div className="relative h-10 w-36">
                <Image 
                  src="/images/Algorythm.png" 
                  alt="Algorythm Logo" 
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  sizes="(max-width: 768px) 144px, 144px"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}