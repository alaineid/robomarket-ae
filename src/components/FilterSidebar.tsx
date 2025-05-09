'use client';

import React, { useState } from 'react';
import { FaTimes, FaChevronDown } from 'react-icons/fa';
import { commonButtonStyles } from '@/styles/commonStyles';
import { motion, AnimatePresence } from 'framer-motion';

// Common categories and brands for robot products
const COMMON_CATEGORIES = [
  'Household Robots',
  'Industrial Robots',
  'Educational Robots',
  'Service Robots',
  'Medical Robots',
  'Entertainment Robots',
  'Agricultural Robots',
  'Military Robots'
];

const COMMON_BRANDS = [
  'Algorythm',
  'RoboMaster',
  'TechDroid',
  'Autonetics',
  'RoboSoft',
  'MechaWorks',
  'Robotech',
  'SynthBot'
];

// Filter panel types
type FilterPanels = 'category' | 'price' | 'brand' | 'rating';

// FilterSidebar props type
interface FilterSidebarProps {
  filters: {
    search: string;
    category: string[];
    brand: string[];
    price: [number, number];
    rating: number;
    sort: string;
  };
  onFilterChange: <K extends keyof FilterSidebarProps['filters']>(
    key: K, 
    value: FilterSidebarProps['filters'][K]
  ) => void;
  onClearFilters: () => void;
  onApplyFilters: () => void;
  isOpen: boolean; 
  onToggle: () => void;
  isMobile: boolean;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  onApplyFilters,
  isOpen,
  onToggle,
  isMobile
}: FilterSidebarProps) {
  // Track which filter panels are expanded
  const [expandedPanels, setExpandedPanels] = useState<FilterPanels[]>([
    'category', 'brand'
  ]);
  
  // Handle expanding/collapsing a panel
  const togglePanel = (panel: FilterPanels) => {
    setExpandedPanels(prev => 
      prev.includes(panel) 
        ? prev.filter(p => p !== panel) 
        : [...prev, panel]
    );
  };
  
  // Check if a panel is expanded
  const isPanelExpanded = (panel: FilterPanels) => expandedPanels.includes(panel);
  
  // Handle checkbox changes for category and brand
  const handleMultiCheckboxChange = (filterKey: 'category' | 'brand', value: string) => {
    const currentValues = filters[filterKey];
    
    const newValues = currentValues.includes(value)
      ? currentValues.filter(val => val !== value) // Remove if exists
      : [...currentValues, value]; // Add if doesn't exist
    
    onFilterChange(filterKey, newValues);
  };
  
  // Handle rating filter change
  const handleRatingChange = (rating: number) => {
    onFilterChange('rating', rating === filters.rating ? 0 : rating);
  };
  
  // Handle price range change
  const handlePriceChange = (index: 0 | 1, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      const newPrice = [...filters.price] as [number, number];
      newPrice[index] = numValue;
      
      // Ensure min <= max
      if (index === 0 && numValue > newPrice[1]) {
        newPrice[1] = numValue;
      } else if (index === 1 && numValue < newPrice[0]) {
        newPrice[0] = numValue;
      }
      
      onFilterChange('price', newPrice);
    }
  };
  
  // Calculate the number of active filters
  const activeFilterCount = (
    filters.category.length +
    filters.brand.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.price[0] > 0 || filters.price[1] < 10000 ? 1 : 0)
  );
  
  // Mobile sidebar overlay variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.5 },
  };
  
  // Mobile sidebar variants
  const sidebarVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };
  
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          onClick={onToggle}
          className="fixed inset-0 bg-black z-30"
        />
      )}
      
      {/* Sidebar Content */}
      <AnimatePresence>
        {(!isMobile || isOpen) && (
          <motion.aside
            initial={isMobile ? "hidden" : undefined}
            animate={isMobile ? "visible" : undefined}
            exit={isMobile ? "hidden" : undefined}
            variants={sidebarVariants}
            className={`${isMobile 
              ? 'fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl overflow-y-auto'
              : 'w-64 lg:w-72'}`}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 sticky top-4">
              {/* Header with close button on mobile */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
                {isMobile && (
                  <button 
                    onClick={onToggle}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes size={18} />
                  </button>
                )}
              </div>

              <div className="p-4 space-y-6">
                {/* Category Filter */}
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                    onClick={() => togglePanel('category')}
                  >
                    Categories
                    <FaChevronDown 
                      size={12} 
                      className={`transform transition-transform ${
                        isPanelExpanded('category') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isPanelExpanded('category') && (
                    <div className="space-y-2 mt-2 pl-1">
                      {COMMON_CATEGORIES.map((category) => (
                        <div key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category}`}
                            checked={filters.category.includes(category)}
                            onChange={() => handleMultiCheckboxChange('category', category)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`category-${category}`} 
                            className="ml-2 text-sm text-gray-700"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Brand Filter */}
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                    onClick={() => togglePanel('brand')}
                  >
                    Brands
                    <FaChevronDown 
                      size={12} 
                      className={`transform transition-transform ${
                        isPanelExpanded('brand') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isPanelExpanded('brand') && (
                    <div className="space-y-2 mt-2 pl-1">
                      {COMMON_BRANDS.map((brand) => (
                        <div key={brand} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`brand-${brand}`}
                            checked={filters.brand.includes(brand)}
                            onChange={() => handleMultiCheckboxChange('brand', brand)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <label 
                            htmlFor={`brand-${brand}`} 
                            className="ml-2 text-sm text-gray-700"
                          >
                            {brand}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                    onClick={() => togglePanel('price')}
                  >
                    Price Range
                    <FaChevronDown 
                      size={12} 
                      className={`transform transition-transform ${
                        isPanelExpanded('price') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isPanelExpanded('price') && (
                    <div className="space-y-3 mt-2 pl-1">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">
                            Min
                          </label>
                          <div className="relative rounded-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              value={filters.price[0]}
                              onChange={(e) => handlePriceChange(0, e.target.value)}
                              className="pl-7 block w-full border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="0"
                              min="0"
                              max="10000"
                            />
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-xs text-gray-500 mb-1">
                            Max
                          </label>
                          <div className="relative rounded-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              value={filters.price[1]}
                              onChange={(e) => handlePriceChange(1, e.target.value)}
                              className="pl-7 block w-full border-gray-200 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                              placeholder="10000"
                              min="0"
                              max="10000"
                            />
                          </div>
                        </div>
                      </div>
                      
                      {/* Price range slider could be added here in a future update */}
                    </div>
                  )}
                </div>
                
                {/* Rating Filter */}
                <div>
                  <button 
                    className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                    onClick={() => togglePanel('rating')}
                  >
                    Rating
                    <FaChevronDown 
                      size={12} 
                      className={`transform transition-transform ${
                        isPanelExpanded('rating') ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {isPanelExpanded('rating') && (
                    <div className="space-y-2 mt-2 pl-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRatingChange(rating)}
                          className={`flex items-center w-full p-1 rounded transition ${
                            filters.rating === rating ? 'bg-yellow-50' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, index) => (
                              <svg
                                key={index}
                                className={`w-4 h-4 ${
                                  index < rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-700">& Up</span>
                          {filters.rating === rating && (
                            <span className="ml-auto text-blue-600">
                              <FaTimes size={12} />
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Filter Actions */}
                <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <button
                    onClick={onApplyFilters}
                    className={commonButtonStyles.primary}
                  >
                    Apply Filters
                  </button>
                  
                  <button
                    onClick={onClearFilters}
                    className={commonButtonStyles.secondary}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}