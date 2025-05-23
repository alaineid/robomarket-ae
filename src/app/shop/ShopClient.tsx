"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiX, FiLoader, FiCpu } from "react-icons/fi";
import { debounce } from "lodash-es";
import PageHero from "@/components/layout/PageHero";
import ProductCard from "@/components/products/ProductCard";
import Container from "@/components/layout/Container";
import { categories, brands, ApiResponse } from "@/types/product.types";
import { useProducts } from "@/hooks/queryHooks";
import { useQueryClient } from "@tanstack/react-query";
import AmazonStyleFilter from "@/components/shop/AmazonStyleFilter";

interface ShopClientProps {
  initialData: ApiResponse;
}

export default function ShopClient({ initialData }: ShopClientProps) {
  const queryClient = useQueryClient();

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [ratingFilter, setRatingFilter] = useState(0);

  // Pagination state
  const [, setOffset] = useState(initialData.products?.length || 0);

  // State for UI
  const [, setIsFilterDirty] = useState(false);
  const [isInfiniteScrollEnabled] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Create filter object for React Query
  const filters = {
    search: searchTerm,
    category:
      selectedCategories.length > 0 ? selectedCategories.join(",") : undefined,
    brand: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
    price_min: priceRange[0] > 0 ? priceRange[0] : undefined,
    price_max: priceRange[1] < 10000 ? priceRange[1] : undefined,
    rating: ratingFilter > 0 ? ratingFilter : undefined,
    sort_by: sortBy,
    limit: 20,
    offset: 0,
  };

  // Use React Query for product fetching, hydrate first page with initialData
  const { data, isLoading, fetchNextPage, isFetchingNextPage, refetch } =
    useProducts(filters, initialData);

  // Extract products from query data - Always prioritize fetched data over initialData when filters are applied
  const products =
    selectedCategories.length > 0 ||
    selectedBrands.length > 0 ||
    searchTerm ||
    ratingFilter > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 10000 ||
    sortBy !== "newest"
      ? data?.products || []
      : data?.products || initialData.products || [];

  const hasMore = data?.hasMore ?? initialData.hasMore ?? false;

  // Load more products
  const fetchMoreProducts = useCallback(async () => {
    if (isFetchingNextPage || !hasMore) return;

    // Update offset for the next page
    setOffset((prev) => prev + 4);

    // Fetch next page with updated offset
    await fetchNextPage();
  }, [fetchNextPage, hasMore, isFetchingNextPage]);

  // Handle infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (
        entry?.isIntersecting &&
        hasMore &&
        !isLoading &&
        !isFetchingNextPage &&
        isInfiniteScrollEnabled
      ) {
        fetchMoreProducts();
      }
    },
    [
      hasMore,
      isLoading,
      isFetchingNextPage,
      isInfiniteScrollEnabled,
      fetchMoreProducts,
    ],
  );

  // No longer needed - Recently viewed functionality removed

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px 300px 0px", // Start loading when loader is 300px from viewport
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  // No longer needed - Recently viewed functionality removed

  // Force refetch when filters change
  useEffect(() => {
    // Only trigger this after initial mount
    if (
      selectedCategories.length > 0 ||
      selectedBrands.length > 0 ||
      searchTerm ||
      ratingFilter > 0 ||
      priceRange[0] > 0 ||
      priceRange[1] < 10000 ||
      sortBy !== "newest"
    ) {
      refetch();
    }
  }, [
    selectedCategories,
    selectedBrands,
    searchTerm,
    ratingFilter,
    priceRange,
    sortBy,
    refetch,
  ]);

  // Toggle a category selection
  const toggleCategory = (newCategories: string[]) => {
    setSelectedCategories(newCategories);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change

    // Refetch with new filters
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  // Toggle a brand selection
  const toggleBrand = (newBrands: string[]) => {
    setSelectedBrands(newBrands);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change

    // Refetch with new filters
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  // Handle price range changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change

    // Debounce for slider dragging
    debounce(() => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }, 300)();
  };

  // Handle rating filter change
  const handleRatingChange = (rating: number) => {
    // If the same rating is clicked again, reset to 0 (no filter)
    const newRating = rating === ratingFilter ? 0 : rating;
    setRatingFilter(newRating);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change

    // Refetch with new filters
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  // Handle sort order change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change

    // Refetch with new filters
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change

    // Debounce search input
    debounce(() => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }, 500)();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setRatingFilter(0);
    setSearchTerm("");
    setSortBy("newest");
    setIsFilterDirty(true);
    setOffset(0);

    // Refetch with cleared filters
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  // Function to render a category icon

  return (
    <div className="min-h-screen flex flex-col">
      {/* Shop Hero Section */}
      <PageHero
        title="Discover Amazing Robots"
        description="Find the perfect robotic companion or utility assistant for your home or business."
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop", active: true },
        ]}
      />

      <Container className="py-8">
        {/* Search Bar - Moved above filter bar */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for robots by name, brand, or category..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-full bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent transition-all duration-300 text-sm md:text-base"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4DA9FF]">
              <FiSearch size={16} />
            </div>
            {searchTerm && (
              <button
                onClick={() => handleSearchChange("")} // Clear search term
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX size={16} />
              </button>
            )}
          </div>

          {/* Amazon-Style Filter Bar - Now inside search container */}
          <AmazonStyleFilter
            categories={categories}
            brands={brands}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            priceRange={priceRange}
            sortBy={sortBy}
            ratingFilter={ratingFilter}
            onCategoryChange={toggleCategory}
            onBrandChange={toggleBrand}
            onPriceChange={handlePriceRangeChange}
            onSortChange={handleSortChange}
            onRatingChange={handleRatingChange}
            onClearFilters={clearFilters}
          />
        </div>

        {/* Recently Viewed Section removed */}

        {/* Products Grid */}
        {isLoading && products.length === 0 ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-t-4 border-[#4DA9FF] border-t-transparent rounded-full animate-spin mb-4"></div>
            <span className="text-gray-600 font-medium">
              Finding the perfect robots for you...
            </span>
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
          >
            {products.map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-8 sm:p-12 border border-gray-100 text-center"
          >
            <div className="flex flex-col items-center">
              <div className="text-6xl text-gray-200 mb-4">
                <FiCpu />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Robots Found
              </h3>
              <p className="text-gray-500 mb-6">
                {
                  "We couldn't find any robots matching your filters. Try adjusting your search or filters to see more products."
                }
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={clearFilters}
                className="bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] hover:from-[#3D89FF] hover:to-[#4DA9FF] text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                Clear All Filters
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Loading indicator for infinite scroll */}
        {products.length > 0 && (
          <div ref={loaderRef} className="py-8 text-center">
            {isFetchingNextPage && (
              <div className="flex justify-center">
                <FiLoader className="animate-spin text-[#4DA9FF]" size={24} />
              </div>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
