"use client";

import { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/ui/Logo';
import { 
  Menu, 
  MenuButton, 
  MenuItems, 
  MenuItem, 
  Transition 
} from '@headlessui/react';
import { 
  FaUserCircle, 
  FaShoppingCart, 
  FaBars, 
  FaTimes, 
  FaSignInAlt, 
  FaUserPlus, 
  FaSignOutAlt, 
  FaUser, 
  FaHeart,
  FaChevronDown,
  FaTrash
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cartContext';
import { useAuthStore } from '@/store/authStore';
import { createClient } from '@/supabase/client';
import { logoutAction } from '@/components/actions/authActions';

export default function Header() {
  const router = useRouter();
  const { cartCount, cartItems, removeFromCart } = useCart();
  const { user, customer, isLoading, sessionChecked, synchronizeAuthState } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Always actively check auth state when the Header component mounts or updates
  useEffect(() => {
    // Synchronize auth state when the component mounts
    const initialSync = async () => {
      console.log('Header: Initial auth state synchronization');
      await synchronizeAuthState();
    };
    
    // Call it immediately on mount
    initialSync();
    
    // Also check when auth state changes (login, logout, etc.)
    const handleAuthChange = () => {
      console.log('Header: Auth state change detected, synchronizing');
      synchronizeAuthState();
    };
    
    // Listen for auth state changes from the AuthProvider
    window.addEventListener('supabase-auth-state-changed', handleAuthChange);
    window.addEventListener('auth-state-synchronized', () => {
      console.log('Header: Received auth-state-synchronized event');
    });
    
    // Clean up listeners on unmount
    return () => {
      window.removeEventListener('supabase-auth-state-changed', handleAuthChange);
      window.removeEventListener('auth-state-synchronized', () => {});
    };
  }, [synchronizeAuthState]);
  
  const handleLogout = async () => {
    try {
      // Set loading state to true to show the loading indicator
      useAuthStore.setState({ isLoading: true });
      console.log('Logging out...');
      
      // Create Supabase client
      const supabase = createClient();
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local auth state
      useAuthStore.setState({ 
        user: null, 
        customer: null, 
        isLoading: false 
      });
      
      // Notify components about auth state change
      window.dispatchEvent(new Event('supabase-auth-state-changed'));
      
      // Call server-side logout action
      try {
        await logoutAction();
      } catch (serverError) {
        console.log('Server logout action completed');
      }
      
      // Finally navigate to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Make sure loading state is reset even on error
      useAuthStore.setState({ isLoading: false });
      // Fallback to a refresh if there's any issue
      window.location.href = '/login';
    }
  };

  // Touch gesture handling
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const transitionInProgress = useRef(false);
  const scrollThreshold = 50; // Increased threshold to prevent oscillation

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };
    
    // Improved scroll handler with debouncing and state tracking
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      lastScrollY.current = currentScrollY;
      
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          // Only update state if we've crossed the threshold by a significant amount
          // to prevent rapid toggling near the threshold
          if (transitionInProgress.current) {
            // If a transition is in progress, don't update state again
            ticking.current = false;
            return;
          }
          
          const shouldBeScrolled = lastScrollY.current > scrollThreshold;
          
          if (shouldBeScrolled !== isScrolled) {
            // Set a flag to prevent multiple state updates during transition
            transitionInProgress.current = true;
            
            setIsScrolled(shouldBeScrolled);
            
            // Clear the flag after the transition duration
            setTimeout(() => {
              transitionInProgress.current = false;
            }, 200); // Slightly longer than the transition duration
          }
          
          ticking.current = false;
        });
        
        ticking.current = true;
      }
    };
    
    // Set initial values
    handleResize();
    window.requestAnimationFrame(() => {
      setIsScrolled(window.scrollY > scrollThreshold);
    });
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isScrolled]);

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

  // Calculate cart subtotal
  const cartSubtotal = cartItems.reduce((sum, item) => {
    return sum + ((item.product?.best_vendor?.price || 0) * item.quantity);
  }, 0);

  return (
    <header 
      id="header" 
      className="sticky top-0 z-50 will-change-transform transform-gpu"
      style={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
        boxShadow: isScrolled ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
        padding: isScrolled ? '0.5rem 0' : '1rem 0',
        transition: 'padding 0.15s ease-in-out, background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      }}
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
          <Link
              href="/shop"
              className="px-3 py-1.5 bg-gradient-to-r from-blue-400 to-[#4DA9FF] text-white rounded-md font-medium tracking-wide text-sm shadow hover:brightness-110 transition"
            >
              Shop Robots
            </Link>            
            <Link href="/about" className="text-gray-700 hover:text-[#4DA9FF] font-medium relative group transition duration-200">
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link href="/support" className="text-gray-700 hover:text-[#4DA9FF] font-medium relative group transition duration-200">
              Support
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full transition-all duration-300"></span>
            </Link>

            {/* Account & Cart */}
            <div className="flex space-x-6 ml-4">
              {/* Account Dropdown Menu */}
              <Menu as="div" className="relative">
                <MenuButton className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 group flex items-center">
                  <div className="relative flex items-center">
                    <FaUserCircle className="text-2xl transform group-hover:scale-110 transition-transform duration-200" />
                    <FaChevronDown className="ml-1 h-3 w-3 text-gray-500 group-hover:text-[#4DA9FF]" />
                    <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </div>
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg border border-gray-100 focus:outline-none divide-y divide-gray-100 z-50 py-1">
                    {/* Menu changes based on login state - no spinner here anymore */}
                    {user ? (
                      <>
                        <div className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900">
                            {customer ? `${customer.first_name || ''} ${customer.last_name || ''}` : 'Welcome Back!'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        </div>
                        <div className="py-1">
                          <MenuItem>
                            <Link
                              href="/account"
                              className="hover:bg-gray-50 hover:text-[#4DA9FF] text-gray-700 flex items-center px-4 py-2 text-sm"
                            >
                              <FaUser className="mr-3 h-4 w-4" />
                              My Profile
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/wishlist"
                              className="hover:bg-gray-50 hover:text-[#4DA9FF] text-gray-700 flex items-center px-4 py-2 text-sm"
                            >
                              <FaHeart className="mr-3 h-4 w-4" />
                              Wishlist
                            </Link>
                          </MenuItem>

                          <MenuItem>
                            <button
                              onClick={handleLogout}
                              className="hover:bg-gray-50 hover:text-[#4DA9FF] text-gray-700 flex items-center px-4 py-2 text-sm w-full text-left"
                            >
                              <FaSignOutAlt className="mr-3 h-4 w-4" />
                              Sign out
                            </button>
                          </MenuItem>
                        </div>
                      </>
                    ) : (
                      <div className="py-1">
                          <MenuItem>
                            <Link
                              href="/login"
                              className="hover:bg-gray-50 hover:text-[#4DA9FF] text-gray-700 flex items-center px-4 py-2 text-sm"
                            >
                              <FaSignInAlt className="mr-3 h-4 w-4" />
                              Login
                            </Link>
                          </MenuItem>
                          <MenuItem>
                            <Link
                              href="/signup"
                              className="hover:bg-gray-50 hover:text-[#4DA9FF] text-gray-700 flex items-center px-4 py-2 text-sm"
                            >
                              <FaUserPlus className="mr-3 h-4 w-4" />
                              Sign up
                            </Link>
                          </MenuItem>
                      </div>
                    )}
                  </MenuItems>
                </Transition>
              </Menu>
              
              {/* Cart Dropdown */}
              <Menu as="div" className="relative">
                <MenuButton className="text-gray-700 hover:text-[#4DA9FF] transition-colors duration-200 group">
                  <div className="relative">
                    <FaShoppingCart className="text-2xl transform group-hover:scale-110 transition-transform duration-200" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-0 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-[#4DA9FF] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-md transition-all duration-200 group-hover:scale-110">
                        {cartCount}
                      </span>
                    )}
                    <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-[#4DA9FF] group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
                  </div>
                </MenuButton>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"  
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <MenuItems className="absolute right-0 mt-2 w-80 origin-top-right bg-white rounded-lg shadow-lg border border-gray-100 focus:outline-none z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <h3 className="text-lg font-medium text-gray-900">Your Cart</h3>
                    </div>
                    
                    {cartItems.length > 0 ? (
                      <>
                        <div className="py-2 max-h-[320px] overflow-y-auto custom-scrollbar">
                          {cartItems.map((item) => (
                            <div key={item.productId} className="hover:bg-gray-50 px-4 py-3 border-b border-gray-100 last:border-0">
                              <div className="flex items-center">
                                {/* Product Image */}
                                <div className="w-16 h-16 relative rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                                  {item.product?.images && item.product.images[0] ? (
                                    <Image
                                      src={item.product.images[0].url}
                                      alt={item.product?.name || "Product"}
                                      fill
                                      className="object-contain p-1"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                                      <FaShoppingCart size={20} />
                                    </div>
                                  )}
                                </div>
                                
                                {/* Product Info */}
                                <div className="flex-1 min-w-0 ml-3">
                                  <Link href={`/product/${item.productId}`} className="text-sm font-medium text-gray-800 hover:text-[#4DA9FF] truncate block">
                                    {item.product?.name || "Product"}
                                  </Link>
                                  
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-sm text-gray-500">
                                      Qty: {item.quantity}
                                    </span>
                                    <span className="text-sm font-medium text-[#4DA9FF]">
                                      ${((item.product?.best_vendor?.price || 0) * item.quantity).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Remove Button */}
                                <button
                                  onClick={() => removeFromCart(item.productId)}
                                  className="ml-3 text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                                  aria-label="Remove item"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        <div className="p-4 bg-gray-50">
                          <div className="flex justify-between font-medium mb-4">
                            <span className="text-gray-700">Subtotal:</span>
                            <span className="text-[#4DA9FF]">${cartSubtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Link 
                              href="/cart" 
                              className="w-full text-center py-2.5 px-4 border border-[#4DA9FF] text-[#4DA9FF] rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                              View Cart
                            </Link>
                            <Link 
                              href="/checkout" 
                              className="w-full text-center py-2.5 px-4 bg-[#4DA9FF] hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
                            >
                              Checkout
                            </Link>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-8 px-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
                          <FaShoppingCart className="text-gray-400" size={24} />
                        </div>
                        <p className="text-gray-600 mb-4">Your cart is empty</p>
                        <Link href="/shop" className="inline-block text-center text-sm py-2.5 px-6 border border-[#4DA9FF] text-[#4DA9FF] rounded-lg hover:bg-blue-50 transition-colors font-medium">
                          Continue Shopping
                        </Link>
                      </div>
                    )}
                  </MenuItems>
                </Transition>
              </Menu>
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
            <Link href="/about" className="block text-gray-700 hover:text-[#4DA9FF] py-2 font-medium border-b border-gray-100">
              About Us
            </Link>
            <Link href="/support" className="block text-gray-700 hover:text-[#4DA9FF] py-2 font-medium border-b border-gray-100">
              Support
            </Link>
            
            {/* Mobile Login/Account section */}
            <div className="py-2 border-b border-gray-100">
              <div className="mb-2 font-medium text-gray-700">Account</div>
              {user ? (
                <div className="space-y-2">
                  <Link href="/account" className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors py-1">
                    <FaUser className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                  <Link href="/wishlist" className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors py-1">
                    <FaHeart className="mr-2 h-4 w-4" />
                    Wishlist
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors py-1"
                  >
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link 
                    href="/login" 
                    className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors py-1"
                  >
                    <FaSignInAlt className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                  <Link href="/signup" className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors py-1">
                    <FaUserPlus className="mr-2 h-4 w-4" />
                    Sign up
                  </Link>
                </div>
              )}
            </div>
            
            <div className="pt-2">
              <Link href="/cart" className="flex items-center text-gray-700 hover:text-[#4DA9FF] transition-colors px-3 py-2 rounded-full hover:bg-blue-50">
                <div className="relative mr-2">
                  <FaShoppingCart />
                  {cartCount > 0 && (
                    <span className="absolute top-1 right-0 translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-[#4DA9FF] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
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
