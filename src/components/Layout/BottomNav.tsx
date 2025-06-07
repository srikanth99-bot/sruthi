import React from 'react';
import { motion } from 'framer-motion';
import { Home, Grid, ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { cartItems } = useStore();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'categories', icon: Grid, label: 'Categories' },
    { id: 'cart', icon: ShoppingBag, label: 'Cart', badge: cartItemCount },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50"
    >
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
              activeTab === item.id 
                ? 'text-primary-600 bg-primary-50' 
                : 'text-gray-600 hover:text-primary-600'
            }`}
          >
            <div className="relative">
              <item.icon className="h-6 w-6" />
              {item.badge && item.badge > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium"
                >
                  {item.badge > 9 ? '9+' : item.badge}
                </motion.span>
              )}
            </div>
            <span className="text-xs font-medium mt-1">{item.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  );
};

export default BottomNav;