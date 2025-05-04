"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { FaSearch, FaUserCircle, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // Set initial values
    handleResize();
    handleScroll();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
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
    <header 
      id="header" 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' 
          : 'bg-white/90 py-4'
      }`}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-[#4DA9FF]"></div>
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Logo 
            href="/" 
            onClick={scrollToTop}
            variant={isMobileView ? 'compact' : 'default'}
            className={`transition-all duration-300 ${isScrolled ? 'scale-95' : ''}`}
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/shop" className="text-gray-700 hover:text-[#4DA9FF] font-medium relative group transition duration-200">
              Shop Robots
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/new-arrivals" className="text-gray-700 hover:text-[#4DA9FF] font-medium relative group transition duration-200">
              New Arrivals
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-[#4DA9FF] font-medium relative group transition duration-200">
              Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {/* Search Bar */}
            <div className="relative hidden sm:block group">
              <input
                type="text"
                placeholder="Search robots..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 text-gray-700 w-56 group-hover:w-64 focus:w-72 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:bg-white transition-all duration-300 ease-in-out"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-[#4DA9FF] transition-colors duration-300" />
            </div>

            {/* Account & Cart */}
            <div className="flex space-x-6 ml-4">
              <Link href="/account" className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 group">
                <div className="relative">
                  <FaUserCircle className="text-2xl transform group-hover:scale-110 transition-transform duration-200" />
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </div>
              </Link>
              <Link href="/cart" className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 relative group">
                <div className="relative">
                  <FaShoppingCart className="text-2xl transform group-hover:scale-110 transition-transform duration-200" />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-[#4DA9FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110">0</span>
                  <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                </div>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              className="text-gray-700 hover:text-[#4DA9FF] focus:outline-none p-2 rounded-md transition-transform duration-200 hover:scale-110" 
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
          className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'max-h-[500px] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col space-y-4 px-4 pt-4 pb-5">
            <div className="bg-gray-100 rounded-lg px-3 py-2 mb-2 flex items-center">
              <FaSearch className="text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search robots..." 
                className="bg-transparent w-full focus:outline-none text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          
            <Link href="/shop" className="block text-gray-700 hover:text-[#4DA9FF] py-2 font-medium border-b border-gray-100">
              Shop Robots
            </Link>
            <Link href="/new-arrivals" className="block text-gray-700 hover:text-[#4DA9FF] py-2 font-medium border-b border-gray-100">
              New Arrivals
            </Link>
            <Link href="/support" className="block text-gray-700 hover:text-[#4DA9FF] py-2 font-medium border-b border-gray-100">
              Support
            </Link>
            
            <div className="flex space-x-4 pt-2">
              <Link href="/account" className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors px-3 py-2 rounded-full hover:bg-blue-50">
                <FaUserCircle className="mr-2" />
                My Account
              </Link>
              <Link href="/cart" className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors px-3 py-2 rounded-full hover:bg-blue-50">
                <div className="relative mr-2">
                  <FaShoppingCart />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-[#4DA9FF] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">0</span>
                </div>
                Cart
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}