"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header id="header" className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-300">
      <nav className="container mx-auto px-4 py-4 lg:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Logo 
            href="/" 
            onClick={scrollToTop}
            variant={isMobileView ? 'compact' : 'default'}
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/shop" className="text-gray-600 hover:text-[#4DA9FF] font-medium transition duration-200">
              Shop Robots
            </Link>
            <Link href="/new-arrivals" className="text-gray-600 hover:text-[#4DA9FF] font-medium transition duration-200">
              New Arrivals
            </Link>
            <Link href="/support" className="text-gray-600 hover:text-[#4DA9FF] font-medium transition duration-200">
              Support
            </Link>
            
            {/* Search Bar */}
            <div className="bg-gray-100 rounded-full px-3 py-2 w-64 flex items-center">
              <input 
                type="text" 
                placeholder="Search robots..." 
                className="bg-transparent w-full focus:outline-none text-sm"
              />
              <button aria-label="Search">
                <i className="fas fa-search text-gray-500"></i>
              </button>
            </div>

            {/* Account & Cart */}
            <div className="flex space-x-4 ml-4">
              <button aria-label="User Account" className="text-gray-700 hover:text-[#4DA9FF] transition-colors">
                <i className="fas fa-user text-xl"></i>
              </button>
              <button aria-label="Shopping Cart" className="text-gray-700 hover:text-[#4DA9FF] transition-colors">
                <i className="fas fa-shopping-cart text-xl"></i>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              className="text-gray-700 hover:text-[#4DA9FF] focus:outline-none p-2 rounded-md" 
              aria-label="Toggle Menu" 
              aria-expanded={isMobileMenuOpen}
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <i className="fas fa-times text-xl"></i>
              ) : (
                <i className="fas fa-bars text-xl"></i>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Panel */}
        <div 
          className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-200 overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'max-h-[500px] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-4 px-4 pt-4 pb-5">
            <div className="bg-gray-100 rounded-lg px-3 py-2 mb-2">
              <input 
                type="text" 
                placeholder="Search robots..." 
                className="bg-transparent w-full focus:outline-none text-sm"
              />
            </div>
          
            <Link href="/shop" className="block text-gray-600 hover:text-[#4DA9FF] py-2 font-medium">
              Shop Robots
            </Link>
            <Link href="/new-arrivals" className="block text-gray-600 hover:text-[#4DA9FF] py-2 font-medium">
              New Arrivals
            </Link>
            <Link href="/support" className="block text-gray-600 hover:text-[#4DA9FF] py-2 font-medium">
              Support
            </Link>
            
            <div className="flex space-x-4 pt-2">
              <Link href="/account" className="flex items-center text-gray-600 hover:text-[#4DA9FF]">
                <i className="fas fa-user mr-2"></i>
                My Account
              </Link>
              <Link href="/cart" className="flex items-center text-gray-600 hover:text-[#4DA9FF]">
                <i className="fas fa-shopping-cart mr-2"></i>
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}