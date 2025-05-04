"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaStar, FaStarHalfAlt, FaShoppingCart, FaFilter, FaTimes, FaChevronDown } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

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
      
      {/* Main Content */}
      <div className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Robot <span className="text-[#4DA9FF]">Marketplace</span></h1>
          
          {/* Mobile filter toggle button */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full py-3 bg-white border border-gray-300 rounded-lg shadow-sm"
            >
              {showFilters ? <FaTimes className="mr-2" /> : <FaFilter className="mr-2" />}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden'} lg:block`}>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
                <h2 className="font-bold text-2xl mb-6 text-gray-800">Filters</h2>
                
                {/* Categories filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex justify-between items-center">
                    Categories
                    <FaChevronDown className="text-gray-400" />
                  </h3>
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
                        <label htmlFor={`category-${index}`} className="ml-2 text-gray-700">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Brands filter */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex justify-between items-center">
                    Brands
                    <FaChevronDown className="text-gray-400" />
                  </h3>
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
                        <label htmlFor={`brand-${index}`} className="ml-2 text-gray-700">
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Slider */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">Price Range</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-[#4DA9FF]"
                    />
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-600">${priceRange[0].toLocaleString()}</span>
                      <span className="text-gray-600">${priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-[#4DA9FF] hover:bg-[#3D99FF] text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Apply Filters
                </button>
              </div>
            </aside>
            
            {/* Products Grid */}
            <main className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-600"><span className="font-medium">{filteredProducts.length}</span> robots found</p>
                  <div className="flex items-center">
                    <label htmlFor="sort" className="mr-2 text-gray-600">Sort by:</label>
                    <select id="sort" className="border border-gray-300 rounded py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#4DA9FF]">
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
                    <div key={product.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden hover:shadow-md transform hover:-translate-y-1 transition-all duration-300">
                      <div className="relative h-48 w-full overflow-hidden group">
                        {/* Placeholder for robot image */}
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                          <span className="text-gray-500 font-medium">[{product.name}]</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <button className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer">
                          <FaShoppingCart size={16} />
                        </button>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2 py-1 text-xs font-medium text-[#4DA9FF] bg-blue-50 rounded-full mb-2">
                              {product.category}
                            </span>
                            <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
                          </div>
                          <span className="font-bold text-lg text-gray-800">${product.price.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <div className="flex">
                            {renderRatingStars(product.rating)}
                          </div>
                          <span className="text-gray-500 text-xs ml-2">({Math.floor(Math.random() * 100) + 10})</span>
                        </div>
                        
                        <div className="mt-3 flex justify-center">
                          <Link 
                            href={`/robot/${product.id}`}
                            className="w-full text-center bg-white border border-[#4DA9FF] text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white text-sm font-medium py-2 px-4 rounded transition-all duration-300"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Empty state */}
                {currentProducts.length === 0 && (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No robots found</h3>
                    <p className="text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                  </div>
                )}
              </div>
              
              {/* Pagination controls */}
              {filteredProducts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-200 text-gray-600' : 'bg-white text-gray-700 hover:bg-[#4DA9FF] hover:text-white'}`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg ${currentPage === page ? 'bg-[#4DA9FF] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                    ))}
                    
                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-200 text-gray-600' : 'bg-white text-gray-700 hover:bg-[#4DA9FF] hover:text-white'}`}
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
