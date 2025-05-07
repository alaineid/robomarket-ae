"use client";

import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/utils/cartContext';

interface AddToCartButtonProps {
  productId: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ productId }) => {
  const { addToCart } = useCart();

  // Handle add to cart button click
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
  };

  return (
    <button 
      onClick={handleAddToCart}
      aria-label="Add to cart"
      className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
    >
      <FaShoppingCart size={18} />
    </button>
  );
};

export default AddToCartButton;