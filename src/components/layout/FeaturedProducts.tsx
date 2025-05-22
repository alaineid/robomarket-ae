"use client";

import React from "react";
import Link from "next/link";
import Container from "./Container";
import { FiArrowRight } from "react-icons/fi";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  image: string;
}

export default function FeaturedProducts() {
  // Placeholder product data
  const featuredProducts: Product[] = [
    {
      id: "1",
      name: "Syntho X-2000 Humanoid Assistant",
      price: 5899.99,
      category: "Assistant",
      rating: 4.8,
      image: "/placeholder-1.jpg",
    },
    {
      id: "2",
      name: "EduMate Teaching Assistant",
      price: 3799.99,
      category: "Education",
      rating: 4.9,
      image: "/placeholder-2.jpg",
    },
    {
      id: "3",
      name: "MediCare Assistance Robot",
      price: 5299.99,
      category: "Healthcare",
      rating: 4.7,
      image: "/placeholder-3.jpg",
    },
    {
      id: "4",
      name: "Guardian Security Bot",
      price: 4999.99,
      category: "Security",
      rating: 4.6,
      image: "/placeholder-1.jpg",
    },
  ];

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>,
        );
      } else if (i === Math.floor(rating) && rating % 1 > 0) {
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>,
        );
      } else {
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>,
        );
      }
    }
    return stars;
  };

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">
            Featured <span className="text-blue-500">Robots</span>
          </h2>
          <p className="text-gray-600">
            Discover our most popular humanoid robot models trusted by customers
            worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className=" rounded-lg shadow-md overflow-hidden"
            >
              <div className="relative pt-[100%]">
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Placeholder for product image */}
                  <div className="w-3/4 h-3/4 bg-gray-200 flex items-center justify-center text-gray-400">
                    Robot Image
                  </div>
                </div>
                <button
                  className="absolute top-3 right-3 w-8 h-8 rounded-full  shadow-md flex items-center justify-center text-gray-400 hover:text-red-500"
                  aria-label="Add to wishlist"
                >
                  ♡
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center text-sm mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                </div>
                <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                <div className="flex items-center text-sm mb-2">
                  {renderStars(product.rating)}
                  <span className="text-gray-500 ml-1">({product.rating})</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-blue-600 font-bold">
                    ${product.price.toLocaleString()}
                  </span>
                  <button className="bg-blue-100 hover:bg-blue-200 text-blue-600 py-1 px-3 rounded-md text-sm">
                    Add to cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-blue-500 hover:underline"
          >
            View All Robots
            <FiArrowRight className="ml-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
