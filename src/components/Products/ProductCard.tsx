import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView, onClick }) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, product.sizes[0], product.colors[0]);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onQuickView) {
      onQuickView(product);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-48 sm:h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {discountPercentage > 0 && (
            <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {discountPercentage}% OFF
            </span>
          )}
          {product.featured && (
            <span className="bg-secondary-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              // Add to wishlist functionality
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="p-2 bg-primary-500 text-white rounded-full shadow-md hover:bg-primary-600 transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Quick View Button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickView) {
                onQuickView(product);
              } else if (onClick) {
                onClick();
              }
            }}
            className="w-full bg-white bg-opacity-90 backdrop-blur-sm text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-opacity-100 transition-all duration-200"
          >
            View Details
          </motion.button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 flex-1">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
          <span className="text-gray-400">·</span>
          <span className="text-sm text-gray-500">{product.reviewCount} reviews</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-semibold text-gray-900">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Variants Preview */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{ backgroundColor: color.toLowerCase() }}
                title={color}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-gray-500 ml-1">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            {product.sizes.length} size{product.sizes.length > 1 ? 's' : ''}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;