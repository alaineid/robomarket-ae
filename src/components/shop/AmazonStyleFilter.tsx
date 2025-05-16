import React, { useState, useEffect } from 'react';
import { FaStar, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';

interface FilterOption {
  label: string;
  value: string;
}

interface DropdownFilterProps {
  buttonLabel: string; // Renamed from label
  dropdownTitle: string; // New
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void; // Changed from (value: string) => void
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
  dropdownTitle: string; // New
}

interface RatingFilterProps {
  selectedRating: number;
  onChange: (rating: number) => void;
  isOpen: boolean;
  onToggle: () => void;
  dropdownTitle: string; // New
}

interface SortFilterProps {
  selectedSort: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  isOpen: boolean;
  onToggle: () => void;
  dropdownTitle: string; // New
}

interface AmazonStyleFilterProps {
  categories: string[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  sortBy: string;
  ratingFilter: number;
  onCategoryChange: (values: string[]) => void; // Changed from (category: string) => void
  onBrandChange: (values: string[]) => void; // Changed from (brand: string) => void
  onPriceChange: (min: number, max: number) => void;
  onSortChange: (sort: string) => void;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

// Individual filter dropdown component
const DropdownFilter: React.FC<DropdownFilterProps> = ({
  buttonLabel,
  dropdownTitle,
  options,
  selected,
  onChange,
  multi = false,
  isOpen,
  onToggle,
}) => {
  const [localSelected, setLocalSelected] = useState<string[]>(selected);
  const [showAll, setShowAll] = useState(false);
  const displayOptions = showAll ? options : options.slice(0, 7);

  useEffect(() => {
    // Sync localSelected with selected prop when dropdown opens or selected changes
    setLocalSelected(selected);
  }, [selected, isOpen]);

  const handleOptionToggle = (optionValue: string) => {
    if (multi) {
      setLocalSelected(prev =>
        prev.includes(optionValue)
          ? prev.filter(item => item !== optionValue)
          : [...prev, optionValue]
      );
    } else {
      setLocalSelected(prev => (prev.includes(optionValue) ? [] : [optionValue]));
    }
  };

  const handleShowResults = () => {
    const hasChanges =
      localSelected.length !== selected.length ||
      localSelected.some(item => !selected.includes(item)) ||
      selected.some(item => !localSelected.includes(item));

    if (hasChanges) {
      onChange(localSelected);
    }
    onToggle(); // Close the dropdown
  };

  const handleClearFilter = () => {
    setLocalSelected([]);
    onChange([]); // Apply empty selection immediately
    onToggle(); // Close the dropdown
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
      >
        <span>{buttonLabel}</span>
        <FaChevronDown
          className={`ml-2 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          size={10}
        />
      </button>

      {isOpen && (
        <div className="absolute z-[100] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72 md:w-80">
          {/* Caret pointing up to the button */}
          <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dropdownTitle}</h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Close filter"
            >
              <FaTimes size={20} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {displayOptions.map((option) => {
              const isSelected = localSelected.includes(option.value);
              return (
                <button
                  key={option.value}
                  onClick={() => handleOptionToggle(option.value)}
                  className={`px-3 py-1.5 border rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${isSelected
                      ? 'bg-[#4DA9FF] text-white border-[#4DA9FF] hover:bg-blue-600 focus:ring-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:ring-blue-400'
                    }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          {options.length > 7 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-sm text-[#4DA9FF] hover:text-blue-700 hover:underline mb-4 focus:outline-none flex items-center"
            >
              <FaChevronDown className={`inline-block mr-1 transition-transform ${showAll ? 'transform rotate-180' : ''}`} size={12} />
              {showAll ? 'See less' : `See more (${options.length - 7} more)`}
            </button>
          )}

          <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleShowResults}
              className="w-full py-2 px-4 bg-[#4DA9FF] text-white rounded-md hover:bg-blue-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              Show results
            </button>
            <button
              onClick={handleClearFilter}
              className="w-full text-sm text-center text-[#4DA9FF] hover:text-blue-700 hover:underline py-1 focus:outline-none"
            >
              Clear filter
            </button>
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
  onToggle,
  dropdownTitle
}) => {
  const [localMin, setLocalMin] = useState(priceRange[0]);
  const [localMax, setLocalMax] = useState(priceRange[1]);
  const minPrice = 0;
  // const maxPrice = 10000; // Assuming a max price for the slider

  useEffect(() => {
    setLocalMin(priceRange[0]);
    setLocalMax(priceRange[1]);
  }, [priceRange, isOpen]);

  const handleApply = () => {
    if (localMin !== priceRange[0] || localMax !== priceRange[1]) {
      onPriceChange(localMin, localMax);
    }
    onToggle();
  };

  const handleClearFilter = () => {
    setLocalMin(minPrice); // Reset to default min
    setLocalMax(maxPrice); // Reset to default max
    onPriceChange(minPrice, maxPrice); // Apply default/cleared price range immediately
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
        <div className="absolute z-[100] mt-1 p-4 bg-white border border-gray-200 rounded-lg shadow-xl w-72 md:w-80">
          {/* Caret pointing up to the button */}
          <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dropdownTitle}</h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Close filter"
            >
              <FaTimes size={20} />
            </button>
          </div>
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

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={handleApply}
              className="w-full py-2 px-4 bg-[#4DA9FF] text-white rounded-md hover:bg-blue-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              Show results
            </button>
            <button
              onClick={handleClearFilter}
              className="w-full text-sm text-center text-[#4DA9FF] hover:text-blue-700 hover:underline py-1 focus:outline-none"
            >
              Clear filter
            </button>
          </div>
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
  onToggle,
  dropdownTitle
}) => {
  const [localRating, setLocalRating] = useState<number>(selectedRating);
  
  // Reset local state whenever the dropdown opens or if external selected rating changes
  React.useEffect(() => {
    setLocalRating(selectedRating);
  }, [selectedRating, isOpen]);
  
  const ratingOptions = [
    { value: 4, label: '4 & Up' },
    { value: 3, label: '3 & Up' },
    { value: 2, label: '2 & Up' },
    { value: 1, label: '1 & Up' },
  ];

  const displayValue = selectedRating > 0
    ? `${selectedRating}★ & Up`
    : 'Customer Reviews';

  const handleShowResults = () => {
    onChange(localRating);
    onToggle();
  };

  const handleClearFilter = () => {
    setLocalRating(0);
    onChange(0); // Apply cleared rating (0) immediately
    onToggle();
  };

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
        <div className="absolute z-[100] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72 md:w-80">
          {/* Caret pointing up to the button */}
          <div className="absolute -top-2 left-4 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200"></div>
           
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dropdownTitle}</h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Close filter"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {ratingOptions.map((option) => {
              const isSelected = localRating === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setLocalRating(option.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1
                    ${isSelected
                      ? 'bg-[#EBF5FF] text-[#007AFF] border-[#4DA9FF] hover:bg-blue-100 focus:ring-blue-500' // Lighter blue for selected single-option
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:ring-blue-400'
                    }`}
                >
                  <span className="flex">
                    {[...Array(option.value)].map((_, i) => (
                      <FaStar key={`star-filled-${i}`} className="text-yellow-400" size={14} />
                    ))}
                    {[...Array(5 - option.value)].map((_, i) => (
                      <FaStar key={`star-empty-${i}`} className="text-gray-300" size={14} />
                    ))}
                    <span className="ml-2 text-gray-700">& Up</span>
                  </span>
                  {isSelected && <FaCheck size={14} className="text-[#007AFF]" />}
                </button>
              );
            })}
          </div>
          <div className="mt-auto pt-3 border-t border-gray-200 space-y-2">
            <button
              onClick={handleShowResults}
              className="w-full py-2 px-4 bg-[#4DA9FF] text-white rounded-md hover:bg-blue-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              Show results
            </button>
            <button
              onClick={handleClearFilter}
              className="w-full text-sm text-center text-[#4DA9FF] hover:text-blue-700 hover:underline py-1 focus:outline-none"
            >
              Clear filter
            </button>
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
  onToggle,
  dropdownTitle
}) => {
  const [localSort, setLocalSort] = useState<string>(selectedSort);
  
  // Reset local state whenever the dropdown opens or if external selected sort changes
  React.useEffect(() => {
    setLocalSort(selectedSort);
  }, [selectedSort, isOpen]);
  
  // Find the selected option label
  const selectedOption = options.find(opt => opt.value === selectedSort);
  const localSelectedOption = options.find(opt => opt.value === localSort);
  
  const handleShowResults = () => {
    onChange(localSort);
    onToggle();
  };

  const handleClearFilter = () => {
    const defaultSort = 'newest'; // Assuming 'newest' is the default
    setLocalSort(defaultSort);
    onChange(defaultSort); // Apply default sort immediately
    onToggle();
  };

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
        <div className="absolute right-0 z-[100] mt-1 bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-72 md:w-80">
          {/* Caret pointing up to the button - positioned on the right */}
          <div className="absolute -top-2 right-4 w-4 h-4 rotate-45 bg-white border-t border-l border-gray-200"></div>
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{dropdownTitle}</h3>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600 p-1 -mr-1 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-label="Close filter"
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className="space-y-1">
            {options.map((option) => {
               const isSelected = localSort === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setLocalSort(option.value)}
                  className={`w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${isSelected
                    ? 'bg-[#EBF5FF] text-[#007AFF] border-[#4DA9FF] hover:bg-blue-100 focus:ring-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50 focus:ring-blue-400'
                  }`}
                >
                  <span>{option.label}</span>
                  {isSelected && <FaCheck size={14} className="text-[#007AFF]" />}
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button
              onClick={handleShowResults}
              className="w-full py-2 px-4 bg-[#4DA9FF] text-white rounded-md hover:bg-blue-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
            >
              Show results
            </button>
            <button
              onClick={handleClearFilter}
              className="w-full text-sm text-center text-[#4DA9FF] hover:text-blue-700 hover:underline py-1 focus:outline-none"
            >
              Clear filter
            </button>
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
    <div className="pt-2 pb-3 px-4 mt-4"> {/* Removed sticky, z-index, bg, and border; Added mt-4 for spacing */}
      <div className="flex flex-wrap items-center gap-2">
        
        {/* Department/Category Filter */}
        <DropdownFilter
          buttonLabel={selectedCategories.length > 0 ? `Category (${selectedCategories.length})` : 'Category'}
          dropdownTitle="Category"
          options={categoryOptions}
          selected={selectedCategories}
          onChange={onCategoryChange}
          isOpen={openFilter === 'category'}
          onToggle={() => handleToggleFilter('category')}
          multi // Explicitly true, though default
        />

        {/* Brand Filter */}
        <DropdownFilter
          buttonLabel={selectedBrands.length > 0 ? `Brand (${selectedBrands.length})` : 'Brand'}
          dropdownTitle="Brand"
          options={brandOptions}
          selected={selectedBrands}
          onChange={onBrandChange}
          isOpen={openFilter === 'brand'}
          onToggle={() => handleToggleFilter('brand')}
          multi // Explicitly true
        />

        {/* Price Range Filter */}
        <PriceFilter
          priceRange={priceRange}
          onPriceChange={onPriceChange}
          isOpen={openFilter === 'price'}
          onToggle={() => handleToggleFilter('price')}
          dropdownTitle="Price Range"
        />

        {/* Rating Filter */}
        <RatingFilter
          selectedRating={ratingFilter}
          onChange={onRatingChange}
          isOpen={openFilter === 'rating'}
          onToggle={() => handleToggleFilter('rating')}
          dropdownTitle="Customer Reviews"
        />

        {/* Sort By */}
        <div className="ml-auto">
          <SortFilter
            selectedSort={sortBy}
            onChange={onSortChange}
            options={sortOptions}
            isOpen={openFilter === 'sort'}
            onToggle={() => handleToggleFilter('sort')}
            dropdownTitle="Sort By"
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
