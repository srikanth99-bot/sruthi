import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  CreditCard, 
  Shield, 
  Truck, 
  Check, 
  Plus, 
  Edit,
  Loader,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { initializeRazorpayPayment } from '../services/razorpay';
import type { Address } from '../types';

interface SimpleCheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

const SimpleCheckoutPage: React.FC<SimpleCheckoutPageProps> = ({ onBack, onOrderComplete }) => {
  const { cartItems, clearCart, user, setUser, createOrder, addPayment } = useStore();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(user?.addresses?.find(addr => addr.isDefault) || null);
  const [showAddressForm, setShowAddressForm] = useState(!selectedAddress);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  
  const [newAddress, setNewAddress] = useState<Address>({
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: user?.phone || ''
  });

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.state && newAddress.pincode) {
      const addressWithId = {
        ...newAddress,
        id: 'addr_' + Date.now(),
        isDefault: !user?.addresses?.length
      };
      
      const updatedUser = {
        ...user,
        name: newAddress.name || user?.name || '',
        phone: newAddress.phone || user?.phone || '',
        addresses: [...(user?.addresses || []), addressWithId],
      };
      setUser(updatedUser as any);
      setSelectedAddress(addressWithId);
      setShowAddressForm(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError('Please select or add a delivery address');
      return;
    }

    if (!user) {
      setError('Please login to continue');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create order first
      const orderId = createOrder({
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        items: cartItems,
        total,
        status: 'pending',
        address: selectedAddress,
        paymentMethod: 'razorpay',
        paymentStatus: 'processing',
        statusHistory: []
      });

      // Get the created order
      const order = {
        id: orderId,
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: user.phone,
        total,
        items: cartItems,
        address: selectedAddress
      };

      // Initialize Razorpay payment
      await initializeRazorpayPayment(
        order as any,
        (response) => {
          // Payment successful
          const paymentData = {
            id: 'pay_' + Date.now(),
            orderId: orderId,
            customerName: user.name,
            customerEmail: user.email,
            customerPhone: user.phone,
            amount: total,
            currency: 'INR',
            status: 'captured' as const,
            method: 'card' as const,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            fee: Math.round(total * 0.02),
            tax: Math.round(total * 0.02 * 0.18),
            createdAt: new Date().toISOString(),
            authorizedAt: new Date().toISOString(),
            capturedAt: new Date().toISOString(),
            receipt: orderId,
            notes: {
              orderId: orderId,
              customerEmail: user.email
            }
          };

          addPayment(paymentData);
          clearCart();
          setIsProcessing(false);
          onOrderComplete(orderId);
        },
        (error) => {
          setIsProcessing(false);
          setError(error.error || 'Payment failed. Please try again.');
        }
      );
    } catch (error) {
      setIsProcessing(false);
      setError('Failed to process order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
                <p className="text-sm text-gray-500">Complete your purchase</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Delivery Address</h3>
                {selectedAddress && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Change</span>
                  </motion.button>
                )}
              </div>

              {selectedAddress && !showAddressForm ? (
                <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                    <div>
                      <h4 className="font-bold text-gray-900">{selectedAddress.name}</h4>
                      <p className="text-gray-700">
                        {selectedAddress.street}, {selectedAddress.city}
                      </p>
                      <p className="text-gray-700">
                        {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      {selectedAddress.phone && (
                        <p className="text-gray-600 text-sm mt-1">Phone: {selectedAddress.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter state"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                      <input
                        type="text"
                        value={newAddress.pincode}
                        onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddAddress}
                      className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Save Address
                    </motion.button>
                    {selectedAddress && (
                      <button
                        onClick={() => setShowAddressForm(false)}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
              
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-3 bg-purple-600 rounded-xl">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">Razorpay Secure Payment</h4>
                    <p className="text-gray-600">UPI, Cards, Net Banking, Wallets - All in one</p>
                  </div>
                  <Check className="h-6 w-6 text-purple-600 ml-auto" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>📱</span>
                    <span>UPI</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>💳</span>
                    <span>Cards</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>🏦</span>
                    <span>Net Banking</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-700">
                    <span>👛</span>
                    <span>Wallets</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-4">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Pay Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePayment}
                disabled={isProcessing || !selectedAddress}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-lg shadow-xl"
              >
                {isProcessing ? (
                  <>
                    <Loader className="h-5 w-5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    <span>Pay ₹{total.toLocaleString()}</span>
                  </>
                )}
              </motion.button>

              {/* Benefits */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Free shipping on orders above ₹2000</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>100% secure payment with Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCheckoutPage;