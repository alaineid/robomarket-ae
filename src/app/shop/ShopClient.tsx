"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import FilterSidebar from '@/components/FilterSidebar';
import { commonButtonStyles, commonLayoutStyles } from '@/styles/commonStyles';
import { useProducts } from '@/hooks/useProducts';
import type { Product as ProductType } from '@/utils/types/product.types';

interface ShopClientProps {
  initialData?: {
    products: ProductType[];
    hasMore: boolean;
    total: number;
  };
}

export default function ShopClient({ initialData }: ShopClientProps) {
  // Mobile sidebar visibility state
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  
  // Use our new hook for products fetching and filtering
  const {
    products,
    isLoading,
    hasMore,
    total,
    filters,
    updateFilter,
    loadMore,
    clearFilters,
    applyFilters
  } = useProducts(initialData);
  
  // Infinite scroll hook
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
    rootMargin: '100px',
  });
  
  // Check viewport size on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Auto-load more when scrolling to the bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMore();
    }
  }, [inView, hasMore, isLoading, loadMore]);
  
  // Handle sidebar toggle
  const toggleSidebar = useCallback(() => {
    setSidebarVisible(prev => !prev);
  }, []);
  
  // Handle search input change with debouncing (handled by hook)
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilter('search', e.target.value);
  }, [updateFilter]);
  
  // Apply filters and close sidebar on mobile
  const handleApplyFilters = useCallback(() => {
    applyFilters();
    if (isMobile) {
      setSidebarVisible(false);
    }
  }, [applyFilters, isMobile]);
  
  // Clear filters and close sidebar on mobile
  const handleClearFilters = useCallback(() => {
    clearFilters();
    applyFilters();
    if (isMobile) {
      setSidebarVisible(false);
    }
  }, [clearFilters, applyFilters, isMobile]);
  
  // Array for skeleton placeholders
  const skeletonArray = Array(8).fill(0);
  
  // Calculate the count and range for product display
  const displayedCount = products.length;
  const totalProductCount = total || 0;
  const showingFrom = displayedCount > 0 ? 1 : 0;
  const showingTo = displayedCount;
  
  return (
    <main className={`${commonLayoutStyles.mainContent}`}>
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop', active: true },
          ]}
        />
        
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shop Robots</h1>
            <p className="text-sm text-gray-500">
              Showing {showingFrom} to {showingTo} of {totalProductCount} results
            </p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar - shows by default on desktop, toggles on mobile */}
          <FilterSidebar 
            filters={filters}
            onFilterChange={updateFilter}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
            isOpen={!isMobile || sidebarVisible}
            onToggle={toggleSidebar}
            isMobile={isMobile}
          />
          
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6 sticky top-4 z-10">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search robots..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {filters.search && (
                    <button
                      onClick={() => updateFilter('search', '')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <FaTimes className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
                
                {/* Mobile Filter Button */}
                {isMobile && (
                  <button
                    className={`${commonButtonStyles.secondary} flex-shrink-0 sm:w-auto`}
                    onClick={toggleSidebar}
                  >
                    <FaFilter className="mr-2" /> Filters
                  </button>
                )}
              </div>
              
              {/* Active Filters Display */}
              {(filters.category.length > 0 || filters.brand.length > 0 || filters.rating > 0) && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filters.category.map((cat, index) => (
                    <div key={`cat-${index}`} className="bg-blue-50 text-blue-700 px-3 py-1 text-sm rounded-full flex items-center">
                      {cat}
                      <button
                        onClick={() => updateFilter('category', filters.category.filter(c => c !== cat))}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {filters.brand.map((b, index) => (
                    <div key={`brand-${index}`} className="bg-green-50 text-green-700 px-3 py-1 text-sm rounded-full flex items-center">
                      {b}
                      <button
                        onClick={() => updateFilter('brand', filters.brand.filter(br => br !== b))}
                        className="ml-2 text-green-500 hover:text-green-700"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                  
                  {filters.rating > 0 && (
                    <div className="bg-yellow-50 text-yellow-700 px-3 py-1 text-sm rounded-full flex items-center">
                      {filters.rating}+ Stars
                      <button
                        onClick={() => updateFilter('rating', 0)}
                        className="ml-2 text-yellow-500 hover:text-yellow-700"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  )}
                  
                  <button 
                    onClick={clearFilters}
                    className="text-gray-600 text-sm hover:text-gray-900 hover:underline ml-2"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
            
            {/* Products Grid */}
            {products.length > 0 || isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {/* Show skeleton placeholders when loading initial data */}
                  {isLoading && products.length === 0 ? 
                    skeletonArray.map((_, index) => (
                      <div key={`skeleton-${index}`}>
                        <ProductCardSkeleton />
                      </div>
                    ))
                  : 
                    products.map((product: ProductType) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))
                  }
                </AnimatePresence>
                
                {/* Additional loading skeletons at the bottom when loading more */}
                {isLoading && products.length > 0 && (
                  <React.Fragment>
                    {skeletonArray.slice(0, 4).map((_, index) => (
                      <div key={`skeleton-more-${index}`}>
                        <ProductCardSkeleton />
                      </div>
                    ))}
                  </React.Fragment>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-6 sm:p-12 border border-gray-100 text-center">
                <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <FaSearch size={24} className="text-gray-300" />
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-gray-700 mb-2">No robots found</h3>
                <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-4 sm:mb-6">
                  We couldn&apos;t find any robots matching your current filters. Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    clearFilters();
                    applyFilters();
                  }}
                  className={commonButtonStyles.primary}
                >
                  Clear All Filters
                </button>
              </div>
            )}
            
            {/* Load More / Loader for Infinite Scroll */}
            {hasMore && products.length > 0 && (
              <div className="mt-8 text-center" ref={ref}>
                <p className="text-gray-500 mb-4">
                  {isLoading ? 'Loading more robots...' : 'Scroll to load more'}
                </p>
                {!isLoading && (
                  <button 
                    onClick={loadMore}
                    className={commonButtonStyles.secondary}
                    disabled={isLoading}
                  >
                    Load More ({totalProductCount - displayedCount} remaining)
                  </button>
                )}
              </div>
            )}
            
            {/* Product Count Summary */}
            {products.length > 0 && (
              <div className="mt-8 mb-8 text-center text-sm text-gray-500">
                Showing {showingFrom} to {showingTo} of {totalProductCount} robots
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}