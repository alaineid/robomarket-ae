"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaStar, FaStarHalfAlt, 
  FaCheck, FaArrowRight, FaShoppingCart, FaHeart, FaRegHeart,
  FaShippingFast, FaAward, FaCreditCard, FaExchangeAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import CategoryTag from '@/components/ui/CategoryTag';
import { commonButtonStyles } from '@/styles/commonStyles';
import { useCart } from '@/store/cartContext';
import { useProduct, useProducts } from '@/hooks/queryHooks';
import { useQueryClient } from '@tanstack/react-query';
import { ProductImage, ProductAttribute, ProductReview } from '@/types/product.types';

interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrent: boolean;
}

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params?.id as string ?? '0');
  const { addToCart } = useCart();
  const queryClient = useQueryClient();
  
  // State for UI
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToCart, setAddedToCart] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);

  // Fetch product data using React Query
  const { 
    data: productData, 
    isLoading: isLoadingProduct,
    error: productError 
  } = useProduct(productId);

  // Fetch related products based on the product category
  const {
    data: relatedProductsData,
    isLoading: isLoadingRelated
  } = useProducts({
    category: productData?.categories?.[0]?.name,
    limit: 4
  });

  // Filter related products to exclude the current one
  const relatedProducts = relatedProductsData?.products?.filter(p => p.id !== productId) || [];

  // Update breadcrumbs when product data loads
  useEffect(() => {
    if (productData) {
      // Save product to recently viewed
      const saveToRecentlyViewed = () => {
        try {
          const recentlyViewed = localStorage.getItem('recentlyViewed');
          let viewedIds: number[] = recentlyViewed ? JSON.parse(recentlyViewed) : [];
          
          // Remove current product if it exists and add it to the front
          viewedIds = viewedIds.filter(id => id !== productData.id);
          viewedIds.unshift(productData.id);
          
          // Limit to 10 recent products
          viewedIds = viewedIds.slice(0, 10);
          
          localStorage.setItem('recentlyViewed', JSON.stringify(viewedIds));
        } catch (error) {
          console.error('Error saving recently viewed products:', error);
        }
      };
      
      // Build breadcrumbs
      setBreadcrumbs([
        { label: 'Home', path: '/', isCurrent: false },
        { label: 'Shop', path: '/shop', isCurrent: false },
        { label: productData.categories[0]?.name || 'Uncategorized', path: `/shop?category=${encodeURIComponent(productData.categories[0]?.name || '')}`, isCurrent: false },
        { label: productData.name, path: `/product/${productData.id}`, isCurrent: true }
      ]);
      
      saveToRecentlyViewed();
    }
  }, [productData]);

  // Reset activeImage when product changes
  useEffect(() => {
    setActiveImage(0);
  }, [productId]);

  // Main image and thumbnail handling function
  const handleThumbnailClick = (index: number) => {
    setActiveImage(index);
  };
  
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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productData) return;
    
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= productData.best_vendor.stock) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (!productData) return;
    
    if (quantity < productData.best_vendor.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (productData) {
      addToCart(productData.id, quantity);
      setAddedToCart(true);
      
      // Reset the flag after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2500);

      // Prefetch cart data
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    }
  };
  
  // Handle quick add to cart for related products
  const handleQuickAddToCart = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
    
    // Prefetch cart data
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  };

  // Loading state
  if (isLoadingProduct) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-[#4DA9FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Product not found
  if (!productData || productError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-500 text-3xl">?</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">We couldn&apos;t find the robot you&apos;re looking for. It may have been moved or doesn&apos;t exist.</p>
            <Link href="/shop" className={commonButtonStyles.primary}>
              Browse All Robots
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          
          {/* Product Details Section */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Product Images */}
              <div className="p-6 lg:p-10 order-2 lg:order-1 bg-gradient-to-br from-gray-50 to-white">
                {/* Main Image */}
                <div className="relative h-[400px] md:h-[500px] mb-6 rounded-xl overflow-hidden bg-white">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <motion.div
                      key={activeImage}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full relative"
                    >
                      <Image
                        src={productData.images?.[activeImage]?.url || ''}
                        alt={`${productData.name} - View ${activeImage + 1}`}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                      />
                    </motion.div>
                  </div>
                  
                  {/* Category badge floating on image */}
                  <div className="absolute top-4 left-4 z-10">
                    {productData.categories && productData.categories.length > 0 && (
                      <CategoryTag 
                        category={productData.categories[0].name}
                        size="md"
                        className="shadow-md"
                      />
                    )}
                  </div>
                  
                  {/* Favorite button floating */}
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center z-10"
                  >
                    {isFavorite ? 
                      <FaHeart className="text-red-500" size={18} /> : 
                      <FaRegHeart className="text-gray-500 hover:text-red-500 transition-colors" size={18} />
                    }
                  </motion.button>
                </div>
                
                {/* Image Thumbnails - Cleaner Grid Layout */}
                <div className="grid grid-cols-5 gap-3">
                  {productData.images && productData.images.map((image:ProductImage, index: number) => (
                    index < 5 && (
                      <motion.button 
                        key={`thumb-${index}`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleThumbnailClick(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden bg-white shadow-sm ${
                          activeImage === index 
                            ? 'ring-2 ring-[#4DA9FF] ring-offset-2' 
                            : 'border border-gray-200 hover:border-[#4DA9FF]'
                        } transition-all duration-200`}
                      >
                        <Image
                          src={image.url || ''}
                          alt={`${productData.name} thumbnail ${index + 1}`}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 768px) 20vw, 10vw"
                        />
                      </motion.button>
                    )
                  ))}
                </div>
              </div>
              
              {/* Right Side - Product Information */}
              <div className="p-6 lg:p-10 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-gray-100">
                {/* Product Title Section */}
                <div className="mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    {productData.name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="text-[#4DA9FF] font-medium">by {productData.brand}</span>
                    <div className="flex items-center">
                      <div className="flex mr-1.5">
                        {renderRatingStars(productData.ratings.average)}
                      </div>
                      <Link href="#reviews" onClick={() => setActiveTab('reviews')} className="text-gray-600 hover:text-[#4DA9FF] transition-colors">
                        {productData.reviews.length} reviews
                      </Link>
                    </div>
                    <span className="text-green-600 font-medium flex items-center">
                      <FaCheck size={12} className="mr-1.5" /> In Stock
                    </span>
                  </div>
                </div>
                
                {/* Price Section - Simplified */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-[#4DA9FF] mb-3">
                    ${productData.best_vendor.price.toLocaleString()}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <FaShippingFast className="mr-1.5 text-[#4DA9FF]" />
                      Free Shipping
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaCreditCard className="mr-1.5 text-[#4DA9FF]" />
                      Financing Available
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaExchangeAlt className="mr-1.5 text-[#4DA9FF]" />
                      30-Day Returns
                    </div>
                  </div>
                </div>
                
                {/* Description Preview */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 mb-8">
                  <p className="text-gray-700 leading-relaxed">
                    {productData.description.length > 250 
                      ? `${productData.description.substring(0, 250)}...` 
                      : productData.description}
                  </p>
                  {productData.description.length > 250 && (
                    <button 
                      onClick={() => setActiveTab('description')} 
                      className="text-[#4DA9FF] font-medium text-sm mt-2 hover:underline flex items-center"
                    >
                      Read More <FaArrowRight className="ml-1 h-3 w-3" />
                    </button>
                  )}
                </div>
                
                {/* Key Features / Attributes - Simplified to match reference design */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                    <FaAward className="mr-2 text-[#4DA9FF]" />
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                    {productData.attributes.slice(0, 6).map((attribute: ProductAttribute, index: number) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 p-1 rounded-full bg-blue-50 text-[#4DA9FF] mr-2">
                          <FaCheck className="h-3 w-3" />
                        </div>
                        <p className="text-gray-700">
                          <span className="font-medium text-gray-900">{attribute.key}:</span>{' '}
                          {attribute.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Add to Cart Section - Simplified */}
                <div className="mb-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                  {/* Quantity and stock section */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-700 mr-4">Quantity:</p>
                      {/* Quantity selector */}
                      <div className="flex border border-blue-300 rounded-lg overflow-hidden bg-white shadow-sm">
                        <button 
                          onClick={decreaseQuantity}
                          className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-blue-50"
                          disabled={quantity <= 1}
                        >
                          <span className="text-xl font-medium">−</span>
                        </button>
                        
                        <div className="relative w-12 h-10">
                          <input
                            type="text"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="absolute inset-0 text-center border-x border-blue-300 h-full w-full focus:outline-none bg-white text-gray-700"
                            aria-label="Quantity"
                          />
                        </div>
                        
                        <button 
                          onClick={increaseQuantity}
                          className="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-blue-50"
                          disabled={quantity >= productData.best_vendor.stock}
                        >
                          <span className="text-xl font-medium">+</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center bg-white px-3 py-1.5 rounded-lg">
                      <span className="font-medium text-green-600 mr-1.5 flex items-center">
                        <FaCheck size={12} className="mr-1.5" />
                        In Stock:
                      </span>
                      <span className="font-medium text-gray-900">{productData.best_vendor.stock} units</span>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button 
                    className={`w-full py-3 rounded-lg font-bold text-lg flex items-center justify-center ${
                      addedToCart 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-[#4DA9FF] hover:bg-[#3D89FF]'
                    } text-white shadow-md transition-colors`}
                    onClick={handleAddToCart}
                  >
                    <FaShoppingCart size={18} className="mr-3" />
                    {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                </div>
                
                {/* Remove duplicate benefit icons - these are shown above */}
                
                {/* Additional Info - Keep this section */}
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Model: <span className="text-gray-900 font-medium">{productData.name.replace(/\s+/g, '-').toUpperCase()}</span></div>
                    <div>SKU: <span className="text-gray-900 font-medium">{productData.brand.substring(0, 2).toUpperCase()}-{productData.id}00{Math.floor(Math.random() * 900) + 100}</span></div>
                    <div>Warranty: <span className="text-gray-900 font-medium">2 Years</span></div>
                    <div>Support: <span className="text-gray-900 font-medium">24/7 Assistance</span></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="border-t border-gray-200 bg-white">
              <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 px-4">
                <button 
                  onClick={() => setActiveTab('description')} 
                  className={`px-8 py-5 font-medium relative ${
                    activeTab === 'description' 
                      ? 'text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Full Description
                  {activeTab === 'description' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DA9FF]"
                    />
                  )}
                </button>
                
                <button 
                  onClick={() => setActiveTab('specifications')} 
                  className={`px-8 py-5 font-medium relative ${
                    activeTab === 'specifications' 
                      ? 'text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Specifications
                  {activeTab === 'specifications' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DA9FF]"
                    />
                  )}
                </button>
                
                <button 
                  id="reviews"
                  onClick={() => setActiveTab('reviews')} 
                  className={`px-8 py-5 font-medium relative ${
                    activeTab === 'reviews' 
                      ? 'text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Customer Reviews ({productData.reviews.length})
                  {activeTab === 'reviews' && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4DA9FF]"
                    />
                  )}
                </button>
              </div>
              
              <div className="p-6 lg:p-10">
                {/* Description Content */}
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="mb-4 leading-relaxed text-gray-700">{productData.description}</p>                    
                  </div>
                )}
                
                {/* Specifications Content */}
                {activeTab === 'specifications' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {productData.attributes.map((attr: ProductAttribute, index: number) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                          <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-2">{attr.key}</h4>
                          <p className="font-medium text-gray-900">{attr.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Reviews Content */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="bg-blue-50 rounded-xl p-6 mb-8 border border-blue-100">
                      <div className="flex flex-wrap justify-between gap-6">
                        <div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900">Customer Feedback</h3>
                          <div className="flex items-center gap-3">
                            <div className="flex">
                              {renderRatingStars(productData.ratings.average)}
                            </div>
                            <span className="text-2xl font-bold text-gray-900">{productData.ratings.average.toFixed(1)}</span>
                            <span className="text-gray-500">out of 5</span>
                          </div>
                          <p className="text-gray-700 mt-1">{productData.ratings.count} global ratings</p>
                        </div>
                        
                        <div>
                          <button className="bg-white px-6 py-3 rounded-lg border border-gray-200 hover:border-[#4DA9FF] text-gray-800 font-medium transition-colors">
                            Write a Review
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-8">
                      {productData.reviews.map((review: ProductReview, index: number) => (
                        <motion.div 
                          key={index} 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border-b border-gray-100 pb-8 last:border-b-0"
                        >
                          <div className="flex flex-wrap justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-lg">{review.author}</p>
                              <div className="flex mt-1">
                                {renderRatingStars(review.rating)}
                              </div>
                            </div>
                            <p className="text-gray-500 text-sm bg-gray-100 px-3 py-1 rounded-full">{review.date}</p>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          <section className="mb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
              <Link 
                href="/shop" 
                className="text-[#4DA9FF] font-medium flex items-center hover:underline"
              >
                View All <FaArrowRight className="ml-2" size={12} />
              </Link>
            </div>
            
            {isLoadingRelated ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 border-4 border-t-4 border-[#4DA9FF] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <motion.div 
                    key={product.id} 
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    className={`bg-white border border-gray-100 rounded-2xl overflow-hidden h-full flex flex-col transition-shadow duration-300`}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-100 group">
                      <div className="absolute inset-0 flex items-center justify-center bg-white">
                        <Image
                          src={product.images?.[0]?.url || ''}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="object-contain w-full h-full p-4"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"></div>
                      
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => handleQuickAddToCart(e, product.id)}
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <FaShoppingCart size={16} />
                      </motion.button>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="mb-auto">
                        <div className="flex justify-between items-start mb-2">
                          {product.categories && product.categories.length > 0 && (
                            <CategoryTag 
                              category={product.categories[0].name}
                              size="sm"
                            />
                          )}
                        </div>
                        
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors line-clamp-2 mb-1">
                            {product.name}
                          </h3>
                        </Link>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex">
                            {renderRatingStars(product.ratings.average)}
                          </div>
                          <span className="text-gray-500 text-xs ml-2">({product.ratings.count})</span>
                        </div>
                        
                        <p className="text-xl font-bold text-[#4DA9FF]">${product.best_vendor.price.toLocaleString()}</p>
                      </div>
                      
                      <div className="mt-4">
                        <Link 
                          href={`/product/${product.id}`}
                          className="block w-full py-2.5 text-center border border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white font-medium rounded-lg transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}