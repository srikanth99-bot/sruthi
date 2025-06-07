import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  Calendar,
  Download,
  Share2,
  Star,
  ArrowRight,
  Phone,
  Mail,
  Clock,
  CreditCard,
  Home
} from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  onBackToHome: () => void;
}

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ orderId, onBackToHome }) => {
  const [orderDetails] = useState({
    id: orderId,
    status: 'confirmed',
    estimatedDelivery: '3-5 business days',
    trackingNumber: `TRK${orderId.slice(-6)}`,
    paymentMethod: 'UPI',
    total: 2800,
    items: [
      {
        name: 'Traditional Ikkat Silk Saree',
        image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
        price: 2800,
        quantity: 1,
        size: 'Free Size',
        color: 'Maroon'
      }
    ],
    address: {
      name: 'Priya Sharma',
      street: '123 MG Road',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    }
  });

  const [confettiVisible, setConfettiVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setConfettiVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
      {/* Confetti Animation */}
      {confettiVisible && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                y: -100, 
                x: Math.random() * window.innerWidth,
                rotate: 0,
                opacity: 1
              }}
              animate={{ 
                y: window.innerHeight + 100,
                rotate: 360,
                opacity: 0
              }}
              transition={{ 
                duration: 3,
                delay: Math.random() * 2,
                ease: "easeOut"
              }}
              className="absolute w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-2xl">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Thank you for your purchase! Your order has been successfully placed.
          </p>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 inline-block">
            <p className="text-sm text-gray-500 mb-1">Order Number</p>
            <p className="text-2xl font-black text-gray-900">#{orderDetails.id}</p>
          </div>
        </motion.div>

        {/* Order Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="flex items-center justify-between">
            {[
              { icon: CheckCircle, label: 'Order Confirmed', status: 'completed', time: 'Just now' },
              { icon: Package, label: 'Processing', status: 'current', time: 'Within 24 hours' },
              { icon: Truck, label: 'Shipped', status: 'pending', time: '1-2 days' },
              { icon: MapPin, label: 'Delivered', status: 'pending', time: '3-5 days' },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                  step.status === 'completed' ? 'bg-green-500 text-white' :
                  step.status === 'current' ? 'bg-blue-500 text-white animate-pulse' :
                  'bg-gray-200 text-gray-400'
                }`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <p className={`font-semibold text-sm mb-1 ${
                  step.status === 'completed' ? 'text-green-600' :
                  step.status === 'current' ? 'text-blue-600' :
                  'text-gray-400'
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-gray-500">{step.time}</p>
                {index < 3 && (
                  <div className={`absolute w-16 h-1 mt-6 ml-16 ${
                    step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} | Color: {item.color}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">₹{item.price.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total Paid</span>
                  <span className="text-2xl font-black text-green-600">₹{orderDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-900">{orderDetails.address.name}</p>
                    <p className="text-gray-600">
                      {orderDetails.address.street}, {orderDetails.address.city}
                    </p>
                    <p className="text-gray-600">
                      {orderDetails.address.state} - {orderDetails.address.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Estimated Delivery</p>
                    <p className="text-gray-600">{orderDetails.estimatedDelivery}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Tracking Number</p>
                    <p className="text-gray-600 font-mono">{orderDetails.trackingNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Actions & Support */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-700">Track Your Order</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-purple-600" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Download className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-700">Download Invoice</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-blue-600" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <Share2 className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-700">Share Order</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-green-600" />
                </motion.button>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h3>
              <div className="flex items-center space-x-3 mb-4">
                <CreditCard className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Payment Method</p>
                  <p className="text-gray-600">{orderDetails.paymentMethod}</p>
                </div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-800">Payment Successful</span>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  Your payment has been processed successfully
                </p>
              </div>
            </div>

            {/* Customer Support */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Need Help?</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Call Support</p>
                    <p className="text-blue-600 text-sm">+91 9876543210</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Email Support</p>
                    <p className="text-purple-600 text-sm">support@looom.shop</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <Clock className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Support Hours</p>
                    <p className="text-green-600 text-sm">24/7 Available</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Continue Shopping */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You for Shopping with Us!</h3>
            <p className="text-gray-600 mb-6">
              We hope you love your purchase. Don't forget to leave a review and share your experience!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackToHome}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-4 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl"
              >
                <Home className="h-5 w-5" />
                <span>Continue Shopping</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 font-bold px-8 py-4 rounded-2xl hover:bg-purple-50 transition-all"
              >
                <Star className="h-5 w-5" />
                <span>Rate Your Experience</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;