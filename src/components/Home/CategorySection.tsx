import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Star, Crown, Zap, Gift, Eye, ShoppingBag } from 'lucide-react';

interface CategorySectionProps {
  onCategoryClick: (category: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 'sarees',
      name: 'Luxury Sarees',
      image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
      description: 'Handwoven silk masterpieces',
      productCount: 150,
      icon: Crown,
      gradient: 'from-purple-600 via-pink-600 to-red-500',
      badge: 'Premium',
      price: 'From ₹2,999',
      rating: 4.9,
    },
    {
      id: 'frocks',
      name: 'Designer Frocks',
      image: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
      description: 'Contemporary ethnic wear',
      productCount: 89,
      icon: Heart,
      gradient: 'from-blue-600 via-purple-600 to-pink-500',
      badge: 'Trending',
      price: 'From ₹899',
      rating: 4.7,
    },
    {
      id: 'dress-materials',
      name: 'Dress Materials',
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
      description: 'Premium fabric collections',
      productCount: 120,
      icon: Sparkles,
      gradient: 'from-emerald-600 via-teal-600 to-cyan-500',
      badge: 'New',
      price: 'From ₹1,499',
      rating: 4.8,
    },
    {
      id: 'kurtas',
      name: 'Ethnic Kurtas',
      image: 'https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg',
      description: 'Modern traditional wear',
      productCount: 75,
      icon: Star,
      gradient: 'from-orange-600 via-red-600 to-pink-500',
      badge: 'Hot',
      price: 'From ₹699',
      rating: 4.6,
    },
    {
      id: 'lehengas',
      name: 'Bridal Lehengas',
      image: 'https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg',
      description: 'Wedding collection',
      productCount: 45,
      icon: Gift,
      gradient: 'from-yellow-600 via-orange-600 to-red-500',
      badge: 'Exclusive',
      price: 'From ₹4,999',
      rating: 5.0,
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image: 'https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg',
      description: 'Complete your look',
      productCount: 200,
      icon: Zap,
      gradient: 'from-indigo-600 via-purple-600 to-pink-500',
      badge: 'Must Have',
      price: 'From ₹299',
      rating: 4.5,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 animate-pulse">
          <Sparkles className="h-32 w-32 text-purple-500" />
        </div>
        <div className="absolute bottom-20 right-20 animate-bounce">
          <Heart className="h-24 w-24 text-pink-500" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mb-10 shadow-2xl"
          >
            <Sparkles className="h-12 w-12 text-white animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl font-black bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent mb-8"
          >
            Explore Collections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed"
          >
            Discover our curated selection of handwoven Ikkat textiles, each piece telling a unique story of tradition and craftsmanship
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -15, scale: 1.02 }}
              className="group cursor-pointer"
              onClick={() => onCategoryClick(category.name)}
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-700 border border-gray-100">
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  
                  {/* Enhanced Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-70 group-hover:opacity-80 transition-opacity duration-300`} />
                  
                  {/* Premium Badge */}
                  <div className="absolute top-6 left-6">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-black text-white bg-black/40 backdrop-blur-sm border border-white/30">
                      <category.icon className="h-4 w-4 mr-2" />
                      {category.badge}
                    </span>
                  </div>

                  {/* Product Count */}
                  <div className="absolute top-6 right-6">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                      <span className="text-white text-sm font-bold">{category.productCount}+ Items</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute top-20 right-6 flex flex-col space-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                    >
                      <Eye className="h-5 w-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                    >
                      <Heart className="h-5 w-5 text-white" />
                    </motion.button>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="font-black text-3xl mb-3">{category.name}</h3>
                    <p className="text-lg opacity-90 mb-4">{category.description}</p>
                    
                    {/* Rating */}
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(category.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-white/50'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold">{category.rating}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-300 font-black text-xl">{category.price}</span>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 45 }}
                        className="bg-white rounded-full p-3 shadow-lg"
                      >
                        <ArrowRight className="h-5 w-5 text-gray-700" />
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Bottom Section */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white shadow-sm" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 font-medium">+{category.productCount} styles</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Starting from</div>
                      <div className="font-black text-gray-900">{category.price}</div>
                    </div>
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onCategoryClick(category.name);
                    }}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span>Shop Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryClick('All Products')}
            className="group bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 hover:from-purple-700 hover:via-pink-700 hover:to-red-600 text-white font-black px-16 py-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center space-x-4 mx-auto text-xl"
          >
            <Sparkles className="h-8 w-8 animate-pulse" />
            <span>View All Collections</span>
            <ArrowRight className="h-8 w-8 group-hover:translate-x-2 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;