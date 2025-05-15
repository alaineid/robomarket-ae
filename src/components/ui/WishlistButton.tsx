"use client";

import { useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useWishlist } from '@/store/wishlistContext';
import { motion } from 'framer-motion';
import { Product } from '@/types/product.types';

interface WishlistButtonProps {
  productId: number;
  className?: string;
  showText?: boolean;
  buttonStyle?: 'primary' | 'secondary' | 'icon';
}

export default function WishlistButton({
  productId,
  className = '',
  showText = false,
  buttonStyle = 'icon'
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlistItem } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    // Create a minimal product object with required fields
    // Using Partial<Product> to properly type the minimal object
    const productObj: Partial<Product> = { 
      id: productId,
      sku: '',
      name: '',
      description: '',
      brand: '',
      created_at: '',
      updated_at: '',
      ratings: { average: 0, count: 0 },
      categories: [],
      images: [],
      attributes: [],
      vendor_products: [],
      best_vendor: { vendor: { id: 0, name: '', email: null, phone: null, website: null }, vendor_sku: null, price: 0, stock: 0 },
      reviews: []
    };
    
    toggleWishlistItem(productObj as Product);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const isWishlisted = isInWishlist(productId);

  // Define button styles based on the buttonStyle prop
  const getStyles = () => {
    switch (buttonStyle) {
      case 'primary':
        return "bg-gradient-to-r from-[#FF6B6B] to-[#FF4F4F] hover:from-[#FF4F4F] hover:to-[#FF6B6B] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center";
      case 'secondary':
        return "bg-white border border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center";
      case 'icon':
        return "w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-all duration-300 cursor-pointer";
      default:
        return "w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#FF6B6B] hover:bg-[#FF6B6B] hover:text-white transition-all duration-300 cursor-pointer";
    }
  };

  return (
    <motion.button
      whileTap={{ scale: isAnimating ? 1.3 : 1.1 }}
      onClick={handleToggleWishlist}
      className={`${getStyles()} ${className}`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      {isWishlisted ? (
        <>
          <FaHeart size={16} className={showText ? "mr-2" : ""} />
          {showText && "Saved"}
        </>
      ) : (
        <>
          <FaRegHeart size={16} className={showText ? "mr-2" : ""} />
          {showText && "Save"}
        </>
      )}
    </motion.button>
  );
}