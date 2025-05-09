"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { Product } from '@/utils/types/product.types';
import WishlistButton from '@/components/ui/WishlistButton';

interface QuickViewProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickView({ product, isOpen, onClose }: QuickViewProps) {
  const [currentImage, setCurrentImage] = useState(0);
  
  // Function to render star ratings
  const renderRatingStars = (rating: number) => {
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
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden relative max-h-[90vh] sm:max-h-[80vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors z-10 text-gray-700"
            >
              <FaTimes size={16} />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto max-h-[90vh] sm:max-h-[unset]">
              <div className="p-4 sm:p-6 bg-gray-50 flex flex-col">
                <div className="relative w-full h-48 sm:h-64 bg-white rounded-lg overflow-hidden mb-4 sm:mb-6">
                  <Image
                    src={product.images[currentImage] || product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="flex space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar">
                  {product.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-lg shadow-sm overflow-hidden relative flex-shrink-0 transition-all duration-200 ${currentImage === index ? 'border-2 border-[#4DA9FF] scale-105' : 'border border-gray-100 hover:border-gray-300'}`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} thumbnail ${index + 1}`}
                        fill
                        className="object-contain p-1"
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-4 sm:p-6 overflow-y-auto">
                <span className="inline-block px-2 sm:px-3 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-2 sm:mb-3">
                  {product.category}
                </span>
                
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h2>
                
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="flex mr-2">
                    {renderRatingStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
                
                <p className="text-xl sm:text-2xl font-bold text-[#4DA9FF] mb-3 sm:mb-4">
                  ${product.price.toLocaleString()}
                </p>
                
                <p className="text-gray-600 mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base">
                  {product.description.substring(0, 150)}...
                </p>
                
                <div className="flex flex-col space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center">
                    <span className="font-medium w-20 sm:w-24 text-gray-700 text-sm">Brand:</span>
                    <span className="text-gray-600 text-sm">{product.brand}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-20 sm:w-24 text-gray-700 text-sm">Height:</span>
                    <span className="text-gray-600 text-sm">{product.specifications.height}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-20 sm:w-24 text-gray-700 text-sm">Weight:</span>
                    <span className="text-gray-600 text-sm">{product.specifications.weight}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-20 sm:w-24 text-gray-700 text-sm">Availability:</span>
                    <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-500'} font-medium text-sm`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      const addToCartBtn = document.querySelector('[aria-label="Add to cart"]') as HTMLButtonElement;
                      if (addToCartBtn) addToCartBtn.click();
                    }}
                    className="flex-grow bg-[#70a7ff] hover:bg-[#4DA9FF] text-white font-medium py-3 px-4 sm:px-6 rounded-lg shadow-md transition-all duration-300 flex items-center justify-center text-sm"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                    Add to cart
                  </button>
                  <WishlistButton 
                    productId={product.id} 
                    buttonStyle="secondary" 
                    className="px-4 sm:px-6 py-3 rounded-lg shadow-md"
                    showText={true}
                  />
                </div>
                
                <div className="mt-4 sm:mt-6 text-center">
                  <Link href={`/product/${product.id}`} className="text-[#70a7ff] hover:underline font-medium text-sm">
                    View Full Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}