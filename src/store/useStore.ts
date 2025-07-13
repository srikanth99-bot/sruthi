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
      categories: [],
      themes: [],
      stories: [],
      banners: [],
      filters: {
        categories: [],
        priceRange: [0, 10000],
        sizes: [],
        colors: [],
        sortBy: 'newest'
      },
      searchQuery: '',
      mobileMenuOpen: false,
      filterDrawerOpen: false,
      orders: [],
      selectedOrder: null,
      payments: [],
      notifications: [],
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

      // Auth actions
      login: async (credentials: LoginCredentials) => {
        // Mock implementation - replace with actual auth logic
        return false;
      },
      
      adminLogin: async (email: string, password: string) => {
        try {
          const result = await signInAsAdmin(email, password);
          if (result.success && result.user) {
            set({
              isAuthenticated: true,
              user: result.user,
              token: result.token
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Admin login failed:', error);
          return false;
        }
      },
      
      signup: async (data: SignupData) => {
        // Mock implementation - replace with actual auth logic
        return false;
      },
      
      logout: async () => {
        try {
          await signOut();
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null
          });
        } catch (error) {
          console.error('Logout failed:', error);
        }
      },
      
      updateProfile: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ user: { ...currentUser, ...updates } });
        }
      },
      
      addAddress: (address: Address) => {
        const currentUser = get().user;
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            addresses: [...(currentUser.addresses || []), address]
          };
          set({ user: updatedUser });
        }
      },
      
      updateAddress: (addressId: string, updates: Partial<Address>) => {
        const currentUser = get().user;
        if (currentUser && currentUser.addresses) {
          const updatedAddresses = currentUser.addresses.map(addr =>
            addr.id === addressId ? { ...addr, ...updates } : addr
          );
          set({ user: { ...currentUser, addresses: updatedAddresses } });
        }
      },
      
      deleteAddress: (addressId: string) => {
        const currentUser = get().user;
        if (currentUser && currentUser.addresses) {
          const updatedAddresses = currentUser.addresses.filter(addr => addr.id !== addressId);
          set({ user: { ...currentUser, addresses: updatedAddresses } });
        }
      },
      
      setDefaultAddress: (addressId: string) => {
        const currentUser = get().user;
        if (currentUser && currentUser.addresses) {
          const updatedAddresses = currentUser.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
          }));
          set({ user: { ...currentUser, addresses: updatedAddresses } });
        }
      },
      
      // Cart actions
      addToCart: (product: Product, size: string, color: string, quantity = 1) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          item => item.product.id === product.id && item.size === size && item.color === color
        );
        
        if (existingItem) {
          get().updateCartQuantity(product.id, size, color, existingItem.quantity + quantity);
        } else {
          const newItem: CartItem = {
            product,
            size,
            color,
            quantity
          };
          set({ cartItems: [...cartItems, newItem] });
        }
      },
      
      removeFromCart: (productId: string, size: string, color: string) => {
        const cartItems = get().cartItems;
        const updatedItems = cartItems.filter(
          item => !(item.product.id === productId && item.size === size && item.color === color)
        );
        set({ cartItems: updatedItems });
      },
      
      updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => {
        const cartItems = get().cartItems;
        const updatedItems = cartItems.map(item => {
          if (item.product.id === productId && item.size === size && item.color === color) {
            return { ...item, quantity };
          }
          return item;
        });
        set({ cartItems: updatedItems });
      },
      
      clearCart: () => {
        set({ cartItems: [] });
      },
      
      setCartOpen: (open: boolean) => {
        set({ cartOpen: open });
      },
      
      // Product actions
      loadProducts: async () => {
        try {
          set({ isLoadingProducts: true });
          const products = await productService.getProducts();
          set({ products, isLoadingProducts: false });
        } catch (error) {
          console.error('Failed to load products:', error);
          set({ isLoadingProducts: false });
        }
      },
      
      createProduct: async (product: Partial<Product>) => {
        try {
          const newProduct = await productService.createProduct(product);
          if (newProduct) {
            const products = get().products;
            set({ products: [...products, newProduct] });
          }
          return newProduct;
        } catch (error) {
          console.error('Failed to create product:', error);
          return null;
        }
      },
      
      updateProduct: async (id: string, updates: Partial<Product>) => {
        try {
          const updatedProduct = await productService.updateProduct(id, updates);
          if (updatedProduct) {
            const products = get().products;
            const updatedProducts = products.map(p => p.id === id ? updatedProduct : p);
            set({ products: updatedProducts });
          }
          return updatedProduct;
        } catch (error) {
          console.error('Failed to update product:', error);
          return null;
        }
      },
      
      deleteProduct: async (id: string) => {
        try {
          const success = await productService.deleteProduct(id);
          if (success) {
            const products = get().products;
            const updatedProducts = products.filter(p => p.id !== id);
            set({ products: updatedProducts });
          }
          return success;
        } catch (error) {
          console.error('Failed to delete product:', error);
          return false;
        }
      },
      
      setProducts: (products: Product[]) => {
        set({ products });
      },
      
      // Notification actions
      addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        const notifications = get().notifications;
        set({ notifications: [newNotification, ...notifications] });
      },
      
      markNotificationAsRead: (notificationId: string) => {
        const notifications = get().notifications;
        const updatedNotifications = notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        );
        set({ notifications: updatedNotifications });
      },
      
      clearNotifications: () => {
        set({ notifications: [] });
      },
      
      getUnreadNotificationCount: () => {
        const notifications = get().notifications;
        return notifications.filter(notification => !notification.isRead).length;
      },
      
      // Wishlist actions
      addToWishlist: (productId: string) => {
        const currentUser = get().user;
        if (currentUser) {
          const wishlist = currentUser.wishlist || [];
          if (!wishlist.includes(productId)) {
            const updatedUser = {
              ...currentUser,
              wishlist: [...wishlist, productId]
            };
            set({ user: updatedUser });
          }
        }
      },
      
      removeFromWishlist: (productId: string) => {
        const currentUser = get().user;
        if (currentUser && currentUser.wishlist) {
          const updatedWishlist = currentUser.wishlist.filter(id => id !== productId);
          const updatedUser = {
            ...currentUser,
            wishlist: updatedWishlist
          };
          set({ user: updatedUser });
        }
      },
      
      isInWishlist: (productId: string) => {
        const currentUser = get().user;
        return currentUser?.wishlist?.includes(productId) || false;
      },
      
      // Order actions
      createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => {
        const orderId = Date.now().toString();
        const newOrder: Order = {
          ...orderData,
          id: orderId,
          createdAt: new Date(),
          updatedAt: new Date(),
          statusHistory: [{
            status: orderData.status,
            timestamp: new Date(),
            notes: 'Order created'
          }]
        };
        const orders = get().orders;
        set({ orders: [...orders, newOrder] });
        return orderId;
      },
      
      getUserOrders: (userId: string) => {
        const orders = get().orders;
        return orders.filter(order => order.userId === userId);
      },
      
      getOrderById: (orderId: string) => {
        const orders = get().orders;
        return orders.find(order => order.id === orderId) || null;
      },
      
      updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => {
        const orders = get().orders;
        const updatedOrders = orders.map(order => {
          if (order.id === orderId) {
            const statusHistory = [...order.statusHistory, {
              status,
              timestamp: new Date(),
              notes: notes || `Status updated to ${status}`
            }];
            return {
              ...order,
              status,
              updatedAt: new Date(),
              statusHistory
            };
          }
          return order;
        });
        set({ orders: updatedOrders });
      },
      
      // Payment actions
      addPayment: (payment: RazorpayPayment) => {
        const payments = get().payments;
        set({ payments: [...payments, payment] });
      },
      
      updatePayment: (paymentId: string, updates: Partial<RazorpayPayment>) => {
        const payments = get().payments;
        const updatedPayments = payments.map(payment =>
          payment.id === paymentId ? { ...payment, ...updates } : payment
        );
        set({ payments: updatedPayments });
      },
      
      getPaymentById: (paymentId: string) => {
        const payments = get().payments;
        return payments.find(payment => payment.id === paymentId) || null;
      },
      
      getPaymentsByOrder: (orderId: string) => {
        const payments = get().payments;
        return payments.filter(payment => payment.orderId === orderId);
      },
      
      getAllPayments: () => {
        return get().payments;
      },
      
      getPaymentStats: () => {
        const payments = get().payments;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayPayments = payments.filter(payment => 
          new Date(payment.createdAt) >= today
        );
        
        return {
          total: payments.length,
          today: todayPayments.length,
          successful: payments.filter(p => p.status === 'captured').length,
          failed: payments.filter(p => p.status === 'failed').length,
          refunded: payments.filter(p => p.status === 'refunded').length,
          totalAmount: payments.reduce((sum, p) => sum + (p.amount || 0), 0),
          todayAmount: todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
        };
      },
      
      // Category actions
      setCategories: (categories: Category[]) => {
        set({ categories });
      },
      
      addCategory: (category: Category) => {
        const categories = get().categories;
        set({ categories: [...categories, category] });
      },
      
      updateCategory: (categoryId: string, updates: Partial<Category>) => {
        const categories = get().categories;
        const updatedCategories = categories.map(cat =>
          cat.id === categoryId ? { ...cat, ...updates } : cat
        );
        set({ categories: updatedCategories });
      },
      
      deleteCategory: (categoryId: string) => {
        const categories = get().categories;
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        set({ categories: updatedCategories });
      },
      
      // Theme actions
      setThemes: (themes: Theme[]) => {
        set({ themes });
      },
      
      addTheme: (theme: Theme) => {
        const themes = get().themes;
        set({ themes: [...themes, theme] });
      },
      
      updateTheme: (themeId: string, updates: Partial<Theme>) => {
        const themes = get().themes;
        const updatedThemes = themes.map(theme =>
          theme.id === themeId ? { ...theme, ...updates } : theme
        );
        set({ themes: updatedThemes });
      },
      
      deleteTheme: (themeId: string) => {
        const themes = get().themes;
        const updatedThemes = themes.filter(theme => theme.id !== themeId);
        set({ themes: updatedThemes });
      },
      
      setActiveTheme: (themeId: string) => {
        const themes = get().themes;
        const updatedThemes = themes.map(theme => ({
          ...theme,
          isActive: theme.id === themeId
        }));
        set({ themes: updatedThemes });
      },
      
      // Story actions
      setStories: (stories: Story[]) => {
        set({ stories });
      },
      
      addStory: (story: Story) => {
        const stories = get().stories;
        set({ stories: [...stories, story] });
      },
      
      updateStory: (storyId: string, updates: Partial<Story>) => {
        const stories = get().stories;
        const updatedStories = stories.map(story =>
          story.id === storyId ? { ...story, ...updates } : story
        );
        set({ stories: updatedStories });
      },
      
      deleteStory: (storyId: string) => {
        const stories = get().stories;
        const updatedStories = stories.filter(story => story.id !== storyId);
        set({ stories: updatedStories });
      },
      
      reorderStories: (stories: Story[]) => {
        set({ stories });
      },
      
      // Banner actions
      setBanners: (banners: Banner[]) => {
        set({ banners });
      },
      
      addBanner: (banner: Banner) => {
        const banners = get().banners;
        set({ banners: [...banners, banner] });
      },
      
      updateBanner: (bannerId: string, updates: Partial<Banner>) => {
        const banners = get().banners;
        const updatedBanners = banners.map(banner =>
          banner.id === bannerId ? { ...banner, ...updates } : banner
        );
        set({ banners: updatedBanners });
      },
      
      deleteBanner: (bannerId: string) => {
        const banners = get().banners;
        const updatedBanners = banners.filter(banner => banner.id !== bannerId);
        set({ banners: updatedBanners });
      },
      
      reorderBanners: (banners: Banner[]) => {
        set({ banners });
      },
      
      // Filter actions
      setFilters: (filters: Partial<Filter>) => {
        const currentFilters = get().filters;
        set({ filters: { ...currentFilters, ...filters } });
      },
      
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
      
      // UI actions
      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },
      
      setFilterDrawerOpen: (open: boolean) => {
        set({ filterDrawerOpen: open });
      },
      
      setOrders: (orders: Order[]) => {
        set({ orders });
      },
      
      setSelectedOrder: (order: Order | null) => {
        set({ selectedOrder: order });
      },
      
      setUser: (user: User) => {
        set({ user });
      },
      
      // Landing settings actions
      loadLandingSettings: async () => {
        try {
          const settings = await landingSettingsService.getLandingSettings();
          set({ landingSettings: settings });
        } catch (error) {
          console.error('Failed to load landing settings:', error);
        }
      },
      
      updateLandingSettings: async (settings: Partial<LandingSettings>) => {
        try {
          const updatedSettings = await landingSettingsService.updateLandingSettings(settings);
          set({ landingSettings: updatedSettings });
        } catch (error) {
          console.error('Failed to update landing settings:', error);
          throw error;
        }
      }

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