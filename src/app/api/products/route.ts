import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/utils/server/supabaseServer';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';
import type { Product } from '@/utils/types/product.types';

// Sanitize and validate string parameters
const sanitizeString = (value: string | null): string => {
  if (!value) return '';
  // Basic sanitization - remove potential SQL injection characters
  return value.replace(/[';\\]/g, '');
};

// Sanitize and validate number parameters
const sanitizeNumber = (value: string | null, min: number, max: number): number => {
  if (!value) return min;
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return min;
  return Math.min(Math.max(parsed, min), max);
};

export async function GET(request: Request) {
  try {
    // Initialize Supabase admin client
    const serverSupabase = createServerAdminClient();
    
    // Get and sanitize query parameters
    const url = new URL(request.url);
    
    // Text search
    const searchTerm = sanitizeString(url.searchParams.get('search'));
    
    // Categories (comma-separated)
    const categoryParam = url.searchParams.get('category');
    const categories = categoryParam ? 
      categoryParam.split(',').map(sanitizeString).filter(Boolean) : 
      [];
    
    // Brands (comma-separated)
    const brandParam = url.searchParams.get('brand');
    const brands = brandParam ? 
      brandParam.split(',').map(sanitizeString).filter(Boolean) : 
      [];
    
    // Price range
    const priceMin = sanitizeNumber(url.searchParams.get('price_min'), 0, 1000000);
    const priceMax = sanitizeNumber(url.searchParams.get('price_max'), priceMin, 1000000);
    
    // Rating
    const rating = sanitizeNumber(url.searchParams.get('rating'), 0, 5);
    
    // Sorting
    const sortBy = sanitizeString(url.searchParams.get('sort_by') || 'newest');
    
    // Pagination
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10), 50);
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0);
    
    // Featured flag
    const featured = url.searchParams.get('featured') === 'true';
    
    // Debug flag
    const debug = url.searchParams.get('debug') === 'true';

    // We need to debug the vendor_products issue - let's first get specific product IDs if provided
    const requestedId = url.searchParams.get('id');

    // Construct the base query with all needed tables
    let query = serverSupabase
      .from('products')
      .select(`
        *,
        product_images (
          url,
          alt_text,
          position
        ),
        product_categories (
          categories (
            id,
            name
          )
        ),
        featured_products (
          position
        ),
        product_attributes (
          key,
          value
        ),
        vendor_products (
          price,
          stock,
          vendor_sku,
          vendors (
            id,
            name,
            email,
            phone,
            website
          )
        ),
        product_ratings (
          average_rating,
          rating_count
        )
      `);

    // If specific ID is requested for testing
    if (requestedId) {
      query = query.eq('id', parseInt(requestedId, 10));
    }
    
    // Apply other filters...
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply brand filter if provided
    if (brands.length > 0) {
      query = query.in('brand', brands);
    }

    // Apply category filter if provided
    if (categories.length > 0) {
      // Join with product_categories and filter by category name
      query = query.filter('product_categories.categories.name', 'in', `(${categories.join(',')})`);
    }

    // Apply featured filter if requested
    if (featured) {
      query = query.not('featured_products', 'is', null);
    }

    // Apply price range filters - using more precise filtering
    if (priceMin > 0) {
      // Use the vendor_products relationship to filter by price
      query = query.filter('vendor_products.price', 'gte', priceMin);
    }
    
    if (priceMax < 100000) {
      // Use the vendor_products relationship to filter by price
      query = query.filter('vendor_products.price', 'lte', priceMax);
    }

    // Apply rating filter using the product_ratings relationship
    if (rating > 0) {
      query = query.filter('product_ratings.average_rating', 'gte', rating);
    }
    
    // Clone the query for count
    const countQuery = serverSupabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Apply the same filters to the count query
    if (searchTerm) {
      countQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    
    if (brands.length > 0) {
      countQuery.in('brand', brands);
    }
    
    if (categories.length > 0) {
      countQuery.filter('product_categories.categories.name', 'in', `(${categories.join(',')})`);
    }
    
    if (featured) {
      countQuery.not('featured_products', 'is', null);
    }
    
    if (priceMin > 0) {
      countQuery.filter('vendor_products.price', 'gte', priceMin);
    }
    
    if (priceMax < 100000) {
      countQuery.filter('vendor_products.price', 'lte', priceMax);
    }
    
    if (rating > 0) {
      countQuery.filter('product_ratings.average_rating', 'gte', rating);
    }
    
    // Execute count query
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Error getting count:', countError);
    }

    // Apply sorting based on the selected option
    switch (sortBy) {
      case 'price-asc':
        query = query.order('price', { ascending: true, referencedTable: 'vendor_products' });
        break;
      case 'price-desc':
        query = query.order('price', { ascending: false, referencedTable: 'vendor_products' });
        break;
      case 'rating':
        query = query.order('average_rating', { ascending: false, referencedTable: 'product_ratings' });
        break;
      case 'popularity':
        query = query.order('rating_count', { ascending: false, referencedTable: 'product_ratings' });
        break;
      case 'featured':
        query = query.not('featured_products', 'is', null)
                     .order('position', { ascending: true, referencedTable: 'featured_products' });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    console.log('DEBUG: Products query:', query);

    // Execute the query
    const { data: rawProducts, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    
    // Log raw products for debugging
    if (debug) {
      console.log('DEBUG: Raw products:', JSON.stringify(rawProducts, null, 2));
    }
    
    // If specific ID was requested, let's also fetch it directly to compare
    if (requestedId && debug) {
      const { data: singleProduct } = await serverSupabase
        .from('products')
        .select(`
          *,
          product_images (
            url,
            alt_text,
            position
          ),
          product_categories (
            categories (
              id,
              name
            )
          ),
          featured_products (
            position
          ),
          product_attributes (
            key,
            value
          ),
          vendor_products (
            price,
            stock,
            vendor_sku,
            vendors (
              id,
              name,
              email,
              phone,
              website
            )
          ),
          product_ratings (
            average_rating,
            rating_count
          )
        `)
        .eq('id', parseInt(requestedId, 10))
        .single();
        
      console.log('DEBUG: Single product fetch:', JSON.stringify(singleProduct, null, 2));
    }

    // Fetch vendor products separately for each product
    if (rawProducts && rawProducts.length > 0) {
      // Get all product IDs
      const productIds = rawProducts.map(p => p.id);
      
      // Fetch all vendor products for these IDs
      const { data: allVendorProducts } = await serverSupabase
        .from('vendor_products')
        .select(`
          *,
          vendors (
            id, 
            name,
            email,
            phone,
            website
          )
        `)
        .in('product_id', productIds);
      
      if (debug) {
        console.log('DEBUG: All vendor products:', JSON.stringify(allVendorProducts, null, 2));
      }
      
      // Map vendor products to their products
      if (allVendorProducts && allVendorProducts.length > 0) {
        // Group vendor products by product_id
        const vendorProductsByProductId = allVendorProducts.reduce((acc, vp) => {
          if (!acc[vp.product_id]) {
            acc[vp.product_id] = [];
          }
          acc[vp.product_id].push(vp);
          return acc;
        }, {});
        
        // Inject vendor products into raw products
        rawProducts.forEach(product => {
          if (vendorProductsByProductId[product.id]) {
            product.vendor_products = vendorProductsByProductId[product.id];
          }
        });
      }
    }
    
    // Transform database products to our Product interface
    const products: Product[] = (rawProducts || []).map(mapDatabaseProductToProduct);
    
    if (debug) {
      console.log('DEBUG: Mapped products:', JSON.stringify(products, null, 2));
    }
    
    // Return products with pagination info
    return NextResponse.json({
      products: products,
      hasMore: (offset + products.length) < (count || 0),
      total: count || 0
    });
  } catch (error) {
    console.error('Server error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}