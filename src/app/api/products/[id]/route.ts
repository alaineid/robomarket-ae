import { NextResponse } from 'next/server';
import { createServerAdminClient } from '@/utils/server/supabaseServer';
import { getBestVendorProduct } from '@/utils/vendor';

export async function GET(request: Request) {
  // Extract the id from the URL path
  const url = new URL(request.url);  
  const match = url.pathname.match(/\/products\/(\d+)$/);
  const id = match ? match[1] : null;
  
  try {
    const idNumber = Number(id);
    
    const serverSupabase = createServerAdminClient();

    const { data: product, error } = await serverSupabase
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
        )
      `)
      .eq('id', idNumber)
      .single();

    if (error) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Cache-busting with updated_at timestamp
    const timestamp = product.updated_at ? new Date(product.updated_at).getTime() : Date.now();
    
    // Format the image URLs with the timestamp
    let mainImage = product.image;
    
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
    
    // Add timestamp to cache bust images
    if (mainImage && mainImage.startsWith('https://')) {
      mainImage = `${mainImage}?v=${timestamp}`;
    }
    
    const categories = Array.isArray(product.product_categories)
      ? product.product_categories.map(pc => pc.categories?.name).filter(Boolean)
      : [];

    // Add a fallback image if no images are available
    if (images.length === 0) {
      images.push('/images/robot1.png');
    }

    // Get best vendor product (best price for in-stock items)
    let bestVendorProduct = null;
    if (Array.isArray(product.vendor_products)) {
      bestVendorProduct = getBestVendorProduct(product.vendor_products);
    }

    // Return formatted product
    const formattedProduct = {
      ...product,
      price: bestVendorProduct?.price ?? null,
      stock: bestVendorProduct?.stock ?? null,
      vendor: bestVendorProduct?.vendors ?? null,
      image: mainImage || images[0] || null,
      images: images.length > 0 ? images.map((img: string) => img ? `${img}?v=${timestamp}` : null).filter(Boolean) : ['/images/robot1.png'],
      // Fix for product_ratings handling both array and object formats
      rating: Array.isArray(product.product_ratings) ? 
        (product.product_ratings[0]?.average_rating || 0) : 
        ((product.product_ratings as unknown as { average_rating?: number })?.average_rating || 0),
      rating_count: Array.isArray(product.product_ratings) ? 
        (product.product_ratings[0]?.rating_count || 0) : 
        ((product.product_ratings as unknown as { rating_count?: number })?.rating_count || 0),
      categories,
      // Include all vendor options for potential UI display
      vendor_options: product.vendor_products,
    };

    return NextResponse.json(formattedProduct);
    
  } catch (error) {
    console.error('Server error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}