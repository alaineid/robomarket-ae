import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/utils/server/supabaseServer';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';
import type { Product } from '@/utils/types/product.types';

export async function GET(request: Request) {
  // Extract the id from the URL path
  const url = new URL(request.url);
  const match = url.pathname.match(/\/products\/(\d+)$/);
  const id = match ? match[1] : null;

  try {
    const idNumber = Number(id);
    
    // Validate ID is a valid number
    if (isNaN(idNumber) || idNumber <= 0) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }
    
    // Initialize Supabase admin client
    const serverSupabase = createServerAdminClient();
    
    // Get product by ID with all related tables
    const { data: dbProduct, error } = await serverSupabase
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
      .eq('id', idNumber)
      .single();
    
    // Handle database errors
    if (error) {
      console.error('Error fetching product:', error);
      return NextResponse.json(
        { error: 'Failed to fetch product' },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      );
    }
    
    // Return 404 if product not found
    if (!dbProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Transform database product to our Product interface
    const product: Product = mapDatabaseProductToProduct(dbProduct);
    
    // Return the product
    return NextResponse.json(product);
  } catch (error) {
    console.error('Server error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}