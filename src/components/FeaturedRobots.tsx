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
            <div key={robot.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              <div className="relative h-56 w-full overflow-hidden group">
                {/* Placeholder for robot image */}
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                  <span className="text-gray-500 font-medium">[{robot.name}]</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer">
                  <FaShoppingCart size={18} />
                </button>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-3 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-2">{robot.category}</span>
                    <h3 className="font-bold text-xl text-gray-800 hover:text-[#4DA9FF] transition-colors">{robot.name}</h3>
                  </div>
                  <span className="font-bold text-xl text-gray-800">${robot.price.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center mt-3">
                  <div className="flex">
                    {renderRatingStars(robot.rating)}
                  </div>
                  <span className="text-gray-500 text-sm ml-2">({Math.floor(Math.random() * 100) + 50} reviews)</span>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Link 
                    href={`/robot/${robot.id}`}
                    className="text-[#4DA9FF] text-sm font-medium hover:text-[#3D99FF] border-b border-transparent hover:border-[#4DA9FF] pb-0.5 transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
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