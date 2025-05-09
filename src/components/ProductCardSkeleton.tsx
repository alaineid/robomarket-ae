'use client';

import React from 'react';

export default function ProductCardSkeleton() {
  return (
    <div className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden animate-pulse">
      {/* Image Placeholder */}
      <div className="aspect-square w-full bg-gray-200"></div>
      
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title Placeholder */}
        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
        
        {/* Category Placeholder */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        
        {/* Rating Placeholder */}
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-4 h-4 rounded-full bg-gray-200"></div>
          ))}
          <div className="w-10 h-4 ml-2 bg-gray-200 rounded"></div>
        </div>
        
        {/* Price Placeholder */}
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-20"></div>
          
          {/* Button Placeholders */}
          <div className="flex space-x-2">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}