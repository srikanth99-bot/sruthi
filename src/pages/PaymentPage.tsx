import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CreditCard, 
  Smartphone,
  Building,
  Wallet,
  Check,
  Shield,
  Clock,
  Copy,
  ExternalLink,
  QrCode,
  AlertCircle,
  CheckCircle,
  Loader,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { PaymentMethod, UPIPayment } from '../types';

interface PaymentPageProps {
  orderId: string;
  amount: number;
  onBack: () => void;
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentFailure: (error: string) => void;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ 
  orderId, 
  amount, 
  onBack, 
  onPaymentSuccess, 
  onPaymentFailure 
}) => {
  const { user } = useStore();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod['type']>('upi');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [upiPayment, setUpiPayment] = useState<UPIPayment | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [vpaInput, setVpaInput] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'upi',
      type: 'upi',
      name: 'UPI Payment',
      description: 'Pay using Google Pay, PhonePe, Paytm, BHIM',
      icon: '📱',
      isActive: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 100000,
      upiApps: ['gpay', 'phonepe', 'paytm', 'bhim']
    },
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay, American Express',
      icon: '💳',
      isActive: true,
      processingFee: 2.5,
      minAmount: 1,
      maxAmount: 500000
    },
    {
      id: 'netbanking',
      type: 'netbanking',
      name: 'Net Banking',
      description: 'All major banks supported',
      icon: '🏦',
      isActive: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 200000,
      supportedBanks: ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB']
    },
    {
      id: 'wallet',
      type: 'wallet',
      name: 'Digital Wallets',
      description: 'Paytm, Mobikwik, Amazon Pay',
      icon: '👛',
      isActive: true,
      processingFee: 1.5,
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'cod',
      type: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: '💵',
      isActive: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 10000
    }
  ];

  useEffect(() => {
    if (paymentStatus === 'processing' && selectedMethod === 'upi' && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [paymentStatus, selectedMethod, countdown]);

  const generateUPIPayment = (): UPIPayment => {
    const transactionRef = `TXN${Date.now()}`;
    const vpa = 'merchant@paytm'; // Your merchant VPA
    const payeeName = 'looom.shop';
    const transactionNote = `Payment for Order ${orderId}`;
    
    const upiString = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`;
    
    return {
      vpa,
      payeeName,
      amount,
      transactionNote,
      transactionRef,
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`,
      deepLinks: {
        gpay: `tez://upi/pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`,
        phonepe: `phonepe://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`,
        paytm: `paytmmp://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`,
        bhim: `bhim://pay?pa=${vpa}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}&tr=${transactionRef}`,
        generic: upiString
      }
    };
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');

    try {
      if (selectedMethod === 'upi') {
        const upiData = generateUPIPayment();
        setUpiPayment(upiData);
        setCountdown(300); // Reset countdown
        
        // Simulate payment verification after some time
        setTimeout(() => {
          // In real implementation, you would poll your backend for payment status
          const isSuccess = Math.random() > 0.3; // 70% success rate for demo
          if (isSuccess) {
            setPaymentStatus('success');
            onPaymentSuccess(upiData.transactionRef);
          } else {
            setPaymentStatus('failed');
            onPaymentFailure('Payment verification failed. Please try again.');
          }
        }, 10000); // 10 seconds for demo
        
      } else if (selectedMethod === 'cod') {
        // COD is always successful
        setTimeout(() => {
          setPaymentStatus('success');
          onPaymentSuccess('COD_' + Date.now());
        }, 2000);
        
      } else {
        // Simulate other payment methods
        setTimeout(() => {
          const isSuccess = Math.random() > 0.2; // 80% success rate
          if (isSuccess) {
            setPaymentStatus('success');
            onPaymentSuccess('PAY_' + Date.now());
          } else {
            setPaymentStatus('failed');
            onPaymentFailure('Payment failed. Please try again.');
          }
        }, 3000);
      }
    } catch (error) {
      setPaymentStatus('failed');
      onPaymentFailure('Payment processing error. Please try again.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <motion.div
      key={method.id}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => setSelectedMethod(method.type)}
      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
        selectedMethod === method.type
          ? 'border-purple-500 bg-purple-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-3xl">{method.icon}</div>
          <div>
            <h4 className="font-bold text-gray-900">{method.name}</h4>
            <p className="text-gray-600 text-sm">{method.description}</p>
            {method.processingFee && method.processingFee > 0 && (
              <p className="text-orange-600 text-xs mt-1">
                Processing fee: {method.processingFee}%
              </p>
            )}
          </div>
        </div>
        {selectedMethod === method.type && (
          <Check className="h-6 w-6 text-purple-600" />
        )}
      </div>
    </motion.div>
  );

  const renderUPIPayment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">UPI Payment</h3>
        <p className="text-gray-600">Scan QR code or use UPI apps to pay</p>
        {countdown > 0 && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            <Clock className="h-4 w-4 text-orange-500" />
            <span className="text-orange-600 font-medium">
              Time remaining: {formatTime(countdown)}
            </span>
          </div>
        )}
      </div>

      {upiPayment && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* QR Code */}
          <div className="text-center">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 inline-block">
              <img
                src={upiPayment.qrCode}
                alt="UPI QR Code"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Scan with any UPI app to pay ₹{amount.toLocaleString()}
            </p>
          </div>

          {/* UPI Apps */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Pay with UPI Apps</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Google Pay', key: 'gpay', color: 'bg-blue-500', icon: '🔵' },
                { name: 'PhonePe', key: 'phonepe', color: 'bg-purple-500', icon: '🟣' },
                { name: 'Paytm', key: 'paytm', color: 'bg-blue-600', icon: '🔷' },
                { name: 'BHIM', key: 'bhim', color: 'bg-orange-500', icon: '🟠' }
              ].map((app) => (
                <motion.button
                  key={app.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.open(upiPayment.deepLinks[app.key as keyof typeof upiPayment.deepLinks], '_blank')}
                  className={`p-4 ${app.color} text-white rounded-xl font-semibold flex items-center justify-center space-x-2`}
                >
                  <span>{app.icon}</span>
                  <span>{app.name}</span>
                </motion.button>
              ))}
            </div>

            {/* Manual VPA Entry */}
            <div className="mt-6">
              <h5 className="font-medium text-gray-900 mb-3">Or enter UPI ID manually</h5>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Pay to:</span>
                  <span className="font-mono font-bold">{upiPayment.vpa}</span>
                  <button
                    onClick={() => copyToClipboard(upiPayment.vpa)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Copy className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-bold">₹{amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status */}
      <div className="text-center">
        {paymentStatus === 'processing' && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Loader className="h-5 w-5 animate-spin" />
            <span>Waiting for payment confirmation...</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  const renderCardPayment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-gray-900">Card Payment</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            placeholder="1234 5678 9012 3456"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Expiry Date
          </label>
          <input
            type="text"
            value={cardDetails.expiry}
            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
            placeholder="MM/YY"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVV
          </label>
          <input
            type="text"
            value={cardDetails.cvv}
            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
            placeholder="123"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-3">
        <Shield className="h-6 w-6 text-blue-600" />
        <div>
          <h4 className="font-semibold text-blue-900">Secure Payment</h4>
          <p className="text-blue-700 text-sm">Your card details are encrypted and secure</p>
        </div>
      </div>
    </motion.div>
  );

  const renderCODPayment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-6"
    >
      <div className="text-6xl">💵</div>
      <h3 className="text-xl font-bold text-gray-900">Cash on Delivery</h3>
      <p className="text-gray-600">
        Pay ₹{amount.toLocaleString()} when your order is delivered to your doorstep
      </p>
      
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h4 className="font-semibold text-green-900 mb-2">What to expect:</h4>
        <ul className="text-green-700 text-sm space-y-1 text-left">
          <li>• Our delivery partner will collect the payment</li>
          <li>• Please keep exact change ready</li>
          <li>• You can inspect the product before payment</li>
          <li>• COD available for orders up to ₹10,000</li>
        </ul>
      </div>
    </motion.div>
  );

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
                <h1 className="text-xl font-bold text-gray-900">Payment</h1>
                <p className="text-sm text-gray-500">Order #{orderId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Payment Amount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white text-center mb-8"
        >
          <h2 className="text-3xl font-black mb-2">₹{amount.toLocaleString()}</h2>
          <p className="opacity-90">Total Amount to Pay</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Choose Payment Method</h3>
            <div className="space-y-4">
              {paymentMethods.filter(method => method.isActive).map(renderPaymentMethod)}
            </div>
          </div>

          {/* Payment Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              <AnimatePresence mode="wait">
                {paymentStatus === 'idle' && (
                  <motion.div
                    key="payment-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {selectedMethod === 'upi' && renderUPIPayment()}
                    {selectedMethod === 'card' && renderCardPayment()}
                    {selectedMethod === 'cod' && renderCODPayment()}
                    {selectedMethod === 'netbanking' && (
                      <div className="text-center">
                        <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Net Banking</h3>
                        <p className="text-gray-600">You will be redirected to your bank's website</p>
                      </div>
                    )}
                    {selectedMethod === 'wallet' && (
                      <div className="text-center">
                        <Wallet className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Digital Wallet</h3>
                        <p className="text-gray-600">Choose your preferred wallet</p>
                      </div>
                    )}

                    {/* Pay Button */}
                    <div className="mt-8">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handlePayment}
                        disabled={paymentStatus === 'processing'}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-2xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {selectedMethod === 'cod' ? 'Confirm Order' : `Pay ₹${amount.toLocaleString()}`}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {paymentStatus === 'processing' && selectedMethod === 'upi' && (
                  <motion.div
                    key="upi-processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {renderUPIPayment()}
                  </motion.div>
                )}

                {paymentStatus === 'processing' && selectedMethod !== 'upi' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <Loader className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-spin" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment</h3>
                    <p className="text-gray-600">Please wait while we process your payment...</p>
                  </motion.div>
                )}

                {paymentStatus === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                    <p className="text-gray-600">Your order has been confirmed and will be processed shortly.</p>
                  </motion.div>
                )}

                {paymentStatus === 'failed' && (
                  <motion.div
                    key="failed"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="text-center py-12"
                  >
                    <AlertCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
                    <p className="text-gray-600 mb-6">There was an issue processing your payment. Please try again.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setPaymentStatus('idle');
                        setUpiPayment(null);
                        setCountdown(300);
                      }}
                      className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors flex items-center space-x-2 mx-auto"
                    >
                      <RefreshCw className="h-4 w-4" />
                      <span>Try Again</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
        >
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <h4 className="font-bold text-gray-900">Your payment is secure</h4>
              <p className="text-gray-600 text-sm">
                We use industry-standard encryption to protect your payment information. 
                Your card details are never stored on our servers.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;