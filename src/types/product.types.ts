// Product data types used across the application
export interface Category {
  id: number;
  name: string;
}

export interface ProductImage {
  url: string;
  alt_text: string;
  position: number;
}

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

export interface ProductRating {
  average: number;
  count: number;
}

export interface ProductReview {
  id: number;
  author: string;
  date: string;
  rating: number;
  comment: string;
  title?: string | null;
  verified_purchase?: boolean;
  helpful_votes?: number;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  brand: string;
  created_at: string;
  updated_at: string;
  price: number; // Added price property
  ratings: ProductRating;
  categories: Category[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  vendor_products: VendorProduct[];
  best_vendor: VendorProduct;
  featured_position: number | null;
  featured_since: string | null;
  reviews: ProductReview[];
}

export interface ApiResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
  nextOffset?: number; // Adding the nextOffset that the API actually returns
}

// Legacy interface for backward compatibility
export interface LegacyProduct {
  id: number;
  name: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  categories?: string[];
  description: string;
  features: string[];
  specifications: {
    height: string;
    weight: string;
    battery: string;
    processor: string;
    memory: string;
    connectivity: string;
    sensors: string;
  };
  stock: number;
  reviews: {
    author: string;
    date: string;
    rating: number;
    comment: string;
  }[];
  image: string; // Main image
  images: string[]; // Array of all product images
  rating_count?: number;
}

// Sample categories and brands for filters (from former productData.ts)
export const categories = [
  "Companion",
  "Utility",
  "Security",
  "Education",
  "Healthcare",
  "Industrial",
];
export const brands = [
  "RoboTech",
  "AIMasters",
  "Synthia",
  "MechWorks",
  "QuantumBots",
];

export interface CartItem {
  id?: number; // Optional to align with cartContext
  quantity: number;
  product: Product;
}
