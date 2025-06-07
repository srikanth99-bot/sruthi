import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Crown, Star, Sparkles, Heart, Eye, ShoppingBag, Zap } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { mockProducts } from '../../data/mockData';

const FeaturedProducts: React.FC = () => {
  const { addToCart } = useStore();
  const featuredProducts = mockProducts.filter(product => product.featured);

  const handleAddToCart = (product: any) => {
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 animate-pulse">
          <Sparkles className="h-40 w-40 text-purple-500" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce">
          <Crown className="h-48 w-48 text-pink-500" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-spin" style={{ animationDuration: '20s' }}>
          <Zap className="h-32 w-32 text-yellow-500" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-10 shadow-2xl"
          >
            <Crown className="h-12 w-12 text-white animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-8"
          >
            Featured Masterpieces
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Handpicked treasures from our artisan partners - each piece represents the pinnacle of traditional craftsmanship
          </motion.p>
        </div>

        {/* Enhanced Featured Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 border-2 border-purple-200 rounded-full px-10 py-5">
            <Star className="h-8 w-8 text-yellow-500 mr-4 fill-current animate-pulse" />
            <span className="text-purple-800 font-black text-2xl">Curator's Choice Collection</span>
            <Star className="h-8 w-8 text-yellow-500 ml-4 fill-current animate-pulse" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group relative"
            >
              {/* Ultra Premium Badge */}
              <div className="absolute -top-4 -right-4 z-20">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-4 shadow-2xl border-4 border-white"
                >
                  <Crown className="h-6 w-6 text-white" />
                </motion.div>
              </div>

              <div className="bg-white rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700 border border-gray-100 overflow-hidden">
                {/* Enhanced Image Container */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Enhanced Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Enhanced Discount Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-6 left-6">
                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-sm font-black px-4 py-2 rounded-full shadow-lg">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  )}

                  {/* Enhanced Action Buttons */}
                  <div className="absolute top-6 right-6 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-colors"
                    >
                      <Heart className="h-5 w-5 text-red-500" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-xl hover:bg-white transition-colors"
                    >
                      <Eye className="h-5 w-5 text-gray-600" />
                    </motion.button>
                  </div>

                  {/* Enhanced Quick Add Button */}
                  <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center justify-center space-x-3 shadow-xl"
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Quick Add</span>
                      <Zap className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Enhanced Product Info */}
                <div className="p-8">
                  <h3 className="font-black text-gray-900 text-xl mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Enhanced Rating */}
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 font-bold">({product.reviewCount} reviews)</span>
                  </div>

                  {/* Enhanced Price */}
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-3xl font-black text-gray-900">
                      ₹{product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Enhanced Variants */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {product.colors.slice(0, 4).map((color, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ scale: 1.2 }}
                          className="w-6 h-6 rounded-full border-2 border-gray-200 shadow-sm cursor-pointer"
                          style={{ backgroundColor: color.toLowerCase() }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 4 && (
                        <span className="text-sm text-gray-500 ml-2 font-medium">
                          +{product.colors.length - 4} more
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-500 font-bold">
                      {product.sizes.length} sizes
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            className="group bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 text-white font-black px-16 py-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-4 mx-auto text-xl"
          >
            <Sparkles className="h-8 w-8 animate-pulse" />
            <span>Explore All Products</span>
            <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Ultra Enhanced Special Offer Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl p-12 text-center text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="h-12 w-12 mr-4 animate-pulse" />
              <h3 className="text-4xl font-black">Exclusive Launch Offer</h3>
              <Sparkles className="h-12 w-12 ml-4 animate-pulse" />
            </div>
            <p className="text-2xl mb-10 max-w-4xl mx-auto">
              Get <span className="font-black text-yellow-300 text-3xl">25% OFF</span> on your first purchase from our featured collection. Use code <span className="font-black text-yellow-300 bg-white/20 px-4 py-2 rounded-lg">WELCOME25</span> at checkout.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-lg">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/30">
                <div className="text-3xl mb-2">✨</div>
                <div className="font-bold">Free shipping on orders above ₹1999</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/30">
                <div className="text-3xl mb-2">🎁</div>
                <div className="font-bold">Complimentary gift wrapping</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-6 border border-white/30">
                <div className="text-3xl mb-2">📞</div>
                <div className="font-bold">24/7 premium support</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;