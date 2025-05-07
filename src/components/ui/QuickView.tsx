"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaTimes } from 'react-icons/fa';
import { Product } from '@/utils/productData';
import AddToCartButton from './AddToCartButton';
import WishlistButton from './WishlistButton';
import { motion, AnimatePresence } from 'framer-motion';

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full overflow-hidden relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 z-10"
            >
              <FaTimes />
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-6 bg-gray-50 flex flex-col">
                <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden mb-6">
                  <Image
                    src={product.images[currentImage] || product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImage(index)}
                      className={`w-16 h-16 bg-white rounded border ${currentImage === index ? 'border-blue-500' : 'border-gray-200'} relative flex-shrink-0`}
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
              
              <div className="p-6">
                <span className="inline-block px-3 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-3">
                  {product.category}
                </span>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {product.name}
                </h2>
                
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">
                    {renderRatingStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
                
                <p className="text-2xl font-bold text-[#4DA9FF] mb-4">
                  ${product.price.toLocaleString()}
                </p>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {product.description.substring(0, 150)}...
                </p>
                
                <div className="flex flex-col space-y-3 mb-6">
                  <div className="flex items-center">
                    <span className="font-medium w-24 text-gray-700">Brand:</span>
                    <span className="text-gray-600">{product.brand}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-24 text-gray-700">Height:</span>
                    <span className="text-gray-600">{product.specifications.height}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-24 text-gray-700">Weight:</span>
                    <span className="text-gray-600">{product.specifications.weight}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="font-medium w-24 text-gray-700">Availability:</span>
                    <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-500'} font-medium`}>
                      {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <AddToCartButton product={product} className="flex-grow" />
                  <WishlistButton productId={product.id} showText />
                </div>
                
                <div className="mt-6 text-center">
                  <Link href={`/product/${product.id}`} className="text-[#4DA9FF] hover:underline font-medium">
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