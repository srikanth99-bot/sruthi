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

// Load Razorpay script
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (orderData: {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}): Promise<any> => {
  try {
    // In production, this should call your backend API
    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error('Failed to create Razorpay order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    
    // Mock response for development
    return {
      id: 'order_' + Date.now(),
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
    };
  }
};

// Initialize Razorpay payment
export const initializeRazorpayPayment = async (
  order: Order,
  onSuccess: (response: any) => void,
  onFailure: (error: any) => void
): Promise<void> => {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    // Create Razorpay order
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

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Error initializing Razorpay payment:', error);
    onFailure(error);
  }
};

// Verify payment signature
export const verifyPaymentSignature = async (
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): Promise<boolean> => {
  try {
    // In production, this should call your backend API for verification
    const response = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature
      }),
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const result = await response.json();
    return result.verified === true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    // For development, return true
    return true;
  }
};

// Fetch payment details
export const fetchPaymentDetails = async (paymentId: string): Promise<any> => {
  try {
    const response = await fetch(`/api/razorpay/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch payment details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return null;
  }
};

// Create refund
export const createRefund = async (
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
): Promise<any> => {
  try {
    const response = await fetch('/api/razorpay/create-refund', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id: paymentId,
        amount: amount ? amount * 100 : undefined, // Amount in paise
        notes: notes || {}
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create refund');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating refund:', error);
    throw error;
  }
};