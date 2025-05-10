"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaStar, FaStarHalfAlt, 
  FaCheck, FaArrowRight, FaShoppingCart, FaHeart, FaRegHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { commonButtonStyles, commonCardStyles } from '@/styles/commonStyles';
import { useCart } from '@/utils/cartContext';
import { useProduct, useProducts } from '@/utils/queryHooks';
import { useQueryClient } from '@tanstack/react-query';

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
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          
          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Product Images */}
              <div className="p-6 lg:p-8">
                {/* Main Image */}
                <div className="relative h-[400px] mb-5 rounded-lg overflow-hidden bg-white border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={productData.images?.[activeImage]?.url || ''}
                      alt={`${productData.name} - View ${activeImage + 1}`}
                      width={600}
                      height={600}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                </div>
                
                {/* Image Carousel */}
                <div className="grid grid-cols-4 gap-3">
                  {/* Explicitly render each image with a key */}
                  {productData.images && productData.images.length > 0 && (
                    <>
                      <button 
                        key="img-0"
                        onClick={() => handleThumbnailClick(0)}
                        className={`relative h-20 rounded-md overflow-hidden bg-white border ${activeImage === 0 ? 'border-[#4DA9FF]' : 'border-gray-200'} hover:border-[#4DA9FF] transition-all cursor-pointer`}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image
                            src={productData.images[0]?.url || ''}
                            alt={`${productData.name} thumbnail 1`}
                            width={100}
                            height={100}
                            className="object-contain w-full h-full"
                          />
                        </div>
                      </button>
                      
                      {productData.images[1] && (
                        <button 
                          key="img-1"
                          onClick={() => handleThumbnailClick(1)}
                          className={`relative h-20 rounded-md overflow-hidden bg-white border ${activeImage === 1 ? 'border-[#4DA9FF]' : 'border-gray-200'} hover:border-[#4DA9FF] transition-all cursor-pointer`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                              src={productData.images[1]?.url || ''}
                              alt={`${productData.name} thumbnail 2`}
                              width={100}
                              height={100}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </button>
                      )}
                      
                      {productData.images[2] && (
                        <button 
                          key="img-2"
                          onClick={() => handleThumbnailClick(2)}
                          className={`relative h-20 rounded-md overflow-hidden bg-white border ${activeImage === 2 ? 'border-[#4DA9FF]' : 'border-gray-200'} hover:border-[#4DA9FF] transition-all cursor-pointer`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                              src={productData.images[2]?.url || ''}
                              alt={`${productData.name} thumbnail 3`}
                              width={100}
                              height={100}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </button>
                      )}
                      
                      {productData.images[3] && (
                        <button 
                          key="img-3"
                          onClick={() => handleThumbnailClick(3)}
                          className={`relative h-20 rounded-md overflow-hidden bg-white border ${activeImage === 3 ? 'border-[#4DA9FF]' : 'border-gray-200'} hover:border-[#4DA9FF] transition-all cursor-pointer`}
                        >
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Image
                              src={productData.images[3]?.url || ''}
                              alt={`${productData.name} thumbnail 4`}
                              width={100}
                              height={100}
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              {/* Right Side - Product Information */}
              <div className="p-6 lg:p-8 bg-gray-50">
                {/* Product Category Badge */}
                <div className="mb-2">
                  <span className={commonCardStyles.categoryBadge}>
                    {productData.categories[0].name}
                  </span>
                </div>
                
                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {productData.name}
                </h1>
                
                {/* Brand */}
                <p className="text-gray-600 mb-4">by <span className="text-[#4DA9FF] font-medium">{productData.brand}</span></p>
                
                {/* Rating */}
                <div className="flex items-center mb-5">
                  <div className="flex mr-2">
                    {renderRatingStars(productData.ratings.average)}
                  </div>
                  <span className="text-gray-600 text-sm">{productData.reviews.length} reviews</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-green-600 font-medium flex items-center">
                    <FaCheck size={12} className="mr-1" /> In Stock ({productData.best_vendor.stock})
                  </span>
                </div>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-[#4DA9FF]">${productData.best_vendor.price.toLocaleString()}</span>
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">Free Shipping</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Financing options available at checkout</p>
                </div>
                
                {/* Short Description */}
                <p className="text-gray-700 mb-6">
                  {productData.description.substring(0, 150)}...
                </p>
                
                {/* Key Attributes List */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Attributes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                    {productData.attributes.slice(0, 4).map((attribute, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-green-500 mr-2">
                          <FaCheck className="h-5 w-5" />
                        </div>
                        <p className="text-gray-600"><span className="font-medium">{attribute.key}:</span> {attribute.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Add to Cart Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={decreaseQuantity}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-gray-100 rounded-l-lg"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={productData.best_vendor.stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-14 text-center border-x border-gray-300 h-10 focus:outline-none focus:ring-0 focus:border-gray-300 text-gray-700"
                      />
                      <button 
                        onClick={increaseQuantity}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-gray-100 rounded-r-lg"
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Favorite Button */}
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500"
                    >
                      {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-4 relative">
                    <AnimatePresence>
                      {addedToCart ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10"
                        >
                          <div className="bg-green-500 text-white rounded-lg py-3 px-4 shadow-lg flex items-center justify-center w-full h-full">
                            <FaCheck className="mr-2" size={18} />
                            <span className="font-medium">Added to Cart!</span>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center ${commonButtonStyles.primary}`}
                      onClick={handleAddToCart}
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <div>Model: <span className="text-gray-800 font-medium">{productData.name.replace(/\s+/g, '-').toUpperCase()}</span></div>
                    <div>SKU: <span className="text-gray-800 font-medium">{productData.brand.substring(0, 2).toUpperCase()}-{productData.id}00{Math.floor(Math.random() * 900) + 100}</span></div>
                  </div>
                  <p className="text-sm text-gray-600">Free 30-day returns & 2-year warranty included</p>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="border-t border-gray-200">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button 
                  onClick={() => setActiveTab('description')} 
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'description' 
                      ? 'border-b-2 border-[#4DA9FF] text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Full Description
                </button>
                
                <button 
                  onClick={() => setActiveTab('specifications')} 
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'specifications' 
                      ? 'border-b-2 border-[#4DA9FF] text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Specifications
                </button>
                
                <button 
                  onClick={() => setActiveTab('reviews')} 
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'reviews' 
                      ? 'border-b-2 border-[#4DA9FF] text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Customer Reviews ({productData.reviews.length})
                </button>
              </div>
              
              <div className="p-6 lg:p-8">
                {/* Description Content */}
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="mb-4">{productData.description}</p>                    
                  </div>
                )}
                
                {/* Specifications Content */}
                {activeTab === 'specifications' && (
                  <div>
                    <table className="w-full text-left">
                      <tbody>
                        {productData.attributes.map((attr, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 font-medium text-gray-700 capitalize">{attr.key}</td>
                            <td className="px-6 py-4 text-gray-700">{attr.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* Reviews Content */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Customer Feedback</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex mr-4">
                          {renderRatingStars(productData.ratings.average)}
                        </div>
                        <span className="text-2xl font-semibold text-gray-800">{productData.ratings.average.toFixed(1)}</span>
                        <span className="text-gray-500 ml-2">out of 5</span>
                      </div>
                      <p className="text-gray-600">{productData.ratings.count} global ratings</p>
                    </div>
                    
                    <div className="space-y-6">
                      {productData.reviews.map((review, index) => (
                        <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                          <div className="flex justify-between mb-2">
                            <p className="font-medium">{review.author}</p>
                            <p className="text-gray-500 text-sm">{review.date}</p>
                          </div>
                          <div className="flex mb-3">
                            {renderRatingStars(review.rating)}
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product) => (
                  <motion.div 
                    key={product.id} 
                    whileHover={{ y: -3 }}
                    className={commonCardStyles.container}
                  >
                    <div className={commonCardStyles.imageContainer}>
                      {/* Display actual robot image */}
                      <div className={`${commonCardStyles.imagePlaceholder} bg-white`}>
                        <Image
                          src={product.images?.[0]?.url || ''}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="object-contain w-full h-full"
                        />
                      </div>
                      <div className={commonCardStyles.imageOverlay}></div>
                      <button 
                        onClick={(e) => handleQuickAddToCart(e, product.id)}
                        className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      >
                        <FaShoppingCart size={16} />
                      </button>
                    </div>
                    
                    <div className={`${commonCardStyles.content} flex flex-col h-[200px]`}>
                      <div className="flex justify-between items-start mb-auto">
                        <div className="flex-1 min-w-0">
                          <span className={commonCardStyles.categoryBadge}>
                            {product.categories && product.categories.length > 0 
                              ? product.categories[0].name 
                              : 'Uncategorized'}
                          </span>
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors truncate">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
                        </div>
                        <span className="font-bold text-lg text-[#4DA9FF] ml-2 whitespace-nowrap">${product.best_vendor.price.toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-center mt-3">
                        <div className="flex">
                          {renderRatingStars(product.ratings.average)}
                        </div>
                        <span className="text-gray-500 text-xs ml-2">({product.ratings.count})</span>
                      </div>
                      
                      <div className="mt-auto pt-4 pb-2">
                        <Link 
                          href={`/product/${product.id}`}
                          className={`w-full text-center ${commonButtonStyles.secondary}`}
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