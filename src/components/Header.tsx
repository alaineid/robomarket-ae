"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { FaSearch, FaUserCircle, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '@/utils/cartContext';

export default function Header() {
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Touch gesture handling
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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

  // Use a dedicated effect for touch event handling
  useEffect(() => {
    if (!isMobileMenuOpen || !mobileMenuRef.current) return;
    
    let initialY = 0;
    let isSwiping = false;
    
    // Using window-level event listeners instead of React's passive events
    const handleTouchStart = (e: TouchEvent) => {
      if (!mobileMenuRef.current?.contains(e.target as Node)) return;
      
      initialY = e.touches[0].clientY;
      touchStartRef.current = initialY;
      isSwiping = false;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      // Only track touches that started inside our menu
      if (!touchStartRef.current || !mobileMenuRef.current?.contains(e.target as Node)) return;
      
      const currentY = e.touches[0].clientY;
      const touchDiff = touchStartRef.current - currentY;
      
      // Start detecting swipe at the beginning of the gesture
      if (Math.abs(touchDiff) > 10 && !isSwiping) {
        isSwiping = true;
      }
      
      // Only try to prevent default if we've detected a clear upward swipe gesture
      // and if the event is still cancelable (not already scrolling)
      if (touchDiff > 10 && isSwiping && e.cancelable) {
        e.preventDefault();
      }
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || !mobileMenuRef.current?.contains(e.target as Node)) return;
      
      touchEndRef.current = e.changedTouches[0].clientY;
      
      // Calculate the distance of the swipe
      const touchDiff = touchStartRef.current - touchEndRef.current;
      
      // If swipe distance is significant and direction is upward, close the menu
      if (touchDiff > 30) {
        setIsMobileMenuOpen(false);
      }
      
      // Reset touch coordinates
      touchStartRef.current = null;
      touchEndRef.current = null;
      isSwiping = false;
    };
    
    // Add event listeners with the non-passive option for touchmove
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // Clean up
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen]);

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
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-[#4DA9FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-110">
                      {cartCount}
                    </span>
                  )}
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

        {/* Mobile Menu Panel with swipe gesture support */}
        <div 
          ref={mobileMenuRef}
          className={`lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200 overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen 
              ? 'max-h-[500px] opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          {/* Swipe indicator when menu is open */}
          {isMobileMenuOpen && (
            <div className="w-20 h-1.5 bg-gray-300 rounded-full mx-auto mt-3 mb-3 animate-pulse" aria-hidden="true"></div>
          )}
          
          <div className="flex flex-col space-y-4 px-4 pt-4 pb-5">
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
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-[#4DA9FF] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                Cart
              </Link>
            </div>
            
            {/* Swipe Up Indicator */}
            {isMobileMenuOpen && (
              <div className="flex flex-col items-center mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-center text-gray-500 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  <span>Swipe up to close menu</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}