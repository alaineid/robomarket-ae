// Product data types used across the application
export interface ProductAttribute {
  key: string;
  value: string;
}

export interface Vendor {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  website: string | null;
}

export interface VendorProduct {
  vendor: Vendor;
  vendor_sku: string | null;
  price: number;
  stock: number;
}

export interface ProductImage {
  url: string;
  alt_text: string | null;
  position: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface ProductRatings {
  average: number;
  count: number;
  breakdown?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  brand: string | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp

  ratings: ProductRatings;
  categories: Category[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  vendor_products: VendorProduct[];

  // Instead of embedding the featured_products array directly,
  // we use a simple position value if the product is featured
  featured_position?: number | null;

  best_vendor?: VendorProduct;

  main_image: string;        // Cache-busted image URL
  main_image_alt: string | null; // Alt text for the main image
}

/**
 * Represents a product that has been featured on the homepage or special sections.
 * This keeps the base Product interface clean while allowing for featured product functionality.
 */
export interface FeaturedProduct {
  product: Product;
  vendor?: Vendor | null;
  position: number;
  featured_since?: string; // ISO timestamp
}

// Sample categories and brands for filters
export const categories = ["Companion", "Utility", "Security", "Education", "Healthcare", "Industrial"];
export const brands = ["RoboTech", "AIMasters", "Synthia", "MechWorks", "QuantumBots"];