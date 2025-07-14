import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Star, Heart, ShoppingBag, Eye, Plus, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';

interface HomePageProps {
  onCategoryClick: (category: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onCategoryClick }) => {
  const { addToCart, banners, landingSettings, products, updateBanner } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isManualTransition, setIsManualTransition] = useState(false);

  const activeBanners = banners.filter(banner => banner.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  // Use landing settings for categories if available
  const categoryNames = landingSettings?.categoriesList || ['Sarees', 'Frocks', 'Kurtas', 'Lehengas', 'Dress Materials', 'Blouses'];
  
  // Auto-slide banners
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
      let timer: NodeJS.Timeout;
      
      if (!isManualTransition) {
        timer = setInterval(() => {
          setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
        }, 5000); // Change banner every 5 seconds
      }
      
      return () => {
        if (timer) clearInterval(timer);
      };
    }
  }, [activeBanners.length, isManualTransition, currentBanner]);
  
  // Reset manual transition flag after a delay
  useEffect(() => {
    if (isManualTransition) {
      const timer = setTimeout(() => {
        setIsManualTransition(false);
      }, 5000); // Resume auto-sliding after 5 seconds of inactivity
      
      return () => clearTimeout(timer);
    }
  }, [isManualTransition, currentBanner]);

  const handleBannerClick = (banner: any) => {
    if (banner.linkType === 'category' && banner.linkValue) {
      onCategoryClick(banner.linkValue);
    } else if (banner.linkType === 'collection' && banner.linkValue) {
      onCategoryClick(banner.linkValue);
    }
  };

  const goToPrevBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsManualTransition(true);
    setCurrentBanner((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const goToNextBanner = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsManualTransition(true);
    setCurrentBanner((prev) => (prev + 1) % activeBanners.length);
  };

  const getBannerHeight = (height: string) => {
    switch (height) {
      case 'small': return 'h-32';
      case 'large': return 'h-64';
      default: return 'h-48';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner Section */}
      <div className="px-4 py-6 mb-6">
        <div className="relative">
          {/* Navigation Arrows */}
          {activeBanners.length > 1 && (
            <>
              <button 
                onClick={goToPrevBanner}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeft className="h-6 w-6 text-gray-800" />
              </button>
              <button 
                onClick={goToNextBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/70 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRight className="h-6 w-6 text-gray-800" />
              </button>
            </>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentBanner}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] bg-pink-50 rounded-3xl overflow-hidden cursor-pointer"
              onClick={() => activeBanners.length > 0 && handleBannerClick(activeBanners[currentBanner])}
            >
              {/* Background Image */}
              {activeBanners.length > 0 && activeBanners[currentBanner]?.image && (
                <img
                  src={activeBanners[currentBanner].image}
                  alt={activeBanners[currentBanner].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100/80 to-white/40" />
              
              {/* Content */}
              <div className="absolute inset-0 p-10 flex flex-col justify-center max-w-lg">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-200 text-pink-800">
                    🔥 HOT DEAL
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Up to 70% OFF
                </h2>
                <p className="text-gray-700 text-lg mb-6">
                  Discover our exquisite collection of handwoven Ikkat textiles, crafted with traditional techniques and modern designs.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="self-start bg-pink-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-pink-600 transition-all flex items-center space-x-2"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
              </div>
              
              {/* Banner Indicators */}
              {activeBanners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {activeBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsManualTransition(true);
                        setCurrentBanner(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentBanner 
                          ? 'bg-pink-500 w-6' 
                          : 'bg-pink-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 mb-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{landingSettings?.popularCategoriesTitle || 'Shop by Category'}</h3>
          <button className="text-pink-500 font-semibold text-sm">View All</button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.slice(1).map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveCategory(category.id);
                onCategoryClick(category.name);
              }}
              className="flex flex-col items-center"
            >
              <div className={`w-16 h-16 mb-3 rounded-full flex items-center justify-center bg-pink-100 text-2xl`}>
                {category.icon}
              </div>
              <span className="font-medium text-gray-800 text-sm">{category.name}</span>
              <span className="text-xs text-gray-500 mt-1">{category.count} items</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{landingSettings?.bestSellingTitle || 'Featured Collection'}</h3>
          <button className="text-pink-500 font-semibold text-sm">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  {product.originalPrice && (
                    <span className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white rounded-full shadow-md">
                    <Heart className="h-4 w-4 text-pink-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                  {product.name}
                </h4>
                <div className="flex items-center space-x-1 mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                  <span className="text-xs text-gray-400">({product.reviewCount})</span>
                </div>
                <div className="flex items-center justify-between">
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
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(product, product.sizes[0], product.colors[0])}
                    className="p-2 bg-pink-100 text-pink-500 rounded-lg hover:bg-pink-200 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="px-4 mb-12 bg-pink-50 py-10 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-pink-500" />
            <h3 className="text-2xl font-bold text-gray-900">{landingSettings?.trendingTitle || 'Trending Now'}</h3>
          </div>
          <button className="text-pink-500 font-semibold text-sm">See All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {trendingProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2 py-1 rounded-full">
                    #{index + 1} Trending
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-medium text-gray-900 mb-2 line-clamp-1">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 bg-pink-100 text-pink-500 rounded-lg hover:bg-pink-200 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
                      <ShoppingBag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Special Offer Banner */}
      <div className="px-4 mb-12">
        <div className="bg-gradient-to-r from-pink-100 to-pink-50 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-200/30 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-200/30 rounded-full translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="h-5 w-5 text-pink-500" />
                <span className="text-pink-800 font-semibold text-sm">LIMITED TIME OFFER</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-700 mb-4">On orders above ₹1999</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-pink-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-pink-600 transition-colors"
              >
                Shop Now
              </motion.button>
            </div>
            
            <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-pink-800 font-bold">SAVE</p>
                  <p className="text-3xl font-black text-pink-500">₹500</p>
                  <p className="text-pink-800 text-xs">Use code: PINK500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="px-4 mb-12">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-pink-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <h4 className="font-bold text-gray-900 mb-1">10,000+ Happy Customers</h4>
            <p className="text-gray-600 text-sm mb-6">Join our community of satisfied shoppers</p>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-black text-pink-500">4.9</div>
                <div className="text-xs text-gray-500">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-pink-500">99%</div>
                <div className="text-xs text-gray-500">Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-pink-500">24/7</div>
                <div className="text-xs text-gray-500">Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instagram Section */}
      <div className="px-4 mb-12">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Follow Us on Instagram</h3>
          <p className="text-gray-600">@looom.shop</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="aspect-square bg-pink-100 rounded-lg overflow-hidden">
              <img 
                src={`https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop&crop=entropy`} 
                alt="Instagram post" 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;