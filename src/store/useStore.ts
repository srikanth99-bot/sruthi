import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productService } from '../services/productService';
import { isSupabaseConfigured, initializeSupabase, signInAsAdmin, signOut } from '../lib/supabase';
import { landingSettingsService } from '../services/landingSettingsService';
import type { 
  Product, 
  CartItem, 
  User, 
  Order, 
  Filter, 
  Category, 
  Theme, 
  Story, 
  Banner,
  AuthState,
  LoginCredentials,
  SignupData,
  Address,
  Notification,
  RazorpayPayment,
  LandingSettings
} from '../types';

interface StoreState extends AuthState {
  // Cart state
  cartItems: CartItem[];
  cartOpen: boolean;
  
  // Products state
  products: Product[];
  categories: Category[];
  themes: Theme[];
  stories: Story[];
  banners: Banner[];
  filters: Filter;
  searchQuery: string;
  
  // UI state
  mobileMenuOpen: boolean;
  filterDrawerOpen: boolean;
  
  // Landing page settings
  landingSettings: LandingSettings | null;
  
  // Admin state
  orders: Order[];
  selectedOrder: Order | null;
  payments: RazorpayPayment[];
  
  // Notifications
  notifications: Notification[];
  
  // Loading states
  isLoadingProducts: boolean;
  isInitialized: boolean;
  
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
  addAddress: (address: Address) => void;
  updateAddress: (addressId: string, updates: Partial<Address>) => void;
  deleteAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  
  // Cart actions
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  // Order actions
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => string;
  getUserOrders: (userId: string) => Order[];
  getOrderById: (orderId: string) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => void;
  
  // Payment actions
  addPayment: (payment: RazorpayPayment) => void;
  updatePayment: (paymentId: string, updates: Partial<RazorpayPayment>) => void;
  getPaymentById: (paymentId: string) => RazorpayPayment | null;
  getPaymentsByOrder: (orderId: string) => RazorpayPayment[];
  getAllPayments: () => RazorpayPayment[];
  getPaymentStats: () => {
    total: number;
    today: number;
    successful: number;
    failed: number;
    refunded: number;
    totalAmount: number;
    todayAmount: number;
  };
  
  // Wishlist actions
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationCount: () => number;
  
  // Product actions
  initializeApp: () => Promise<void>;
  loadProducts: () => Promise<void>;
  createProduct: (product: Partial<Product>) => Promise<Product | null>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<boolean>;
  setProducts: (products: Product[]) => void;
  
  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (categoryId: string, updates: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  
  setThemes: (themes: Theme[]) => void;
  addTheme: (theme: Theme) => void;
  updateTheme: (themeId: string, updates: Partial<Theme>) => void;
  deleteTheme: (themeId: string) => void;
  setActiveTheme: (themeId: string) => void;
  
  setStories: (stories: Story[]) => void;
  addStory: (story: Story) => void;
  updateStory: (storyId: string, updates: Partial<Story>) => void;
  deleteStory: (storyId: string) => void;
  reorderStories: (stories: Story[]) => void;
  
  setBanners: (banners: Banner[]) => void;
  addBanner: (banner: Banner) => void;
  updateBanner: (bannerId: string, updates: Partial<Banner>) => void;
  deleteBanner: (bannerId: string) => void;
  reorderBanners: (banners: Banner[]) => void;
  
  setFilters: (filters: Partial<Filter>) => void;
  setSearchQuery: (query: string) => void;
  
  setMobileMenuOpen: (open: boolean) => void;
  setFilterDrawerOpen: (open: boolean) => void;
  
  setOrders: (orders: Order[]) => void;
  
  // Landing settings actions
  loadLandingSettings: () => Promise<void>;
  updateLandingSettings: (settings: Partial<LandingSettings>) => Promise<void>;
  
  setSelectedOrder: (order: Order | null) => void;
  setUser: (user: User) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial auth state
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      
      // Initial state
      cartItems: [],
      cartOpen: false,
      products: [],
      isLoadingProducts: false,
      isInitialized: false,
      landingSettings: null,
      
      // Initialize app
      initializeApp: async () => {
        if (get().isInitialized) return;
        
        console.log('🚀 Initializing looom.shop...');
        
        try {
          // Initialize Supabase connection
          const supabaseConnected = await initializeSupabase();
          
          // Load products
          await get().loadProducts();
          
          // Load landing settings
          await get().loadLandingSettings();
          
          set({ isInitialized: true });
          
          console.log('✅ App initialized successfully');
        } catch (error) {
          console.error('❌ App initialization failed:', error);
          set({ isInitialized: true }); // Still mark as initialized to prevent infinite loops
        }
      },

      // ... rest of the implementation remains exactly the same ...

    }),
    {
      name: 'ikkat-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        cartItems: state.cartItems,
        categories: state.categories,
        themes: state.themes,
        stories: state.stories,
        landingSettings: state.landingSettings,
        banners: state.banners,
        orders: state.orders,
        payments: state.payments,
        notifications: state.notifications,
      }),
    }
  )
);