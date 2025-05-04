"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaShoppingCart } from 'react-icons/fa';
import { useCart } from '@/utils/cartContext';
import { products } from '@/utils/productData';
import { motion } from 'framer-motion';

export default function FeaturedRobots() {
  // Get the first 4 products from productData
  const featuredRobots = products.slice(0, 4);
  
  // Use cart context to add products to cart
  const { addToCart } = useCart();

  // Function to render star ratings using React Icons
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
  
  // Handle add to cart button click
  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
  };

  return (
    <section id="featured-robots" className="py-16 bg-gray-50 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
            Featured <span className="text-[#4DA9FF]">Robots</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our most popular humanoid robot models trusted by customers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredRobots.map(robot => (
            <motion.div 
              key={robot.id} 
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <Link href={`/product/${robot.id}`} className="block">
                <div className="relative h-56 w-full overflow-hidden">
                  {/* Display actual robot image */}
                  <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                    <Image
                      src={robot.image}
                      alt={robot.name}
                      width={300}
                      height={300}
                      className="object-contain w-full h-full"
                      priority={robot.id === 1}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <button 
                    onClick={(e) => handleAddToCart(e, robot.id)}
                    aria-label={`Add ${robot.name} to cart`}
                    className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    <FaShoppingCart size={18} />
                  </button>
                </div>
              </Link>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-2">{robot.category}</span>
                    <Link href={`/product/${robot.id}`}>
                      <h3 className="font-bold text-xl text-gray-800 hover:text-[#4DA9FF] transition-colors">{robot.name}</h3>
                    </Link>
                  </div>
                  <span className="font-bold text-xl text-gray-800">${robot.price.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center mt-3">
                  <div className="flex">
                    {renderRatingStars(robot.rating)}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({robot.reviews.length} reviews)</span>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Link 
                    href={`/product/${robot.id}`}
                    className="text-[#4DA9FF] text-sm font-medium hover:text-[#3D99FF] border-b border-transparent hover:border-[#4DA9FF] pb-0.5 transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/shop" 
            className="inline-block bg-white border-2 border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md"
          >
            View All Robots
          </Link>
        </div>
      </div>
    </section>
  );
}