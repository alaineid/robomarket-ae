"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  FaStar, FaFilter, FaTimes, FaChevronDown, FaChevronRight,
  FaSearch, FaCheck, FaHeart, FaBoxOpen, FaShieldAlt, FaBrain, FaHeartbeat, FaIndustry
} from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProductCard from '@/components/ProductCard';
import { commonButtonStyles, commonFormStyles, commonLayoutStyles } from '@/styles/commonStyles';
import { Product, products, categories, brands } from '@/utils/productData';

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const [comparingProducts, setComparingProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);

  const CATEGORY_ICONS = {
    'Companion': <FaHeart />,
    'Utility': <FaBoxOpen />,
    'Security': <FaShieldAlt />,
    'Education': <FaBrain />,
    'Healthcare': <FaHeartbeat />,
    'Industrial': <FaIndustry />
  };
  
  // Load recently viewed products from localStorage on mount
  useEffect(() => {
    const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (savedRecentlyViewed) {
      try {
        const viewedIds = JSON.parse(savedRecentlyViewed);
        const viewedProducts = viewedIds
          .map((id: number) => products.find(p => p.id === id))
          .filter(Boolean)
          .slice(0, 4);
        setRecentlyViewed(viewedProducts);
      } catch {
        console.error("Failed to parse recently viewed products from localStorage");
      }
    }
  }, []);

  // Toggle a category selection
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
    // Reset to first page when changing filters
    setCurrentPage(1);
  };

  // Toggle a brand selection
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
    // Reset to first page when changing filters
    setCurrentPage(1);
  };

  // Handle price range changes
  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange([min, max]);
    setCurrentPage(1);
  };

  // Handle rating filter change
  const handleRatingChange = (rating: number) => {
    setRatingFilter(rating === ratingFilter ? 0 : rating);
    setCurrentPage(1);
  };

  // Handle adding/removing products to compare
  const handleCompareToggle = (product: Product, isComparing: boolean) => {
    if (isComparing) {
      if (comparingProducts.length < 3) {
        setComparingProducts([...comparingProducts, product]);
      } else {
        alert("You can compare up to 3 products at a time");
      }
    } else {
      setComparingProducts(comparingProducts.filter(p => p.id !== product.id));
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 10000]);
    setRatingFilter(0);
    setSearchTerm('');
  };

  // Apply filters to products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    const matchesRating = ratingFilter === 0 || product.rating >= ratingFilter;
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesRating;
  });

  // Sort the filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popularity':
        return b.reviews.length - a.reviews.length;
      case 'newest':
      default:
        return b.id - a.id; // Using id as a proxy for newest
    }
  });

  // Pagination logic
  const productsPerPage = 8;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Function to render a category icon
  const renderCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category as keyof typeof CATEGORY_ICONS] || <FaBoxOpen />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />    
     
      {/* Main Content */}
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
            <h1 className="text-3xl font-bold text-gray-800">
              Shop Our Robots
              {selectedCategories.length > 0 && (
                <span className="text-xl font-normal text-[#4DA9FF] ml-2">
                  • {selectedCategories.join(', ')}
                </span>
              )}
            </h1>         
           
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6 relative">
            {/* Show Filter Button - Visible when filters are hidden */}
            {!showFilters && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowFilters(true)}
                className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-[#4DA9FF] text-white p-3 rounded-r-lg shadow-md z-10 hover:bg-blue-500 transition-colors"
                style={{ transform: 'translateY(-50%)' }}
              >
                <FaChevronRight />
              </motion.button>
            )}
            
            {/* Filters Sidebar */}
            <motion.aside 
              className={`lg:w-1/4 ${!showFilters ? 'hidden' : ''}`}
              initial={{ opacity: showFilters ? 1 : 0, x: showFilters ? 0 : -20 }}
              animate={{ opacity: showFilters ? 1 : 0, x: showFilters ? 0 : -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h2 className="font-bold text-xl text-gray-800">Filters</h2>
                  <button 
                    onClick={() => setShowFilters(false)} 
                    className="text-gray-500 hover:text-gray-700"
                    title="Hide filters"
                  >
                    <FaTimes size={16} />
                  </button>
                </div>
                
                {/* Categories filter with icons */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">Categories</h3>
                    <FaChevronDown className="text-gray-400 text-sm" />
                  </div>
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
                </div>
                
                {/* Brands filter */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">Brands</h3>
                    <FaChevronDown className="text-gray-400 text-sm" />
                  </div>
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
                </div>
                
                {/* Price Range Slider */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4 text-gray-800">Price Range</h3>
                  <div className="px-2">
                    <div className="flex items-center justify-between mb-2">
                      <input 
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceRangeChange(
                          Math.min(Number(e.target.value), priceRange[1] - 100),
                          priceRange[1]
                        )}
                        className="w-24 h-8 px-2 border border-gray-200 rounded text-sm"
                      />
                      <span className="mx-2 text-gray-400">to</span>
                      <input 
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceRangeChange(
                          priceRange[0],
                          Math.max(Number(e.target.value), priceRange[0] + 100)
                        )}
                        className="w-24 h-8 px-2 border border-gray-200 rounded text-sm"
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
                </div>
                
                {/* Ratings Filter */}
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-3 text-gray-800">Rating</h3>
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
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={clearFilters}
                  className={commonButtonStyles.primary}
                >
                  Reset All Filters
                </motion.button>
              </div>
            </motion.aside>
            
            {/* Main Products Area */}
            <main className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
              {/* Search and Sort Control Bar */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  {/* Search Bar - Large and clean */}
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Search robots..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset to first page on search
                      }}
                      className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#4DA9FF] focus:border-transparent transition"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    {searchTerm && (
                      <button 
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes size={14} />
                      </button>
                    )}
                  </div>
                  
                  {/* Sort Dropdown - Right aligned */}
                  <div className="flex items-center whitespace-nowrap">
                    <span className="mr-2 text-gray-600 text-sm">Sort by:</span>
                    <select 
                      id="sort" 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#4DA9FF] transition"
                    >
                      <option value="newest">Newest</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Best Rated</option>
                      <option value="popularity">Most Popular</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {filteredProducts.length > 0 && (
                <div className="mb-6">          
                  
                  {/* Category filter buttons */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button
                      onClick={() => setSelectedCategories([])}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
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
                        className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors ${
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
              )}
              
              {/* Comparison Bar */}
              {comparingProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-blue-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800">
                      Compare Products ({comparingProducts.length}/3)
                    </h3>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setComparingProducts([])}
                        className="text-sm text-gray-500 hover:text-gray-700"
                      >
                        Clear All
                      </button>
                      <button 
                        onClick={() => setShowComparison(true)}
                        className={`text-sm ${commonButtonStyles.secondary}`}
                        disabled={comparingProducts.length < 2}
                      >
                        Compare Now
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {comparingProducts.map(product => (
                      <div key={product.id} className="flex items-center p-2 bg-blue-50 rounded-lg border border-blue-100 min-w-[200px]">
                        <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="min-w-0 flex-grow">
                          <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
                          <p className="text-sm text-[#4DA9FF]">${product.price.toLocaleString()}</p>
                        </div>
                        <button 
                          onClick={() => handleCompareToggle(product, false)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Recently Viewed Section */}
              {recentlyViewed.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
                  <h3 className="font-bold text-xl mb-4 text-gray-800">Recently Viewed</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recentlyViewed.map(product => (
                      <Link 
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors"
                      >
                        <div className="relative w-12 h-12 mr-3 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-sm text-[#4DA9FF]">${product.price.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(product => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      showCompare={true}
                      onCompareToggle={handleCompareToggle}
                      isComparing={comparingProducts.some(p => p.id === product.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 border border-gray-100 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <FaSearch size={36} className="text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-700 mb-2">No robots found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    We couldn&apos;t find any robots matching your current filters. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={clearFilters}
                    className={commonButtonStyles.primary}
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
              
              {/* Pagination */}
              {filteredProducts.length > productsPerPage && (
                <div className="mt-10 flex justify-center">
                  <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      className={`px-3 py-2 rounded-l-lg font-medium ${
                        currentPage === 1 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                      } border border-gray-200`}
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // For many pages, show first, last, current, and neighbors
                      let pageNum;
                      if (totalPages <= 5) {
                        // Show all pages if there are 5 or fewer
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        // Near start
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        // Near end
                        pageNum = totalPages - 4 + i;
                      } else {
                        // Middle
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button 
                          key={i}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 ${
                            currentPage === pageNum 
                              ? 'bg-[#4DA9FF] text-white font-bold' 
                              : 'bg-white text-gray-700 hover:bg-gray-50'
                          } border border-gray-200`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                      className={`px-3 py-2 rounded-r-lg font-medium ${
                        currentPage === totalPages 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 cursor-pointer'
                      } border border-gray-200`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
