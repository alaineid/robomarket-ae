import type { Product, Category, ProductImage, VendorProduct, ProductRatings, ProductAttribute } from './types/product.types';
import { getBestVendorProduct } from './vendor';

// Define interfaces for the raw database objects
interface RawProductImage {
  url: string;
  alt_text?: string | null;
  position?: number;
}

interface RawCategory {
  categories?: {
    id: number;
    name: string;
  };
}

interface RawVendorProduct {
  vendors?: {
    id?: number;
    name?: string;
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  };
  vendor_sku?: string | null;
  price?: number;
  stock?: number;
}

interface RawProductAttribute {
  key: string;
  value: string;
}

interface RawProductRating {
  average_rating?: number;
  rating_count?: number;
}

// Type guard to detect error objects - works with both object and string forms
function isQueryError(obj: unknown): boolean {
  if (typeof obj === 'object' && obj !== null) {
    // Use type predicate to check if the object has an error property
    return 'error' in obj && (obj as { error?: unknown }).error === true;
  }
  return false;
}

// Define database product type including potential error objects
interface DatabaseProduct {
  id?: number;
  sku?: string;
  name?: string;
  description?: string;
  brand?: string | null;
  image?: string;
  created_at?: string;
  updated_at?: string;
  price?: number; // Main product price (might be used)
  stock?: number; // Main product stock (might be used)
  specifications?: unknown;
  features?: string[];
  images?: string[]; // Legacy format, might still be used
  category?: string; // Legacy format, might still be used
  
  // Relationships that might be error objects
  product_images?: RawProductImage[] | unknown;
  product_categories?: RawCategory[] | unknown;
  vendor_products?: RawVendorProduct[] | unknown;
  product_attributes?: RawProductAttribute[] | unknown;
  product_ratings?: RawProductRating[] | RawProductRating | unknown;
  featured_products?: { position?: number }[] | { position?: number } | unknown;
  
  [key: string]: unknown; // For any other fields that might be in the database response
}

/**
 * Maps a database product to our normalized Product type
 * Handles all the complex relationships and provides fallbacks for missing data
 * @param dbProduct The raw product from the database
 * @returns A normalized Product object
 */
export function mapDatabaseProductToProduct(dbProduct: DatabaseProduct): Product {
  // Cache-busting with updated_at timestamp
  const timestamp = dbProduct?.updated_at ? new Date(dbProduct.updated_at).getTime() : Date.now();
  
  // Process product images - handle potential error object and sort by position
  const productImages: ProductImage[] = (() => {
    if (!dbProduct?.product_images || isQueryError(dbProduct.product_images)) {
      // Try to create images from legacy format if available
      if (Array.isArray(dbProduct?.images) && dbProduct.images.length > 0) {
        return dbProduct.images.map((url, index) => ({
          url,
          alt_text: `${dbProduct.name || 'Product'} image ${index + 1}`,
          position: index
        }));
      }
      
      // Create a single image if a main image is available
      if (dbProduct?.image) {
        return [{
          url: dbProduct.image,
          alt_text: dbProduct.name || 'Product image',
          position: 0
        }];
      }
      
      return [];
    }
    
    if (Array.isArray(dbProduct.product_images)) {
      return dbProduct.product_images
        .map((img: RawProductImage) => ({
          url: img.url,
          alt_text: img.alt_text || `${dbProduct.name || 'Product'} image`,
          position: typeof img.position === 'number' ? img.position : 0
        }))
        .sort((a: ProductImage, b: ProductImage) => a.position - b.position);
    }
    
    return [];
  })();
  
  // Set main image (first in the array or fallback)
  const mainImage = productImages.length > 0 
    ? `${productImages[0].url}?v=${timestamp}`
    : dbProduct?.image 
      ? `${dbProduct.image}?v=${timestamp}`
      : Array.isArray(dbProduct?.images) && dbProduct.images.length > 0
        ? `${dbProduct.images[0]}?v=${timestamp}`
        : '/images/robot1.png'; // Fallback image

  // Always provide a fallback for main_image_alt
  const mainImageAlt = productImages.length > 0
    ? productImages[0]?.alt_text || dbProduct?.name || 'Product image'
    : dbProduct?.name || 'Product image';
  
  // Process categories - handle potential error object and provide fallbacks
  const categories: Category[] = (() => {
    if (!dbProduct?.product_categories || isQueryError(dbProduct.product_categories)) {
      // Fallback to single category if available
      if (dbProduct?.category) {
        return [{
          id: 0, // Placeholder ID
          name: dbProduct.category
        }];
      }
      return [];
    }
    
    if (Array.isArray(dbProduct.product_categories)) {
      return dbProduct.product_categories
        .filter((pc: RawCategory) => pc.categories && pc.categories.id && pc.categories.name)
        .map((pc: RawCategory) => ({
          id: pc.categories!.id,
          name: pc.categories!.name
        }));
    }
    
    return [];
  })();
  
  // Process vendor products - handle potential error object and create fallbacks
  const vendorProducts: VendorProduct[] = (() => {
    if (!dbProduct?.vendor_products || isQueryError(dbProduct.vendor_products)) {
      // Create a fallback vendor product if we have price and stock
      if (typeof dbProduct?.price === 'number') {
        return [{
          vendor: {
            id: 0,
            name: 'Default Vendor',
            email: null,
            phone: null,
            website: null
          },
          vendor_sku: null,
          price: dbProduct.price || 0,
          stock: dbProduct.stock || 0
        }];
      }
      return [];
    }
    
    if (Array.isArray(dbProduct.vendor_products)) {
      return dbProduct.vendor_products
        .filter((vp: RawVendorProduct) => vp !== null && typeof vp === 'object')
        .map((vp: RawVendorProduct) => ({
          vendor: {
            id: vp.vendors?.id || 0,
            name: vp.vendors?.name || 'Unknown Vendor',
            email: vp.vendors?.email || null,
            phone: vp.vendors?.phone || null,
            website: vp.vendors?.website || null
          },
          vendor_sku: vp.vendor_sku || null,
          price: typeof vp.price === 'number' ? vp.price : 0,
          stock: typeof vp.stock === 'number' ? vp.stock : 0
        }));
    }
    
    return [];
  })();
  
  // Get best vendor product (lowest price with stock)
  const bestVendor = vendorProducts.length > 0 ? 
    getBestVendorProduct(vendorProducts) || vendorProducts[0] : 
    undefined;
  
  // Process product attributes with improved handling for specifications
  const attributes: ProductAttribute[] = (() => {
    if (!dbProduct?.product_attributes || isQueryError(dbProduct.product_attributes)) {
      // Create attributes from specifications if available
      const specs = dbProduct?.specifications;
      if (specs && typeof specs === 'object' && specs !== null) {
        return Object.entries(specs).map(([key, value]) => ({
          key,
          value: String(value)
        }));
      }
      return [];
    }
    
    if (Array.isArray(dbProduct.product_attributes)) {
      return dbProduct.product_attributes
        .filter((attr: RawProductAttribute) => attr && attr.key && attr.value)
        .map((attr: RawProductAttribute) => ({
          key: attr.key,
          value: attr.value
        }));
    }
    
    return [];
  })();
  
  // Process ratings with improved defaults
  let ratings: ProductRatings = {
    average: 0,
    count: 0
  };
  
  if (dbProduct?.product_ratings && !isQueryError(dbProduct.product_ratings)) {
    if (Array.isArray(dbProduct.product_ratings) && dbProduct.product_ratings.length > 0) {
      ratings = {
        average: typeof dbProduct.product_ratings[0]?.average_rating === 'number' 
          ? dbProduct.product_ratings[0].average_rating 
          : 0,
        count: typeof dbProduct.product_ratings[0]?.rating_count === 'number'
          ? dbProduct.product_ratings[0].rating_count
          : 0
      };
    } else if (typeof dbProduct.product_ratings === 'object' && dbProduct.product_ratings !== null) {
      const ratingObj = dbProduct.product_ratings as RawProductRating;
      ratings = {
        average: typeof ratingObj.average_rating === 'number' ? ratingObj.average_rating : 0,
        count: typeof ratingObj.rating_count === 'number' ? ratingObj.rating_count : 0
      };
    }
  }

  // Extract featured position with improved handling
  let featured_position: number | null = null;
  
  if (dbProduct?.featured_products && !isQueryError(dbProduct.featured_products)) {
    if (Array.isArray(dbProduct.featured_products) && dbProduct.featured_products.length > 0) {
      // If the featured_products is an array of objects with position property
      const featuredObj = dbProduct.featured_products[0];
      if (featuredObj && typeof featuredObj === 'object' && 'position' in featuredObj) {
        featured_position = typeof featuredObj.position === 'number' ? featuredObj.position : 0;
      }
    } else if (typeof dbProduct.featured_products === 'object' && dbProduct.featured_products !== null) {
      // If it's a single object with position property
      const featuredObj = dbProduct.featured_products as { position?: number };
      featured_position = typeof featuredObj?.position === 'number' ? featuredObj.position : 0;
    }
  }

  // Return transformed product with all data normalized
  return {
    id: dbProduct?.id || 0,
    sku: dbProduct?.sku || `SKU-${dbProduct?.id || Math.floor(Math.random() * 10000)}`,
    name: dbProduct?.name || 'Unnamed Product',
    description: dbProduct?.description || '',
    brand: dbProduct?.brand || null,
    created_at: dbProduct?.created_at || new Date().toISOString(),
    updated_at: dbProduct?.updated_at || new Date().toISOString(),
    
    // Related data
    ratings,
    categories,
    images: productImages,
    attributes,
    vendor_products: vendorProducts,
    
    // Derived fields
    best_vendor: bestVendor,
    main_image: mainImage,
    main_image_alt: mainImageAlt,
    featured_position
  };
}