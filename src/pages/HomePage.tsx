import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, Play, Sparkles, Heart, ShoppingBag, Zap, TrendingUp, Siren as Fire, Crown, Eye, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';

interface HomePageProps {
  onCategoryClick: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCategoryClick }) => {
  const { addToCart, banners, landingSettings, products } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentBanner, setCurrentBanner] = useState(0);

  const activeBanners = banners.filter(banner => banner.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  // Use landing settings for categories if available
  const categoryNames = landingSettings?.categoriesList || ['Sarees', 'Frocks', 'Kurtas', 'Lehengas', 'Dress Materials', 'Blouses'];
  
  const categories = [
    { id: 'All', name: 'All', icon: '🔥', count: products.length },
    ...categoryNames.map(cat => ({
      id: cat,
      name: cat,
      icon: cat === 'Sarees' ? '👗' : 
            cat === 'Frocks' ? '👚' : 
            cat === 'Kurtas' ? '👘' : 
            cat === 'Lehengas' ? '👑' : 
            cat === 'Dress Materials' ? '🧵' : 
            cat === 'Blouses' ? '👕' : '📦',
      count: products.filter(p => p.category === cat).length
    }))
  ];

  // Use landing settings for featured products if available
  let featuredProducts = products.filter(p => p.featured).slice(0, 6);
  if (landingSettings?.bestSellingProductIds && landingSettings.bestSellingProductIds.length > 0) {
    featuredProducts = products
      .filter(p => landingSettings.bestSellingProductIds?.includes(p.id))
      .slice(0, 6);
  }
  
  // Use landing settings for trending products if available
  let trendingProducts = products.slice(0, 4);
  if (landingSettings?.trendingProductIds && landingSettings.trendingProductIds.length > 0) {
    trendingProducts = products
      .filter(p => landingSettings.trendingProductIds?.includes(p.id))
      .slice(0, 4);
  }

  useEffect(() => {
    if (activeBanners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
      }, 8000);
      return () => clearInterval(timer);
    }
  }, [activeBanners.length]);

  const handleBannerClick = (banner: any) => {
    if (banner.linkType === 'category' && banner.linkValue) {
      onCategoryClick(banner.linkValue);
    } else if (banner.linkType === 'collection' && banner.linkValue) {
      onCategoryClick(banner.linkValue);
    }
  };

  const getBannerHeight = (height: string) => {
    switch (height) {
      case 'small': return 'h-32';
      case 'large': return 'h-64';
      default: return 'h-48';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dynamic Banners Section */}
      {activeBanners.length > 0 && (
        <div className="px-4 mb-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className={`relative ${getBannerHeight(activeBanners[currentBanner].height)} bg-gradient-to-br ${activeBanners[currentBanner].gradient} rounded-3xl overflow-hidden cursor-pointer`}
              onClick={() => handleBannerClick(activeBanners[currentBanner])}
            >
              {/* Background Image */}
              {activeBanners[currentBanner].image && (
                <img
                  src={activeBanners[currentBanner].image}
                  alt={activeBanners[currentBanner].title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-black/20" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  {activeBanners[currentBanner].showIcon && activeBanners[currentBanner].icon && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{activeBanners[currentBanner].icon}</span>
                      <span className={`${activeBanners[currentBanner].textColor} font-bold text-sm`}>
                        {activeBanners[currentBanner].subtitle}
                      </span>
                    </div>
                  )}
                  <h2 className={`text-2xl font-black ${activeBanners[currentBanner].textColor} mb-2`}>
                    {activeBanners[currentBanner].title}
                  </h2>
                  {activeBanners[currentBanner].description && (
                    <p className={`${activeBanners[currentBanner].textColor}/90 text-sm`}>
                      {activeBanners[currentBanner].description}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`self-start ${activeBanners[currentBanner].buttonColor} font-bold px-6 py-3 rounded-xl shadow-lg`}
                >
                  {activeBanners[currentBanner].buttonText}
                </motion.button>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-4 right-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Banner Indicators */}
              {activeBanners.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {activeBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentBanner(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentBanner 
                          ? 'bg-white w-6' 
                          : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Categories */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{landingSettings?.popularCategoriesTitle || 'Categories'}</h3>
          <button className="text-purple-600 font-semibold text-sm">View All</button>
        </div>
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(category.id);
                if (category.id !== 'All') {
                  onCategoryClick(category.name);
                }
              }}
              className={`flex-shrink-0 flex flex-col items-center p-4 rounded-2xl min-w-[80px] transition-all ${
                activeCategory === category.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 shadow-sm'
              }`}
            >
              <span className="text-2xl mb-2">{category.icon}</span>
              <span className="font-semibold text-xs">{category.name}</span>
              <span className={`text-xs mt-1 ${
                activeCategory === category.id ? 'text-purple-200' : 'text-gray-500'
              }`}>
                {category.count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Trending Section */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-500" /> 
            <h3 className="text-xl font-bold text-gray-900">{landingSettings?.trendingTitle || 'Trending Now'}</h3>
          </div>
          <button className="text-purple-600 font-semibold text-sm">See All</button>
        </div>
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0 w-40 bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1}
                  </span>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                    className="p-2 bg-purple-600 text-white rounded-lg"
                  >
                    <Plus className="h-3 w-3" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            <h3 className="text-xl font-bold text-gray-900">{landingSettings?.bestSellingTitle || 'Featured'}</h3>
          </div>
          <button className="text-purple-600 font-semibold text-sm">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Featured
                  </span>
                </div>
                {product.originalPrice && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-500 line-through ml-1">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Cart</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Special Offers */}
      <div className="px-4 mb-6">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-5 w-5 text-emerald-200" />
              <span className="text-emerald-200 font-semibold text-sm">SPECIAL OFFER</span>
            </div>
            <h3 className="text-2xl font-black mb-2">Free Shipping</h3>
            <p className="text-emerald-100 mb-4">On orders above ₹1999</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-emerald-600 font-bold px-6 py-3 rounded-xl"
            >
              Shop Now
            </motion.button>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="px-4 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <h4 className="font-bold text-gray-900 mb-1">10,000+ Happy Customers</h4>
            <p className="text-gray-600 text-sm mb-4">Join our community of satisfied shoppers</p>
            <div className="flex items-center justify-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-black text-purple-600">4.9</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-green-600">99%</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-blue-600">24/7</div>
                <div className="text-xs text-gray-500">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;