import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { productService } from '../services/productService';
import { isSupabaseConfigured, initializeSupabase, signInAsAdmin, signOut } from '../lib/supabase';
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
  RazorpayPayment
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
      categories: [
        {
          id: 'cat_1',
          name: 'Sarees',
          slug: 'sarees',
          image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
          description: 'Traditional handwoven sarees',
          autoDescription: 'Exquisite handwoven sarees crafted with traditional techniques, featuring intricate patterns and premium quality fabrics. Perfect for special occasions and cultural celebrations.',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👗',
          color: '#8B5CF6',
          sortOrder: 1,
          level: 0
        },
        {
          id: 'cat_2',
          name: 'Frocks',
          slug: 'frocks',
          image: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
          description: 'Comfortable and stylish frocks',
          autoDescription: 'Comfortable and stylish frocks perfect for daily wear and special occasions. Made with premium fabrics and modern designs.',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👚',
          color: '#EC4899',
          sortOrder: 2,
          level: 0
        },
        {
          id: 'cat_3',
          name: 'Dress Materials',
          slug: 'dress-materials',
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
          description: 'Premium dress materials',
          autoDescription: 'Premium dress materials with matching accessories. Perfect for custom tailoring and creating your unique style.',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '🧵',
          color: '#10B981',
          sortOrder: 3,
          level: 0
        },
        {
          id: 'cat_4',
          name: 'Kurtas',
          slug: 'kurtas',
          image: 'https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg',
          description: 'Elegant kurtas for all occasions',
          autoDescription: 'Elegant kurtas designed for comfort and style. Perfect for office wear, casual outings, and semi-formal occasions.',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👘',
          color: '#F59E0B',
          sortOrder: 4,
          level: 0
        },
        {
          id: 'cat_5',
          name: 'Blouses',
          slug: 'blouses',
          image: 'https://images.pexels.com/photos/8100786/pexels-photo-8100786.jpeg',
          description: 'Beautiful blouses to pair with sarees',
          autoDescription: 'Beautiful blouses crafted to perfectly complement your sarees. Available in various designs, sizes, and colors.',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👕',
          color: '#8B5CF6',
          sortOrder: 5,
          level: 0
        },
        {
          id: 'cat_6',
          name: 'Lehengas',
          slug: 'lehengas',
          image: 'https://images.pexels.com/photos/8100783/pexels-photo-8100783.jpeg',
          description: 'Stunning lehengas for special occasions',
          autoDescription: 'Stunning lehengas perfect for weddings, festivals, and special celebrations. Complete sets with blouse, lehenga, and dupatta.',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👑',
          color: '#DC2626',
          sortOrder: 6,
          level: 0
        }
      ],
      themes: [
        {
          id: 'theme_1',
          name: 'Festival Collection',
          slug: 'festival-collection',
          description: 'Vibrant colors and festive designs for celebrations',
          image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
          bannerImage: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
          icon: '🎉',
          colors: {
            primary: '#8B5CF6',
            secondary: '#EC4899',
            accent: '#F59E0B',
            background: '#FEF3C7',
            text: '#1F2937'
          },
          isActive: true,
          isDefault: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          sortOrder: 1,
          settings: {
            showBanner: true,
            showCountdown: false,
            enableSpecialOffers: true
          }
        }
      ],
      stories: [
        {
          id: 'story_1',
          title: 'New Collection',
          subtitle: 'Latest Arrivals',
          image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
          gradient: 'from-purple-600 to-pink-600',
          isActive: true,
          sortOrder: 1,
          linkType: 'category',
          linkValue: 'new-arrivals',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ],
      banners: [
        {
          id: 'banner_1',
          title: 'Up to 70% OFF',
          subtitle: 'HOT DEAL',
          description: 'On premium Ikkat collection',
          image: '',
          gradient: 'from-purple-600 via-pink-600 to-red-500',
          textColor: 'text-white',
          buttonText: 'Shop Now',
          buttonColor: 'bg-white text-purple-600',
          isActive: true,
          sortOrder: 1,
          linkType: 'collection',
          linkValue: 'sale',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          bannerType: 'promotional',
          height: 'medium',
          position: 'top',
          showIcon: true,
          icon: '🔥'
        }
      ],
      filters: {
        category: [],
        priceRange: [0, 10000],
        sizes: [],
        colors: [],
        inStock: true,
      },
      searchQuery: '',
      mobileMenuOpen: false,
      filterDrawerOpen: false,
      orders: [],
      selectedOrder: null,
      payments: [],
      notifications: [],

      // Initialize app
      initializeApp: async () => {
        if (get().isInitialized) return;
        
        console.log('🚀 Initializing looom.shop...');
        
        try {
          // Initialize Supabase connection
          const supabaseConnected = await initializeSupabase();
          
          // Load products
          await get().loadProducts();
          
          set({ isInitialized: true });
          
          console.log('✅ App initialized successfully');
        } catch (error) {
          console.error('❌ App initialization failed:', error);
          set({ isInitialized: true }); // Still mark as initialized to prevent infinite loops
        }
      },

      // Product actions
      loadProducts: async () => {
        set({ isLoadingProducts: true });
        try {
          const products = await productService.getProducts();
          set({ products, isLoadingProducts: false });
          
          // Show connection status
          if (isSupabaseConfigured()) {
            get().addNotification({
              type: 'system',
              title: 'Database Connected',
              message: `Loaded ${products.length} products from Supabase database`,
              isRead: false
            });
          } else {
            get().addNotification({
              type: 'system',
              title: 'Using Demo Data',
              message: 'Connect to Supabase to enable real database functionality',
              isRead: false
            });
          }
        } catch (error) {
          console.error('Error loading products:', error);
          set({ isLoadingProducts: false });
          get().addNotification({
            type: 'system',
            title: 'Error Loading Products',
            message: 'Failed to load products from database',
            isRead: false
          });
        }
      },

      createProduct: async (product: Partial<Product>) => {
        try {
          const newProduct = await productService.createProduct(product);
          if (newProduct) {
            set({ products: [...get().products, newProduct] });
            get().addNotification({
              type: 'system',
              title: 'Product Created',
              message: `${newProduct.name} has been added successfully`,
              isRead: false
            });
          }
          return newProduct;
        } catch (error) {
          console.error('Error creating product:', error);
          get().addNotification({
            type: 'system',
            title: 'Error Creating Product',
            message: error instanceof Error ? error.message : 'Failed to create product. Please try again.',
            isRead: false
          });
          throw error;
        }
      },

      updateProduct: async (id: string, updates: Partial<Product>) => {
        try {
          const updatedProduct = await productService.updateProduct(id, updates);
          if (updatedProduct) {
            set({
              products: get().products.map(p => p.id === id ? updatedProduct : p)
            });
            get().addNotification({
              type: 'system',
              title: 'Product Updated',
              message: `${updatedProduct.name} has been updated successfully`,
              isRead: false
            });
          }
          return updatedProduct;
        } catch (error) {
          console.error('Error updating product:', error);
          get().addNotification({
            type: 'system',
            title: 'Error Updating Product',
            message: error instanceof Error ? error.message : 'Failed to update product. Please try again.',
            isRead: false
          });
          throw error;
        }
      },

      deleteProduct: async (id: string) => {
        try {
          const success = await productService.deleteProduct(id);
          if (success) {
            const product = get().products.find(p => p.id === id);
            set({
              products: get().products.filter(p => p.id !== id)
            });
            get().addNotification({
              type: 'system',
              title: 'Product Deleted',
              message: `${product?.name || 'Product'} has been deleted successfully`,
              isRead: false
            });
          }
          return success;
        } catch (error) {
          console.error('Error deleting product:', error);
          get().addNotification({
            type: 'system',
            title: 'Error Deleting Product',
            message: error instanceof Error ? error.message : 'Failed to delete product. Please try again.',
            isRead: false
          });
          throw error;
        }
      },

      // Auth actions
      login: async (credentials: LoginCredentials) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock user data
          const mockUser: User = {
            id: 'user_1',
            name: 'Priya Sharma',
            email: credentials.email,
            phone: '+91 9876543210',
            role: 'customer',
            addresses: [
              {
                id: 'addr_1',
                type: 'home',
                name: 'Priya Sharma',
                street: '123 MG Road',
                city: 'Bangalore',
                state: 'Karnataka',
                pincode: '560001',
                phone: '+91 9876543210',
                isDefault: true
              }
            ],
            preferences: {
              newsletter: true,
              smsUpdates: true,
              emailUpdates: true,
              favoriteCategories: ['sarees', 'kurtas']
            },
            loyaltyPoints: 250,
            totalOrders: 5,
            totalSpent: 12500,
            joinedAt: '2024-01-01T00:00:00Z',
            lastLoginAt: new Date().toISOString(),
            isVerified: true,
            wishlist: []
          };

          set({
            isAuthenticated: true,
            user: mockUser,
            token: 'mock_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now()
          });

          // Add welcome notification
          get().addNotification({
            type: 'system',
            title: 'Welcome back!',
            message: `Hello ${mockUser.name}, welcome back to looom.shop!`,
            isRead: false
          });

          return true;
        } catch (error) {
          console.error('Login failed:', error);
          return false;
        }
      },

      adminLogin: async (email: string, password: string) => {
        console.log('🔐 Admin login attempt:', { email, hasPassword: !!password });
        
        try {
          let authSuccess = false;

          if (isSupabaseConfigured()) {
            console.log('📡 Using Supabase authentication...');
            // If Supabase is configured, try to authenticate via Supabase
            const result = await signInAsAdmin(email, password);
            authSuccess = result.success;
            
            if (authSuccess) {
              console.log('✅ Supabase admin login successful');
            } else {
              console.log('❌ Supabase admin login failed:', result.error);
            }
          } else {
            console.log('🔧 Using demo mode authentication...');
            // Demo mode credentials
            const demoCredentials = {
              email: 'admin@looom.shop',
              password: 'admin123'
            };

            console.log('🔍 Checking credentials:', {
              providedEmail: email,
              expectedEmail: demoCredentials.email,
              emailMatch: email === demoCredentials.email,
              providedPassword: password,
              expectedPassword: demoCredentials.password,
              passwordMatch: password === demoCredentials.password
            });

            if (email === demoCredentials.email && password === demoCredentials.password) {
              authSuccess = true;
              console.log('✅ Demo admin login successful');
            } else {
              console.log('❌ Demo admin login failed - credentials mismatch');
            }
          }

          if (authSuccess) {
            console.log('🎉 Creating admin user session...');
            // Create admin user
            const adminUser: User = {
              id: 'admin_1',
              name: 'Admin User',
              email: email,
              phone: '+91 9876543210',
              role: 'admin',
              addresses: [],
              preferences: {
                newsletter: false,
                smsUpdates: false,
                emailUpdates: true,
                favoriteCategories: []
              },
              loyaltyPoints: 0,
              totalOrders: 0,
              totalSpent: 0,
              joinedAt: '2024-01-01T00:00:00Z',
              lastLoginAt: new Date().toISOString(),
              isVerified: true,
              wishlist: []
            };

            set({
              isAuthenticated: true,
              user: adminUser,
              token: 'admin_token_' + Date.now(),
              refreshToken: 'admin_refresh_token_' + Date.now()
            });

            // Add admin login notification
            get().addNotification({
              type: 'system',
              title: 'Admin Access Granted',
              message: 'Welcome to the admin dashboard!',
              isRead: false
            });

            console.log('✅ Admin session created successfully');
            return true;
          }
          
          console.log('❌ Authentication failed');
          return false;
        } catch (error) {
          console.error('❌ Admin login error:', error);
          return false;
        }
      },

      signup: async (data: SignupData) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          if (data.password !== data.confirmPassword) {
            throw new Error('Passwords do not match');
          }

          // Mock user creation
          const newUser: User = {
            id: 'user_' + Date.now(),
            name: data.name,
            email: data.email,
            phone: data.phone,
            role: 'customer',
            addresses: [],
            preferences: {
              newsletter: true,
              smsUpdates: true,
              emailUpdates: true,
              favoriteCategories: []
            },
            loyaltyPoints: 100, // Welcome bonus
            totalOrders: 0,
            totalSpent: 0,
            joinedAt: new Date().toISOString(),
            isVerified: false,
            wishlist: []
          };

          set({
            isAuthenticated: true,
            user: newUser,
            token: 'mock_token_' + Date.now(),
            refreshToken: 'mock_refresh_token_' + Date.now()
          });

          // Add welcome notification
          get().addNotification({
            type: 'system',
            title: 'Welcome to looom.shop!',
            message: `Hi ${newUser.name}! Thanks for joining us. You've earned 100 loyalty points!`,
            isRead: false
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
        } catch (error) {
          console.error('Logout error:', error);
        }
        
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          refreshToken: null,
          cartItems: [],
          notifications: []
        });
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates }
          });
        }
      },

      addAddress: (address: Address) => {
        const { user } = get();
        if (user) {
          const newAddress = {
            ...address,
            id: 'addr_' + Date.now(),
            isDefault: user.addresses.length === 0
          };
          set({
            user: {
              ...user,
              addresses: [...user.addresses, newAddress]
            }
          });
        }
      },

      updateAddress: (addressId: string, updates: Partial<Address>) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              addresses: user.addresses.map(addr =>
                addr.id === addressId ? { ...addr, ...updates } : addr
              )
            }
          });
        }
      },

      deleteAddress: (addressId: string) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              addresses: user.addresses.filter(addr => addr.id !== addressId)
            }
          });
        }
      },

      setDefaultAddress: (addressId: string) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              addresses: user.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
              }))
            }
          });
        }
      },

      // Cart actions
      addToCart: (product, size, color, quantity = 1) => {
        const { cartItems } = get();
        const existingItem = cartItems.find(
          item => item.product.id === product.id && 
                   item.selectedSize === size && 
                   item.selectedColor === color
        );

        if (existingItem) {
          set({
            cartItems: cartItems.map(item =>
              item.product.id === product.id && 
              item.selectedSize === size && 
              item.selectedColor === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            cartItems: [...cartItems, { product, selectedSize: size, selectedColor: color, quantity }]
          });
        }
      },

      removeFromCart: (productId, size, color) => {
        const { cartItems } = get();
        set({
          cartItems: cartItems.filter(
            item => !(item.product.id === productId && 
                     item.selectedSize === size && 
                     item.selectedColor === color)
          )
        });
      },

      updateCartQuantity: (productId, size, color, quantity) => {
        const { cartItems } = get();
        if (quantity <= 0) {
          get().removeFromCart(productId, size, color);
          return;
        }
        
        set({
          cartItems: cartItems.map(item =>
            item.product.id === productId && 
            item.selectedSize === size && 
            item.selectedColor === color
              ? { ...item, quantity }
              : item
          )
        });
      },

      clearCart: () => set({ cartItems: [] }),
      setCartOpen: (open) => set({ cartOpen: open }),

      // Order actions
      createOrder: (orderData) => {
        const { orders, user } = get();
        const orderId = 'ORD' + Date.now();
        const now = new Date().toISOString();
        
        const newOrder: Order = {
          ...orderData,
          id: orderId,
          createdAt: now,
          updatedAt: now,
          trackingNumber: 'TRK' + orderId.slice(-6),
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          statusHistory: [
            {
              status: orderData.status,
              timestamp: now,
              notes: 'Order placed successfully'
            }
          ]
        };

        set({ orders: [...orders, newOrder] });

        // Update user stats
        if (user) {
          set({
            user: {
              ...user,
              totalOrders: (user.totalOrders || 0) + 1,
              totalSpent: (user.totalSpent || 0) + orderData.total,
              loyaltyPoints: (user.loyaltyPoints || 0) + Math.floor(orderData.total / 100) // 1 point per ₹100
            }
          });
        }

        // Add order notification
        get().addNotification({
          type: 'order',
          title: 'Order Confirmed!',
          message: `Your order #${orderId} has been confirmed and is being processed.`,
          isRead: false,
          orderId: orderId
        });

        return orderId;
      },

      getUserOrders: (userId: string) => {
        const { orders } = get();
        return orders.filter(order => order.customerEmail === get().user?.email)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getOrderById: (orderId: string) => {
        const { orders } = get();
        return orders.find(order => order.id === orderId) || null;
      },

      updateOrderStatus: (orderId: string, status: Order['status'], notes?: string) => {
        const { orders } = get();
        const now = new Date().toISOString();
        
        set({
          orders: orders.map(order =>
            order.id === orderId 
              ? { 
                  ...order, 
                  status, 
                  updatedAt: now,
                  statusHistory: [
                    ...order.statusHistory,
                    {
                      status,
                      timestamp: now,
                      notes: notes || `Order ${status}`
                    }
                  ],
                  ...(status === 'delivered' && { deliveryDate: now })
                }
              : order
          )
        });

        // Add status update notification
        const statusMessages = {
          confirmed: 'Your order has been confirmed!',
          packed: 'Your order is packed and ready to ship!',
          shipped: 'Your order is on its way!',
          delivered: 'Your order has been delivered!',
          cancelled: 'Your order has been cancelled.'
        };

        get().addNotification({
          type: 'order',
          title: 'Order Update',
          message: statusMessages[status] || `Order status updated to ${status}`,
          isRead: false,
          orderId: orderId
        });
      },

      // Payment actions
      addPayment: (payment: RazorpayPayment) => {
        const { payments } = get();
        set({ payments: [...payments, payment] });
      },

      updatePayment: (paymentId: string, updates: Partial<RazorpayPayment>) => {
        const { payments } = get();
        set({
          payments: payments.map(payment =>
            payment.id === paymentId ? { ...payment, ...updates } : payment
          )
        });
      },

      getPaymentById: (paymentId: string) => {
        const { payments } = get();
        return payments.find(payment => payment.id === paymentId) || null;
      },

      getPaymentsByOrder: (orderId: string) => {
        const { payments } = get();
        return payments.filter(payment => payment.orderId === orderId);
      },

      getAllPayments: () => {
        const { payments } = get();
        return payments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getPaymentStats: () => {
        const { payments } = get();
        const today = new Date().toDateString();
        
        const todayPayments = payments.filter(payment => 
          new Date(payment.createdAt).toDateString() === today
        );
        
        const successfulPayments = payments.filter(payment => 
          payment.status === 'captured'
        );
        
        const failedPayments = payments.filter(payment => 
          payment.status === 'failed'
        );
        
        const refundedPayments = payments.filter(payment => 
          payment.status === 'refunded'
        );

        const totalAmount = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
        const todayAmount = todayPayments
          .filter(payment => payment.status === 'captured')
          .reduce((sum, payment) => sum + payment.amount, 0);

        return {
          total: payments.length,
          today: todayPayments.length,
          successful: successfulPayments.length,
          failed: failedPayments.length,
          refunded: refundedPayments.length,
          totalAmount,
          todayAmount
        };
      },

      // Wishlist actions
      addToWishlist: (productId: string) => {
        const { user } = get();
        if (user && !user.wishlist.includes(productId)) {
          set({
            user: {
              ...user,
              wishlist: [...user.wishlist, productId]
            }
          });
        }
      },

      removeFromWishlist: (productId: string) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              wishlist: user.wishlist.filter(id => id !== productId)
            }
          });
        }
      },

      isInWishlist: (productId: string) => {
        const { user } = get();
        return user ? user.wishlist.includes(productId) : false;
      },

      // Notification actions
      addNotification: (notification) => {
        const { notifications } = get();
        const newNotification: Notification = {
          ...notification,
          id: 'notif_' + Date.now(),
          createdAt: new Date().toISOString()
        };
        set({ notifications: [newNotification, ...notifications] });
      },

      markNotificationAsRead: (notificationId: string) => {
        const { notifications } = get();
        set({
          notifications: notifications.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        });
      },

      clearNotifications: () => set({ notifications: [] }),

      getUnreadNotificationCount: () => {
        const { notifications } = get();
        return notifications.filter(notif => !notif.isRead).length;
      },

      // Products actions
      setProducts: (products) => set({ products }),
      setCategories: (categories) => set({ categories }),
      addCategory: (category) => {
        const { categories } = get();
        set({ categories: [...categories, category] });
      },
      updateCategory: (categoryId, updates) => {
        const { categories } = get();
        set({
          categories: categories.map(cat =>
            cat.id === categoryId 
              ? { ...cat, ...updates, updatedAt: new Date().toISOString() }
              : cat
          )
        });
      },
      deleteCategory: (categoryId) => {
        const { categories } = get();
        set({ categories: categories.filter(cat => cat.id !== categoryId) });
      },

      // Theme actions
      setThemes: (themes) => set({ themes }),
      addTheme: (theme) => {
        const { themes } = get();
        set({ themes: [...themes, theme] });
      },
      updateTheme: (themeId, updates) => {
        const { themes } = get();
        set({
          themes: themes.map(theme =>
            theme.id === themeId 
              ? { ...theme, ...updates, updatedAt: new Date().toISOString() }
              : theme
          )
        });
      },
      deleteTheme: (themeId) => {
        const { themes } = get();
        set({ themes: themes.filter(theme => theme.id !== themeId) });
      },
      setActiveTheme: (themeId) => {
        const { themes } = get();
        set({
          themes: themes.map(theme => ({
            ...theme,
            isActive: theme.id === themeId,
            updatedAt: new Date().toISOString()
          }))
        });
      },

      // Story actions
      setStories: (stories) => set({ stories }),
      addStory: (story) => {
        const { stories } = get();
        set({ stories: [...stories, story] });
      },
      updateStory: (storyId, updates) => {
        const { stories } = get();
        set({
          stories: stories.map(story =>
            story.id === storyId 
              ? { ...story, ...updates, updatedAt: new Date().toISOString() }
              : story
          )
        });
      },
      deleteStory: (storyId) => {
        const { stories } = get();
        set({ stories: stories.filter(story => story.id !== storyId) });
      },
      reorderStories: (stories) => set({ stories }),

      // Banner actions
      setBanners: (banners) => set({ banners }),
      addBanner: (banner) => {
        const { banners } = get();
        set({ banners: [...banners, banner] });
      },
      updateBanner: (bannerId, updates) => {
        const { banners } = get();
        set({
          banners: banners.map(banner =>
            banner.id === bannerId 
              ? { ...banner, ...updates, updatedAt: new Date().toISOString() }
              : banner
          )
        });
      },
      deleteBanner: (bannerId) => {
        const { banners } = get();
        set({ banners: banners.filter(banner => banner.id !== bannerId) });
      },
      reorderBanners: (banners) => set({ banners }),

      setFilters: (newFilters) => set({ filters: { ...get().filters, ...newFilters } }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      // UI actions
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),
      setFilterDrawerOpen: (open) => set({ filterDrawerOpen: open }),

      // Admin actions
      setOrders: (orders) => set({ orders }),
      setSelectedOrder: (order) => set({ selectedOrder: order }),
      setUser: (user) => set({ user }),
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
        banners: state.banners,
        orders: state.orders,
        payments: state.payments,
        notifications: state.notifications,
      }),
    }
  )
);