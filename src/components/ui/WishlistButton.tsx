"use client";

import { useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { useWishlist } from '@/utils/wishlistContext';
import { motion } from 'framer-motion';

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
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
    
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