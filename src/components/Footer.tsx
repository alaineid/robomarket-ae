"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import Logo from './Logo';

export default function Footer() {
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
              <li><Link href="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
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
                <span className="text-gray-400">+971 5X XXX XXXX</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="mr-2 text-[#4DA9FF]" />
                <span className="text-gray-400">hello@robomarket.ae</span>
              </li>
            </ul>
          </div>          
          
          {/* Powered by Algorythm */}
          <div className="flex flex-col items-end justify-center">
            <a 
              href="https://algorythm.ca" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center hover:opacity-80 transition-opacity"
            >
              <p className="text-white mb-2">Powered by</p>
              <div className="relative h-12 w-36">
                <style jsx>{`
                  .white-logo {
                    filter: brightness(0) invert(1);
                    -webkit-filter: brightness(0) invert(1);
                  }
                `}</style>
                <Image 
                  src="/images/Algorythm.png" 
                  alt="Algorythm Logo" 
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                  className="white-logo"
                />
              </div>
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} RoboMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}