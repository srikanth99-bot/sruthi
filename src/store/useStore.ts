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
        category: '',
        priceRange: [0, 10000],
        colors: [],
        sizes: [],
        inStock: false,
        sortBy: 'newest'
      },
      searchQuery: '',
      mobileMenuOpen: false,
      filterDrawerOpen: false,
      landingSettings: null,
      orders: [],
      selectedOrder: null,
      payments: [],
      notifications: [],
      isLoadingProducts: false,
      isInitialized: false,
      getUnreadNotificationCount: () => {
        return get().notifications.filter(notification => !notification.isRead).length;
      },
      
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
      
      // Load products
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

      // Auth actions
      login: async (credentials: LoginCredentials) => {
        try {
          // Mock login implementation
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            name: 'User',
            phone: '',
            addresses: [],
            wishlist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set({
            isAuthenticated: true,
            user: mockUser,
            token: 'mock-token'
          });
          
          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      adminLogin: async (email: string, password: string) => {
        try {
          console.log('🔐 Admin login attempt:', { email, isSupabaseConfigured: isSupabaseConfigured() });
          
          if (isSupabaseConfigured()) {
            // Try Supabase authentication
            const result = await signInAsAdmin(email, password);
            if (result.success) {
              console.log('✅ Supabase admin login successful');
              return true;
            } else {
              console.log('❌ Supabase admin login failed:', result.error);
              return false;
            }
          }
          
          // Simple admin check
          if (email === 'admin@looom.shop' && password === 'admin123') {
            console.log('✅ Demo admin login successful');
            localStorage.setItem('adminSession', 'true');
            localStorage.setItem('adminSessionExpiry', (Date.now() + 8 * 60 * 60 * 1000).toString());
            return true;
          }
          
          console.log('❌ Demo admin login failed - invalid credentials');
          return false;
        } catch (error) {
          console.error('Admin login failed:', error);
          return false;
        }
      },

      signup: async (data: SignupData) => {
        try {
          // Mock signup implementation
          const mockUser: User = {
            id: Date.now().toString(),
            email: data.email,
            name: data.name,
            phone: data.phone || '',
            addresses: [],
            wishlist: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set({
            isAuthenticated: true,
            user: mockUser,
            token: 'mock-token'
          });
          
          return true;
        } catch (error) {
          console.error('Signup failed:', error);
          return false;
        }
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
          set({
            user: { ...currentUser, ...updates, updatedAt: new Date().toISOString() }
          });
        }
      },

      addAddress: (address: Address) => {
        const currentUser = get().user;
        if (currentUser) {
          const newAddress = { ...address, id: Date.now().toString() };
          set({
            user: {
              ...currentUser,
              addresses: [...currentUser.addresses, newAddress],
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      updateAddress: (addressId: string, updates: Partial<Address>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              addresses: currentUser.addresses.map(addr =>
                addr.id === addressId ? { ...addr, ...updates } : addr
              ),
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      deleteAddress: (addressId: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              addresses: currentUser.addresses.filter(addr => addr.id !== addressId),
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      setDefaultAddress: (addressId: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              addresses: currentUser.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
              })),
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      // Cart actions
      addToCart: (product: Product, size: string, color: string, quantity = 1) => {
        const cartItems = get().cartItems;
        const existingItem = cartItems.find(
          item => item.product.id === product.id && item.size === size && item.color === color
        );

        if (existingItem) {
          set({
            cartItems: cartItems.map(item =>
              item.product.id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          const newItem: CartItem = {
            id: `${product.id}-${size}-${color}`,
            product,
            size,
            color,
            quantity
          };
          set({ cartItems: [...cartItems, newItem] });
        }
      },

      removeFromCart: (productId: string, size: string, color: string) => {
        set({
          cartItems: get().cartItems.filter(
            item => !(item.product.id === productId && item.size === size && item.color === color)
          )
        });
      },

      updateCartQuantity: (productId: string, size: string, color: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }

        set({
          cartItems: get().cartItems.map(item =>
            item.product.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          )
        });
      },

      clearCart: () => {
        set({ cartItems: [] });
      },

      setCartOpen: (open: boolean) => {
        set({ cartOpen: open });
      },

      // Order actions
      createOrder: (orderData) => {
        const orderId = Date.now().toString();
        const newOrder: Order = {
          ...orderData,
          id: orderId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [{
            status: orderData.status,
            timestamp: new Date().toISOString(),
            notes: 'Order created'
          }]
        };

        set({
          orders: [...get().orders, newOrder]
        });

        return orderId;
      },

      getUserOrders: (userId: string) => {
        return get().orders.filter(order => order.userId === userId);
      },

      getOrderById: (orderId: string) => {
        return get().orders.find(order => order.id === orderId) || null;
      },

      updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => {
        set({
          orders: get().orders.map(order =>
            order.id === orderId
              ? {
                  ...order,
                  status,
                  updatedAt: new Date().toISOString(),
                  statusHistory: [
                    ...order.statusHistory,
                    {
                      status,
                      timestamp: new Date().toISOString(),
                      notes: notes || `Status updated to ${status}`
                    }
                  ]
                }
              : order
          )
        });
      },

      // Payment actions
      addPayment: (payment: RazorpayPayment) => {
        set({
          payments: [...get().payments, payment]
        });
      },

      updatePayment: (paymentId: string, updates: Partial<RazorpayPayment>) => {
        set({
          payments: get().payments.map(payment =>
            payment.id === paymentId ? { ...payment, ...updates } : payment
          )
        });
      },

      getPaymentById: (paymentId: string) => {
        return get().payments.find(payment => payment.id === paymentId) || null;
      },

      getPaymentsByOrder: (orderId: string) => {
        return get().payments.filter(payment => payment.orderId === orderId);
      },

      getAllPayments: () => {
        return get().payments;
      },

      getPaymentStats: () => {
        const payments = get().payments;
        const today = new Date().toDateString();
        
        const todayPayments = payments.filter(payment => 
          new Date(payment.createdAt).toDateString() === today
        );

        const successful = payments.filter(payment => payment.status === 'captured').length;
        const failed = payments.filter(payment => payment.status === 'failed').length;
        const refunded = payments.filter(payment => payment.status === 'refunded').length;

        const totalAmount = payments
          .filter(payment => payment.status === 'captured')
          .reduce((sum, payment) => sum + payment.amount, 0);

        const todayAmount = todayPayments
          .filter(payment => payment.status === 'captured')
          .reduce((sum, payment) => sum + payment.amount, 0);

        return {
          total: payments.length,
          today: todayPayments.length,
          successful,
          failed,
          refunded,
          totalAmount,
          todayAmount
        };
      },

      // Wishlist actions
      addToWishlist: (productId: string) => {
        const currentUser = get().user;
        if (currentUser && !currentUser.wishlist.includes(productId)) {
          set({
            user: {
              ...currentUser,
              wishlist: [...currentUser.wishlist, productId],
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      removeFromWishlist: (productId: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              wishlist: currentUser.wishlist.filter(id => id !== productId),
              updatedAt: new Date().toISOString()
            }
          });
        }
      },

      isInWishlist: (productId: string) => {
        const currentUser = get().user;
        return currentUser ? currentUser.wishlist.includes(productId) : false;
      },

      // Notification actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString()
        };
        set({
          notifications: [newNotification, ...get().notifications]
        });
      },

      markNotificationAsRead: (notificationId: string) => {
        set({
          notifications: get().notifications.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },

      getUnreadNotificationCount: () => {
        return get().notifications.filter(notification => !notification.read).length;
      },

      // Product actions
      createProduct: async (product: Partial<Product>) => {
        try {
          const newProduct = await productService.createProduct(product);
          if (newProduct) {
            set({
              products: [...get().products, newProduct]
            });
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
            set({
              products: get().products.map(product =>
                product.id === id ? updatedProduct : product
              )
            });
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
            set({
              products: get().products.filter(product => product.id !== id)
            });
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

      // Category actions
      setCategories: (categories: Category[]) => {
        set({ categories });
      },

      addCategory: (category: Category) => {
        set({
          categories: [...get().categories, category]
        });
      },

      updateCategory: (categoryId: string, updates: Partial<Category>) => {
        set({
          categories: get().categories.map(category =>
            category.id === categoryId ? { ...category, ...updates } : category
          )
        });
      },

      deleteCategory: (categoryId: string) => {
        set({
          categories: get().categories.filter(category => category.id !== categoryId)
        });
      },

      // Theme actions
      setThemes: (themes: Theme[]) => {
        set({ themes });
      },

      addTheme: (theme: Theme) => {
        set({
          themes: [...get().themes, theme]
        });
      },

      updateTheme: (themeId: string, updates: Partial<Theme>) => {
        set({
          themes: get().themes.map(theme =>
            theme.id === themeId ? { ...theme, ...updates } : theme
          )
        });
      },

      deleteTheme: (themeId: string) => {
        set({
          themes: get().themes.filter(theme => theme.id !== themeId)
        });
      },

      setActiveTheme: (themeId: string) => {
        set({
          themes: get().themes.map(theme => ({
            ...theme,
            isActive: theme.id === themeId
          }))
        });
      },

      // Story actions
      setStories: (stories: Story[]) => {
        set({ stories });
      },

      addStory: (story: Story) => {
        set({
          stories: [...get().stories, story]
        });
      },

      updateStory: (storyId: string, updates: Partial<Story>) => {
        set({
          stories: get().stories.map(story =>
            story.id === storyId ? { ...story, ...updates } : story
          )
        });
      },

      deleteStory: (storyId: string) => {
        set({
          stories: get().stories.filter(story => story.id !== storyId)
        });
      },

      reorderStories: (stories: Story[]) => {
        set({ stories });
      },

      // Banner actions
      setBanners: (banners: Banner[]) => {
        set({ banners });
      },

      addBanner: (banner: Banner) => {
        set({
          banners: [...get().banners, banner]
        });
      },

      updateBanner: (bannerId: string, updates: Partial<Banner>) => {
        set({
          banners: get().banners.map(banner =>
            banner.id === bannerId ? { ...banner, ...updates } : banner
          )
        });
      },

      deleteBanner: (bannerId: string) => {
        set({
          banners: get().banners.filter(banner => banner.id !== bannerId)
        });
      },

      reorderBanners: (banners: Banner[]) => {
        set({ banners });
      },

      // Filter and search actions
      setFilters: (filters: Partial<Filter>) => {
        set({
          filters: { ...get().filters, ...filters }
        });
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