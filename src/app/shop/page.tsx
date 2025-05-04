"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaFilter, FaTimes, FaChevronDown, FaSearch } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { commonButtonStyles, commonCardStyles, commonFormStyles, commonLayoutStyles } from '@/styles/commonStyles';

export default function ShopPage() {
  // State for filters and pagination
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Sample categories and brands for filters
  const categories = ["Companion", "Utility", "Security", "Education", "Healthcare", "Industrial"];
  const brands = ["RoboTech", "AIMasters", "Synthia", "MechWorks", "QuantumBots"];
  
  // Sample product data (would be fetched from API in a real app)
  const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `${['Advanced', 'Smart', 'Intelligent', 'Next-Gen'][i % 4]} ${['Robot', 'Companion', 'Assistant', 'Helper'][i % 4]} ${i + 1}`,
    price: Math.floor(Math.random() * 8000) + 2000,
    rating: Math.floor(Math.random() * 2) + 3 + (Math.random() > 0.5 ? 0.5 : 0),
    image: `/images/robot${(i % 4) + 1}.jpg`,
    category: categories[i % categories.length],
    brand: brands[i % brands.length],
    features: ["AI Learning", "Voice Control", "Autonomous Navigation"]
  }));

  // Function to handle category filter changes
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Function to handle brand filter changes
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Function to render star ratings
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

  // Apply filters
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesBrand && matchesPrice;
  });

  // Pagination logic
  const productsPerPage = 8;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <div className={commonLayoutStyles.heroSection}>
        <div className={commonLayoutStyles.section}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">Robot <span className="text-[#4DA9FF] relative inline-block">
              Marketplace
              <span className="absolute bottom-0 left-0 w-full h-1 bg-[#4DA9FF] rounded-full transform -translate-y-1"></span>
            </span></h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Discover the future of robotics with our premium selection of companion and utility robots</p>
            
            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <input 
                type="text" 
                placeholder="Search for robots..." 
                className="w-full h-12 px-6 pr-12 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]/40 focus:border-[#4DA9FF] transition-all duration-200 placeholder-gray-400"
              />
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#4DA9FF] transition-colors">
                <FaSearch size={18} />
              </button>
            </div>
            
            {/* Quick category buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {categories.map((category, index) => (
                <button 
                  key={index}
                  onClick={() => toggleCategory(category)} 
                  className={commonButtonStyles.category(selectedCategories.includes(category))}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={commonLayoutStyles.mainContent}>
        <div className={commonLayoutStyles.section}>
          {/* Filter toggle button */}
          <div className="mb-6">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={commonButtonStyles.filter}
            >
              {showFilters ? <FaTimes className="mr-2 text-gray-500" /> : <FaFilter className="mr-2 text-[#4DA9FF]" />}
              <span className="font-medium">{showFilters ? "Hide Filters" : "Show Filters"}</span>
            </motion.button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.aside 
              className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'}`}
              initial={false}
              animate={{ opacity: showFilters ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border border-gray-100">
                <h2 className="font-bold text-2xl mb-6 text-gray-800 border-b border-gray-100 pb-4">Filters</h2>
                
                {/* Categories filter */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-lg text-gray-800">Categories</h3>
                    <FaChevronDown className="text-gray-400 text-sm" />
                  </div>
                  <div className="space-y-2 pl-1">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center">
                        <input
                          id={`category-${index}`}
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => toggleCategory(category)}
                          className="w-4 h-4 accent-[#4DA9FF]"
                        />
                        <label htmlFor={`category-${index}`} className="ml-3 text-gray-700 hover:text-[#4DA9FF] cursor-pointer">
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
                  <div className="space-y-2 pl-1">
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
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-md appearance-none cursor-pointer accent-[#4DA9FF]"
                    />
                    <div className="flex justify-between mt-3">
                      <span className="bg-gray-100 px-3 py-1 rounded text-gray-600 font-medium">${priceRange[0].toLocaleString()}</span>
                      <span className="bg-gray-100 px-3 py-1 rounded text-gray-600 font-medium">${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={commonButtonStyles.primary}
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.aside>
            
            {/* Products Grid */}
            <main className={`${showFilters ? 'lg:w-3/4' : 'w-full'} transition-all duration-300`}>
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                  <p className="text-gray-700"><span className="font-semibold text-[#4DA9FF]">{filteredProducts.length}</span> robots found</p>
                  <div className="flex items-center">
                    <label htmlFor="sort" className="mr-3 text-gray-600">Sort by:</label>
                    <select id="sort" className={commonFormStyles.select}>
                      <option>Newest</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                      <option>Popularity</option>
                    </select>
                  </div>
                </div>
                
                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map(product => (
                    <motion.div 
                      key={product.id} 
                      whileHover={{ y: -3 }}
                      className={commonCardStyles.container}
                    >
                      <div className={commonCardStyles.imageContainer}>
                        {/* Placeholder for robot image */}
                        <div className={commonCardStyles.imagePlaceholder}>
                          <span className="text-gray-500 font-medium">[{product.name}]</span>
                        </div>
                        <div className={commonCardStyles.imageOverlay}></div>
                        <button className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                          <FaShoppingCart size={18} />
                        </button>
                      </div>
                      
                      <div className={commonCardStyles.content}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className={commonCardStyles.categoryBadge}>
                              {product.category}
                            </span>
                            <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
                          </div>
                          <span className="font-bold text-lg text-[#4DA9FF]">${product.price.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center mt-3">
                          <div className="flex">
                            {renderRatingStars(product.rating)}
                          </div>
                          <span className="text-gray-500 text-xs ml-2">({Math.floor(Math.random() * 100) + 10})</span>
                        </div>
                        
                        <div className="mt-4 flex justify-center">
                          <Link 
                            href={`/robot/${product.id}`}
                            className={`w-full text-center ${commonButtonStyles.secondary}`}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Empty state */}
                {currentProducts.length === 0 && (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaSearch size={36} className="text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-700 mb-2">No robots found</h3>
                    <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search terms to find what you're looking for.</p>
                  </div>
                )}
              </div>
              
              {/* Pagination controls */}
              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-10">
                  <div className="inline-flex rounded-lg shadow-sm">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-l-lg font-medium ${commonButtonStyles.pagination(false, currentPage === 1)}`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-12 h-12 ${commonButtonStyles.pagination(currentPage === page)}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-r-lg font-medium ${commonButtonStyles.pagination(false, currentPage === totalPages)}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
