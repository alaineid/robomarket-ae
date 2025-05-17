"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductCard from "./ProductCard";
import { useFeaturedProducts } from "@/hooks/queryHooks";
import { Product } from "@/types/product.types";

export default function FeaturedRobots() {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use React Query hook for featured products
  const { data: featuredRobots = [], isLoading, error } = useFeaturedProducts();

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
    window.addEventListener("resize", updateItemsPerPage);

    // Clean up
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  // Calculate total pages
  const totalPages = Math.ceil(featuredRobots.length / itemsPerPage);

  // Navigate to previous page
  const prevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  // Navigate to next page
  const nextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  // Return products for the current page without wrapping around to avoid duplicates
  const getCurrentRobots = () => {
    const startIndex = currentPage * itemsPerPage;
    return featuredRobots.slice(startIndex, startIndex + itemsPerPage);
  };

  if (isLoading) {
    return (
      <section id="featured-robots" className="py-16 bg-gray-50 px-4 lg:px-8">
        <div className="container mx-auto max-w-[2400px]">
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

  // If error or no products, don't render anything
  if (error || featuredRobots.length === 0) {
    return null;
  }

  // Get robots to display in current view
  const currentRobots = getCurrentRobots();

  return (
    <section id="featured-robots" className="py-16 bg-gray-50 px-4 lg:px-8">
      <div className="container mx-auto max-w-[2400px]">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-gray-800">
            Featured <span className="text-[#4DA9FF]">Robots</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            Discover our most popular humanoid robot models trusted by customers
            worldwide
          </p>
        </div>

        {/* Multi-product carousel */}
        <div ref={containerRef} className="relative max-w-[2200px] mx-auto">
          {featuredRobots.length > itemsPerPage && (
            <>
              <button
                onClick={prevPage}
                className="absolute -left-2 md:-left-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-[#4DA9FF] hover:text-white transition-all duration-300"
                aria-label="Previous page"
              >
                <FaChevronLeft className="text-xs sm:text-base" />
              </button>

              <button
                onClick={nextPage}
                className="absolute -right-2 md:-right-6 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-md flex items-center justify-center text-gray-800 hover:bg-[#4DA9FF] hover:text-white transition-all duration-300"
                aria-label="Next page"
              >
                <FaChevronRight className="text-xs sm:text-base" />
              </button>
            </>
          )}

          <div ref={carouselRef} className="overflow-hidden px-2">
            <div
              className={`grid gap-4 md:gap-6 ${
                // Dynamic grid columns based on items per page
                itemsPerPage === 1
                  ? "grid-cols-1"
                  : itemsPerPage === 2
                    ? "grid-cols-2"
                    : itemsPerPage === 3
                      ? "grid-cols-3"
                      : "grid-cols-4"
              }`}
            >
              {currentRobots.map((product: Product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
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
                    index === currentPage ? "bg-[#4DA9FF] w-5" : "bg-gray-300"
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
