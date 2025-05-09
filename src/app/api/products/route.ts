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
    
    // Specific product ID (for testing/debugging)
    const requestedId = url.searchParams.get('id');

    // First, get just the IDs of the products that match our filters
    // Include all related tables needed for filtering but only select the id
    let idQuery = serverSupabase
      .from('products')
      .select(`
        id, 
        product_categories!inner(
          categories(
            name
          )
        ),
        featured_products(
          position
        ),
        vendor_products(
          price
        ),
        product_ratings(
          average_rating,
          rating_count
        )
      `);
      
    // Apply filters
    if (searchTerm) {
      idQuery = idQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    if (brands.length > 0) {
      idQuery = idQuery.in('brand', brands);
    }

    if (categories.length > 0) {
      // We need to use the !inner join here to filter by category
      idQuery = idQuery.filter('product_categories.categories.name', 'in', `(${categories.join(',')})`);
    }

    if (featured) {
      idQuery = idQuery.not('featured_products', 'is', null);
    }

    if (priceMin > 0) {
      idQuery = idQuery.filter('vendor_products.price', 'gte', priceMin);
    }
    
    if (priceMax < 100000) {
      idQuery = idQuery.filter('vendor_products.price', 'lte', priceMax);
    }

    if (rating > 0) {
      idQuery = idQuery.filter('product_ratings.average_rating', 'gte', rating);
    }
    
    // Apply sorting based on the selected option
    switch (sortBy) {
      case 'price-asc':
        idQuery = idQuery.order('price', { ascending: true, referencedTable: 'vendor_products' });
        break;
      case 'price-desc':
        idQuery = idQuery.order('price', { ascending: false, referencedTable: 'vendor_products' });
        break;
      case 'rating':
        idQuery = idQuery.order('average_rating', { ascending: false, referencedTable: 'product_ratings' });
        break;
      case 'popularity':
        idQuery = idQuery.order('rating_count', { ascending: false, referencedTable: 'product_ratings' });
        break;
      case 'featured':
        idQuery = idQuery.not('featured_products', 'is', null)
                      .order('position', { ascending: true, referencedTable: 'featured_products' });
        break;
      case 'newest':
      default:
        idQuery = idQuery.order('created_at', { ascending: false });
        break;
    }
    
    // If specific ID is requested, only get that one
    if (requestedId) {
      idQuery = idQuery.eq('id', parseInt(requestedId, 10));
    } else {
      // Apply pagination
      idQuery = idQuery.range(offset, offset + limit - 1);
    }

    // Get the IDs of filtered products
    const { data: productIdResults, error: idError, count } = await idQuery;
    
    if (idError) {
      console.error('Error fetching product IDs:', idError);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    
    if (!productIdResults || productIdResults.length === 0) {
      // No products found matching filters
      return NextResponse.json({
        products: [],
        hasMore: false,
        total: count || 0
      });
    }
    
    // Extract just the IDs from the query result
    const ids = productIdResults.map(item => item.id);
    
    // Now fetch the full product data for these IDs with proper relations
    const { data: rawProducts, error } = await serverSupabase
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
      .in('id', ids);

    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    
    // Transform database products to our Product interface
    const products: Product[] = (rawProducts || []).map(mapDatabaseProductToProduct);
    
    // Sort products to match the original sorting order
    if (ids.length > 1 && products.length > 1) {
      // Create a map of id -> position
      const idPositionMap = ids.reduce((map, id, index) => {
        map[id] = index;
        return map;
      }, {});
      
      // Sort by the original position in the ids array
      products.sort((a, b) => idPositionMap[a.id] - idPositionMap[b.id]);
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