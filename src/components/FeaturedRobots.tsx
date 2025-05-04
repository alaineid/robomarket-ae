"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  id: number;
  name: string;
  image: string;
  feature: string;
  price: string;
};

// Product Card Component
const ProductCard: React.FC<ProductCardProps> = ({ id, name, image, feature, price }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col">
      <div className="relative h-64 bg-gray-100 flex items-center justify-center p-6">
        <Image
          src={image}
          alt={`${name} robot`}
          width={200}
          height={200}
          className="object-contain max-h-full transition-transform hover:scale-105 duration-300"
        />
        <div className="absolute top-4 right-4 bg-[#4DA9FF]/90 text-white text-xs px-2 py-1 rounded-full">
          New Model
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow border-t">
        <h3 className="font-bold text-xl mb-1 text-gray-800">{name}</h3>
        <p className="text-gray-600 text-sm mb-4">{feature}</p>
        <div className="mt-auto flex justify-between items-center pt-4">
          <span className="font-bold text-lg text-gray-900">{price}</span>
          <Link 
            href={`/product/${id}`}
            className="text-[#4DA9FF] hover:text-[#3B8CD9] font-medium flex items-center transition-colors"
          >
            View Details
            <i className="fas fa-chevron-right ml-1 text-sm"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function FeaturedRobots() {
  // Sample featured products data
  const featuredProducts = [
    {
      id: 1,
      name: "HomeBot Pro",
      image: "/vercel.svg", // Placeholder image
      feature: "Advanced home assistance with intuitive AI learning capabilities",
      price: "$2,499",
    },
    {
      id: 2,
      name: "CompanionX",
      image: "/vercel.svg", // Placeholder image
      feature: "Emotional intelligence and personalized companionship features",
      price: "$3,299",
    },
    {
      id: 3,
      name: "TaskMaster 3000",
      image: "/vercel.svg", // Placeholder image
      feature: "Professional task automation with industry-leading precision",
      price: "$4,199",
    },
    {
      id: 4,
      name: "ElderlyCare Bot",
      image: "/vercel.svg", // Placeholder image
      feature: "24/7 senior monitoring and assistance with medical alerts",
      price: "$3,799",
    },
  ];

  return (
    <section id="featured" className="py-16 px-4 lg:px-8 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Robots</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our most popular humanoid robots, designed for various needs from home assistance to specialized tasks.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/shop"
            className="border-2 border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 inline-flex items-center"
          >
            View All Products
            <i className="fas fa-long-arrow-alt-right ml-2"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}