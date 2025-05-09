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
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { commonButtonStyles, commonLayoutStyles } from '@/styles/commonStyles';
import { categories, brands } from '@/utils/types/product.types';

// Define types for our data
import type { Product as ProductType } from '@/utils/types/product.types';

interface ApiResponse {
  products: ProductType[];
  hasMore: boolean;
  total: number;
}

interface ShopClientProps {
  initialData: ApiResponse;
}

export default function ShopClient({ initialData }: ShopClientProps) {
  // State for products and pagination
  const [products, setProducts] = useState<ProductType[]>(initialData.products || []);
  const [hasMore, setHasMore] = useState<boolean>(initialData.hasMore || false);
  const [isLoading, setIsLoading] = useState(false);
  const [offset, setOffset] = useState(initialData.products?.length || 0);
  
  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState(0);
  
  // State for recently viewed products
  const [recentlyViewed, setRecentlyViewed] = useState<ProductType[]>([]);
  
  // State for UI
  const [isFilterDirty, setIsFilterDirty] = useState(false);
  const [mobileShowFilters, setMobileShowFilters] = useState(false);
  const [desktopShowFilters, setDesktopShowFilters] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isInfiniteScrollEnabled, setIsInfiniteScrollEnabled] = useState(true); // Toggle for infinite scroll
  const loaderRef = useRef<HTMLDivElement>(null);

  // State for collapsible filter sections
  const [collapsedSections, setCollapsedSections] = useState<{[key: string]: boolean}>({
    categories: false,
    brands: false,
    sortBy: false,
    priceRange: false,
    rating: false
  });

  // Category icons mapping
  const CATEGORY_ICONS = {
    'Companion': <FaHeart />,
    'Utility': <FaBoxOpen />,
    'Security': <FaShieldAlt />,
    'Education': <FaBrain />,
    'Healthcare': <FaHeartbeat />,
    'Industrial': <FaIndustry />
  };

  // Function to fetch products from API with filters
  const fetchProducts = useCallback(async (resetProducts = false) => {
    try {
      setIsLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      
      // Add safer handling for categories
      if (selectedCategories && selectedCategories.length > 0) {
        // Make sure we're passing valid categories
        const validCategories = selectedCategories.filter(Boolean);
        if (validCategories.length > 0) {
          params.append('category', validCategories.join(','));
        }
      }
      
      // Add safer handling for brands
      if (selectedBrands && selectedBrands.length > 0) {
        const validBrands = selectedBrands.filter(Boolean);
        if (validBrands.length > 0) {
          params.append('brand', validBrands.join(','));
        }
      }
      
      if (priceRange && priceRange[0] > 0) params.append('price_min', priceRange[0].toString());
      if (priceRange && priceRange[1] < 10000) params.append('price_max', priceRange[1].toString());
      if (ratingFilter > 0) params.append('rating', ratingFilter.toString());
      if (sortBy) params.append('sort_by', sortBy);
      
      // Set limit for pagination
      params.append('limit', '20');
      
      // If resetting products, start from offset 0, otherwise use current offset
      if (resetProducts) {
        params.append('offset', '0');
      } else {
        params.append('offset', offset.toString());
      }
      
      // Fetch products
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      // Filter out products that do not match the selected categories
      let filteredProducts = data.products;
      if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter((product: ProductType) =>
          product.categories &&
          product.categories.some((cat) => 
            // Check if category is an object with name property or a string
            (typeof cat === 'object' && cat.name && selectedCategories.includes(cat.name)) || 
            (typeof cat === 'string' && selectedCategories.includes(cat))
          )
        );
      }

      if (resetProducts) {
        setProducts(filteredProducts || []);
        setOffset((filteredProducts || []).length);
      } else {
        setProducts(prev => [...prev, ...(filteredProducts || [])]);
        setOffset(prev => prev + (filteredProducts || []).length);
      }
      
      setHasMore(!!data.hasMore);
      setIsFilterDirty(false);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      // Show empty products instead of crashing
      if (resetProducts) {
        setProducts([]);
        setOffset(0);
      }
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategories, selectedBrands, priceRange, ratingFilter, sortBy, offset]);
  
  // Handle infinite scroll
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    // Only load more if visible, has more products, not already loading, and infinite scroll is enabled
    if (entry?.isIntersecting && hasMore && !isLoading && isInfiniteScrollEnabled) {
      fetchProducts();
    }
  }, [hasMore, isLoading, isInfiniteScrollEnabled, fetchProducts]);
  
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
  
  // Auto-apply filters when selectedCategories changes
  useEffect(() => {
    // Only run this effect if selectedCategories actually changes and it's not the initial render
    if (initialData.products && selectedCategories !== undefined) {
      fetchProducts(true);
    }
  }, [selectedCategories, fetchProducts]);
  
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
  }, []);
  
  // Fetch recently viewed products
  const fetchRecentlyViewedProducts = async (ids: number[]) => {
    if (!ids.length) return;
    
    try {
      // Limit to 4 most recent
      const limitedIds = ids.slice(0, 4);
      const promises = limitedIds.map(id => 
        fetch(`/api/products/${id}`).then(res => res.json())
      );
      
      const products = await Promise.all(promises);
      setRecentlyViewed(products.filter(Boolean));
    } catch (error) {
      console.error('Failed to fetch recently viewed products:', error);
    }
  };

  // Toggle a category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      return prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category];
    });
    setIsFilterDirty(true);
  };

  // Toggle a brand selection
  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => {
      if (prev.includes(brand)) {
        return prev.filter(b => b !== brand);
      } else {
        return [...prev, brand];
      }
    });
    setIsFilterDirty(true);
  };

  // Handle price range changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setIsFilterDirty(true);
  };

  // Handle rating filter change
  const handleRatingChange = (rating: number) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
    setIsFilterDirty(true);
  };

  // Handle sort order change
  const handleSortChange = (value: string) => {
    setSortBy(value);
    setIsFilterDirty(true);
  };
  
  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setIsFilterDirty(true);
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
  };

  // Apply filters
  const applyFilters = () => {
    // Reset products and fetch with current filters
    fetchProducts(true);
    
    // Close mobile filters if on mobile
    if (isMobileView) {
      setMobileShowFilters(false);
    }
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

  // Toggle between Load More button and infinite scroll
  const toggleInfiniteScroll = () => {
    setIsInfiniteScrollEnabled(!isInfiniteScrollEnabled);
  };

  return (
    <div className={commonLayoutStyles.mainContent}>
      <div className={commonLayoutStyles.section}>
        {/* Breadcrumbs Navigation */}
        <Breadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shop', href: '/shop', active: true }
          ]}
        />
        
        {/* Page Title & Filter Toggle */}
        <div className="flex justify-between items-center mb-6 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Shop Robots
          </h1>
          
          {/* Mobile filter toggle button */}
          {isMobileView && (
            <button
              onClick={toggleFilters}
              className="flex items-center justify-center bg-gray-100 text-gray-700 p-2 rounded-lg shadow-sm hover:bg-gray-200 transition-colors"
              aria-label={showFilters ? 'Hide Filters' : 'Show Filters'}
            >
              <FaFilter size={14} />
            </button>
          )}
        </div>
        
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
              className={`bg-white shadow-lg border border-gray-100 ${
                isMobileView 
                  ? 'mx-4 my-16 rounded-xl max-h-[80vh] overflow-y-auto' 
                  : 'rounded-xl p-6 sticky top-8'
              }`}
              initial={isMobileView ? { y: 50 } : { opacity: 0 }}
              animate={showFilters ? { y: 0, opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
             <div className="sticky top-0 z-10 bg-white p-4 lg:p-0 border-b border-gray-100 flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-800">Filters</h2>
              <div 
                  className="flex justify-between items-center mb-3 cursor-pointer" 
                  onClick={() => toggleFilters()}
                >
                  <FaTimes 
                    size={16} className="text-gray-400 text-sm"
                  />
                </div>                  
            </div>
              
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
                          onChange={(e) => handlePriceRangeChange(
                            Math.min(Number(e.target.value), priceRange[1] - 100),
                            priceRange[1]
                          )}
                          className="w-20 h-8 px-2 border border-gray-200 rounded text-sm"
                        />
                        <span className="mx-2 text-gray-400">to</span>
                        <input 
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => handlePriceRangeChange(
                            priceRange[0],
                            Math.max(Number(e.target.value), priceRange[0] + 100)
                          )}
                          className="w-20 h-8 px-2 border border-gray-200 rounded text-sm"
                        />
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(priceRange[0], parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer accent-[#4DA9FF]"
                      />
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
                      {[5, 4, 3, 2, 1].map(rating => (
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(rating)}
                          className={`flex items-center w-full p-2 rounded-lg transition-colors ${
                            ratingFilter === rating ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex">
                            {Array(rating).fill(0).map((_, i) => (
                              <FaStar key={i} className="text-yellow-400" />
                            ))}
                            {Array(5-rating).fill(0).map((_, i) => (
                              <FaStar key={i} className="text-gray-300" />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-700">& Up</span>
                          {ratingFilter === rating && (
                            <FaCheck className="ml-auto text-[#4DA9FF]" size={14} />
                          )}
                        </button>
                      ))}
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
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={applyFilters}
                    disabled={!isFilterDirty && !isMobileView}
                    className={`${commonButtonStyles.primary} ${
                      !isFilterDirty && !isMobileView ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.aside>
          
          {/* Main Products Area */}
          <main className={`${showFilters && !isMobileView ? 'lg:w-3/4' : 'w-full'}`}>
            {/* Search and Sort */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search Bar */}
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search robots..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 pr-4 py-2 md:py-3 w-full border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4DA9FF] focus:border-transparent transition text-sm md:text-base"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  {searchTerm && (
                    <button 
                      onClick={() => handleSearchChange('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes size={14} />
                    </button>
                  )}
                </div>
                
                {/* Apply Search Button */}
                <button 
                  onClick={applyFilters}
                  className="md:w-auto w-full py-2 md:py-3 px-6 bg-[#4DA9FF] text-white rounded-full hover:bg-blue-500 transition-colors flex items-center justify-center gap-2"
                >
                  <FaSearch className="text-white" size={14} />
                  <span>Search</span>
                </button>
              </div>
            </div>
            
            {/* Category Quick Filters */}
            <div className="mb-6">
              <div className="flex overflow-x-auto pb-2 md:pb-0 md:flex-wrap gap-2 mt-2 no-scrollbar">
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setIsFilterDirty(true);
                  }}
                  className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                    selectedCategories.length === 0
                      ? 'bg-[#4DA9FF] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                
                {categories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => toggleCategory(category)}
                    className={`px-3 py-2 rounded-full text-xs md:text-sm font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedCategories.includes(category)
                        ? 'bg-[#4DA9FF] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-sm">
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
            
            {/* Infinite Scroll Toggle (for bonus feature) */}
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleInfiniteScroll}
                className={`text-xs md:text-sm px-3 py-1 rounded-full transition-colors ${
                  isInfiniteScrollEnabled
                    ? 'bg-[#4DA9FF] text-white'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {isInfiniteScrollEnabled ? 'Infinite Scroll: ON' : 'Infinite Scroll: OFF'}
              </button>
            </div>
            
            {/* Recently Viewed Section */}
            {recentlyViewed.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-gray-100">
                <h3 className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-gray-800">Recently Viewed</h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  {recentlyViewed.map((product: ProductType) => (
                    <Link 
                      key={product.id}
                      href={`/product/${product.id}`}
                      className="flex flex-col sm:flex-row items-center p-2 sm:p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                    >
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-0 sm:mr-3 flex-shrink-0">
                        <Image
                          src={product.main_image}
                          alt={product.main_image_alt || product.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs sm:text-sm text-[#4DA9FF]">${product.best_vendor?.price.toLocaleString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Products Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence>
                  {products.map((product: ProductType) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
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
            {products.length > 0 && (
              <div className="mt-8 flex justify-center" ref={loaderRef}>
                {hasMore ? (
                  <>
                    {!isInfiniteScrollEnabled ? (
                      <button 
                        onClick={() => fetchProducts()}
                        disabled={isLoading}
                        className={`${commonButtonStyles.primary} w-48 flex items-center justify-center gap-2 ${
                          isLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? (
                          <>
                            <FaSpinner className="animate-spin" />
                            Loading...
                          </>
                        ) : (
                          'Load More Products'
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-gray-500">
                        {isLoading && (
                          <>
                            <FaSpinner className="animate-spin" />
                            Loading more robots...
                          </>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  products.length > 0 && (
                    <p className="text-gray-500 py-2">You&apos;ve reached the end of the catalog</p>
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