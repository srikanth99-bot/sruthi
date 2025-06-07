import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  MapPin, 
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Copy,
  ExternalLink,
  Star,
  MessageCircle,
  Download,
  Share2,
  Calendar,
  Navigation,
  AlertCircle,
  Info
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Order, OrderStatusUpdate } from '../types';

interface OrderTrackingPageProps {
  orderId: string;
  onBack: () => void;
}

const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ orderId, onBack }) => {
  const { getOrderById, user } = useStore();
  const [order, setOrder] = useState<Order | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const orderData = getOrderById(orderId);
    setOrder(orderData);
    
    if (orderData) {
      // Set active step based on order status
      const statusSteps = ['pending', 'confirmed', 'packed', 'shipped', 'delivered'];
      const currentStepIndex = statusSteps.indexOf(orderData.status);
      setActiveStep(currentStepIndex >= 0 ? currentStepIndex : 0);
    }
  }, [orderId, getOrderById]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or you don't have access to it.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    {
      id: 'confirmed',
      title: 'Order Confirmed',
      description: 'Your order has been confirmed and is being processed',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'packed',
      title: 'Order Packed',
      description: 'Your items have been carefully packed',
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'shipped',
      title: 'Order Shipped',
      description: 'Your order is on its way to you',
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      id: 'delivered',
      title: 'Delivered',
      description: 'Your order has been delivered successfully',
      icon: MapPin,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'packed': return 'text-orange-600 bg-orange-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const copyTrackingNumber = () => {
    if (order.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      // You could add a toast notification here
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstimatedDelivery = () => {
    if (order.deliveryDate) {
      return `Delivered on ${formatDate(order.deliveryDate)}`;
    }
    if (order.estimatedDelivery) {
      return `Expected by ${formatDate(order.estimatedDelivery)}`;
    }
    return 'Delivery date will be updated soon';
  };

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
                <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
                <p className="text-sm text-gray-500">#{order.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <Download className="h-5 w-5 text-gray-600" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Status</h2>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600">{formatDate(order.updatedAt)}</span>
              </div>
            </div>
            {order.trackingNumber && (
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-gray-900">{order.trackingNumber}</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={copyTrackingNumber}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Delivery Estimate */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Delivery Information</h3>
                <p className="text-gray-600">{getEstimatedDelivery()}</p>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              {trackingSteps.map((step, index) => {
                const isCompleted = activeStep > index;
                const isCurrent = activeStep === index;
                const isUpcoming = activeStep < index;

                return (
                  <div key={step.id} className="flex flex-col items-center relative">
                    {/* Step Circle */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                        isCompleted 
                          ? 'bg-green-500 border-green-500' 
                          : isCurrent 
                          ? `${step.bgColor} border-purple-500` 
                          : 'bg-gray-100 border-gray-300'
                      }`}
                    >
                      <step.icon 
                        className={`h-8 w-8 ${
                          isCompleted 
                            ? 'text-white' 
                            : isCurrent 
                            ? step.color 
                            : 'text-gray-400'
                        }`} 
                      />
                    </motion.div>

                    {/* Step Info */}
                    <div className="mt-4 text-center max-w-32">
                      <h4 className={`font-bold text-sm ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h4>
                      <p className={`text-xs mt-1 ${
                        isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Connecting Line */}
                    {index < trackingSteps.length - 1 && (
                      <div 
                        className={`absolute top-8 left-16 w-full h-1 transition-all duration-500 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                        style={{ width: 'calc(100vw / 4 - 4rem)' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Items</h3>
            <div className="space-y-6">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-16 w-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Size: {item.selectedSize} | Color: {item.selectedColor}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total Amount</span>
                <span className="text-2xl font-black text-purple-600">₹{order.total.toLocaleString()}</span>
              </div>
            </div>
          </motion.div>

          {/* Delivery & Support */}
          <div className="space-y-8">
            {/* Delivery Address */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h3>
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{order.customerName}</h4>
                  <p className="text-gray-600">
                    {order.address.street}, {order.address.city}
                  </p>
                  <p className="text-gray-600">
                    {order.address.state} - {order.address.pincode}
                  </p>
                  <p className="text-gray-600 mt-2">
                    <Phone className="h-4 w-4 inline mr-1" />
                    {order.customerPhone}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Customer Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Need Help?</h3>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-4 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors"
                >
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900">Call Support</h4>
                    <p className="text-blue-600">+91 9876543210</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-4 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-colors"
                >
                  <div className="p-3 bg-green-100 rounded-xl">
                    <MessageCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900">Live Chat</h4>
                    <p className="text-green-600">Available 24/7</p>
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center space-x-4 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-colors"
                >
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-gray-900">Email Support</h4>
                    <p className="text-purple-600">support@looom.shop</p>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Order Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6">Order Timeline</h3>
          <div className="space-y-6">
            {order.statusHistory.map((update, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-4"
              >
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 capitalize">
                      Order {update.status}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(update.timestamp)}
                    </span>
                  </div>
                  {update.notes && (
                    <p className="text-gray-600 mt-1">{update.notes}</p>
                  )}
                  {update.location && (
                    <p className="text-sm text-gray-500 mt-1">
                      <Navigation className="h-4 w-4 inline mr-1" />
                      {update.location}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        {order.status === 'delivered' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-4">How was your experience?</h3>
            <p className="mb-6 opacity-90">Your feedback helps us improve our service</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-purple-600 font-bold px-8 py-4 rounded-2xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
              >
                <Star className="h-5 w-5" />
                <span>Rate & Review</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-colors border border-white/30"
              >
                Order Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;