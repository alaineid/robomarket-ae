"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FaStar, FaStarHalfAlt, 
  FaCheck, FaArrowRight, FaShoppingCart, FaHeart, FaRegHeart
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { commonButtonStyles, commonCardStyles } from '@/styles/commonStyles';
import { useCart } from '@/utils/cartContext';
import { Product } from '@/utils/types/product.types';

interface BreadcrumbItem {
  label: string;
  path: string;
  isCurrent: boolean;
}

interface Review {
  author: string;
  date: string;
  rating: number;
  comment: string;
}

interface Specifications {
  [key: string]: string;
}

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params?.id as string ?? '0');
  const { addToCart } = useCart();
  
  const [productData, setProductData] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([]);
  // Mock data for backward compatibility
  const [reviews, setReviews] = useState<Review[]>([]);
  const [specifications, setSpecifications] = useState<Specifications>({});

  // Load product data based on ID using API instead of local data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        
        // Fetch product data from API
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const product = await response.json();
        setProductData(product);
        
        // Generate mock reviews and specs from product data for compatibility
        generateMockData(product);
        
        // Build custom breadcrumbs including the product name and category
        const categoryName = product.categories.length > 0 ? product.categories[0].name : "Uncategorized";
        setBreadcrumbs([
          { label: 'Home', path: '/', isCurrent: false },
          { label: 'Shop', path: '/shop', isCurrent: false },
          { label: categoryName, path: `/shop?category=${encodeURIComponent(categoryName)}`, isCurrent: false },
          { label: product.name, path: `/product/${product.id}`, isCurrent: true }
        ]);
        
        // Fetch related products (products in the same category)
        if (product.categories.length > 0) {
          const categoryName = product.categories[0].name;
          const relatedResponse = await fetch(`/api/products?category=${encodeURIComponent(categoryName)}&limit=4`);
          const relatedData = await relatedResponse.json();
          
          // Filter out the current product from related products
          const filteredProducts = relatedData.products.filter((p: Product) => p.id !== productId);
          setRelatedProducts(filteredProducts.slice(0, 4)); // Limit to 4 related products
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Generate mock reviews and specs for UI compatibility
  const generateMockData = (product: Product) => {
    // Generate mock reviews based on ratings
    const mockReviews: Review[] = [
      {
        author: "Customer Review",
        date: new Date().toLocaleDateString(),
        rating: product.ratings.average,
        comment: `${product.name} is an excellent product that exceeds expectations. The quality and features are outstanding.`
      }
    ];
    
    if (product.ratings.count > 1) {
      mockReviews.push({
        author: "Verified Buyer",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        rating: Math.min(5, product.ratings.average + 0.5),
        comment: `I'm very satisfied with my purchase of the ${product.name}. It's well-built and performs great!`
      });
    }
    
    setReviews(mockReviews);
    
    // Generate specs from attributes
    const specs: Specifications = {};
    product.attributes.forEach(attr => {
      specs[attr.key] = attr.value;
    });
    
    // Add some standard specs if they don't exist
    if (!specs["dimensions"]) specs["dimensions"] = "Varies by model";
    if (!specs["weight"]) specs["weight"] = "Contact manufacturer";
    if (!specs["battery"]) specs["battery"] = "Rechargeable Li-ion";
    if (!specs["warranty"]) specs["warranty"] = "2 years limited";
    
    setSpecifications(specs);
  };

  // Reset activeImage when product changes
  useEffect(() => {
    setActiveImage(0);
  }, [productId]);

  // Main image and thumbnail handling function
  const handleThumbnailClick = (index: number) => {
    console.log(`Clicking thumbnail ${index}`);
    setActiveImage(index);
  };
  
  // Function to render star ratings
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
    }
    
    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="text-gray-300" />);
    }
    
    return stars;
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!productData || !productData.best_vendor) return;
    
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= productData.best_vendor.stock) {
      setQuantity(value);
    }
  };

  const increaseQuantity = () => {
    if (!productData || !productData.best_vendor) return;
    
    if (quantity < productData.best_vendor.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (productData) {
      addToCart(productData.id, quantity);
      setAddedToCart(true);
      
      // Reset the flag after 2 seconds
      setTimeout(() => {
        setAddedToCart(false);
      }, 2500);
    }
  };
  
  // Handle quick add to cart for related products
  const handleQuickAddToCart = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(productId, 1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-4 border-[#4DA9FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading product...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Product not found
  if (!productData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-500 text-3xl">?</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">We couldn&apos;t find the robot you&apos;re looking for. It may have been moved or doesn&apos;t exist.</p>
            <Link href="/shop" className={commonButtonStyles.primary}>
              Browse All Robots
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Extract relevant data from product
  const imageUrls = productData.images.map(img => img.url);
  const price = productData.best_vendor?.price || 0;
  const stock = productData.best_vendor?.stock || 0;
  const categoryName = productData.categories.length > 0 ? productData.categories[0].name : "Uncategorized";
  const rating = productData.ratings.average;
  const ratingCount = productData.ratings.count;

  // Extract features from attributes
  const features = productData.attributes
    .filter(attr => attr.key.toLowerCase().includes('feature'))
    .map(attr => attr.value);
  
  // If no specific features, use the first few attributes as features
  const displayFeatures = features.length > 0 
    ? features 
    : productData.attributes.slice(0, 4).map(attr => `${attr.key}: ${attr.value}`);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-6">
            <Breadcrumbs items={breadcrumbs} />
          </div>
          
          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Side - Product Images */}
              <div className="p-6 lg:p-8">
                {/* Main Image */}
                <div className="relative h-[400px] mb-5 rounded-lg overflow-hidden bg-white border border-gray-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Image
                      src={imageUrls[activeImage] || productData.main_image}
                      alt={`${productData.name} - View ${activeImage + 1}`}
                      width={600}
                      height={600}
                      className="object-contain w-full h-full"
                      priority
                    />
                  </div>
                </div>
                
                {/* Image Carousel */}
                <div className="grid grid-cols-4 gap-3">
                  {imageUrls.length > 0 && imageUrls.slice(0, 4).map((url, index) => (
                    <button 
                      key={`img-${index}`}
                      onClick={() => handleThumbnailClick(index)}
                      className={`relative h-20 rounded-md overflow-hidden bg-white border ${activeImage === index ? 'border-[#4DA9FF]' : 'border-gray-200'} hover:border-[#4DA9FF] transition-all cursor-pointer`}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                          src={url}
                          alt={`${productData.name} thumbnail ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-contain w-full h-full"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Right Side - Product Information */}
              <div className="p-6 lg:p-8 bg-gray-50">
                {/* Product Category Badge */}
                <div className="mb-2">
                  <span className={commonCardStyles.categoryBadge}>
                    {categoryName}
                  </span>
                </div>
                
                {/* Product Name */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                  {productData.name}
                </h1>
                
                {/* Brand */}
                <p className="text-gray-600 mb-4">by <span className="text-[#4DA9FF] font-medium">{productData.brand}</span></p>
                
                {/* Rating */}
                <div className="flex items-center mb-5">
                  <div className="flex mr-2">
                    {renderRatingStars(rating)}
                  </div>
                  <span className="text-gray-600 text-sm">{ratingCount} reviews</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className={`${stock > 0 ? 'text-green-600' : 'text-red-500'} font-medium flex items-center`}>
                    {stock > 0 ? (
                      <>
                        <FaCheck size={12} className="mr-1" /> In Stock ({stock})
                      </>
                    ) : (
                      <>Out of Stock</>
                    )}
                  </span>
                </div>
                
                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold text-[#4DA9FF]">${price.toLocaleString()}</span>
                    <span className="ml-2 text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">Free Shipping</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Financing options available at checkout</p>
                </div>
                
                {/* Short Description */}
                <p className="text-gray-700 mb-6">
                  {productData.description.substring(0, 150)}...
                </p>
                
                {/* Key Features List */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {displayFeatures.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#4DA9FF] mr-2 mt-1">•</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Add to Cart Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-4 mb-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button 
                        onClick={decreaseQuantity}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-gray-100 rounded-l-lg"
                        disabled={stock <= 0}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={stock}
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-14 text-center border-x border-gray-300 h-10 focus:outline-none focus:ring-0 focus:border-gray-300 text-gray-700"
                        disabled={stock <= 0}
                      />
                      <button 
                        onClick={increaseQuantity}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#4DA9FF] hover:bg-gray-100 rounded-r-lg"
                        disabled={stock <= 0}
                      >
                        +
                      </button>
                    </div>
                    
                    {/* Favorite Button */}
                    <button 
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-500"
                    >
                      {isFavorite ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                    </button>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 gap-4 relative">
                    <AnimatePresence>
                      {addedToCart ? (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 z-10"
                        >
                          <div className="bg-green-500 text-white rounded-lg py-3 px-4 shadow-lg flex items-center justify-center w-full h-full">
                            <FaCheck className="mr-2" size={18} />
                            <span className="font-medium">Added to Cart!</span>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                    
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-center ${commonButtonStyles.primary} ${stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleAddToCart}
                      disabled={stock <= 0}
                    >
                      <FaShoppingCart className="mr-2" />
                      {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </motion.button>
                  </div>
                </div>
                
                {/* Additional Info */}
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <div>Model: <span className="text-gray-800 font-medium">{productData.name.replace(/\s+/g, '-').toUpperCase()}</span></div>
                    <div>SKU: <span className="text-gray-800 font-medium">{productData.sku || `${productData.brand?.substring(0, 2).toUpperCase()}-${productData.id}00${Math.floor(Math.random() * 900) + 100}`}</span></div>
                  </div>
                  <p className="text-sm text-gray-600">Free 30-day returns & 2-year warranty included</p>
                </div>
              </div>
            </div>
            
            {/* Product Details Tabs */}
            <div className="border-t border-gray-200">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button 
                  onClick={() => setActiveTab('description')} 
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'description' 
                      ? 'border-b-2 border-[#4DA9FF] text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Full Description
                </button>
                
                <button 
                  onClick={() => setActiveTab('specifications')} 
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'specifications' 
                      ? 'border-b-2 border-[#4DA9FF] text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Specifications
                </button>
                
                <button 
                  onClick={() => setActiveTab('reviews')} 
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap ${
                    activeTab === 'reviews' 
                      ? 'border-b-2 border-[#4DA9FF] text-[#4DA9FF]' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Customer Reviews ({ratingCount})
                </button>
              </div>
              
              <div className="p-6 lg:p-8">
                {/* Description Content */}
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="mb-4">{productData.description}</p>
                    <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-4">All Features</h3>
                    <ul className="space-y-3">
                      {productData.attributes.map((attr, index) => (
                        <li key={index} className="flex items-center">
                          <FaCheck className="text-green-500 mr-3" />
                          <span>{attr.key}: {attr.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Specifications Content */}
                {activeTab === 'specifications' && (
                  <div>
                    <table className="w-full text-left">
                      <tbody>
                        {Object.entries(specifications).map(([key, value], index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-6 py-4 font-medium text-gray-700 capitalize">{key}</td>
                            <td className="px-6 py-4 text-gray-700">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {/* Reviews Content */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold mb-4">Customer Feedback</h3>
                      <div className="flex items-center mb-2">
                        <div className="flex mr-4">
                          {renderRatingStars(rating)}
                        </div>
                        <span className="text-2xl font-semibold text-gray-800">{rating.toFixed(1)}</span>
                        <span className="text-gray-500 ml-2">out of 5</span>
                      </div>
                      <p className="text-gray-600">{ratingCount} global ratings</p>
                      
                      {/* Show rating breakdown if available */}
                      {productData.ratings.breakdown && (
                        <div className="mt-4 space-y-2">
                          {Object.entries(productData.ratings.breakdown).sort((a, b) => parseInt(b[0]) - parseInt(a[0])).map(([stars, count]) => (
                            <div key={stars} className="flex items-center">
                              <span className="w-12 text-sm text-gray-600">{stars} star</span>
                              <div className="w-48 h-2 bg-gray-200 rounded-full mx-2">
                                <div 
                                  className="h-full bg-yellow-400 rounded-full" 
                                  style={{ width: `${(count / ratingCount) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{Math.round((count / ratingCount) * 100)}%</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-6">
                      {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                          <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                            <div className="flex justify-between mb-2">
                              <p className="font-medium">{review.author}</p>
                              <p className="text-gray-500 text-sm">{review.date}</p>
                            </div>
                            <div className="flex mb-3">
                              {renderRatingStars(review.rating)}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Related Products Section */}
          <section className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Related Products</h2>
              <Link 
                href="/shop" 
                className="text-[#4DA9FF] font-medium flex items-center hover:underline"
              >
                View All <FaArrowRight className="ml-2" size={12} />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  whileHover={{ y: -3 }}
                  className={commonCardStyles.container}
                >
                  <div className={commonCardStyles.imageContainer}>
                    {/* Display actual robot image */}
                    <div className={`${commonCardStyles.imagePlaceholder} bg-white`}>
                      <Image
                        src={product.main_image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div className={commonCardStyles.imageOverlay}></div>
                    <button 
                      onClick={(e) => handleQuickAddToCart(e, product.id)}
                      className="absolute bottom-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-[#4DA9FF] hover:bg-[#4DA9FF] hover:text-white transition-all duration-300 cursor-pointer transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      <FaShoppingCart size={16} />
                    </button>
                  </div>
                  
                  <div className={`${commonCardStyles.content} flex flex-col h-[200px]`}>
                    <div className="flex justify-between items-start mb-auto">
                      <div className="flex-1 min-w-0">
                        <span className={commonCardStyles.categoryBadge}>
                          {product.categories[0]?.name || "Uncategorized"}
                        </span>
                        <Link href={`/product/${product.id}`}>
                          <h3 className="font-bold text-lg text-gray-800 hover:text-[#4DA9FF] transition-colors truncate">
                            {product.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mt-1">{product.brand}</p>
                      </div>
                      <span className="font-bold text-lg text-[#4DA9FF] ml-2 whitespace-nowrap">
                        ${product.best_vendor?.price?.toLocaleString() || '0.00'}
                      </span>
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <div className="flex">
                        {renderRatingStars(product.ratings.average)}
                      </div>
                      <span className="text-gray-500 text-xs ml-2">({product.ratings.count})</span>
                    </div>
                    
                    <div className="mt-auto pt-4 pb-2">
                      <Link 
                        href={`/product/${product.id}`}
                        className={`w-full text-center ${commonButtonStyles.secondary}`}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}