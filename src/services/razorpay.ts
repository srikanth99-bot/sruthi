import type { RazorpayConfig, RazorpayPayment, Order } from '../types';

// Razorpay configuration
export const razorpayConfig: RazorpayConfig = {
  keyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
  keySecret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'your_key_secret',
  webhookSecret: import.meta.env.VITE_RAZORPAY_WEBHOOK_SECRET || 'your_webhook_secret',
  currency: 'INR',
  companyName: 'looom.shop',
  companyLogo: '/logo.png',
  themeColor: '#8B5CF6'
};

// Load Razorpay script with timeout and error handling
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (typeof (window as any).Razorpay !== 'undefined') {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    
    // Set timeout for script loading
    const timeout = setTimeout(() => {
      console.warn('Razorpay script loading timeout');
      resolve(false);
    }, 10000); // 10 seconds timeout

    script.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    
    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('Failed to load Razorpay script:', error);
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// Create Razorpay order (mock implementation for development)
export const createRazorpayOrder = async (orderData: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<any> => {
  // For development, return mock response immediately
  // In production, this would make an API call to your backend
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'order_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        entity: 'order',
        amount: orderData.amount,
        amount_paid: 0,
        amount_due: orderData.amount,
        currency: orderData.currency,
        receipt: orderData.receipt,
        status: 'created',
        attempts: 0,
        notes: orderData.notes || {},
        created_at: Math.floor(Date.now() / 1000)
      });
    }, 500); // Simulate API delay
  });
};

// Mock payment simulation for development
const simulatePayment = (
  options: any,
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
): void => {
  // Create a mock payment dialog
  const confirmed = window.confirm(
    `Mock Payment Simulation\n\n` +
    `Amount: ₹${(options.amount / 100).toLocaleString()}\n` +
    `Order ID: ${options.order_id}\n` +
    `Merchant: ${options.name}\n\n` +
    `Click OK to simulate successful payment, Cancel to simulate failure.`
  );

  setTimeout(() => {
    if (confirmed) {
      // Simulate successful payment
      const mockResponse = {
        razorpay_order_id: options.order_id,
        razorpay_payment_id: 'pay_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        razorpay_signature: 'mock_signature_' + Date.now()
      };
      onSuccess(mockResponse);
    } else {
      // Simulate payment failure
      onFailure({ error: 'Payment cancelled by user' });
    }
  }, 1000); // Simulate processing time
};

// Initialize Razorpay payment with fallback
export const initializeRazorpayPayment = async (
  order: Order,
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  try {
    // Create Razorpay order first
    const razorpayOrder = await createRazorpayOrder({
      amount: order.total * 100, // Amount in paise
      currency: razorpayConfig.currency,
      receipt: order.id,
      notes: {
        orderId: order.id,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone
      }
    });

    const options = {
      key: razorpayConfig.keyId,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: razorpayConfig.companyName,
      description: `Payment for Order #${order.id}`,
      image: razorpayConfig.companyLogo,
      order_id: razorpayOrder.id,
      handler: function (response: any) {
        // Payment successful
        onSuccess({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          order: razorpayOrder
        });
      },
      prefill: {
        name: order.customerName,
        email: order.customerEmail,
        contact: order.customerPhone
      },
      notes: razorpayOrder.notes,
      theme: {
        color: razorpayConfig.themeColor
      },
      modal: {
        ondismiss: function() {
          onFailure({ error: 'Payment cancelled by user' });
        }
      }
    };

    // Try to load Razorpay script
    const isLoaded = await loadRazorpayScript();
    
    if (isLoaded && typeof (window as any).Razorpay !== 'undefined') {
      // Use real Razorpay if available
      try {
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } catch (razorpayError) {
        console.warn('Razorpay initialization failed, falling back to mock payment:', razorpayError);
        // Fallback to mock payment
        simulatePayment(options, onSuccess, onFailure);
      }
    } else {
      // Fallback to mock payment if Razorpay script fails to load
      console.warn('Razorpay script not available, using mock payment simulation');
      simulatePayment(options, onSuccess, onFailure);
    }
  } catch (error) {
    console.error('Error initializing payment:', error);
    onFailure({ error: 'Payment initialization failed' });
  }
};

// Verify payment signature (mock implementation for development)
export const verifyPaymentSignature = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> => {
  try {
    // In production, this should call your backend API for verification
    // For development, we'll simulate verification
    console.log('Verifying payment signature:', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For development, always return true
    // In production, implement proper signature verification
    return true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    // For development, return true to allow testing
    return true;
  }
};

// Fetch payment details (mock implementation)
export const fetchPaymentDetails = async (paymentId: string): Promise<any> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock payment details
    return {
      id: paymentId,
      amount: 100000, // Amount in paise
      currency: 'INR',
      status: 'captured',
      method: 'card',
      created_at: Math.floor(Date.now() / 1000)
    };
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return null;
  }
};

// Create refund (mock implementation)
export const createRefund = async (
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
): Promise<any> => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock refund response
    return {
      id: 'rfnd_' + Date.now(),
      payment_id: paymentId,
      amount: amount || 100000,
      currency: 'INR',
      status: 'processed',
      notes: notes || {},
      created_at: Math.floor(Date.now() / 1000)
    };
  } catch (error) {
    console.error('Error creating refund:', error);
    throw error;
  }
};

// Utility function to check if we're in development mode
export const isDevelopmentMode = (): boolean => {
  return import.meta.env.DEV || window.location.hostname === 'localhost';
};

// Show development notice
if (isDevelopmentMode()) {
  console.log(
    '%c🔧 Development Mode: Razorpay Integration',
    'background: #8B5CF6; color: white; padding: 8px 12px; border-radius: 4px; font-weight: bold;',
    '\n\nRazorpay is running in development mode with mock responses.\n' +
    'To use real Razorpay:\n' +
    '1. Add your Razorpay keys to .env file\n' +
    '2. Set up backend APIs for order creation and verification\n' +
    '3. Update the service to use real API endpoints\n\n' +
    'Current mock features:\n' +
    '✓ Order creation simulation\n' +
    '✓ Payment flow simulation\n' +
    '✓ Success/failure handling\n' +
    '✓ Fallback when Razorpay script fails to load'
  );
}