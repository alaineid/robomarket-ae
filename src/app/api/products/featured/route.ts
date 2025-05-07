import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/server/supabaseAdmin';

export const revalidate = 600; // Cache results for 10 minutes

export async function GET() {
  try {
    // Modified query to directly get product ratings and categories
    const { data, error } = await supabaseAdmin
      .from('featured_products')
      .select(`
        position,
        product_id,
        products:product_id (
          id,
          name,
          vendor_products (
            price
          ),
          product_images (
            url
          ),
          product_categories (
            categories (
              name
            )
          )
        )
      `)
      .order('position')
      .limit(6);

    if (error) {
      console.error('Error fetching featured products:', error);
      return NextResponse.json({ error: 'Failed to fetch featured products' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.log('No featured products found in database');
      return NextResponse.json({ products: [] });
    }
    
    // Get all product IDs to fetch ratings in a separate query
    const productIds = data.map(item => item.product_id);

    // Fetch ratings for all products in a single query
    const { data: ratingsData, error: ratingsError } = await supabaseAdmin
      .from('product_ratings')
      .select('product_id, average_rating, rating_count')
      .in('product_id', productIds);

    if (ratingsError) {
      console.error('Error fetching ratings:', ratingsError);
    }

    // Create a map of product_id to ratings data for easy lookup
    const ratingsMap = new Map();
    if (ratingsData) {
      ratingsData.forEach(rating => {
        ratingsMap.set(rating.product_id, {
          rating: parseFloat(rating.average_rating) || 0,
          count: parseInt(rating.rating_count) || 0
        });
      });
    }

    // Transform the data to match our Product interface
    const products = data.map(item => {
      // Get rating and review count from our ratings map
      const ratingInfo = ratingsMap.get(item.product_id) || { rating: 0, count: 0 };

      // Check if products is an array or a direct object
      const product = Array.isArray(item.products) ? item.products[0] : item.products;
      
      if (!product) {
        console.warn(`No product data found for product_id: ${item.product_id}`);
        return null;
      }

      // Extract the first category name
      let categoryName = 'General';
      
      // Log the structure to debug
      console.log('Product categories structure:', JSON.stringify(product.product_categories, null, 2));
      
      if (product.product_categories && product.product_categories.length > 0) {
        const categoryData = product.product_categories[0].categories;
        // Safely access the category name regardless of structure
        if (categoryData) {
          if (Array.isArray(categoryData)) {
            categoryName = categoryData[0]?.name || 'General';
          } else if (typeof categoryData === 'object') {
            // Use type assertion to tell TypeScript this is an object with a name property
            categoryName = (categoryData as { name?: string }).name || 'General';
          }
        }
      }
      
      return {
        id: product.id,
        name: product.name,
        price: product.vendor_products?.[0]?.price || 0,
        category: categoryName,
        image_url: product.product_images?.[0]?.url,
        rating: ratingInfo.rating,
        review_count: ratingInfo.count,
        position: item.position
      };
    }).filter(Boolean);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error in featured products API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}