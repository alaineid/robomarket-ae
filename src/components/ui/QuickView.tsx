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
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  
  useEffect(() => {
    setPortalElement(document.body);
  }, []);
  
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
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
  }, []);

  if (!isOpen || !portalElement) return null;

  // Render modal at document.body to avoid nesting inside card group
  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          key="modal-backdrop"
        >
          <motion.div 
            className="bg-white rounded-xl shadow-xl max-w-3xl w-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            onClick={stopPropagation}
            key="modal-content"
            style={{ maxHeight: '90vh' }}
          >
            <div className="relative">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 hover:bg-gray-100 transition-colors text-gray-500"
                aria-label="Close modal"
              >
                <FaTimes size={14} />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                {/* Product Image Section */}
                <div className="p-6 bg-gray-50 flex flex-col justify-between">
                  <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden mb-4">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[currentImage]?.url || '/images/Algorythm.png'}
                        alt={product.name}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    ) : (
                      <Image
                        src="/images/robot1.png"
                        alt="Product"
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                  </div>
                  
                  {product.images && product.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto py-1">
                      {product.images.map((image, index) => (
                        <button 
                          key={index}
                          onClick={() => setCurrentImage(index)}
                          className={`w-14 h-14 bg-white rounded-md overflow-hidden flex-shrink-0 border ${
                            currentImage === index ? 'border-[#4DA9FF] ring-1 ring-[#4DA9FF]' : 'border-gray-200'
                          }`}
                        >
                          <Image
                            src={image.url || '/images/Algorythm.png'}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            width={56}
                            height={56}
                            className="object-contain w-full h-full"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Product Details Section */}
                <div className="p-6 pb-8 flex flex-col overflow-y-auto" style={{ maxHeight: '90vh' }}>
                  {/* Top badge */}
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full">
                      {product.categories?.[0]?.name || 'Companion'}
                    </span>
                  </div>
                  
                  {/* Product name */}
                  <h2 className="text-3xl font-medium text-gray-800 mb-1">
                    {product.name}
                  </h2>
                  
                  {/* Ratings */}
                  <div className="flex items-center mb-5 gap-2">
                    <div className="flex">
                      {renderRatingStars(product.ratings?.average || 4.5)}
                    </div>
                    <span className="text-sm text-gray-500">
                      ({product.ratings?.count || 9} reviews)
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-6">
                    <span className="text-3xl font-semibold text-[#4DA9FF]">
                      ${product.best_vendor?.price?.toLocaleString() || '4,499.99'}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {product.description || 
                      `The ${product.name} creates meaningful relationships through advanced emotional intelligence. This robot learns your preferences, adapts to your mood, and provides personalized companionship for all ages.`
                    }
                  </p>
                  
                  {/* Product specs */}
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-8 text-sm">
                    <div>
                      <span className="text-gray-500 block mb-1">Brand:</span>
                      <span className="font-medium">{product.brand || 'Synthia'}</span>
                    </div>
                    
                    <div>
                      <span className="text-gray-500 block mb-1">Availability:</span>
                      <span className="font-medium text-green-600">
                        {product.best_vendor?.stock > 0 
                          ? `In Stock (${product.best_vendor.stock})` 
                          : 'In Stock (10)'}
                      </span>
                    </div>
                    
                    {product.attributes?.slice(0, 4).map((attr, index) => (
                      <div key={index}>
                        <span className="text-gray-500 block mb-1 capitalize">{attr.key}:</span>
                        <span className="font-medium">{attr.value}</span>
                      </div>
                    ))}
                    
                    {/* Fallback attributes if none exist */}
                    {(!product.attributes || product.attributes.length === 0) && (
                      <>
                        <div>
                          <span className="text-gray-500 block mb-1">Height:</span>
                          <span className="font-medium">4'11" (150 cm)</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block mb-1">Weight:</span>
                          <span className="font-medium">94 lbs (42.5 kg)</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <AddToCartButton 
                      product={product} 
                      buttonStyle="primary"
                      className="flex-grow py-3 rounded-lg flex items-center justify-center font-medium"
                      showText={true}
                    />
                    
                    <WishlistButton 
                      productId={product.id} 
                      buttonStyle="secondary" 
                      className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-gray-200 hover:border-[#4DA9FF]"
                      showText={false}
                    />
                  </div>
                  
                  {/* View full details link */}
                  <div className="mt-6 text-center">
                    <Link 
                      href={`/product/${product.id}`} 
                      className="inline-flex items-center text-[#4DA9FF] font-medium hover:underline"
                      onClick={onClose}
                    >
                      View Full Details
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalElement
  );
}