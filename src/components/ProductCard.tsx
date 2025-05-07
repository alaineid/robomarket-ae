"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaEye, FaCheck, FaExchangeAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Product } from '@/utils/productData';
import AddToCartButton from './ui/AddToCartButton';
import WishlistButton from './ui/WishlistButton';
import QuickView from './ui/QuickView';
import { commonCardStyles } from '@/styles/commonStyles';

interface ProductCardProps {
  product: Product;
  showCompare?: boolean;
  onCompareToggle?: (product: Product, isComparing: boolean) => void;
  isComparing?: boolean;
}

export default function ProductCard({ 
  product, 
  showCompare = false,
  onCompareToggle,
  isComparing = false 
}: ProductCardProps) {
  const [showQuickView, setShowQuickView] = useState(false);
  
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

  // Get a shorter description for the card
  const shortDescription = product.description.split('.')[0] + '.';

  // Handle quick view button click
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  // Handle compare toggle
  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCompareToggle) {
      onCompareToggle(product, !isComparing);
    }
  };

  return (
    <>
      <motion.div 
        whileHover={{ y: -3 }}
        className={`${commonCardStyles.container} h-full flex flex-col`}
      >
        <div className={commonCardStyles.imageContainer}>
          {/* Product Image */}
          <Link href={`/product/${product.id}`} className="block absolute inset-0 z-10">
            <div className={`${commonCardStyles.imagePlaceholder} bg-white`}>
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={300}
                className="object-contain w-full h-full transform transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          </Link>
          
          {/* Image Overlay with Action Buttons */}
          <div className={commonCardStyles.imageOverlay}>
            <div className="absolute top-4 left-4 space-y-2">
              <WishlistButton productId={product.id} />
            </div>
            
            <div className="absolute top-4 right-4 space-y-2">
              <motion.button
                whileTap={{ scale: 1.1 }}
                onClick={handleQuickView}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer"
                aria-label="Quick view"
              >
                <FaEye size={16} />
              </motion.button>
              
              {showCompare && (
                <motion.button
                  whileTap={{ scale: 1.1 }}
                  onClick={handleCompareToggle}
                  className={`w-10 h-10 rounded-full ${isComparing ? 'bg-[#4DA9FF] text-white' : 'bg-white text-[#4DA9FF]'} shadow-lg flex items-center justify-center hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer mt-2`}
                  aria-label={isComparing ? "Remove from compare" : "Add to compare"}
                >
                  <FaExchangeAlt size={14} />
                </motion.button>
              )}
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 px-4">
              <AddToCartButton 
                product={product} 
                buttonStyle="icon" 
                className="w-full bg-white/90 hover:bg-[#4DA9FF]/90 backdrop-blur-sm py-3"
                showText={true}
              />
            </div>
          </div>
          
          {/* Category Badge */}
          <div className="absolute top-2 left-2 z-20">
            <span className={commonCardStyles.categoryBadge}>
              {product.category}
            </span>
          </div>
          
          {/* Stock Status Badge */}
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 z-20">
              <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-red-500 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute top-2 right-2 z-20">
              <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-amber-500 rounded-full">
                Low Stock
              </span>
            </div>
          )}
        </div>
        
        {/* Product Content */}
        <div className={`${commonCardStyles.content} flex flex-col flex-grow`}>
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors truncate">
                <Link href={`/product/${product.id}`}>
                  {product.name}
                </Link>
              </h3>
              <p className="text-gray-600 text-sm">{product.brand}</p>
            </div>
            <span className="font-bold text-lg text-[#4DA9FF] ml-2 whitespace-nowrap">${product.price.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center mt-2">
            <div className="flex">
              {renderRatingStars(product.rating)}
            </div>
            <span className="text-gray-500 text-xs ml-2">({product.reviews.length})</span>
          </div>
          
          {/* Short Description */}
          <p className="text-gray-600 text-sm mt-3 mb-auto line-clamp-2">
            {shortDescription}
          </p>
          
          {/* Key Features */}
          <div className="mt-3 space-y-1">
            {product.features.slice(0, 2).map((feature, index) => (
              <div key={index} className="flex items-start">
                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" size={12} />
                <p className="text-gray-600 text-xs line-clamp-1">{feature}</p>
              </div>
            ))}
          </div>
          
          {/* Button Area */}
          <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
            <Link 
              href={`/product/${product.id}`}
              className="flex-grow text-center text-sm text-[#4DA9FF] hover:underline font-medium"
            >
              View Details
            </Link>
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