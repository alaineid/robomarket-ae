import React, { useState } from 'react';
import { FaStar, FaChevronDown, FaCheck } from 'react-icons/fa';

interface FilterOption {
  label: string;
  value: string;
}

interface DropdownFilterProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (value: string) => void;
  multi?: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

interface PriceFilterProps {
  priceRange: [number, number];
  onPriceChange: (min: number, max: number) => void;
  maxPrice?: number;
  isOpen: boolean;
  onToggle: () => void;
}

interface RatingFilterProps {
  selectedRating: number;
  onChange: (rating: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

interface SortFilterProps {
  selectedSort: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  isOpen: boolean;
  onToggle: () => void;
}

interface AmazonStyleFilterProps {
  categories: string[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  sortBy: string;
  ratingFilter: number;
  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;
  onPriceChange: (min: number, max: number) => void;
  onSortChange: (sort: string) => void;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

// Individual filter dropdown component
const DropdownFilter: React.FC<DropdownFilterProps> = ({ 
  label, 
  options, 
  selected, 
  onChange, 
  multi = true,
  isOpen,
  onToggle
}) => {
  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{label}</span>
        <FaChevronDown 
          className={`ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          size={10}
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-30 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-3">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option, index) => (
                <div 
                  key={index} 
                  className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-md"
                  onClick={() => {
                    onChange(option.value);
                    if (!multi) onToggle();
                  }}
                >
                  <input
                    type={multi ? "checkbox" : "radio"}
                    checked={selected.includes(option.value)}
                    onChange={() => {}}
                    className={`${multi ? 'form-checkbox' : 'form-radio'} h-4 w-4 text-[#4DA9FF] border-gray-300 rounded focus:ring-[#4DA9FF]`}
                  />
                  <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                  {selected.includes(option.value) && <FaCheck size={12} className="ml-auto text-[#4DA9FF]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Price range filter component
const PriceFilter: React.FC<PriceFilterProps> = ({ 
  priceRange, 
  onPriceChange,
  maxPrice = 10000,
  isOpen,
  onToggle
}) => {
  const [localMin, setLocalMin] = useState(priceRange[0]);
  const [localMax, setLocalMax] = useState(priceRange[1]);

  // Sync local state if external priceRange changes while dropdown is closed
  React.useEffect(() => {
    if (!isOpen) {
      setLocalMin(priceRange[0]);
      setLocalMax(priceRange[1]);
    }
  }, [priceRange, isOpen]);

  const handleApply = () => {
    onPriceChange(localMin, localMax);
    onToggle();
  };

  const displayValue = 
    priceRange[0] > 0 || priceRange[1] < maxPrice
      ? `$${priceRange[0]} - $${priceRange[1]}`
      : 'Price';

  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{displayValue}</span>
        <FaChevronDown 
          className={`ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          size={10}
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-30 w-64 mt-1 p-4 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <input
              type="number"
              value={localMin}
              min={0}
              max={localMax - 1}
              onChange={(e) => setLocalMin(Math.max(0, Math.min(Number(e.target.value), localMax - 1)))}
              className="w-24 p-2 border border-gray-300 rounded text-sm"
              placeholder="Min"
            />
            <span className="mx-2 text-gray-400">to</span>
            <input
              type="number"
              value={localMax}
              min={localMin + 1}
              max={maxPrice}
              onChange={(e) => setLocalMax(Math.max(localMin + 1, Math.min(Number(e.target.value), maxPrice)))}
              className="w-24 p-2 border border-gray-300 rounded text-sm"
              placeholder="Max"
            />
          </div>
          
          <button
            onClick={handleApply}
            className="w-full py-2 text-sm font-medium text-white bg-[#4DA9FF] rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

// Rating filter component
const RatingFilter: React.FC<RatingFilterProps> = ({ 
  selectedRating, 
  onChange,
  isOpen,
  onToggle 
}) => {
  const ratingOptions = [
    { value: 4, label: '4 & Up' },
    { value: 3, label: '3 & Up' },
    { value: 2, label: '2 & Up' },
    { value: 1, label: '1 & Up' },
  ];

  const displayValue = selectedRating > 0 
    ? `${selectedRating}★ & Up` 
    : 'Customer Reviews';

  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{displayValue}</span>
        <FaChevronDown 
          className={`ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          size={10}
        />
      </button>
      
      {isOpen && (
        <div className="absolute z-30 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2">
            {ratingOptions.map((option, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
                className={`flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-md ${
                  selectedRating === option.value ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex">
                  {[...Array(option.value)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400" size={14} />
                  ))}
                  {[...Array(5 - option.value)].map((_, i) => (
                    <FaStar key={i} className="text-gray-300" size={14} />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-700">& Up</span>
                {selectedRating === option.value && (
                  <FaCheck size={12} className="ml-auto text-[#4DA9FF]" />
                )}
              </div>
            ))}
            
            {/* Option to clear rating filter */}
            <div 
              onClick={() => {
                onChange(0);
                onToggle();
              }}
              className="flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-md"
            >
              <span className="text-sm text-gray-700">Clear filter</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sort filter component
const SortFilter: React.FC<SortFilterProps> = ({ 
  selectedSort, 
  onChange, 
  options,
  isOpen,
  onToggle
}) => {
  // Find the selected option label
  const selectedOption = options.find(opt => opt.value === selectedSort);
  
  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>Sort by: {selectedOption?.label || 'Featured'}</span>
        <FaChevronDown 
          className={`ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          size={10}
        />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-30 w-64 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="p-2">
            {options.map((option, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  onChange(option.value);
                  onToggle();
                }}
                className={`flex items-center p-2 cursor-pointer hover:bg-blue-50 rounded-md ${
                  selectedSort === option.value ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-sm text-gray-700">{option.label}</span>
                {selectedSort === option.value && (
                  <FaCheck size={12} className="ml-auto text-[#4DA9FF]" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Amazon-style filter component
const AmazonStyleFilter: React.FC<AmazonStyleFilterProps> = ({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  sortBy,
  ratingFilter,
  onCategoryChange,
  onBrandChange,
  onPriceChange,
  onSortChange,
  onRatingChange,
  onClearFilters
}) => {
  const [openFilter, setOpenFilter] = useState<string | null>(null);

  const handleToggleFilter = (filterName: string) => {
    setOpenFilter(prevOpenFilter => (prevOpenFilter === filterName ? null : filterName));
  };

  // Convert categories to options format
  const categoryOptions = categories.map(cat => ({
    label: cat,
    value: cat
  }));
  
  // Convert brands to options format
  const brandOptions = brands.map(brand => ({
    label: brand,
    value: brand
  }));
  
  // Sort options
  const sortOptions = [
    { label: 'Featured', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Best Rated', value: 'rating' },
    { label: 'Most Popular', value: 'popularity' }
  ];

  return (
    <div className="sticky top-0 z-20 bg-white border-b border-gray-200 pt-2 pb-3 px-4 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Filters Label */}
        <div className="mr-2 text-sm font-medium text-gray-700">Filters:</div>
        
        {/* Department/Category Filter */}
        <DropdownFilter
          label={selectedCategories.length > 0 ? `Category (${selectedCategories.length})` : 'Category'}
          options={categoryOptions}
          selected={selectedCategories}
          onChange={onCategoryChange}
          isOpen={openFilter === 'category'}
          onToggle={() => handleToggleFilter('category')}
        />
        
        {/* Brand Filter */}
        <DropdownFilter
          label={selectedBrands.length > 0 ? `Brand (${selectedBrands.length})` : 'Brand'}
          options={brandOptions}
          selected={selectedBrands}
          onChange={onBrandChange}
          isOpen={openFilter === 'brand'}
          onToggle={() => handleToggleFilter('brand')}
        />
        
        {/* Price Range Filter */}
        <PriceFilter
          priceRange={priceRange}
          onPriceChange={onPriceChange}
          isOpen={openFilter === 'price'}
          onToggle={() => handleToggleFilter('price')}
        />
        
        {/* Rating Filter */}
        <RatingFilter
          selectedRating={ratingFilter}
          onChange={onRatingChange}
          isOpen={openFilter === 'rating'}
          onToggle={() => handleToggleFilter('rating')}
        />
        
        {/* Sort By */}
        <div className="ml-auto">
          <SortFilter
            selectedSort={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            isOpen={openFilter === 'sort'}
            onToggle={() => handleToggleFilter('sort')}
          />
        </div>
      </div>
      
      {/* Active Filters Section */}
      {(selectedCategories.length > 0 || selectedBrands.length > 0 || 
        ratingFilter > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-gray-500">Active filters:</span>
          
          {/* Clear All Button */}
          <button
            onClick={() => {
              onClearFilters();
              setOpenFilter(null); // Close any open filter
            }}
            className="text-xs text-[#4DA9FF] hover:underline"
          >
            Clear all
          </button>
          
          {/* Active filters badges would go here */}
          {/* This part could be expanded with filter chips/badges */}
        </div>
      )}
    </div>
  );
};

export default AmazonStyleFilter;
