"use client";

import { useState, useEffect } from 'react';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useCart } from '@/utils/cartContext';
import { Product, getProductById } from '@/utils/productData';

interface AddToCartButtonProps {
  product?: Product;
  productId?: number;
  quantity?: number;
  className?: string;
  showText?: boolean;
  buttonStyle?: 'primary' | 'secondary' | 'icon';
  onAddedToCart?: () => void;
}

export default function AddToCartButton({ 
  product, 
  productId,
  quantity = 1, 
  className = '', 
  showText = true,
  buttonStyle = 'primary',
  onAddedToCart
}: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [resolvedProduct, setResolvedProduct] = useState<Product | undefined>(product);

  // If a productId is provided without a product, fetch the product
  useEffect(() => {
    if (!product && productId) {
      const fetchedProduct = getProductById(productId);
      setResolvedProduct(fetchedProduct);
    }
  }, [product, productId]);

  // Define button styles based on the buttonStyle prop
  const getStyles = () => {
    switch (buttonStyle) {
      case 'primary':
        return isAdded
          ? "bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
          : "bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer";
      case 'secondary':
        return isAdded
          ? "bg-green-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer"
          : "bg-white border border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer";
      case 'icon':
        return isAdded 
          ? "w-10 h-10 rounded-full bg-green-500 shadow-lg flex items-center justify-center text-white transition-all duration-300 cursor-pointer" 
          : "w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer";
      default:
        return isAdded
          ? "bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer"
          : "bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center cursor-pointer";
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use the resolved product or fallback to the productId
    const id = resolvedProduct?.id || productId;
    
    if (id) {
      addToCart(id, quantity);
      setIsAdded(true);
      
      if (onAddedToCart) {
        onAddedToCart();
      }
      
      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }
  };

  // If we can't resolve a product and don't have an ID, don't render
  if (!resolvedProduct && !productId) {
    return null;
  }

  // Check if product is in stock (default to true if we only have ID)
  const isInStock = resolvedProduct ? resolvedProduct.stock > 0 : true;

  return (
    <button
      onClick={handleAddToCart}
      disabled={!isInStock}
      className={`${getStyles()} ${className} ${!isInStock ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label={isAdded ? "Added to cart" : "Add to cart"}
    >
      {isAdded ? (
        <>
          <FaCheck size={16} className={buttonStyle === 'icon' ? "" : "mr-2"} />
          {showText && "Added to cart!"}
        </>
      ) : (
        <>
          <FaShoppingCart size={16} className={showText ? "mr-2" : ""} />
          {showText && (isInStock ? "Add to cart" : "Out of stock")}
        </>
      )}
    </button>
  );
}