"use client";

import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6 md:px-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About Us Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:underline text-gray-300 hover:text-white transition-colors">Our Story</Link></li>
              <li><Link href="/team" className="hover:underline text-gray-300 hover:text-white transition-colors">Our Team</Link></li>
              <li><Link href="/careers" className="hover:underline text-gray-300 hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="hover:underline text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="hover:underline text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/feedback" className="hover:underline text-gray-300 hover:text-white transition-colors">Feedback</Link></li>
            </ul>
          </div>

          {/* FAQs Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">FAQs</h3>
            <ul className="space-y-2">
              <li><Link href="/faq" className="hover:underline text-gray-300 hover:text-white transition-colors">Common Questions</Link></li>
              <li><Link href="/shipping" className="hover:underline text-gray-300 hover:text-white transition-colors">Shipping Info</Link></li>
              <li><Link href="/returns" className="hover:underline text-gray-300 hover:text-white transition-colors">Returns & Warranty</Link></li>
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h3 className="font-bold text-lg mb-4">Policies</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:underline text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:underline text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/accessibility" className="hover:underline text-gray-300 hover:text-white transition-colors">Accessibility</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo inFooter={true} variant="default" />
            <p className="text-sm text-gray-400 mt-2">&copy; {new Date().getFullYear()} RoboMarket. All rights reserved.</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-gray-700 hover:bg-[#4DA9FF] text-white transition-colors">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-gray-700 hover:bg-[#4DA9FF] text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-gray-700 hover:bg-[#4DA9FF] text-white transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" aria-label="YouTube" className="p-2 rounded-full bg-gray-700 hover:bg-[#4DA9FF] text-white transition-colors">
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}