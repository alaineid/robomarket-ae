"use client";

import React from 'react';
import Link from 'next/link';
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
            <h3 className="text-xl font-bold mb-4">RoboMarket</h3>
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
                <span className="text-gray-400">info@robomarket.ae</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-gray-800 text-white p-2 rounded-l focus:outline-none flex-grow"
                />
                <button 
                  type="submit" 
                  className="bg-[#4DA9FF] hover:bg-[#3B8CD9] text-white p-2 rounded-r"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400">
          <p>© {new Date().getFullYear()} RoboMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}