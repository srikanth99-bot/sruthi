import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, User, Heart, Bell, MapPin, ChevronDown } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { LandingSettings } from '../../types';

interface HeaderProps {
  isAdmin?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const { 
    cartItems, 
    setCartOpen, 
    setMobileMenuOpen, 
    searchQuery, 
    setSearchQuery,
    landingSettings,
    isAuthenticated,
    user,
    getUnreadNotificationCount
  } = useStore();
  
  const [searchFocused, setSearchFocused] = useState(false);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = getUnreadNotificationCount();

  if (isAdmin) {
    return (
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                looom.shop Admin
              </h1>
            </motion.div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
              <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <User className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>
    );
  }

  return (
    <>
      {/* Top Banner */}
      <div className="bg-black text-white py-2 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-2 text-white">
              <MapPin className="h-4 w-4 text-purple-400" />
              <span>Deliver to:</span>
              <button className="flex items-center space-x-1 font-medium text-white hover:text-purple-300 transition-colors">
                <span>{landingSettings?.deliveryLocation || 'Bangalore 560001'}</span>
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="flex items-center space-x-6 text-white">
              <div className="flex items-center space-x-2">
                <span className="text-red-400">📞</span>
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-red-400">🚚</span>
                <span>Same Day Delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-lg"
      >
        {/* Location Bar */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span>Deliver to:</span>
                <button className="flex items-center space-x-1 font-medium text-gray-900 hover:text-purple-600 transition-colors">
                  <span>Bangalore 560001</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
              <div className="hidden md:flex items-center space-x-4 text-gray-600">
                <span>📞 24/7 Support</span>
                <span>🚚 Same Day Delivery</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0 flex items-center"
            >
              {landingSettings?.siteLogoUrl ? (
                <img 
                  src={landingSettings.siteLogoUrl} 
                  alt={landingSettings.siteName || 'looom.shop'} 
                  className="h-8 w-auto mr-2"
                />
              ) : null}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 bg-clip-text text-transparent">
                  {landingSettings?.siteName || 'looom.shop'}
                </h1>
                <p className="text-xs text-gray-500 -mt-1">{landingSettings?.pageSubtitle || 'Handwoven Heritage'}</p>
              </div>
            </motion.div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <motion.div 
                className="relative w-full"
                animate={{ scale: searchFocused ? 1.02 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search for sarees, frocks, dress materials..."
                  className="block w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
                />
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-200 p-4"
                  >
                    <p className="text-sm text-gray-500">Search suggestions will appear here...</p>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Icon - Mobile */}
              <button className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors">
                <Search className="h-5 w-5 text-gray-600" />
              </button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Heart className="h-6 w-6 text-gray-600" />
                {isAuthenticated && user?.wishlist && user.wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {user.wishlist.length}
                  </span>
                )}
              </motion.button>

              {/* Notifications */}
              {isAuthenticated && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Bell className="h-6 w-6 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                    >
                      {unreadNotifications}
                    </motion.span>
                  )}
                </motion.button>
              )}

              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCartOpen(true)}
                className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <ShoppingBag className="h-6 w-6 text-gray-600" />
                {cartItemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Profile */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                {isAuthenticated && user ? (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <User className="h-6 w-6 text-gray-600" />
                )}
              </motion.button>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-3 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;