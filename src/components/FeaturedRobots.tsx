"use client";

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { supabase } from '@/utils/supabaseClient';
import AddToCartButton from '@/components/ui/AddToCartButton';

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

// Define the shape of data coming from Supabase for featured products query
interface FeaturedProductData {
  position: number;
  product_id: number;
  products: Array<{
    id: number;
    name: string;
    vendor_products?: Array<{ price: number }>;
    product_categories?: Array<{ 
      categories: Array<{ 
        name: string 
      }> 
    }>;
    product_images?: Array<{ url: string }>;
  }>;
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
    console.log('Starting to fetch featured products...');
    // Modified query to directly get product ratings
    const { data, error } = await supabase
      .from('featured_products')
      .select(`
        position,
        product_id,
        products:product_id (
          id,
          name,
          vendor_products (
            price
          ),
          product_categories (
            categories:category_id (
              name
            )
          ),
          product_images (
            url
          )
        )
      `)
      .order('position')
      .limit(6);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    if (!data || data.length === 0) {
      console.log('No featured products found in database');
      return [];
    }

    console.log('Featured products raw data:', data);
    
    // Get all product IDs to fetch ratings in a separate query
    const productIds = data.map(item => item.product_id);

    // Fetch ratings for all products in a single query
    const { data: ratingsData, error: ratingsError } = await supabase
      .from('product_ratings')
      .select('product_id, average_rating, rating_count')
      .in('product_id', productIds);

    if (ratingsError) {
      console.error('Error fetching ratings:', ratingsError);
    }

    // Create a map of product_id to ratings data for easy lookup
    const ratingsMap = new Map();
    if (ratingsData) {
      ratingsData.forEach(rating => {
        ratingsMap.set(rating.product_id, {
          rating: parseFloat(rating.average_rating) || 0,
          count: parseInt(rating.rating_count) || 0
        });
      });
    }

    // Transform the data to match our Product interface
    return data.map(item => {
      // Get rating and review count from our ratings map
      const ratingInfo = ratingsMap.get(item.product_id) || { rating: 0, count: 0 };

      // Check if products is an array or a direct object
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      
      if (!product) {
        console.warn(`No product data found for product_id: ${item.product_id}`);
        return null;
      }
      
      return {
        id: product.id,
        name: product.name,
        price: product.vendor_products?.[0]?.price || 0,
        category: product.product_categories?.[0]?.categories?.name || 'Unknown',
        image_url: product.product_images?.[0]?.url || '/images/robot1.png', // Fallback image
        rating: ratingInfo.rating,
        review_count: ratingInfo.count,
        position: item.position
      };
    }).filter(Boolean) as Product[]; // Filter out any null products
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

export default function FeaturedRobots() {
  const [featuredRobots, setFeaturedRobots] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
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
  
  // Calculate how many items to show at once based on screen size
  const [itemsPerView, setItemsPerView] = useState(4);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2);
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3);
      } else {
        setItemsPerView(4);
      }
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Navigate to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, Math.ceil(featuredRobots.length / itemsPerView) - 1));
  };

  // Scroll the carousel when currentSlide changes
  useEffect(() => {
    if (carouselRef.current) {
      const scrollAmount = currentSlide * carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }, [currentSlide, itemsPerView]);

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
  
  return (
    <section id="featured-robots" className="py-16 bg-gray-50 px-4 lg:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-800">
            Featured <span className="text-[#4DA9FF]">Robots</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover our most popular humanoid robot models trusted by customers worldwide
          </p>
        </div>
        
        <div className="relative">
          {/* Carousel Navigation Buttons */}
          <button 
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
            aria-label="Previous slide"
          >
            <FaChevronLeft />
          </button>
          
          <button 
            onClick={nextSlide}
            disabled={currentSlide >= Math.ceil(featuredRobots.length / itemsPerView) - 1}
            className={`absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 ${currentSlide >= Math.ceil(featuredRobots.length / itemsPerView) - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'}`}
            aria-label="Next slide"
          >
            <FaChevronRight />
          </button>
          
          {/* Carousel Container */}
          <div 
            ref={carouselRef}
            className="overflow-hidden"
          >
            <div 
              className="flex transition-transform duration-300 gap-6"
              style={{ 
                width: `${(100 / itemsPerView) * featuredRobots.length}%`
              }}
            >
              {featuredRobots.map(robot => (
                <div 
                  key={robot.id} 
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  style={{ width: `${100 / featuredRobots.length}%` }}
                >
                  <Link href={`/product/${robot.id}`} className="block">
                    <div className="relative h-56 w-full overflow-hidden">
                      {/* Display actual robot image */}
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <Image
                          src={robot.image_url}
                          alt={robot.name}
                          width={300}
                          height={300}
                          className="object-contain w-full h-full"
                          priority={robot.position === 1}
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <AddToCartButton productId={robot.id} />
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
                      <span className="text-gray-500 text-sm ml-2">({robot.review_count} reviews)</span>
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
                </div>
              ))}
            </div>
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(featuredRobots.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-[#4DA9FF] w-8' : 'bg-gray-300'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
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
