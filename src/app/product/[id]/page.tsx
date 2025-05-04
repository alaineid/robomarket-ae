"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaRegHeart, FaArrowRight, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { commonButtonStyles, commonCardStyles } from '@/styles/commonStyles';
import { getProductById, getRelatedProducts, Product } from '@/utils/productData';

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  
  const [productData, setProductData] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);

  // Load product data based on ID
  useEffect(() => {
    // In a real app, this would be an API call
    const product = getProductById(productId);
    const related = getRelatedProducts(productId, 4);
    
    if (product) {
      setProductData(product);
      setRelatedProducts(related);
    }
    
    setLoading(false);
  }, [productId]);

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
    if (!isNaN(value) && value > 0 && value <= productData.stock) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (!productData) return;
    
    if (quantity < productData.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Loading state
  if (loading) {
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
  if (!productData) {
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
          <div className="mb-6 flex items-center text-sm">
            <Link href="/" className="text-gray-500 hover:text-[#4DA9FF]">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/shop" className="text-gray-500 hover:text-[#4DA9FF]">Shop</Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href={`/shop?category=${productData.category}`} className="text-gray-500 hover:text-[#4DA9FF]">{productData.category}</Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-[#4DA9FF]">{productData.name}</span>
          </div>
          
          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Product Images */}
              <div className="p-6 lg:p-8">
                {/* Main Image */}
                <div className="relative h-[400px] mb-5 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                    <div className="text-center">
                      <div className="w-32 h-32 mx-auto mb-4 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-500 font-bold text-2xl">ROBOT</span>
                      </div>
                      <p className="text-gray-500 font-medium">[{productData.name}]</p>
                    </div>
                  </div>
                </div>
                
                {/* Image Carousel */}
                <div className="grid grid-cols-4 gap-3">
                  {[0, 1, 2, 3].map((index) => (
                    <button 
                      key={index}
                      onClick={() => setActiveImage(index)}
                      className={`relative h-20 rounded-md overflow-hidden bg-gray-100 border ${activeImage === index ? 'border-[#4DA9FF]' : 'border-gray-200'} hover:border-[#4DA9FF] transition-all`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
                        <span className="text-xs text-gray-500">[View {index + 1}]</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Right Side - Product Information */}
              <div className="p-6 lg:p-8 bg-gray-50">
                {/* Product Category Badge */}
                <div className="mb-2">
                  <span className={commonCardStyles.categoryBadge}>
                    {productData.category}
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
                    {renderRatingStars(productData.rating)}
                  </div>
                  <span className="text-gray-600 text-sm">{productData.reviews.length} reviews</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-green-600 font-medium flex items-center">
                    <FaCheck size={12} className="mr-1" /> In Stock ({productData.stock})
                  </span>
                </div>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-[#4DA9FF]">${productData.price.toLocaleString()}</span>
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">Free Shipping</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Financing options available at checkout</p>
                </div>
                
                {/* Short Description */}
                <p className="text-gray-700 mb-6">
                  {productData.description.substring(0, 150)}...
                </p>
                
                {/* Key Features List */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {productData.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#4DA9FF] mr-2 mt-1">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
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
                        max={productData.stock}
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
                  <div className="grid grid-cols-1 gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center ${commonButtonStyles.primary}`}
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
                    <p className="mb-4">
                      Experience the future with the {productData.name}. This advanced {productData.category.toLowerCase()} robot 
                      combines cutting-edge artificial intelligence with elegant design to provide an unparalleled user experience.
                      Whether you need help managing your schedule, controlling smart home devices, or simply want a companion, 
                      the {productData.name} adapts to your unique needs.
                    </p>
                    <p className="mb-4">
                      With its advanced mobility system, the {productData.name} can navigate smoothly through your 
                      environment, avoiding obstacles and learning the layout over time to optimize its movement patterns. 
                      The robot&apos;s expressive interface and intuitive interactions create a natural experience that feels 
                      comfortable from day one.
                    </p>
                    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">All Features</h3>
                    <ul className="space-y-3">
                      {productData.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheck className="text-green-500 mr-3" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Specifications Content */}
                {activeTab === 'specifications' && (
                  <div>
                    <table className="w-full text-left">
                      <tbody>
                        {Object.entries(productData.specifications).map(([key, value], index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 font-medium text-gray-700 capitalize">{key}</td>
                            <td className="px-6 py-4 text-gray-700">{value}</td>
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
                          {renderRatingStars(productData.rating)}
                        </div>
                        <span className="text-2xl font-semibold text-gray-800">{productData.rating}</span>
                        <span className="text-gray-500 ml-2">out of 5</span>
                      </div>
                      <p className="text-gray-600">{productData.reviews.length} global ratings</p>
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
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  whileHover={{ y: -3 }}
                  className={commonCardStyles.container}
                >
                  <div className={commonCardStyles.imageContainer}>
                    {/* Placeholder for robot image */}
                    <div className={commonCardStyles.imagePlaceholder}>
                      <span className="text-gray-500 font-medium">[{product.name}]</span>
                    </div>
                    <div className={commonCardStyles.imageOverlay}></div>
                    <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                      <FaShoppingCart size={16} />
                    </button>
                  </div>
                  
                  <div className={`${commonCardStyles.content} flex flex-col h-[200px]`}>
                    <div className="flex justify-between items-start mb-auto">
                      <div className="flex-1 min-w-0">
                        <span className={commonCardStyles.categoryBadge}>
                          {product.category}
                        </span>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors truncate">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
                      </div>
                      <span className="font-bold text-lg text-[#4DA9FF] ml-2 whitespace-nowrap">${product.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex">
                        {renderRatingStars(product.rating)}
                      </div>
                      <span className="text-gray-500 text-xs ml-2">({product.reviews.length})</span>
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
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}