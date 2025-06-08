export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  description: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
  address: Address;
  paymentMethod: 'cod' | 'upi' | 'card' | 'netbanking' | 'wallet' | 'razorpay';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentId?: string;
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  deliveryDate?: string;
  notes?: string;
  statusHistory: OrderStatusUpdate[];
}

export interface OrderStatusUpdate {
  status: Order['status'];
  timestamp: string;
  location?: string;
  notes?: string;
}

export interface Address {
  id?: string;
  type?: 'home' | 'office' | 'other';
  name?: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  phone?: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  role: 'customer' | 'admin';
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  preferences?: {
    newsletter: boolean;
    smsUpdates: boolean;
    emailUpdates: boolean;
    favoriteCategories: string[];
  };
  loyaltyPoints?: number;
  totalOrders?: number;
  totalSpent?: number;
  joinedAt: string;
  lastLoginAt?: string;
  isVerified: boolean;
  wishlist: string[]; // Product IDs
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface PaymentMethod {
  id: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet' | 'cod' | 'razorpay';
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  processingFee?: number;
  minAmount?: number;
  maxAmount?: number;
  supportedBanks?: string[];
  upiApps?: string[];
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: PaymentMethod['type'];
  returnUrl: string;
  webhookUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  transactionId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  message: string;
  redirectUrl?: string;
  qrCode?: string; // For UPI payments
  deepLink?: string; // For UPI app deep links
  expiresAt?: string;
}

export interface UPIPayment {
  vpa: string; // Virtual Payment Address
  payeeName: string;
  amount: number;
  transactionNote: string;
  transactionRef: string;
  qrCode: string;
  deepLinks: {
    gpay: string;
    phonepe: string;
    paytm: string;
    bhim: string;
    generic: string;
  };
}

export interface RazorpayPayment {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  currency: string;
  status: 'created' | 'authorized' | 'captured' | 'refunded' | 'failed';
  method: 'card' | 'netbanking' | 'wallet' | 'upi' | 'emi';
  bank?: string;
  wallet?: string;
  vpa?: string;
  cardType?: string;
  cardNetwork?: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  fee: number;
  tax: number;
  errorCode?: string;
  errorDescription?: string;
  createdAt: string;
  authorizedAt?: string;
  capturedAt?: string;
  refundedAt?: string;
  notes?: Record<string, string>;
  receipt?: string;
}

export interface RazorpayConfig {
  keyId: string;
  keySecret: string;
  webhookSecret: string;
  currency: string;
  companyName: string;
  companyLogo: string;
  themeColor: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  productCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  icon?: string;
  color?: string;
  sortOrder: number;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  bannerImage?: string;
  icon: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  isActive: boolean;
  isDefault: boolean;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  sortOrder: number;
  settings: {
    showBanner: boolean;
    showCountdown: boolean;
    enableSpecialOffers: boolean;
    customCSS?: string;
  };
}

export interface Story {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  gradient: string;
  isActive: boolean;
  sortOrder: number;
  linkType: 'category' | 'collection' | 'external' | 'none';
  linkValue?: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image: string;
  backgroundImage?: string;
  gradient: string;
  textColor: string;
  buttonText: string;
  buttonColor: string;
  isActive: boolean;
  sortOrder: number;
  linkType: 'category' | 'collection' | 'external' | 'none';
  linkValue?: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  endDate?: string;
  bannerType: 'hero' | 'promotional' | 'seasonal' | 'announcement';
  height: 'small' | 'medium' | 'large';
  position: 'top' | 'middle' | 'bottom';
  showIcon: boolean;
  icon?: string;
  discount?: {
    percentage: number;
    originalText: string;
    highlightText: string;
  };
}

export interface Filter {
  category: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  inStock: boolean;
}

export interface AdminStats {
  todayOrders: number;
  todayRevenue: number;
  totalProducts: number;
  lowStockItems: number;
  recentOrders: Order[];
  totalPayments: number;
  todayPayments: number;
  successfulPayments: number;
  failedPayments: number;
  totalRefunds: number;
}

export interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'delivery' | 'payment';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  orderId?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt: string;
}