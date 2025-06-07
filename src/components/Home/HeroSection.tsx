import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Play, Sparkles, Heart, ShoppingBag } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
      title: 'Timeless Ikkat Collection',
      subtitle: 'Where Tradition Meets Modern Style',
      description: 'Discover handwoven masterpieces crafted by skilled artisans',
      cta: 'Explore Collection',
      badge: 'New Arrivals',
      offer: 'Up to 60% Off',
      video: false,
    },
    {
      id: 2,
      image: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
      title: 'Festive Elegance',
      subtitle: 'Celebrate Every Moment',
      description: 'Premium sarees and dress materials for special occasions',
      cta: 'Shop Festive',
      badge: 'Trending',
      offer: 'Free Shipping',
      video: false,
    },
    {
      id: 3,
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
      title: 'Designer Collection',
      subtitle: 'Exclusive Handloom Designs',
      description: 'Limited edition pieces crafted with love and precision',
      cta: 'View Designs',
      badge: 'Limited Edition',
      offer: 'Custom Fit',
      video: true,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-gray-900">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          
          {/* Ultra Modern Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-pink-900/70 to-red-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          
          {/* Animated Floating Elements */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotate: 0 }}
            animate={{ opacity: 0.1, y: 0, rotate: 360 }}
            transition={{ delay: 0.5, duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 right-20 text-white"
          >
            <Sparkles className="h-40 w-40" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 0.05, x: 0 }}
            transition={{ delay: 1, duration: 15, repeat: Infinity, repeatType: "reverse" }}
            className="absolute bottom-20 left-20 text-pink-300"
          >
            <Heart className="h-32 w-32" />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-4xl">
            {/* Animated Badge */}
            <motion.div
              key={`badge-${currentSlide}`}
              initial={{ y: 50, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <span className="inline-flex items-center px-8 py-4 rounded-full text-sm font-black bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black shadow-2xl border-4 border-white/20">
                <Star className="h-5 w-5 mr-2 fill-current animate-pulse" />
                {slides[currentSlide].badge}
                <Sparkles className="h-4 w-4 ml-2 animate-spin" />
              </span>
            </motion.div>

            <motion.h1
              key={`title-${currentSlide}`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 1, type: "spring", stiffness: 100 }}
              className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </span>
            </motion.h1>

            <motion.p
              key={`subtitle-${currentSlide}`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="text-3xl sm:text-4xl text-yellow-300 mb-6 font-bold"
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.p
              key={`description-${currentSlide}`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-xl sm:text-2xl text-gray-200 mb-12 leading-relaxed max-w-3xl"
            >
              {slides[currentSlide].description}
            </motion.p>

            {/* Enhanced CTA Buttons */}
            <motion.div
              key={`cta-${currentSlide}`}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-6 sm:space-y-0 sm:space-x-8"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white font-black px-12 py-6 rounded-2xl text-xl transition-all duration-300 shadow-2xl overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center space-x-3">
                  <ShoppingBag className="h-6 w-6" />
                  <span>{slides[currentSlide].cta}</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </motion.button>

              {slides[currentSlide].video && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-4 text-white font-bold text-lg"
                >
                  <div className="relative bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-full p-5 group-hover:bg-white/30 transition-colors">
                    <Play className="h-8 w-8 ml-1" />
                    <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                  </div>
                  <span>Watch Our Story</span>
                </motion.button>
              )}

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl px-8 py-5 cursor-pointer"
              >
                <span className="text-yellow-300 font-black text-xl">
                  {slides[currentSlide].offer}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Enhanced Navigation */}
      <motion.button
        onClick={prevSlide}
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 p-5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border-2 border-white/30 group"
      >
        <ChevronLeft className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
      </motion.button>
      
      <motion.button
        onClick={nextSlide}
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 p-5 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border-2 border-white/30 group"
      >
        <ChevronRight className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* Ultra Modern Slide Indicators */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-6">
        {slides.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => setCurrentSlide(index)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`transition-all duration-500 ${
              index === currentSlide 
                ? 'w-16 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg' 
                : 'w-4 h-4 bg-white/50 hover:bg-white/75 rounded-full'
            }`}
          />
        ))}
      </div>

      {/* Floating Offer Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -45 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="absolute top-10 right-10 bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 text-white font-black px-8 py-4 rounded-full shadow-2xl border-4 border-white/20 cursor-pointer"
      >
        🔥 Limited Time Only
      </motion.div>

      {/* Social Proof Badge */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 right-10 bg-white/10 backdrop-blur-sm border border-white/30 rounded-2xl px-6 py-4 text-white"
      >
        <div className="flex items-center space-x-2 mb-1">
          <div className="flex -space-x-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white" />
            ))}
          </div>
          <span className="text-sm font-bold">10K+ Happy Customers</span>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
          ))}
          <span className="text-xs ml-1">4.9/5 Rating</span>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;