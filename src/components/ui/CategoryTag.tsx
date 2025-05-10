"use client";

import { motion } from 'framer-motion';

interface CategoryTagProps {
  category: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CategoryTag({ 
  category, 
  size = 'sm', 
  className = '' 
}: CategoryTagProps) {
  // Function to get category background color
  const getCategoryColor = (category: string): string => {
    const categoryLower = category?.toLowerCase() || '';
    
    if (categoryLower.includes('companion')) return 'bg-blue-100 text-blue-700';
    if (categoryLower.includes('home')) return 'bg-green-100 text-green-700';
    if (categoryLower.includes('industrial')) return 'bg-orange-100 text-orange-700';
    if (categoryLower.includes('utility')) return 'bg-amber-100 text-amber-700';
    if (categoryLower.includes('security')) return 'bg-violet-100 text-violet-700';
    if (categoryLower.includes('business')) return 'bg-purple-100 text-purple-700';
    if (categoryLower.includes('medical') || categoryLower.includes('healthcare')) return 'bg-red-100 text-red-700';
    if (categoryLower.includes('developer')) return 'bg-teal-100 text-teal-700';
    if (categoryLower.includes('education')) return 'bg-yellow-100 text-yellow-700';
    if (categoryLower.includes('entertainment')) return 'bg-pink-100 text-pink-700';
    
    // Default color for other categories
    return 'bg-gray-100 text-gray-700';
  };

  // Define size-based styling
  const getSizeStyling = (): string => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-xs';
      case 'lg':
        return 'px-3.5 py-2 text-sm';
      case 'md':
      default:
        return 'px-3 py-1.5 text-xs';
    }
  };

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        ${getCategoryColor(category)} 
        ${getSizeStyling()}
        rounded-full shadow-sm
        transition-all duration-300 hover:shadow
        ${className}
      `}
    >
      <span>{category}</span>
    </motion.div>
  );
}