import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

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
    const { data, error } = await supabase
      .from('featured_products')
      .select(`
        position,
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
          ),
          product_attributes (
            key,
            value
          )
        )
      `)
      .order('position')
      .limit(4);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Transform the data to match our Product interface
    return data.map(item => {
      const product = item.products as any; // Type assertion to deal with complex structure
      
      // Find rating and review count from attributes
      let rating = 0;
      let reviewCount = 0;
      
      if (product && product.product_attributes) {
        const ratingAttr = product.product_attributes.find((attr: any) => attr.key === 'rating');
        const reviewCountAttr = product.product_attributes.find((attr: any) => attr.key === 'review_count');
        
        rating = ratingAttr ? parseFloat(ratingAttr.value) : 0;
        reviewCount = reviewCountAttr ? parseInt(reviewCountAttr.value) : 0;
      }
      
      return {
        id: product.id,
        name: product.name,
        price: product.vendor_products?.[0]?.price || 0,
        category: product.product_categories?.[0]?.categories?.name || 'Unknown',
        image_url: product.product_images?.[0]?.url || '/images/robot1.png', // Fallback image
        rating,
        review_count: reviewCount,
        position: item.position
      };
    });
  } catch (error) {
    console.error('Error in getFeaturedProducts:', error);
    return [];
  }
}

export default async function FeaturedRobots() {
  // Fetch featured robots from Supabase
  const featuredRobots = await getFeaturedProducts();
  
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
            <div 
              key={robot.id} 
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group"
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