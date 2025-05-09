// Product data types used across the application
export interface ProductImage {
  url: string;
  alt_text: string;
  position: number;
}

export interface ProductRating {
  average_rating: number;
  rating_count: number;
}

export interface ProductReview {
  author: string;
  date: string;
  rating: number;
  comment: string;
}

export interface Vendor {
  name: string;
  email: string;
  phone: string;
  website: string;
}

export interface VendorProduct {
  price: number;
  stock: number;
  vendors: Vendor;
}

export interface ProductSpecifications {
  height: string;
  weight: string;
  battery: string;
  processor: string;
  memory: string;
  connectivity: string;
  sensors: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  brand: string;
  category: string;
  categories?: string[];
  description: string;
  features: string[];
  specifications: ProductSpecifications;
  stock: number;
  reviews: ProductReview[];
  image: string; // Main image
  images: string[]; // Array of all product images
  rating_count?: number;
  product_images?: ProductImage[];
  product_ratings?: ProductRating[];
  vendor_products?: VendorProduct[];
}

// Sample categories and brands for filters (from former productData.ts)
export const categories = ["Companion", "Utility", "Security", "Education", "Healthcare", "Industrial"];
export const brands = ["RoboTech", "AIMasters", "Synthia", "MechWorks", "QuantumBots"];