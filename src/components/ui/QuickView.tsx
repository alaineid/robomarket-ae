"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Product } from '@/utils/types/product.types';
import WishlistButton from '@/components/ui/WishlistButton';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { createPortal } from 'react-dom';

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [currentImage, setCurrentImage] = useState(0);
  
  // Close modal with Escape key
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling behind modal
      window.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.body.style.overflow = ''; // Restore scrolling
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  // Function to render star ratings - memoized to prevent unnecessary re-renders
  const renderRatingStars = useCallback((rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  }, []);
  
  // Stop propagation to prevent clicks inside the modal from closing it
  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Important: immediately stop this event from propagating
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  if (!isOpen) return null;

  // Render modal at document.body to avoid nesting inside card group
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          key="modal-backdrop"
          style={{ pointerEvents: 'auto' }}
        >
          <motion.div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
            onClick={stopPropagation}
            key="modal-content"
            style={{ 
              pointerEvents: 'auto', 
              maxHeight: '90vh',
              transform: 'translate3d(0, 0, 0)', // Force GPU acceleration
              willChange: 'transform' // Hint to browser about animation
            }}
          >
            <div className="relative">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors text-gray-700"
                aria-label="Close modal"
              >
                <FaTimes size={16} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Product Image Section - no hover effects here to avoid conflicts */}
                <div className="p-6 bg-gray-50 flex flex-col">
                  <div className="relative w-full h-64 md:h-80 bg-white rounded-lg overflow-hidden mb-6">
                    {product.images && product.images.length > 0 && (
                      <Image
                        src={product.images[currentImage]?.url || '/images/Algorythm.png'}
                        alt={product.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    )}
                  </div>
                  
                  <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
                    {product.images && product.images.map((image, index) => (
                      <button 
                        key={index}
                        onClick={() => setCurrentImage(index)}
                        className={`w-16 h-16 bg-white rounded-lg overflow-hidden relative flex-shrink-0 transition-colors ${
                          currentImage === index 
                            ? 'border-2 border-[#4DA9FF] shadow-md' 
                            : 'border border-gray-200 hover:border-[#4DA9FF]'
                        }`}
                        style={{ transform: currentImage === index ? 'scale(1.05)' : 'none' }}
                      >
                        <Image
                          src={image.url || '/images/Algorythm.png'}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Product Details Section */}
                <div className="p-6 overflow-y-auto" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                  {product.categories && product.categories.length > 0 && (
                    <span className="inline-block px-3 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-3">
                      {product.categories[0].name || 'Uncategorized'}
                    </span>
                  )}
                  
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderRatingStars(product.ratings.average)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.ratings.count} reviews)
                    </span>
                  </div>
                  
                  <p className="text-2xl font-bold text-[#4DA9FF] mb-4">
                    ${product.best_vendor?.price?.toLocaleString() || '0.00'}
                  </p>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {product.description?.substring(0, 150)}...
                  </p>
                  
                  <div className="flex flex-col space-y-3 mb-6">
                    <div className="flex items-center">
                      <span className="font-medium w-24 text-gray-700">Brand:</span>
                      <span className="text-gray-600">{product.brand}</span>
                    </div>
                    
                    {product.attributes?.slice(0, 4).map((attr, index) => (
                      <div key={index} className="flex items-center">
                        <span className="font-medium w-24 text-gray-700 capitalize">{attr.key}:</span>
                        <span className="text-gray-600">{attr.value}</span>
                      </div>
                    ))}
                    
                    <div className="flex items-center">
                      <span className="font-medium w-24 text-gray-700">Availability:</span>
                      <span className={`${product.best_vendor?.stock > 0 ? 'text-green-600' : 'text-red-500'} font-medium`}>
                        {product.best_vendor?.stock > 0 ? `In Stock (${product.best_vendor.stock})` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
                    <AddToCartButton 
                      product={product} 
                      buttonStyle="primary"
                      className="flex-grow py-3 px-6 rounded-lg flex items-center justify-center text-sm"
                      showText={true}
                    />
                    
                    <WishlistButton 
                      productId={product.id} 
                      buttonStyle="secondary" 
                      className="px-6 py-3 rounded-lg"
                      showText={true}
                    />
                  </div>
                  
                  <div className="mt-6 text-center">
                    <Link 
                      href={`/product/${product.id}`} 
                      className="text-[#4DA9FF] hover:text-[#70a7ff] hover:underline font-medium"
                      onClick={onClose}
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}