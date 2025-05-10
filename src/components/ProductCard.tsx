"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Product } from '@/utils/types/product.types';
import AddToCartButton from './ui/AddToCartButton';
import WishlistButton from './ui/WishlistButton';
import QuickView from './ui/QuickView';
import { commonCardStyles } from '@/styles/commonStyles';

export default function ProductCard({ 
  product 
}: { 
  product: Product 
}) {
  const [showQuickView, setShowQuickView] = useState(false);  
  
  // Function to render star ratings
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" size={12} />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" size={12} />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" size={12} />);
    }
    
    return stars;
  };

  // Function to get category background color
  const getCategoryColor = (category: string): string => {
    const categoryLower = category?.toLowerCase() || '';
    
    if (categoryLower.includes('companion')) return 'bg-blue-100 text-blue-700';
    if (categoryLower.includes('home')) return 'bg-green-100 text-green-700';
    if (categoryLower.includes('industrial')) return 'bg-orange-100 text-orange-700';
    if (categoryLower.includes('utility')) return 'bg-amber-100 text-amber-700';
    if (categoryLower.includes('security')) return 'bg-violet-100 text-violet-700';
    if (categoryLower.includes('business')) return 'bg-purple-100 text-purple-700';
    if (categoryLower.includes('medical') || categoryLower.includes('healthcare')) return 'bg-red-100 text-red-700';
    if (categoryLower.includes('developer')) return 'bg-teal-100 text-teal-700';
    if (categoryLower.includes('education')) return 'bg-yellow-100 text-yellow-700';
    if (categoryLower.includes('entertainment')) return 'bg-pink-100 text-pink-700';
    
    // Default color for other categories
    return 'bg-gray-100 text-gray-700';
  };

  // Handle quick view button click
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -3 }}
        className={`${commonCardStyles.container} h-full flex flex-col`}
      >
        <div className={`${commonCardStyles.imageContainer} group`}>
          {/* Product Images Thumbnails Row */}
          {Array.isArray(product.images) && product.images.length > 1 && (
            <div className="absolute top-2 left-2 z-20 flex gap-1 overflow-x-auto max-w-[90%]">
              {product.images.map((imgUrl, idx) => (
                imgUrl ? (
                  <Image
                    key={idx}
                    src={typeof imgUrl === 'string' ? imgUrl : ''}
                    alt={product.name + ' thumbnail ' + (idx + 1)}
                    width={40}
                    height={40}
                    className="object-contain rounded border bg-white"
                  />
                ) : null
              ))}
            </div>
          )}
          {/* Main Product Image */}
          <Link href={`/product/${product.id}`} className="block absolute inset-0 z-10">
            <div className={`${commonCardStyles.imagePlaceholder} bg-white`}>
              {(product.images && product.images.length > 0) ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt_text || product.name}
                  width={300}
                  height={300}
                  className="object-contain w-full h-full transform transition-transform duration-500 group-hover:scale-110"
                  priority={true}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-6xl bg-gray-50">
                  <span>🖼️</span>
                </div>
              )}
            </div>
          </Link>
          
          {/* Stock Status Badge - Only Out of Stock */}
          {(!product.best_vendor || !product.best_vendor.stock || product.best_vendor.stock <= 0) && (
            <div className="absolute top-2 right-2 z-20">
              <span className="inline-block px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Mobile-friendly quick actions overlay */}
          <div className="absolute bottom-2 right-2 z-20 flex flex-col gap-2">
            <WishlistButton productId={product.id} buttonStyle="icon" className="w-8 h-8" />
          </div>
        </div>
        
        {/* Product Content - Optimized for mobile */}
        <div className={`${commonCardStyles.content} flex flex-col flex-grow p-3 sm:p-4`}>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-gray-800 hover:text-[#4DA9FF] transition-colors truncate">
                <Link href={`/product/${product.id}`}>
                  {product.name}
                </Link>
              </h3>
              <p className="text-gray-600 text-xs">{product.brand}</p>
            </div>
            <span className="font-bold text-sm sm:text-base text-[#4DA9FF] ml-2 whitespace-nowrap">
              ${typeof product.best_vendor.price === 'number' ? product.best_vendor.price.toLocaleString() : '0.00'}
            </span>
          </div>
          
          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center">
              <div className="flex">
                {renderRatingStars(product.ratings.average)}
              </div>
              <span className="text-gray-500 text-xs ml-1">{product.ratings.average.toFixed(1)}</span>
              {product.ratings.count > 0 && (
                <span className="text-gray-500 text-xs ml-1">({product.ratings.count})</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {Array.isArray(product.categories) && product.categories.length > 0 ? (
                product.categories.map((cat, idx) => (
                  <motion.span 
                    key={idx} 
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className={`${commonCardStyles.categoryBadge} inline-flex items-center text-xs px-2 py-1 ${getCategoryColor(cat.name)} shadow-sm transition-all duration-300 hover:shadow`}
                  >
                    {cat.name || 'Category'}
                  </motion.span>
                ))
              ) : (
                <motion.span 
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`${commonCardStyles.categoryBadge} inline-flex items-center text-xs px-2 py-1 bg-gray-100 text-gray-700 shadow-sm transition-all duration-300 hover:shadow`}
                >
                  Uncategorized
                </motion.span>
              )}
            </div>
          </div>
          
          {/* Key Features - Simplified for mobile */}
          <div className="mt-2 space-y-0.5 mb-auto">
            {Array.isArray(product.attributes) && product.attributes.length > 0 ? (
              product.attributes.slice(0, 1).map((attr, index) => (
                <div key={index} className="flex items-start">
                  <FaCheck className="text-green-500 mt-0.5 mr-1 flex-shrink-0" size={10} />
                  <p className="text-gray-600 text-xs line-clamp-1">{`${attr.key}: ${attr.value}`}</p>
                </div>
              ))
            ) : null}
          </div>
          
          {/* Mobile-optimized action buttons */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link 
              href={`/product/${product.id}`}
              className="py-2 px-3 text-center bg-gray-100 text-xs rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
            >
              View Details
            </Link>
            <button 
              onClick={handleQuickView}
              className="py-2 px-3 text-center text-xs bg-blue-50 text-[#4DA9FF] rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
            >
              Quick View
            </button>
          </div>
          
          <div className="mt-2">
            <AddToCartButton 
              product={product} 
              buttonStyle="primary" 
              className="w-full py-2 text-xs"
              showText={true}
            />
          </div>
        </div>
      </motion.div>
      
      {/* Quick View Modal */}
      <QuickView 
        product={product} 
        isOpen={showQuickView} 
        onClose={() => setShowQuickView(false)} 
      />
    </>
  );
}