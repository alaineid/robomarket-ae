import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/utils/server/supabaseServer';
import { mapDatabaseProductToProduct } from '@/utils/productMappers';

export async function GET(request: Request) {
  // Extract the id from the URL path
  const url = new URL(request.url);  
  const match = url.pathname.match(/\/products\/(\d+)$/);
  const id = match ? match[1] : null;
  
  try {
    const idNumber = Number(id);
    
    const serverSupabase = createServerAdminClient();

    const { data: dbProduct, error } = await serverSupabase
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
          vendor_sku,
          vendors (
            id,
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
            id,
            name
          )
        ),
        product_attributes (
          key,
          value
        )
      `)
      .eq('id', idNumber)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Use the mapper function to transform the raw database product into our Product interface
    const formattedProduct = mapDatabaseProductToProduct(dbProduct);

    return NextResponse.json(formattedProduct);
    
  } catch (error) {
    console.error('Server error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}