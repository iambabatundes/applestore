import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2, Star } from 'lucide-react';
import { getCategories } from '../../../services/categoryService';
import { getProductsByCategory } from '../../../services/productService';
import './styles/offerByCategory.css';

export default function OfferByCategory() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchCategoriesAndProducts();
  }, []);

  const fetchCategoriesAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all categories
      const categoriesResponse = await getCategories();
      const allCategories = categoriesResponse.data || categoriesResponse;

      if (!Array.isArray(allCategories) || allCategories.length === 0) {
        setError('No categories found');
        return;
      }

      // Get featured products from the first category (Fashion/Featured)
      if (allCategories.length > 0) {
        try {
          const featuredProductsResponse = await getProductsByCategory(allCategories[0]._id);
          const products = featuredProductsResponse.data || featuredProductsResponse;
          setFeaturedProducts(products ? products.slice(0, 3) : []);
        } catch (err) {
          console.warn('Failed to fetch featured products:', err);
          setFeaturedProducts([]);
        }
      }

      // Transform categories to match component structure
      const transformedCategories = allCategories.map((category, index) => ({
        id: category._id,
        title: category.name,
        bgColor: "category-card",
        image: getCategoryImage(category.image),
        category: category
      }));

      setCategories(transformedCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get category image URL
  const getCategoryImage = (imageData) => {
    if (!imageData) return getDefaultImage();
    
    if (typeof imageData === 'string') {
      return imageData.startsWith('http') ? imageData : `${import.meta.env.VITE_API_URL}${imageData}`;
    }
    
    if (typeof imageData === 'object') {
      if (imageData.url) {
        return imageData.url.startsWith('http') ? imageData.url : `${import.meta.env.VITE_API_URL}${imageData.url}`;
      }
      if (imageData.filename) {
        return `${import.meta.env.VITE_API_URL}/uploads/${imageData.filename}`;
      }
    }
    
    return getDefaultImage();
  };

  const getDefaultImage = () => {
    return 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop';
  };

  // Format price to Nigerian Naira
  const formatPrice = (price, salePrice) => {
    const currentPrice = salePrice || price;
    return `₦${currentPrice?.toLocaleString() || '0'}`;
  };

  // Format original price (strikethrough)
  const formatOriginalPrice = (price, salePrice) => {
    if (salePrice && salePrice < price) {
      return `₦${price?.toLocaleString() || '0'}`;
    }
    return null;
  };

  // Calculate rating display
  const formatRating = (product) => {
    const rating = product.averageRating || product.rating || 4.5;
    const reviewCount = product.reviewCount || product.reviews?.length || Math.floor(Math.random() * 1000) + 10;
    return { rating: rating.toFixed(1), count: reviewCount };
  };

  const nextSlide = () => {
    const visibleCategories = 6; // Show 6 categories at a time
    const maxIndex = Math.max(0, categories.length - visibleCategories);
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
    // Add your navigation logic here
  };

  const handleProductClick = (product) => {
    console.log('Product clicked:', product);
    // Add your product navigation logic here
  };

  // Loading state
  if (loading) {
    return (
      <div className="offers-container">
        <div className="loading-container">
          <Loader2 className="loading-spinner" size={40} />
          <p className="loading-text">Loading categories...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="offers-container">
        <div className="error-container">
          <p className="error-text">{error}</p>
          <button onClick={fetchCategoriesAndProducts} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No categories state
  if (categories.length === 0) {
    return (
      <div className="offers-container">
        <div className="empty-container">
          <p className="empty-text">No categories available</p>
        </div>
      </div>
    );
  }

  const visibleCategories = categories.slice(currentIndex, currentIndex + 6);

  return (
    <div className="offers-container">
      <h2 className="offers-title">
        Offers by Category
      </h2>
      
      <div className="offers-wrapper">
        {/* Main Grid Container */}
        <div className="offers-grid">
          {/* Featured Large Card - Fashion with Products */}
          <div className="featured-section">
            <div className="featured-header">
              <div className="featured-brand">Viva</div>
              <div className="featured-subtitle">Fashion offers</div>
              <button className="featured-btn">Buy now</button>
            </div>
            
            {/* Featured background image */}
            <div className="featured-background">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" 
                alt="Fashion model"
              />
            </div>

            {/* Product Cards */}
            <div className="featured-products">
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product, index) => {
                  const ratingData = formatRating(product);
                  return (
                    <div 
                      key={product._id || index} 
                      className="product-card"
                      onClick={() => handleProductClick(product)}
                    >
                      <div className="product-image">
                        <img 
                          src={getCategoryImage(product.featureImage || product.media?.[0])} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = getDefaultImage();
                          }}
                        />
                      </div>
                      <div className="product-info">
                        <div className="product-price">
                          <span className="current-price">
                            {formatPrice(product.price, product.salePrice)}
                          </span>
                          {formatOriginalPrice(product.price, product.salePrice) && (
                            <span className="original-price">
                              {formatOriginalPrice(product.price, product.salePrice)}
                            </span>
                          )}
                        </div>
                        <div className="product-rating">
                          <div className="stars">
                            <Star size={12} className="star filled" />
                            <span className="rating-number">{ratingData.rating}</span>
                          </div>
                          <span className="sold-count">{ratingData.count}+ sold</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Default product cards when no real products
                [...Array(3)].map((_, index) => (
                  <div key={index} className="product-card">
                    <div className="product-image">
                      <img src={getDefaultImage()} alt="Product" />
                    </div>
                    <div className="product-info">
                      <div className="product-price">
                        <span className="current-price">₦16,636.69</span>
                        <span className="original-price">₦33,273.39</span>
                      </div>
                      <div className="product-rating">
                        <div className="stars">
                          <Star size={12} className="star filled" />
                          <span className="rating-number">4.9</span>
                        </div>
                        <span className="sold-count">700+ sold</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Category cards grid */}
          <div className="category-grid">
            {visibleCategories.map((category) => (
              <div 
                key={category.id}
                className="category-card"
                onClick={() => handleCategoryClick(category)}
              >
                <div className="category-content">
                  <div className="category-text">
                    <h3 className="category-title">
                      {category.title}
                    </h3>
                  </div>
                  <div className="category-image">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      onError={(e) => {
                        e.target.src = getDefaultImage();
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows for categories */}
        {categories.length > 6 && (
          <>
            <button 
              onClick={prevSlide}
              className="nav-arrow nav-arrow-left"
              disabled={currentIndex === 0}
              aria-label="Previous categories"
            >
              <ChevronLeft size={20} />
            </button>
            
            <button 
              onClick={nextSlide}
              className="nav-arrow nav-arrow-right"
              disabled={currentIndex >= categories.length - 6}
              aria-label="Next categories"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}