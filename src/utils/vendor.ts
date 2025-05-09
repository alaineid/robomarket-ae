/**
 * Helper functions for working with vendor products
 */
import { VendorProduct } from './types/product.types';

/**
 * Gets the best vendor product based on price and availability
 * Prioritizes in-stock items, then sorts by price
 * Returns undefined if no vendor products are available
 */
export const getBestVendorProduct = (vendorProducts: VendorProduct[]): VendorProduct | undefined => {
  // Check if it's an error object from Supabase
  if (vendorProducts && typeof vendorProducts === 'object' && 'error' in vendorProducts) {
    console.error("Error in vendor products data:", vendorProducts);
    return undefined;
  }
  
  // Check if it's a valid array of vendor products
  if (!vendorProducts || !Array.isArray(vendorProducts) || vendorProducts.length === 0) {
    return undefined;
  }

  // First filter for products that are in stock, if any
  const inStockProducts = vendorProducts.filter(vp => vp.stock > 0);
  
  // If we have in-stock products, find the lowest price among them
  if (inStockProducts.length > 0) {
    return inStockProducts.reduce((best, current) => 
      current.price < best.price ? current : best, inStockProducts[0]);
  }
  
  // If no product is in stock, just return the lowest price one
  return vendorProducts.reduce((best, current) => 
    current.price < best.price ? current : best, vendorProducts[0]);
};

/**
 * Gets all available vendors for a product, sorted by price
 */
export const getSortedVendorProducts = (vendorProducts: VendorProduct[]): VendorProduct[] => {
  // Check if it's an error object from Supabase
  if (vendorProducts && typeof vendorProducts === 'object' && 'error' in vendorProducts) {
    console.error("Error in vendor products data:", vendorProducts);
    return [];
  }
  
  // Check if it's a valid array of vendor products
  if (!vendorProducts || !Array.isArray(vendorProducts) || vendorProducts.length === 0) {
    return [];
  }

  // Sort by price (lowest first)
  return [...vendorProducts].sort((a, b) => a.price - b.price);
};