import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/utils/server/supabaseServer';
import { getBestVendorProduct } from '@/utils/vendor';
import type { Database } from '@/utils/types/database.types';

type Product = Database['public']['Tables']['products']['Row'];
type ProductRating = Database['public']['Tables']['product_ratings']['Row'];
type Vendor = Database['public']['Tables']['vendors']['Row'];
type VendorProduct = {
  price: number;
  stock: number;
  vendors?: {
    name: string;
    email?: string;
    phone?: string;
    website?: string;
  };
};

type ProductWithRelations = Product & {
  product_ratings?: Pick<ProductRating, 'average_rating' | 'rating_count'>[];
  vendors?: Pick<Vendor, 'name'>[];
  vendor_products?: VendorProduct[];
  product_images?: {
    url: string;
    alt_text?: string;
    position?: number;
  }[];
  product_categories?: {
    categories?: {
      name: string;
    };
  }[];
  featured_products?: { position: number }[]; // Added featured_products property
};

export async function GET(request: Request) {
  try {
    // Initialize Supabase admin client
    const serverSupabase = createServerAdminClient();
    
    // Get query parameters
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || null;
    const brand = url.searchParams.get('brand') || null;
    const priceMin = parseFloat(url.searchParams.get('price_min') || '0');
    const priceMax = parseFloat(url.searchParams.get('price_max') || '100000');
    const rating = parseFloat(url.searchParams.get('rating') || '0');
    const sortBy = url.searchParams.get('sort_by') || 'newest';
    const limit = parseInt(url.searchParams.get('limit') || '20', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const featured = url.searchParams.get('featured') === 'true';

    // Start query
    let query = serverSupabase
      .from('products')
      .select(`
        *,
        product_ratings (
          average_rating,
          rating_count
        ),
        vendor_products (
          price,
          stock,
          vendors (
            name,
            email,
            phone,
            website
          )
        ),
        product_images (
          url,
          alt_text,
          position
        ),
        product_categories (
          categories (
            name
          )
        ),
        featured_products(
          position
        )
      `);

    // If featured parameter is true, filter to only featured products
    if (featured) {
      query = query.not('featured_products', 'is', null);
    }

    // Apply filter: search term
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply filter: category
    if (category) {
      // Handle multiple categories separated by commas
      const categories = category.split(',');
      if (categories.length > 1) {
        query = query.filter('category', 'in', categories);
      } else {
        query = query.filter('category', 'eq', category);
      }
    }

    // Apply filter: brand
    if (brand) {
      // Handle multiple brands separated by commas
      const brands = brand.split(',');
      if (brands.length > 1) {
        query = query.in('brand', brands);
      } else {
        query = query.eq('brand', brand);
      }
    }

    // Apply filter: price range (on vendor_products.price)
    if (priceMin > 0) {
      query = query.gte('vendor_products.price', priceMin);
    }
    if (priceMax < 100000) {
      query = query.lte('vendor_products.price', priceMax);
    }

    // Apply filter: rating - ensure this is a number
    if (rating > 0) {
      query = query.gte('product_ratings.average_rating', rating);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        query = query.order('vendor_products.price', { ascending: true });
        break;
      case 'price-desc':
        query = query.order('vendor_products.price', { ascending: false });
        break;
      case 'rating':
        query = query.order('product_ratings.average_rating', { ascending: false });
        break;
      case 'popularity':
        query = query.order('product_ratings.rating_count', { ascending: false });
        break;
      case 'featured':
        // For featured products, we can't directly order by the nested position field
        // We'll handle ordering after getting the results
        query = query.order('id', { ascending: true }); // Just a base ordering
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    // We already filtered for featured products above, no need to duplicate the filter

    // Get count for pagination
    const countQuery = serverSupabase.from('products').select('*', { count: 'exact', head: true });
    
    // Apply the same filters to count query
    if (searchTerm) {
      countQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    if (category) {
      const categories = category.split(',');
      if (categories.length > 1) {
        countQuery.filter('category', 'in', categories);
      } else {
        countQuery.filter('category', 'eq', category);
      }
    }
    if (brand) {
      const brands = brand.split(',');
      if (brands.length > 1) {
        countQuery.filter('brand', 'in', brands);
      } else {
        countQuery.filter('brand', 'eq', brand);
      }
    }
    if (priceMin > 0) {
      countQuery.gte('price', priceMin);
    }
    if (priceMax < 100000) {
      countQuery.lte('price', priceMax);
    }
    if (featured) {
      countQuery.not('featured_products', 'is', null);
    }
    
    const { count } = await countQuery;

    // Execute query with pagination
    const { data: rawProducts, error } = await query
      .range(offset, offset + limit - 1);

    // Check for error
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    
    // Handle different result structures based on query type
    let products = rawProducts;
    
    // Extract featured position and add it to products if available
    products = (rawProducts || []).map(product => {
      // Get featured position if available
      let featuredPosition = null;
      if (product.featured_products) {
        // featured_products can be an array or an object based on the Supabase response
        if (Array.isArray(product.featured_products) && product.featured_products.length > 0) {
          featuredPosition = product.featured_products[0].position;
        } else if (typeof product.featured_products === 'object') {
          // Use type assertion to tell TypeScript this is a safe operation
          const featuredObj = product.featured_products as unknown as { position?: number };
          featuredPosition = featuredObj.position;
        }
      }
      
      // Return product with featured position if applicable
      return {
        ...product,
        featured_position: featuredPosition
      };
    });

    // Format products with cache-busting image URLs
    const productsWithFeaturedPosition = (products || []).map((product) => {
      // Use type assertion for product
      const typedProduct = product as unknown as ProductWithRelations;
      
      // Cache-busting with updated_at timestamp
      const timestamp = typedProduct.updated_at ? new Date(typedProduct.updated_at).getTime() : Date.now();
      
      // Format the image URLs with the timestamp
      let mainImage = typedProduct.image;
      
      // Extract images from product_images array
      const images = (() => {
        // Check if product_images is an error object
        if (!product.product_images || (typeof product.product_images === 'object' && 'error' in product.product_images)) {
          console.error("Error in product_images data:", product.product_images);
          return [];
        }
        
        // Ensure it's an array before sorting
        if (!Array.isArray(product.product_images)) {
          return [];
        }
        
        return product.product_images
          .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
          .map((img: { url: string }) => img.url)
          .filter(Boolean);
      })();
      
      // Use the first product_image as mainImage if product.image is not set
      if (!mainImage && images.length > 0) {
        mainImage = images[0];
      }
      
      if (mainImage && mainImage.startsWith('https://')) {
        mainImage = `${mainImage}?v=${timestamp}`;
      }
      
      const categories = Array.isArray(product.product_categories)
        ? product.product_categories.map(pc => pc.categories?.name).filter(Boolean)
        : [];

      // Get best vendor product (best price for in-stock items)
      const bestVendorProduct = getBestVendorProduct(Array.isArray(typedProduct.vendor_products) ? typedProduct.vendor_products : []);

      // Handle product ratings - fixed to support both array and object formats
      let rating = 0;
      let rating_count = 0;
      
      if (product.product_ratings) {
        if (Array.isArray(product.product_ratings) && product.product_ratings.length > 0) {
          rating = product.product_ratings[0]?.average_rating || 0;
          rating_count = product.product_ratings[0]?.rating_count || 0;
        } else if (typeof product.product_ratings === 'object') {
          rating = product.product_ratings.average_rating || 0;
          rating_count = product.product_ratings.rating_count || 0;
        }
      }

      // Return formatted product
      return {
        ...typedProduct,
        price: bestVendorProduct?.price ?? null,
        stock: bestVendorProduct?.stock ?? null,
        vendor: bestVendorProduct?.vendors ?? null,
        image: mainImage || null,
        images: images.map((img: string) => img ? `${img}?v=${timestamp}` : null).filter(Boolean),
        rating,
        rating_count,
        categories
      };
    });

    // Sort by featured position if needed
    let sortedProducts = productsWithFeaturedPosition;
    if (sortBy === 'featured' && featured) {
      // Sort products by their featured_position (lower position = higher priority)
      sortedProducts = [...productsWithFeaturedPosition].sort((a, b) => {
        // Default position for products without a position value
        const posA = a.featured_position ?? 999;
        const posB = b.featured_position ?? 999;
        return posA - posB;
      });
    }
    
    // Return products with pagination info
    return NextResponse.json({
      products: sortedProducts,
      hasMore: (offset + limit) < (count || 0),
      total: count || 0
    });
  } catch (error) {
    console.error('Server error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}