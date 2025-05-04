"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { FaSearch, FaUserCircle, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Search robots..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-700 w-56 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:bg-white transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>

            {/* Account & Cart */}
            <div className="flex space-x-4 ml-4">
              <Link href="/account" className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200">
                <FaUserCircle className="text-2xl" />
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 relative">
                <FaShoppingCart className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-[#4DA9FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
              </Link>
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
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
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
                <FaUserCircle className="mr-2" />
                My Account
              </Link>
              <Link href="/cart" className="flex items-center text-gray-600 hover:text-[#4DA9FF]">
                <FaShoppingCart className="mr-2" />
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}