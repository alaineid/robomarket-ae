import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/utils/server/supabaseServer';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';
import type { Product } from '@/utils/types/product.types';

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

    console.log("API request - sort by:", sortBy);

    // Start with a simpler base query first
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

    // Apply search filter if provided
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Apply brand filter if provided
    if (brand) {
      const brandValues = brand.split(',');
      query = query.in('brand', brandValues);
    }

    // Apply category filter if provided
    if (category) {
      // For category filtering, we'll use a simpler approach
      const categoryValues = category.split(',');
      query = query.filter('product_categories.categories.name', 'in', `(${categoryValues.join(',')})`);
    }

    // Apply featured filter if requested
    if (featured) {
      query = query.not('featured_products', 'is', null);
    }

    // Apply price range filters if provided
    if (priceMin > 0) {
      query = query.gte('vendor_products.price', priceMin);
    }
    if (priceMax < 100000) {
      query = query.lte('vendor_products.price', priceMax);
    }

    // Apply rating filter
    if (rating > 0) {
      query = query.gte('product_ratings.average_rating', rating);
    }
    
    // Get total count for pagination
    const countQuery = serverSupabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Apply filters to count query
    if (searchTerm) {
      countQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
    if (brand) {
      countQuery.in('brand', brand.split(','));
    }
    if (category) {
      countQuery.filter('product_categories.categories.name', 'in', `(${category.split(',').join(',')})`);
    }
    if (featured) {
      countQuery.not('featured_products', 'is', null);
    }
    
    // Execute count query
    const { count, error: countError } = await countQuery;
    
    if (countError) {
      console.error('Error getting count:', countError);
    }

    // Apply sorting based on the selected option
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
        // Use `referencedTable` to specify ordering by a column in a related table
        query = query.order('position', { ascending: true, referencedTable: 'featured_products' });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    // Execute the query
    const { data: rawProducts, error } = await query;

    // Check for error
    if (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
    
    // Transform database products to our Product interface
    const products: Product[] = (rawProducts || []).map(mapDatabaseProductToProduct);
    
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