"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import AddToCartButton from '@/components/ui/AddToCartButton';
import { commonCardStyles } from '@/styles/commonStyles';

// Define Product type based on our database schema
interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image_url: string;
  rating: number;
  review_count: number;
  position?: number;
}

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

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    console.log('Starting to fetch featured products via API...');
    
    const response = await fetch('/api/products/featured', {
      next: { revalidate: 600 } // Cache for 10 minutes
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching featured products: ${response.status}`);
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

export default function FeaturedRobots() {
  const [featuredRobots, setFeaturedRobots] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Load featured products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      console.log('FeaturedRobots: Attempting to load products...');
      try {
        const products = await getFeaturedProducts();
        console.log('FeaturedRobots: Products loaded:', products);
        setFeaturedRobots(products);
        setLoading(false);
      } catch (error) {
        console.error('FeaturedRobots: Error loading products:', error);
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  // Update items per page based on screen size
  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height;
      
      // Special handling for iPhone in landscape
      if (isLandscape && height < 500) {
        setItemsPerPage(2); // Force 2 items for iPhone landscape
      } else if (width < 540) {
        setItemsPerPage(1);
      } else if (width < 768) {
        setItemsPerPage(2);
      } else if (width < 1024) {
        setItemsPerPage(3);
      } else {
        setItemsPerPage(4);
      }
    };

    // Set initial value
    updateItemsPerPage();
    
    // Add event listener for window resize
    window.addEventListener('resize', updateItemsPerPage);
    
    // Clean up
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(featuredRobots.length / itemsPerPage);

  // Navigate to previous page
  const prevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };
  
  // Navigate to next page
  const nextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Get current robots to display
  const getCurrentRobots = () => {
    const startIndex = currentPage * itemsPerPage;
    if (featuredRobots.length <= itemsPerPage) {
      return featuredRobots;
    }
    
    // Handle wrap-around for circular navigation
    if (startIndex + itemsPerPage > featuredRobots.length) {
      const firstPart = featuredRobots.slice(startIndex);
      const secondPart = featuredRobots.slice(0, itemsPerPage - firstPart.length);
      return [...firstPart, ...secondPart];
    }
    
    return featuredRobots.slice(startIndex, startIndex + itemsPerPage);
  };

  if (loading) {
    return (
      <section id="featured-robots" className="py-16 bg-gray-50 px-4 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
              Featured <span className="text-[#4DA9FF]">Robots</span>
            </h2>
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-t-4 border-[#4DA9FF] border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // If no products, don't render anything
  if (featuredRobots.length === 0) {
    return null;
  }
  
  // Get robots to display in current view
  const currentRobots = getCurrentRobots();
  
  return (
    <section id="featured-robots" className="py-16 bg-gray-50 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-gray-800">
            Featured <span className="text-[#4DA9FF]">Robots</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Discover our most popular humanoid robot models trusted by customers worldwide
          </p>
        </div>
        
        {/* Multi-product carousel */}
        <div ref={containerRef} className="relative max-w-6xl mx-auto">
          {featuredRobots.length > itemsPerPage && (
            <>
              <button 
                onClick={prevPage}
                className="absolute -left-2 md:-left-6 top-1/3 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-[#4DA9FF] hover:text-white transition-all duration-300"
                aria-label="Previous page"
              >
                <FaChevronLeft className="text-xs sm:text-base" />
              </button>
              
              <button 
                onClick={nextPage}
                className="absolute -right-2 md:-right-6 top-1/3 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-[#4DA9FF] hover:text-white transition-all duration-300"
                aria-label="Next page"
              >
                <FaChevronRight className="text-xs sm:text-base" />
              </button>
            </>
          )}
          
          <div ref={carouselRef} className="overflow-hidden px-2">
            <div className={`grid gap-4 md:gap-6 ${
              // Dynamic grid columns based on items per page
              itemsPerPage === 1 ? 'grid-cols-1' : 
              itemsPerPage === 2 ? 'grid-cols-2' : 
              itemsPerPage === 3 ? 'grid-cols-3' : 
              'grid-cols-4'
            }`}>
              {currentRobots.map((robot) => (
                <div 
                  key={robot.id} 
                  className={`${commonCardStyles.container} transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg`}
                >
                  <Link href={`/product/${robot.id}`} className="block">
                    <div className="relative h-36 sm:h-48 w-full overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center p-2">
                        <Image
                          src={robot.image_url}
                          alt={robot.name}
                          width={300}
                          height={300}
                          className="object-contain w-full h-full"
                          priority={robot.position === 1}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>
                  
                  <div className="p-3 sm:p-4">
                    <span className="inline-block px-2 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-1 sm:mb-2 mt-3">
                      {robot.category}
                    </span>
                    
                    <div className="flex flex-col mb-1 sm:mb-2">
                      <Link href={`/product/${robot.id}`}>
                        <h3 className="font-bold text-base sm:text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors line-clamp-1 sm:line-clamp-2">
                          {robot.name}
                        </h3>
                      </Link>
                      <span className="font-bold text-base sm:text-lg text-gray-800 mt-1">
                        ${robot.price.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="flex items-center text-xs sm:text-sm">
                        {renderRatingStars(robot.rating)}
                      </div>
                      <span className="text-gray-500 text-xs ml-1 sm:ml-2">
                        ({robot.review_count})
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <Link
                        href={`/product/${robot.id}`}
                        className="text-[#4DA9FF] text-xs sm:text-sm font-medium hover:text-[#3D99FF] border-b border-transparent hover:border-[#4DA9FF] pb-0.5 transition-all duration-200"
                      >
                        View Details
                      </Link>
                      <AddToCartButton productId={robot.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Page Indicators */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentPage ? 'bg-[#4DA9FF] w-5' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
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
