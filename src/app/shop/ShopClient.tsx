"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaStar, FaFilter, FaTimes, FaChevronDown, FaChevronRight,
  FaSearch, FaCheck, FaHeart, FaBoxOpen, FaShieldAlt, FaBrain,
  FaHeartbeat, FaIndustry, FaSpinner
} from 'react-icons/fa';
import { debounce } from 'lodash-es';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { commonButtonStyles, commonLayoutStyles } from '@/styles/commonStyles';
import {
  categories,
  brands,
  Product,
  ApiResponse
} from '@/lib/product';
import { useProducts } from '@/utils/queryHooks';
import { useQueryClient } from '@tanstack/react-query';

interface ShopClientProps {
  initialData: ApiResponse;
}

export default function ShopClient({ initialData }: ShopClientProps) {
  const queryClient = useQueryClient();
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState(0);
  
  // Pagination state
  const [, setOffset] = useState(initialData.products?.length || 0);
  
  // State for recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  
  // State for UI
  const [, setIsFilterDirty] = useState(false);
  const [mobileShowFilters, setMobileShowFilters] = useState(false);
  const [desktopShowFilters, setDesktopShowFilters] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isInfiniteScrollEnabled] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // State for collapsible filter sections
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    categories: false,
    brands: false,
    sortBy: false,
    priceRange: false,
    rating: false
  });

  // Create filter object for React Query
  const filters = {
    search: searchTerm,
    category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
    brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
    price_min: priceRange[0] > 0 ? priceRange[0] : undefined,
    price_max: priceRange[1] < 10000 ? priceRange[1] : undefined,
    rating: ratingFilter > 0 ? ratingFilter : undefined,
    sort_by: sortBy,
    limit: 20, // Changed from 4 to 20
    offset: 0
  };

  // Use React Query for product fetching, hydrate first page with initialData
  const { 
    data, 
    isLoading, 
    fetchNextPage,
    isFetchingNextPage,
    refetch  } = useProducts(filters, initialData);

  // Extract products from query data - Always prioritize fetched data over initialData when filters are applied
  const products = selectedCategories.length > 0 || selectedBrands.length > 0 || 
    searchTerm || ratingFilter > 0 || priceRange[0] > 0 || priceRange[1] < 10000 ||
    sortBy !== 'newest' ? 
    data?.products || [] : 
    data?.products || initialData.products || [];
    
  const hasMore = data?.hasMore ?? initialData.hasMore ?? false;

  // Category icons mapping
  const CATEGORY_ICONS = {
    'Companion': <FaHeart />,
    'Utility': <FaBoxOpen />,
    'Security': <FaShieldAlt />,
    'Education': <FaBrain />,
    'Healthcare': <FaHeartbeat />,
    'Industrial': <FaIndustry />
  };

  // Load more products
  const fetchMoreProducts = useCallback(async () => {
    if (isFetchingNextPage || !hasMore) return;
    
    // Update offset for the next page
    setOffset(prev => prev + 4);
    
    // Fetch next page with updated offset
    await fetchNextPage();
  }, [fetchNextPage, hasMore, isFetchingNextPage]); // Removed offset dependency

  // Handle infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry?.isIntersecting && hasMore && !isLoading && !isFetchingNextPage && isInfiniteScrollEnabled) {
      fetchMoreProducts();
    }
  }, [hasMore, isLoading, isFetchingNextPage, isInfiniteScrollEnabled, fetchMoreProducts]);
  
  // Fetch recently viewed products
  const fetchRecentlyViewedProducts = useCallback(async (ids: number[]) => {
    if (!ids.length) return;
    
    try {
      // Limit to 4 most recent
      const limitedIds = ids.slice(0, 4);
      const productsData = await Promise.all(
        limitedIds.map(async (id) => {
          // Pre-fetch and cache with React Query
          const data = await queryClient.fetchQuery({
            queryKey: ['product', id],
            queryFn: async () => {
              const response = await fetch(`/api/products/${id}`);
              if (!response.ok) return null;
              return response.json() as Promise<Product>;
            },
          });
          return data;
        })
      );
      setRecentlyViewed(productsData.filter((p): p is Product => p !== null));
    } catch (error) {
       
      console.error('Failed to fetch recently viewed products:', error);
    }
  }, [queryClient]);
  
  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '0px 0px 300px 0px', // Start loading when loader is 300px from viewport
    });
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);
  
  // Load recently viewed products from localStorage on mount
  useEffect(() => {
    const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (savedRecentlyViewed) {
      try {
        const viewedIds = JSON.parse(savedRecentlyViewed);
        // Fetch these products from the API instead of using local data
        fetchRecentlyViewedProducts(viewedIds);
      } catch {
        console.error("Failed to parse recently viewed products from localStorage");
      }
    }
    
    // Check if mobile view on component mount
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, [fetchRecentlyViewedProducts]); // Added fetchRecentlyViewedProducts dependency
  
  // Force refetch when filters change
  useEffect(() => {
    // Only trigger this after initial mount
    if (selectedCategories.length > 0 || selectedBrands.length > 0 || 
        searchTerm || ratingFilter > 0 || priceRange[0] > 0 || priceRange[1] < 10000 ||
        sortBy !== 'newest') {
      refetch();
    }
  }, [selectedCategories, selectedBrands, searchTerm, ratingFilter, priceRange, sortBy, refetch]);
  
  // Toggle a category selection
  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    
    // Update state
    setSelectedCategories(newCategories);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change
    
    // Refetch with new filters
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Toggle a brand selection
  const toggleBrand = (brand: string) => {
    const newBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter(b => b !== brand)
      : [...selectedBrands, brand];

    setSelectedBrands(newBrands);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change
    
    // Refetch with new filters
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Handle price range changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change
    
    // Debounce for slider dragging
    debounce(() => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
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
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Handle sort order change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change
    
    // Refetch with new filters
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };
  
  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsFilterDirty(true);
    setOffset(0); // Reset pagination when filters change
    
    // Debounce search input
    debounce(() => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }, 500)();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setRatingFilter(0); 
    setSearchTerm('');
    setSortBy('newest');
    setIsFilterDirty(true); 
    setOffset(0);
    
    // Refetch with cleared filters
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  // Toggle section visibility
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Computed property for filter visibility based on current view
  const showFilters = isMobileView ? mobileShowFilters : desktopShowFilters;

  // Toggle filters based on current view
  const toggleFilters = () => {
    if (isMobileView) {
      setMobileShowFilters(!mobileShowFilters);
    } else {
      setDesktopShowFilters(!desktopShowFilters);
    }
  };

  // Function to render a category icon
  const renderCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || <FaBoxOpen />;
  };

  return (
    <div className={commonLayoutStyles.mainContent}>
      {/* Shop Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-6 mb-6 border-b border-gray-100">
        <div className={commonLayoutStyles.section}>
          {/* Breadcrumbs Navigation */}
          <Breadcrumbs 
            items={[
              { label: 'Home', href: '/' },
              { label: 'Shop', href: '/shop', active: true }
            ]}
          />
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-6 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 font-heading tracking-tight">
                Discover Amazing Robots
              </h1>
              <p className="text-gray-600 max-w-xl">
                Find the perfect robotic companion or utility assistant for your home or business.
              </p>
            </div>
            
            {/* Mobile filter toggle button */}
            {isMobileView && (
              <button
                onClick={toggleFilters}
                className="mt-4 md:mt-0 flex items-center justify-center bg-white text-gray-700 p-3 rounded-lg shadow-sm hover:bg-gray-50 border border-gray-200 transition-colors"
                aria-label={showFilters ? 'Hide Filters' : 'Show Filters'}
              >
                <FaFilter size={14} className="mr-2" />
                <span>Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
        
      <div className={commonLayoutStyles.section}>
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Show Filter Button - Visible when filters are hidden on desktop */}
          {!showFilters && !isMobileView && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onClick={toggleFilters}
              className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-[#4DA9FF] text-white p-3 rounded-r-lg shadow-md z-50 hover:bg-blue-500 transition-colors"
              aria-label="Show filters"
            >
              <FaChevronRight />
            </motion.button>
          )}
          
          {/* Filters Sidebar */}
          <motion.aside 
            className={`${showFilters ? 'block' : 'hidden'} ${
              isMobileView 
                ? 'fixed inset-0 z-50 bg-gray-800 bg-opacity-75 overflow-y-auto' 
                : 'lg:w-1/4'
            }`}
            initial={isMobileView ? { opacity: 0 } : {}}
            animate={isMobileView && showFilters ? { opacity: 1 } : {}}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className={`bg-white shadow-xl rounded-2xl border border-gray-100 ${
                isMobileView 
                  ? 'mx-4 my-16 max-h-[80vh] overflow-y-auto' 
                  : 'rounded-xl p-6 sticky top-8'
              }`}
              initial={isMobileView ? { y: 50 } : { opacity: 0 }}
              animate={showFilters ? { y: 0, opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="sticky top-0 z-10 bg-white p-4 lg:p-0 border-b border-gray-100 flex justify-between items-center mb-6">
                <h2 className="font-bold text-xl text-gray-800 flex items-center">
                  <FaFilter className="text-[#4DA9FF] mr-2" size={16} /> 
                  <span>Filter Products</span>
                </h2>
                <button 
                  className="text-gray-400 hover:text-gray-600 transition-colors" 
                  onClick={() => toggleFilters()}
                  aria-label="Close filters"
                >
                  <FaTimes size={16} />
                </button>                  
              </div>

              {/* The rest of filters panel remains unchanged */}
              <div className="p-4 lg:p-0">
                {/* Categories filter with icons */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center mb-3 cursor-pointer" 
                    onClick={() => toggleSection('categories')}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">Categories</h3>
                    <FaChevronDown 
                      className={`text-gray-400 text-sm transition-transform duration-300 ${collapsedSections.categories ? 'transform rotate-180' : ''}`}
                    />
                  </div>
                  {!collapsedSections.categories && (
                    <div className="space-y-2">
                      {categories.map((category, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={`category-${index}`}
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleCategory(category)}
                            className="w-4 h-4 accent-[#4DA9FF]"
                          />
                          <label htmlFor={`category-${index}`} className="ml-3 flex items-center text-gray-700 hover:text-[#4DA9FF] cursor-pointer">
                            <span className="mr-2 text-sm text-gray-500">
                              {renderCategoryIcon(category)}
                            </span>
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Brands filter */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={() => toggleSection('brands')}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">Brands</h3>
                    <FaChevronDown 
                      className={`text-gray-400 text-sm transition-transform duration-300 ${collapsedSections.brands ? 'transform rotate-180' : ''}`}
                    />
                  </div>
                  {!collapsedSections.brands && (
                    <div className="space-y-2">
                      {brands.map((brand, index) => (
                        <div key={index} className="flex items-center">
                          <input
                            id={`brand-${index}`}
                            type="checkbox"
                            checked={selectedBrands.includes(brand)}
                            onChange={() => toggleBrand(brand)}
                            className="w-4 h-4 accent-[#4DA9FF]"
                          />
                          <label htmlFor={`brand-${index}`} className="ml-3 text-gray-700 hover:text-[#4DA9FF] cursor-pointer">
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Sort By */}
                <div className="mb-6">
                  <div 
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={() => toggleSection('sortBy')}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">Sort By</h3>
                    <FaChevronDown 
                      className={`text-gray-400 text-sm transition-transform duration-300 ${collapsedSections.sortBy ? 'transform rotate-180' : ''}`}
                    />
                  </div>
                  {!collapsedSections.sortBy && (
                    <div className="space-y-3">
                      <label htmlFor="sort-newest" className="flex items-center cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            id="sort-newest"
                            type="radio"
                            value="newest"
                            name="sortBy"
                            checked={sortBy === "newest"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="sr-only" /* Hide the default radio button */
                          />
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                            sortBy === "newest" 
                              ? 'border-[#4DA9FF] bg-[#4DA9FF]' 
                              : 'border-gray-300'
                          }`}>
                            {sortBy === "newest" && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </span>
                          <span className="ml-3 text-gray-700">
                            Newest
                          </span>
                        </div>
                      </label>
                      
                      <label htmlFor="sort-price-asc" className="flex items-center cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            id="sort-price-asc"
                            type="radio"
                            value="price-asc"
                            name="sortBy"
                            checked={sortBy === "price-asc"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="sr-only" /* Hide the default radio button */
                          />
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                            sortBy === "price-asc" 
                              ? 'border-[#4DA9FF] bg-[#4DA9FF]' 
                              : 'border-gray-300'
                          }`}>
                            {sortBy === "price-asc" && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </span>
                          <span className="ml-3 text-gray-700">
                            Price Low to High
                          </span>
                        </div>
                      </label>
                      
                      <label htmlFor="sort-price-desc" className="flex items-center cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            id="sort-price-desc"
                            type="radio"
                            value="price-desc"
                            name="sortBy"
                            checked={sortBy === "price-desc"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="sr-only" /* Hide the default radio button */
                          />
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                            sortBy === "price-desc" 
                              ? 'border-[#4DA9FF] bg-[#4DA9FF]' 
                              : 'border-gray-300'
                          }`}>
                            {sortBy === "price-desc" && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </span>
                          <span className="ml-3 text-gray-700">
                            Price High to Low
                          </span>
                        </div>
                      </label>
                      
                      <label htmlFor="sort-rating" className="flex items-center cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            id="sort-rating"
                            type="radio"
                            value="rating"
                            name="sortBy"
                            checked={sortBy === "rating"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="sr-only" /* Hide the default radio button */
                          />
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                            sortBy === "rating" 
                              ? 'border-[#4DA9FF] bg-[#4DA9FF]' 
                              : 'border-gray-300'
                          }`}>
                            {sortBy === "rating" && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </span>
                          <span className="ml-3 text-gray-700">
                            Best Rated
                          </span>
                        </div>
                      </label>
                      
                      <label htmlFor="sort-popularity" className="flex items-center cursor-pointer">
                        <div className="relative flex items-center">
                          <input
                            id="sort-popularity"
                            type="radio"
                            value="popularity"
                            name="sortBy"
                            checked={sortBy === "popularity"}
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="sr-only" /* Hide the default radio button */
                          />
                          <span className={`w-5 h-5 flex items-center justify-center rounded-full border ${
                            sortBy === "popularity" 
                              ? 'border-[#4DA9FF] bg-[#4DA9FF]' 
                              : 'border-gray-300'
                          }`}>
                            {sortBy === "popularity" && (
                              <span className="w-2 h-2 rounded-full bg-white"></span>
                            )}
                          </span>
                          <span className="ml-3 text-gray-700">
                            Most Popular
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                
                {/* Price Range Slider */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={() => toggleSection('priceRange')}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">Price Range</h3>
                    <FaChevronDown 
                      className={`text-gray-400 text-sm transition-transform duration-300 ${collapsedSections.priceRange ? 'rotate-180' : ''}`}
                    />
                  </div>
                  {!collapsedSections.priceRange && (
                    <div className="px-2">
                      <div className="flex items-center justify-between mb-2">
                        <input 
                          type="number"
                          value={priceRange[0]}
                          min={0}
                          max={priceRange[1] - 1}
                          onChange={(e) => {
                            const newMin = Math.max(0, Math.min(Number(e.target.value), priceRange[1] - 1));
                            handlePriceRangeChange(newMin, priceRange[1]);
                          }}
                          className="w-20 h-8 px-2 border border-gray-200 rounded text-sm"
                        />
                        <span className="mx-2 text-gray-400">to</span>
                        <input 
                          type="number"
                          value={priceRange[1]}
                          min={priceRange[0] + 1}
                          max={10000}
                          onChange={(e) => {
                            const newMax = Math.max(priceRange[0] + 1, Math.min(Number(e.target.value), 10000));
                            handlePriceRangeChange(priceRange[0], newMax);
                          }}
                          className="w-20 h-8 px-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      
                      {/* rc-slider dual-handle component */}
                      <div className="py-4">
                        <Slider
                          range
                          min={0}
                          max={10000}
                          step={100}
                          value={[priceRange[0], priceRange[1]]}
                          onChange={(values) => {
                            if (Array.isArray(values) && values.length === 2) {
                              handlePriceRangeChange(values[0], values[1]);
                            }
                          }}
                          railStyle={{ backgroundColor: '#E5E7EB', height: 8 }}
                          trackStyle={[{ backgroundColor: '#4DA9FF', height: 8 }]}
                          handleStyle={[
                            {
                              backgroundColor: '#FFFFFF',
                              borderColor: '#4DA9FF',
                              height: 18,
                              width: 18,
                              marginLeft: 0,
                              marginTop: -5,
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            },
                            {
                              backgroundColor: '#FFFFFF',
                              borderColor: '#4DA9FF',
                              height: 18,
                              width: 18,
                              marginLeft: 0,
                              marginTop: -5,
                              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                            },
                          ]}
                        />
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className="text-xs text-gray-500">${priceRange[0].toLocaleString()}</span>
                        <span className="text-xs text-gray-500">${priceRange[1].toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Ratings Filter */}
                <div className="mb-8">
                  <div 
                    className="flex justify-between items-center mb-3 cursor-pointer"
                    onClick={() => toggleSection('rating')}
                  >
                    <h3 className="font-semibold text-lg text-gray-800">Rating</h3>
                    <FaChevronDown 
                      className={`text-gray-400 text-sm transition-transform duration-300 ${collapsedSections.rating ? 'transform rotate-180' : ''}`}
                    />
                  </div>
                  {!collapsedSections.rating && (
                    <div className="space-y-2">
                      {/* Explicitly use numbers for ratings to avoid any potential issues */}
                      <button
                        onClick={() => handleRatingChange(5)}
                        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                          ratingFilter === 5 ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">& Up</span>
                        {ratingFilter === 5 && (
                          <FaCheck className="ml-auto text-[#4DA9FF]" size={14} />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRatingChange(4)}
                        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                          ratingFilter === 4 ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {Array(4).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                          {Array(1).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-gray-300" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">& Up</span>
                        {ratingFilter === 4 && (
                          <FaCheck className="ml-auto text-[#4DA9FF]" size={14} />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRatingChange(3)}
                        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                          ratingFilter === 3 ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {Array(3).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                          {Array(2).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-gray-300" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">& Up</span>
                        {ratingFilter === 3 && (
                          <FaCheck className="ml-auto text-[#4DA9FF]" size={14} />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRatingChange(2)}
                        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                          ratingFilter === 2 ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {Array(2).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                          {Array(3).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-gray-300" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">& Up</span>
                        {ratingFilter === 2 && (
                          <FaCheck className="ml-auto text-[#4DA9FF]" size={14} />
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleRatingChange(1)}
                        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                          ratingFilter === 1 ? 'bg-blue-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex">
                          {Array(1).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                          {Array(4).fill(0).map((_, i) => (
                            <FaStar key={i} className="text-gray-300" />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-700">& Up</span>
                        {ratingFilter === 1 && (
                          <FaCheck className="ml-auto text-[#4DA9FF]" size={14} />
                        )}
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    className={commonButtonStyles.secondary}
                  >
                    Reset All Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.aside>
          
          {/* Main Products Area */}
          <main className={`${showFilters && !isMobileView ? 'lg:w-3/4' : 'w-full'}`}>
            {/* Search and Sort */}
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search for robots by name, brand, or category..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-full bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF] focus:border-transparent transition-all duration-300 text-sm md:text-base"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4DA9FF]">
                    <FaSearch size={16} />
                  </div>
                  {searchTerm && (
                    <button 
                      onClick={() => handleSearchChange('')} // Clear search term
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FaTimes size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            {/* Category Quick Filters */}
            <div className="mb-6">
              <div className="flex overflow-x-auto pb-2 md:pb-0 md:flex-wrap gap-3 mt-2 no-scrollbar">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setIsFilterDirty(true);
                    queryClient.invalidateQueries({ queryKey: ['products'] });
                  }}
                  className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                    selectedCategories.length === 0
                      ? 'bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  All Categories
                </button>
                
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => toggleCategory(category)}
                    className={`px-4 py-2.5 rounded-full text-xs md:text-sm font-medium flex items-center gap-2 transition-all duration-300 whitespace-nowrap flex-shrink-0 ${
                      selectedCategories.includes(category)
                        ? 'bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span className={`${
                      selectedCategories.includes(category) ? 'text-white' : 'text-[#4DA9FF]'
                    }`}>
                      {renderCategoryIcon(category)}
                    </span>
                    {category}
                    {selectedCategories.includes(category) && (
                      <FaTimes size={12} />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-white rounded-2xl shadow-sm p-6 mb-8 border border-blue-100">
                <div className="flex items-center mb-4">
                  <h3 className="font-bold text-xl text-gray-800">Recently Viewed</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentlyViewed.map(product => (
                    <Link 
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="flex flex-col sm:flex-row items-center p-3 rounded-xl hover:bg-white border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
                    >
                      <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-0 sm:mr-4 flex-shrink-0 bg-white rounded-lg p-1">
                        <Image
                          src={product.images[0]?.url || '/images/Algorythm.png'} 
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 48px, 64px"
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                        {product.best_vendor && (
                          <p className="text-sm font-semibold bg-gradient-to-r from-[#4DA9FF] to-blue-600 bg-clip-text text-transparent">${product.best_vendor.price.toLocaleString()}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Products Grid */}
            {isLoading && products.length === 0 ? (
              <div className="flex flex-col justify-center items-center py-20">
                <div className="w-16 h-16 border-4 border-t-4 border-[#4DA9FF] border-t-transparent rounded-full animate-spin mb-4"></div>
                <span className="text-gray-600 font-medium">Finding the perfect robots for you...</span>
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
              >
                <AnimatePresence>
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, delay: index % 4 * 0.1 }}
                      className="transform transition-all duration-300 hover:-translate-y-1"
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm p-8 sm:p-12 border border-gray-100 text-center"
              >
                <div className="mx-auto w-20 h-20 sm:w-28 sm:h-28 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                  <FaSearch size={32} className="text-[#4DA9FF] opacity-70" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-medium text-gray-800 mb-3">No robots found</h3>
                <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto mb-6 sm:mb-8">
                  We couldn&apos;t find any robots matching your current filters. Try adjusting your filters or search terms.
                </p>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={clearFilters}
                  className={`${commonButtonStyles.primary} px-8`}
                >
                  Clear All Filters
                </motion.button>
              </motion.div>
            )}
            
            {/* Load More Button */}
            {products.length > 0 && (
              <div className="mt-12 flex justify-center" ref={loaderRef}>
                {hasMore ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={fetchMoreProducts}
                    disabled={isFetchingNextPage || isLoading}
                    className={`bg-gradient-to-r from-[#4DA9FF] to-[#3D89FF] text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transition-all w-auto flex items-center justify-center gap-3 ${
                      isFetchingNextPage || isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isFetchingNextPage || isLoading ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <span>Load More Robots</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L11 12.586V6a1 1 0 012 0v6.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </motion.button>
                ) : (
                  products.length > 0 && (
                    <div className="text-center">
                      <p className="text-gray-500 py-2 mb-2">You&apos;ve explored our entire robot collection!</p>
                      <div className="h-1 w-16 bg-gradient-to-r from-[#4DA9FF] to-blue-300 rounded-full mx-auto"></div>
                    </div>
                  )
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}