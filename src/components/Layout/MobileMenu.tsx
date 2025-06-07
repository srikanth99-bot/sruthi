import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, Grid, ShoppingBag, User, Settings, LogOut } from 'lucide-react';
import { useStore } from '../../store/useStore';

const MobileMenu: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen, user, isAuthenticated } = useStore();

  const menuItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Grid, label: 'Categories', href: '/categories' },
    { icon: ShoppingBag, label: 'My Orders', href: '/orders' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Menu */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User Info */}
            {isAuthenticated && user && (
              <div className="p-6 border-b bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-6">
              {menuItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 px-6 py-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-6 w-6 text-gray-600" />
                  <span className="text-gray-900 font-medium">{item.label}</span>
                </motion.a>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
              {isAuthenticated ? (
                <button className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Sign Out</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <button className="w-full btn-primary">Sign In</button>
                  <button className="w-full text-primary-600 font-medium">Create Account</button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;