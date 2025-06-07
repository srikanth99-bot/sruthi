import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Zap,
  Shield,
  Truck,
  RotateCcw,
  Award,
  Users,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Product } from '../types';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
  onBuyNow?: () => void;
}

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack, onBuyNow }) => {
  const { addToCart, cartItems } = useStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Check if product is already in cart
  const isInCart = cartItems.some(item => 
    item.product.id === product.id && 
    item.selectedSize === selectedSize && 
    item.selectedColor === selectedColor
  );

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    if (onBuyNow) {
      onBuyNow();
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
                <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{product.name}</h1>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-xl transition-colors ${
                  isWishlisted ? 'bg-red-50 text-red-600' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Share2 className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl overflow-hidden shadow-xl">
              <div className="aspect-square relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    src={product.images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-6 w-6 text-gray-700" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-6 w-6 text-gray-700" />
                    </motion.button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col space-y-2">
                  {discountPercentage > 0 && (
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                      {discountPercentage}% OFF
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                {/* Image Indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === selectedImage 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 hover:bg-white/75'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      index === selectedImage 
                        ? 'border-purple-500 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-8">
            {/* Basic Info */}
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
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
                <span className="text-lg font-semibold text-gray-700">{product.rating}</span>
                <span className="text-gray-500">({product.reviewCount} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="text-4xl font-black text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-green-100 text-green-800 text-sm font-bold px-3 py-1 rounded-full">
                    Save ₹{(product.originalPrice! - product.price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Color: <span className="text-purple-600">{selectedColor}</span>
              </h3>
              <div className="flex items-center space-x-3">
                {product.colors.map((color) => (
                  <motion.button
                    key={color}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      selectedColor === color 
                        ? 'border-purple-500 shadow-lg' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <Check className="h-6 w-6 text-white mx-auto" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Size: <span className="text-purple-600">{selectedSize}</span>
                </h3>
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <motion.button
                    key={size}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                      selectedSize === size
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center bg-gray-100 rounded-xl">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-200 rounded-l-xl transition-colors"
                  >
                    <Minus className="h-5 w-5" />
                  </motion.button>
                  <span className="px-6 py-3 font-bold text-lg">{quantity}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-200 rounded-r-xl transition-colors"
                  >
                    <Plus className="h-5 w-5" />
                  </motion.button>
                </div>
                <span className="text-gray-600">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-black py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-6 w-6" />
                <span>Buy Now - ₹{(product.price * quantity).toLocaleString()}</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-3 text-lg ${
                  isInCart
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <ShoppingBag className="h-6 w-6" />
                <span>{isInCart ? 'Added to Cart' : 'Add to Cart'}</span>
              </motion.button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, text: 'Authentic Product' },
                { icon: Truck, text: 'Free Shipping' },
                { icon: RotateCcw, text: '7 Day Returns' },
                { icon: Award, text: 'Premium Quality' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl"
                >
                  <feature.icon className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: 'Reviews' },
                { id: 'care', label: 'Care Instructions' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6">
                      {product.description}
                    </p>
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                      <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                        <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                        Special Features
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Handwoven by skilled artisans using traditional techniques</li>
                        <li>• Premium quality materials sourced ethically</li>
                        <li>• Unique patterns that celebrate cultural heritage</li>
                        <li>• Perfect for special occasions and daily wear</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Product Details</h4>
                      <dl className="space-y-3">
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Category:</dt>
                          <dd className="font-medium">{product.category}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Available Sizes:</dt>
                          <dd className="font-medium">{product.sizes.join(', ')}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Available Colors:</dt>
                          <dd className="font-medium">{product.colors.join(', ')}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-gray-600">Material:</dt>
                          <dd className="font-medium">Premium Cotton/Silk Blend</dd>
                        </div>
                      </dl>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-4">Care & Maintenance</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Dry clean recommended</li>
                        <li>• Hand wash in cold water if needed</li>
                        <li>• Do not bleach or use harsh chemicals</li>
                        <li>• Iron on low heat with cloth protection</li>
                      </ul>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Customer Reviews</h4>
                    <p className="text-gray-600">Reviews and ratings will be displayed here</p>
                  </div>
                )}

                {activeTab === 'care' && (
                  <div className="bg-blue-50 rounded-2xl p-8">
                    <h4 className="font-bold text-gray-900 mb-6 flex items-center">
                      <Shield className="h-5 w-5 text-blue-600 mr-2" />
                      Care Instructions
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Washing</h5>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Dry clean for best results</li>
                          <li>• Hand wash in cold water if necessary</li>
                          <li>• Use mild detergent only</li>
                          <li>• Do not wring or twist</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-3">Storage</h5>
                        <ul className="space-y-2 text-gray-700">
                          <li>• Store in a cool, dry place</li>
                          <li>• Use breathable garment bags</li>
                          <li>• Avoid direct sunlight</li>
                          <li>• Fold carefully to prevent creases</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;