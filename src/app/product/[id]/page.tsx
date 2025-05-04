"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaHeart, FaRegHeart, FaArrowRight, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { commonButtonStyles, commonCardStyles, commonLayoutStyles } from '@/styles/commonStyles';

// Mock product data (this would come from an API in a real application)
const productData = {
  id: 1,
  name: "Syntho X-2000 Humanoid Assistant",
  price: 4999.99,
  rating: 4.5,
  brand: "RoboTech",
  category: "Companion",
  description: "The Syntho X-2000 is our most advanced humanoid assistant robot, designed to seamlessly integrate into your home or office environment. With advanced AI capabilities, natural language processing, and fluid movement, the X-2000 can assist with daily tasks, provide companionship, and serve as a personal assistant.",
  features: [
    "Advanced natural language processing",
    "Facial recognition and emotional response",
    "24/7 operation with quick-charging capability",
    "Adaptive learning AI system",
    "Human-like movement and gestures",
    "Voice command recognition from up to 20 feet away",
    "Multi-language support"
  ],
  specifications: {
    height: "5'7\" (170 cm)",
    weight: "165 lbs (75 kg)",
    battery: "Lithium-ion, 16 hours operation",
    processor: "Quantum Neural Processor X12",
    memory: "1 TB solid state",
    connectivity: "Wi-Fi 6, Bluetooth 5.2, 5G",
    sensors: "LiDAR, infrared, temperature, pressure, audio array"
  },
  stock: 12,
  reviews: [
    {
      author: "Alex Johnson",
      date: "April 15, 2025",
      rating: 5,
      comment: "The X-2000 has completely transformed how I manage my home office. The assistance with scheduling and communications alone is worth the investment!"
    },
    {
      author: "Maya Patel",
      date: "March 28, 2025",
      rating: 4,
      comment: "Impressive AI capabilities and very human-like interactions. Battery life could be better, but otherwise it's been a great addition to our family."
    },
    {
      author: "Carlos Rodriguez",
      date: "April 2, 2025",
      rating: 5,
      comment: "My elderly father has found a new companion in the X-2000. The robot has been helping him with medication reminders and keeping him engaged with conversation and games."
    }
  ],
  relatedProducts: [
    { id: 2, name: "HomeBot Pro", price: 3299.99, category: "Utility", rating: 4.0 },
    { id: 3, name: "EduMate Teaching Assistant", price: 3799.99, category: "Education", rating: 4.8 },
    { id: 4, name: "Guardian Security Bot", price: 4599.99, category: "Security", rating: 4.7 }
  ]
};

export default function ProductDetail() {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Array of placeholder images for the carousel
  const imageUrls = [
    "/placeholder-main.jpg",
    "/placeholder-angle1.jpg",
    "/placeholder-angle2.jpg",
    "/placeholder-detail.jpg",
  ];

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
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= productData.stock) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (quantity < productData.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

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
                      <p className="text-gray-500 font-medium">[Main Product Image]</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center ${commonButtonStyles.primary}`}
                    >
                      <FaShoppingCart className="mr-2" />
                      Add to Cart
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center ${commonButtonStyles.secondary}`}
                    >
                      Request Quote
                    </motion.button>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <div>Model: <span className="text-gray-800 font-medium">X2000-HMN-AST</span></div>
                    <div>SKU: <span className="text-gray-800 font-medium">RT-X2000-238</span></div>
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
                      Experience the future of home and office assistance with the Syntho X-2000. This advanced humanoid robot combines cutting-edge artificial intelligence with elegant design to provide an unparalleled user experience. Whether you need help managing your schedule, controlling smart home devices, or simply want a companion, the X-2000 adapts to your unique needs.
                    </p>
                    <p className="mb-4">
                      With its advanced mobility system, the X-2000 can navigate smoothly through your home or office environment, avoiding obstacles and learning the layout over time to optimize its movement patterns. The robot's expressive face and fluid gestures create a natural interaction experience that feels intuitive and comfortable.
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
              {productData.relatedProducts.map((product, index) => (
                <motion.div 
                  key={index} 
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
                  
                  <div className={commonCardStyles.content}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={commonCardStyles.categoryBadge}>
                          {product.category}
                        </span>
                        <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors">
                          {product.name}
                        </h3>
                      </div>
                      <span className="font-bold text-lg text-[#4DA9FF]">${product.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex">
                        {renderRatingStars(product.rating)}
                      </div>
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