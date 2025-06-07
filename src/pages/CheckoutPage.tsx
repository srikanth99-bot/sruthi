import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CreditCard, 
  Smartphone,
  Building,
  Check,
  Shield,
  Truck,
  Clock,
  Star,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Address } from '../types';

interface CheckoutPageProps {
  onBack: () => void;
  onOrderComplete: (orderId: string) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack, onOrderComplete }) => {
  const { cartItems, clearCart, user, setUser, createOrder } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerDetails, setCustomerDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
  });
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPayment, setShowPayment] = useState(false);

  const subtotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 2000 ? 0 : 100;
  const tax = Math.round(subtotal * 0.05); // 5% tax
  const total = subtotal + shipping + tax;

  const steps = [
    { id: 1, title: 'Customer Details', icon: User },
    { id: 2, title: 'Delivery Address', icon: MapPin },
    { id: 3, title: 'Payment Method', icon: CreditCard },
    { id: 4, title: 'Order Review', icon: Check },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!customerDetails.name.trim()) newErrors.name = 'Name is required';
      if (!customerDetails.email.trim()) newErrors.email = 'Email is required';
      if (!customerDetails.phone.trim()) newErrors.phone = 'Phone is required';
      if (customerDetails.email && !/\S+@\S+\.\S+/.test(customerDetails.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (customerDetails.phone && !/^\d{10}$/.test(customerDetails.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Invalid phone number';
      }
    }

    if (step === 2) {
      if (!selectedAddress) newErrors.address = 'Please select or add an address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const handleAddAddress = () => {
    if (newAddress.street && newAddress.city && newAddress.state && newAddress.pincode) {
      const updatedUser = {
        ...user,
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone,
        addresses: [...(user?.addresses || []), newAddress],
      };
      setUser(updatedUser as any);
      setSelectedAddress(newAddress);
      setNewAddress({ street: '', city: '', state: '', pincode: '', landmark: '' });
      setShowAddressForm(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return;

    setIsProcessing(true);
    
    try {
      // Create order
      const orderId = createOrder({
        customerName: customerDetails.name,
        customerEmail: customerDetails.email,
        customerPhone: customerDetails.phone,
        items: cartItems,
        total,
        status: 'pending',
        address: selectedAddress,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'processing',
        statusHistory: []
      });

      if (paymentMethod === 'cod') {
        // For COD, complete the order immediately
        setTimeout(() => {
          clearCart();
          setIsProcessing(false);
          onOrderComplete(orderId);
        }, 2000);
      } else {
        // For other payment methods, show payment page
        setShowPayment(true);
        setIsProcessing(false);
      }
    } catch (error) {
      setIsProcessing(false);
      console.error('Order creation failed:', error);
    }
  };

  const handlePaymentSuccess = (paymentId: string) => {
    clearCart();
    setShowPayment(false);
    // In real implementation, update order with payment details
    onOrderComplete('ORD' + Date.now());
  };

  const handlePaymentFailure = (error: string) => {
    setShowPayment(false);
    setErrors({ payment: error });
  };

  const renderCustomerDetails = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={customerDetails.name}
                onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={customerDetails.email}
                onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={customerDetails.phone}
                onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your phone number"
              />
            </div>
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderAddressSelection = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Delivery Address</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddressForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </motion.button>
      </div>

      {errors.address && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{errors.address}</p>
        </div>
      )}

      {/* Existing Addresses */}
      {user?.addresses && user.addresses.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Saved Addresses</h4>
          {user.addresses.map((address, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedAddress(address)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedAddress === address
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900">Address {index + 1}</span>
                    {selectedAddress === address && (
                      <Check className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <p className="text-gray-700">
                    {address.street}, {address.city}, {address.state} - {address.pincode}
                  </p>
                  {address.landmark && (
                    <p className="text-sm text-gray-500">Landmark: {address.landmark}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add New Address Form */}
      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-xl p-6 space-y-4"
          >
            <h4 className="font-semibold text-gray-900">Add New Address</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={newAddress.street}
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter street address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter pincode"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter landmark"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddAddress}
                className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                Save Address
              </motion.button>
              <button
                onClick={() => setShowAddressForm(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderPaymentMethod = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-gray-900">Payment Method</h3>
      
      <div className="space-y-4">
        {/* UPI Payment */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setPaymentMethod('upi')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'upi'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">UPI Payment</h4>
                <p className="text-gray-600">Pay using Google Pay, PhonePe, Paytm, BHIM</p>
              </div>
            </div>
            {paymentMethod === 'upi' && (
              <Check className="h-6 w-6 text-purple-600" />
            )}
          </div>
        </motion.div>

        {/* Card Payment */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setPaymentMethod('card')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'card'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Credit/Debit Card</h4>
                <p className="text-gray-600">Visa, Mastercard, RuPay accepted</p>
              </div>
            </div>
            {paymentMethod === 'card' && (
              <Check className="h-6 w-6 text-purple-600" />
            )}
          </div>
        </motion.div>

        {/* Net Banking */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setPaymentMethod('netbanking')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'netbanking'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Net Banking</h4>
                <p className="text-gray-600">All major banks supported</p>
              </div>
            </div>
            {paymentMethod === 'netbanking' && (
              <Check className="h-6 w-6 text-purple-600" />
            )}
          </div>
        </motion.div>

        {/* Cash on Delivery */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          onClick={() => setPaymentMethod('cod')}
          className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
            paymentMethod === 'cod'
              ? 'border-purple-500 bg-purple-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-600 to-red-600 p-3 rounded-xl">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">Cash on Delivery</h4>
                <p className="text-gray-600">Pay when you receive your order</p>
              </div>
            </div>
            {paymentMethod === 'cod' && (
              <Check className="h-6 w-6 text-purple-600" />
            )}
          </div>
        </motion.div>
      </div>

      {/* Security Badge */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
        <Shield className="h-6 w-6 text-green-600" />
        <div>
          <h4 className="font-semibold text-green-900">Secure Payment</h4>
          <p className="text-green-700 text-sm">Your payment information is encrypted and secure</p>
        </div>
      </div>
    </motion.div>
  );

  const renderOrderReview = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-bold text-gray-900">Order Review</h3>
      
      {/* Order Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                className="h-16 w-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                <p className="text-sm text-gray-600">
                  Size: {item.selectedSize} | Color: {item.selectedColor}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  ₹{(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Customer Details</h4>
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {customerDetails.name}</p>
          <p><span className="font-medium">Email:</span> {customerDetails.email}</p>
          <p><span className="font-medium">Phone:</span> {customerDetails.phone}</p>
        </div>
      </div>

      {/* Delivery Address */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Delivery Address</h4>
        {selectedAddress && (
          <p className="text-gray-700">
            {selectedAddress.street}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
            {selectedAddress.landmark && `, Near ${selectedAddress.landmark}`}
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
        <p className="text-gray-700 capitalize">
          {paymentMethod === 'cod' ? 'Cash on Delivery' : 
           paymentMethod === 'upi' ? 'UPI Payment' : 
           paymentMethod === 'card' ? 'Credit/Debit Card' :
           paymentMethod === 'netbanking' ? 'Net Banking' : 'Digital Wallet'}
        </p>
      </div>
    </motion.div>
  );

  // Show payment page if payment is in progress
  if (showPayment) {
    const PaymentPage = React.lazy(() => import('./PaymentPage'));
    return (
      <React.Suspense fallback={<div>Loading payment...</div>}>
        <PaymentPage
          orderId={'ORD' + Date.now()}
          amount={total}
          onBack={() => setShowPayment(false)}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      </React.Suspense>
    );
  }

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
                onClick={handleBack}
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
              <Lock className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      currentStep >= step.id
                        ? 'bg-purple-600 border-purple-600 text-white'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-16 h-1 mx-2 transition-all ${
                        currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                {steps.map((step) => (
                  <span key={step.id} className={`text-xs font-medium ${
                    currentStep >= step.id ? 'text-purple-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && renderCustomerDetails()}
                {currentStep === 2 && renderAddressSelection()}
                {currentStep === 3 && renderPaymentMethod()}
                {currentStep === 4 && renderOrderReview()}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Back
                </motion.button>

                {currentStep < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="px-8 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-semibold"
                  >
                    Continue
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>{paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}</span>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-12 w-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm line-clamp-1">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.selectedSize} | {item.selectedColor} | Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
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
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Truck className="h-4 w-4 text-green-600" />
                  <span>Free shipping on orders above ₹2000</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span>100% secure payment</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-purple-600" />
                  <span>7-day easy returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;