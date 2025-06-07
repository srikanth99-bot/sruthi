import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Filter, Grid, List, Search, SlidersHorizontal, Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { useStore } from '../store/useStore';
import ProductCard from '../components/Products/ProductCard';
import type { Product } from '../types';

interface CollectionPageProps {
  category?: string;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

const CollectionPage: React.FC<CollectionPageProps> = ({ category = 'All Products', onBack, onProductClick }) => {
  const { products, addToCart, searchQuery, setSearchQuery } = useStore();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter products based on category and other filters
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (category !== 'All Products') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === category.toLowerCase() ||
        category.toLowerCase().includes(product.category.toLowerCase())
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by colors
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => selectedColors.includes(color))
      );
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, category, searchQuery, sortBy, priceRange, selectedColors, selectedSizes]);

  // Get unique colors and sizes from all products
  const allColors = [...new Set(products.flatMap(p => p.colors))];
  const allSizes = [...new Set(products.flatMap(p => p.sizes))];

  const handleQuickView = (product: Product) => {
    onProductClick(product);
  };

  const clearFilters = () => {
    setPriceRange([0, 15000]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-6 w-6 text-gray-600" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{category}</h1>
                <p className="text-sm text-gray-500">{filteredProducts.length} products found</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
                />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              {/* Filter Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                className="w-80 bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-fit sticky top-24"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Clear All
                  </button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">₹{priceRange[0].toLocaleString()}</span>
                      <span className="text-sm text-gray-600">₹{priceRange[1].toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Colors */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Colors</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {allColors.map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => {
                          if (selectedColors.includes(color)) {
                            setSelectedColors(selectedColors.filter(c => c !== color));
                          } else {
                            setSelectedColors([...selectedColors, color]);
                          }
                        }}
                        className={`w-8 h-8 rounded-full border-2 ${
                          selectedColors.includes(color) ? 'border-purple-500' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Sizes</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {allSizes.map((size) => (
                      <motion.button
                        key={size}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (selectedSizes.includes(size)) {
                            setSelectedSizes(selectedSizes.filter(s => s !== size));
                          } else {
                            setSelectedSizes([...selectedSizes, size]);
                          }
                        }}
                        className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                          selectedSizes.includes(size)
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {size}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <button
                  onClick={clearFilters}
                  className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' ? (
                      <ProductCard 
                        product={product} 
                        onQuickView={handleQuickView}
                        onClick={() => onProductClick(product)}
                      />
                    ) : (
                      <div 
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => onProductClick(product)}
                      >
                        <div className="flex">
                          <div className="w-48 h-48 relative overflow-hidden">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
                                <p className="text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                                <div className="flex items-center space-x-2 mb-3">
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                                  </div>
                                  <span className="text-gray-400">·</span>
                                  <span className="text-sm text-gray-500">{product.reviewCount} reviews</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                  ₹{product.price.toLocaleString()}
                                </div>
                                {product.originalPrice && (
                                  <div className="text-sm text-gray-500 line-through">
                                    ₹{product.originalPrice.toLocaleString()}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {product.colors.slice(0, 4).map((color, i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                                    style={{ backgroundColor: color.toLowerCase() }}
                                    title={color}
                                  />
                                ))}
                                {product.colors.length > 4 && (
                                  <span className="text-sm text-gray-500">+{product.colors.length - 4}</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Add to wishlist
                                  }}
                                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                  <Heart className="h-5 w-5 text-gray-600" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(product, product.sizes[0], product.colors[0]);
                                  }}
                                  className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2"
                                >
                                  <ShoppingBag className="h-4 w-4" />
                                  <span>Add to Cart</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;