"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaShoppingCart } from 'react-icons/fa';

export default function FeaturedRobots() {
  // Sample featured robots data
  const featuredRobots = [
    {
      id: 1,
      name: "Companion X1",
      price: 5999,
      rating: 4.5,
      image: "/images/robot1.jpg",
      category: "Companion"
    },
    {
      id: 2,
      name: "TaskMaster Pro",
      price: 8999,
      rating: 5,
      image: "/images/robot2.jpg",
      category: "Utility"
    },
    {
      id: 3,
      name: "HomeGuard 360",
      price: 7499,
      rating: 4,
      image: "/images/robot3.jpg",
      category: "Security"
    },
    {
      id: 4,
      name: "EduBot Teacher",
      price: 6499,
      rating: 4.5,
      image: "/images/robot4.jpg",
      category: "Education"
    }
  ];

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

  return (
    <section id="featured-robots" className="py-16 bg-gray-50 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Robots</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular humanoid robot models trusted by customers worldwide
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredRobots.map(robot => (
            <div key={robot.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full">
                {/* Replace with actual robot images */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">[Robot Image]</span>
                </div>
              </div>
              
              <div className="p-5">
                <span className="text-sm text-[#4DA9FF] font-medium">{robot.category}</span>
                <h3 className="font-bold text-lg mt-1">{robot.name}</h3>
                
                <div className="flex items-center mt-2">
                  <div className="flex">
                    {renderRatingStars(robot.rating)}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({Math.floor(Math.random() * 100) + 50})</span>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-lg">${robot.price.toLocaleString()}</span>
                  <button className="w-10 h-10 rounded-full bg-[#4DA9FF]/10 flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-colors duration-200">
                    <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Link 
            href="/shop" 
            className="inline-block bg-white border-2 border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            View All Robots
          </Link>
        </div>
      </div>
    </section>
  );
}