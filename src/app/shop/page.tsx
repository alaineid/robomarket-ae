import React, { Suspense } from 'react';
import ShopClient from './ShopClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { headers } from 'next/headers';

// Function to determine the base URL from request headers
async function getBaseUrl() {
  // Get host from headers
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  
  // Determine protocol (secure in production, otherwise http)
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  
  return `${protocol}://${host}`;
}

// Fetching products from the API server-side
async function fetchInitialProducts() {
  try {
    const baseUrl = await getBaseUrl();
    
    // Server-side fetch of initial products with proper base URL
    const res = await fetch(`${baseUrl}/api/products?limit=20`, {
      cache: 'no-cache',  // Don't cache this response
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching initial products:', error);
    // Return an empty result to avoid breaking the page
    return { products: [], hasMore: false, total: 0 };
  }
}

export default async function ShopPage() {
  // Fetch initial data server-side
  const initialData = await fetchInitialProducts();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading products...</div>}>
        <ShopClient initialData={initialData} />
      </Suspense>
      
      <Footer />
    </div>
  );
}
