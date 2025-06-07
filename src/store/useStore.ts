import { create } from 'zustand';
import { persist } from 'zustand/middleware';
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
  Notification
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
  
  // Notifications
  notifications: Notification[];
  
  // Auth actions
  login: (credentials: LoginCredentials) => Promise<boolean>;
  signup: (data: SignupData) => Promise<boolean>;
  logout: () => void;
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
  
  // Wishlist actions
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  getUnreadNotificationCount: () => number;
  
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
      categories: [
        {
          id: 'cat_1',
          name: 'Sarees',
          slug: 'sarees',
          image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
          description: 'Traditional handwoven sarees',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👗',
          color: '#8B5CF6',
          sortOrder: 1
        },
        {
          id: 'cat_2',
          name: 'Frocks',
          slug: 'frocks',
          image: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
          description: 'Modern ethnic frocks',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👚',
          color: '#EC4899',
          sortOrder: 2
        },
        {
          id: 'cat_3',
          name: 'Kurtas',
          slug: 'kurtas',
          image: 'https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg',
          description: 'Comfortable ethnic kurtas',
          productCount: 0,
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          icon: '👘',
          color: '#10B981',
          sortOrder: 3
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
        },
        {
          id: 'theme_2',
          name: 'Summer Collection',
          slug: 'summer-collection',
          description: 'Light and breezy designs for summer comfort',
          image: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
          bannerImage: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
          icon: '☀️',
          colors: {
            primary: '#06B6D4',
            secondary: '#10B981',
            accent: '#F59E0B',
            background: '#F0F9FF',
            text: '#0F172A'
          },
          isActive: false,
          isDefault: false,
          startDate: '2024-04-01T00:00:00Z',
          endDate: '2024-06-30T23:59:59Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          sortOrder: 2,
          settings: {
            showBanner: true,
            showCountdown: true,
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
        },
        {
          id: 'story_2',
          title: 'Trending Now',
          subtitle: 'Hot Picks',
          image: 'https://images.pexels.com/photos/5560021/pexels-photo-5560021.jpeg',
          gradient: 'from-blue-600 to-cyan-600',
          isActive: true,
          sortOrder: 2,
          linkType: 'collection',
          linkValue: 'trending',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'story_3',
          title: 'Best Sellers',
          subtitle: 'Top Rated',
          image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
          gradient: 'from-orange-600 to-red-600',
          isActive: true,
          sortOrder: 3,
          linkType: 'collection',
          linkValue: 'best-sellers',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'story_4',
          title: 'Premium',
          subtitle: 'Luxury Line',
          image: 'https://images.pexels.com/photos/8100784/pexels-photo-8100784.jpeg',
          gradient: 'from-emerald-600 to-teal-600',
          isActive: true,
          sortOrder: 4,
          linkType: 'category',
          linkValue: 'premium',
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
          icon: '🔥',
          discount: {
            percentage: 70,
            originalText: 'HOT DEAL',
            highlightText: 'Up to 70% OFF'
          }
        },
        {
          id: 'banner_2',
          title: 'New Arrivals',
          subtitle: 'FRESH COLLECTION',
          description: 'Latest handwoven designs just arrived',
          image: 'https://images.pexels.com/photos/8193085/pexels-photo-8193085.jpeg',
          gradient: 'from-emerald-500 to-teal-600',
          textColor: 'text-white',
          buttonText: 'Explore Now',
          buttonColor: 'bg-white text-emerald-600',
          isActive: false,
          sortOrder: 2,
          linkType: 'category',
          linkValue: 'new-arrivals',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          bannerType: 'hero',
          height: 'large',
          position: 'top',
          showIcon: true,
          icon: '✨'
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
      notifications: [],

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

      logout: () => {
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
        notifications: state.notifications,
      }),
    }
  )
);