'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Product } from '@/utils/types/product.types';

// Default filter values
const DEFAULT_FILTERS = {
  search: '',
  category: [] as string[],
  brand: [] as string[],
  price: [0, 10000] as [number, number],
  rating: 0,
  sort: 'newest'
};

// Type for the return value of our API
interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
}

// Type for initial data passed from SSR
interface InitialData {
  products: Product[];
  hasMore: boolean;
  total: number;
}

// Hook for managing products with filtering, sorting, and pagination
export function useProducts(initialData?: InitialData) {
  // Products state
  const [products, setProducts] = useState<Product[]>(initialData?.products || []);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialData?.hasMore || false);
  const [total, setTotal] = useState(initialData?.total || 0);
  
  // Current offset (for pagination)
  const [offset, setOffset] = useState(initialData?.products?.length || 0);
  
  // Filters state
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [appliedFilters, setAppliedFilters] = useState({ ...DEFAULT_FILTERS });
  
  // Search debouncing
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Load more products
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Build query string
      const params = new URLSearchParams();
      
      // Pagination
      params.append('offset', offset.toString());
      params.append('limit', '20');
      
      // Filter params
      if (appliedFilters.search) {
        params.append('search', appliedFilters.search);
      }
      
      if (appliedFilters.category.length > 0) {
        params.append('category', appliedFilters.category.join(','));
      }
      
      if (appliedFilters.brand.length > 0) {
        params.append('brand', appliedFilters.brand.join(','));
      }
      
      if (appliedFilters.price[0] > 0) {
        params.append('price_min', appliedFilters.price[0].toString());
      }
      
      if (appliedFilters.price[1] < 10000) {
        params.append('price_max', appliedFilters.price[1].toString());
      }
      
      if (appliedFilters.rating > 0) {
        params.append('rating', appliedFilters.rating.toString());
      }
      
      // Sort param
      params.append('sort_by', appliedFilters.sort);
      
      // Fetch data
      const response = await fetch(`/api/products?${params.toString()}`);
      const data: ProductsResponse = await response.json();
      
      // Update state
      setProducts(prevProducts => [...prevProducts, ...data.products]);
      setHasMore(data.hasMore);
      setTotal(data.total);
      setOffset(prevOffset => prevOffset + data.products.length);
    } catch (error) {
      console.error('Error loading more products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, isLoading, offset, appliedFilters]);
  
  // Fetch products (reset)
  const fetchProducts = useCallback(async (resetFilters: boolean = false) => {
    setIsLoading(true);
    
    try {
      // Build query string
      const params = new URLSearchParams();
      
      // Reset pagination
      params.append('offset', '0');
      params.append('limit', '20');
      
      const filtersToUse = resetFilters ? DEFAULT_FILTERS : appliedFilters;
      
      // Filter params
      if (filtersToUse.search) {
        params.append('search', filtersToUse.search);
      }
      
      if (filtersToUse.category.length > 0) {
        params.append('category', filtersToUse.category.join(','));
      }
      
      if (filtersToUse.brand.length > 0) {
        params.append('brand', filtersToUse.brand.join(','));
      }
      
      if (filtersToUse.price[0] > 0) {
        params.append('price_min', filtersToUse.price[0].toString());
      }
      
      if (filtersToUse.price[1] < 10000) {
        params.append('price_max', filtersToUse.price[1].toString());
      }
      
      if (filtersToUse.rating > 0) {
        params.append('rating', filtersToUse.rating.toString());
      }
      
      // Sort param
      params.append('sort_by', filtersToUse.sort);
      
      // Fetch data
      const response = await fetch(`/api/products?${params.toString()}`);
      const data: ProductsResponse = await response.json();
      
      // Update state
      setProducts(data.products);
      setHasMore(data.hasMore);
      setTotal(data.total);
      setOffset(data.products.length);
      
      // If we're resetting filters, update both the current and applied filters
      if (resetFilters) {
        setFilters({ ...DEFAULT_FILTERS });
        setAppliedFilters({ ...DEFAULT_FILTERS });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [appliedFilters]);
  
  // Update filter and apply debounce for search
  const updateFilter = useCallback(<K extends keyof typeof filters>(
    key: K,
    value: typeof filters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    
    // Debounce search to avoid too many API calls
    if (key === 'search') {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
      
      searchTimeout.current = setTimeout(() => {
        setAppliedFilters(prev => ({ ...prev, [key]: value }));
        setOffset(0);
        fetchProducts(false);
      }, 500); // 500ms debounce delay
    }
  }, [fetchProducts]);
  
  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);
  
  // Apply filters and refresh products
  const applyFilters = useCallback(() => {
    setAppliedFilters({ ...filters });
    setOffset(0);
    fetchProducts(false);
  }, [filters, fetchProducts]);
  
  // Refresh when the applied filters change (useful for search changes)
  useEffect(() => {
    // Don't run on initial mount
    if (initialData && products === initialData.products) {
      return;
    }
  }, [appliedFilters, initialData, products]);
  
  // Clean up the search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);
  
  return {
    products,
    isLoading,
    hasMore,
    total,
    filters,
    updateFilter,
    fetchProducts,
    loadMore,
    clearFilters,
    applyFilters
  };
}