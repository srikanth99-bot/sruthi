import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore';

const CartDrawer: React.FC = () => {
  const { 
    cartOpen, 
    setCartOpen, 
    cartItems, 
    updateCartQuantity, 
    removeFromCart 
  } = useStore();

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Cart Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">Shopping Cart</h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <ShoppingBag className="h-16 w-16 mb-4" />
                  <p className="text-lg font-medium">Your cart is empty</p>
                  <p className="text-sm">Add some products to get started</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start space-x-4 border-b border-gray-200 pb-6"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-20 w-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>Size: {item.selectedSize}</p>
                          <p>Color: {item.selectedColor}</p>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateCartQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                Math.max(0, item.quantity - 1)
                              )}
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor,
                                item.quantity + 1
                              )}
                              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ₹{(item.product.price * item.quantity).toLocaleString()}
                            </p>
                            <button
                              onClick={() => removeFromCart(
                                item.product.id,
                                item.selectedSize,
                                item.selectedColor
                              )}
                              className="text-xs text-red-600 hover:text-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t bg-white p-6 space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-primary text-lg"
                  onClick={() => {
                    setCartOpen(false);
                    // Navigate to checkout
                  }}
                >
                  Proceed to Checkout
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;