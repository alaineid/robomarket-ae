/**
 * React Query hooks for data fetching
 */
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Product, ApiResponse } from "@/types/product.types";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

// Fetch products with filters
export function useProducts(
  filters?: {
    search?: string;
    category?: string;
    brand?: string;
    price_min?: number;
    price_max?: number;
    rating?: number;
    sort_by?: string;
    limit?: number;
    offset?: number;
  },
  initialData?: ApiResponse,
) {
  const queryKey = ["products", filters];
  const pageSize = filters?.limit || 4;

  return useInfiniteQuery({
    queryKey,
    // Provide initial data for the first page to hydrate from server
    initialData: initialData
      ? { pages: [initialData], pageParams: [0] }
      : undefined,
    queryFn: async ({ pageParam = 0 }) => {
      const params = new URLSearchParams();

      // Add all filters to query params if they exist
      if (filters?.search) params.append("search", filters.search);
      if (filters?.category) params.append("category", filters.category);
      if (filters?.brand) params.append("brand", filters.brand);
      if (filters?.price_min !== undefined)
        params.append("price_min", filters.price_min.toString());
      if (filters?.price_max !== undefined)
        params.append("price_max", filters.price_max.toString());
      if (filters?.rating !== undefined)
        params.append("rating", filters.rating.toString());
      if (filters?.sort_by) params.append("sort_by", filters.sort_by);

      // Pagination
      params.append("limit", pageSize.toString());
      params.append("offset", pageParam.toString());

      // Make API request using the utility
      return fetchWithAuth<ApiResponse>(`/api/products?${params.toString()}`, {
        skipCache: true,
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.hasMore) return undefined;

      // Use the server-provided nextOffset when available
      return lastPage.nextOffset;
    },
    select: (data) => {
      // Just append all products from all pages, trusting the backend paging
      const products = data.pages.flatMap((page) => page.products || []);
      const hasMore = data.pages[data.pages.length - 1].hasMore;
      return {
        products,
        hasMore,
        pages: data.pages,
        pageParams: data.pageParams,
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch a single product by ID
export function useProduct(id: number | string | null) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;

      return fetchWithAuth<Product>(`/api/products/${id}`, {
        skipCache: true,
      });
    },
    enabled: !!id, // Only run the query if we have an ID
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

// Fetch products with featured flag
export function useFeaturedProducts(limit = 6) {
  return useQuery({
    queryKey: ["featuredProducts", limit],
    queryFn: async () => {
      const data = await fetchWithAuth<ApiResponse>(
        `/api/products?featured=true&limit=${limit}&sort_by=featured`,
        {
          skipCache: true,
        },
      );
      return data.products || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
