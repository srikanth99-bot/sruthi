import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Bell,
  Settings,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  Star,
  Heart,
  MessageSquare,
  Activity,
  Zap,
  Target,
  Award,
  Layers,
  Globe,
  Lock,
  Image,
  Type,
  Palette,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Save,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  RefreshCw,
  Database,
  FileText,
  PieChart,
  BarChart,
  LineChart,
  TrendingDown,
  UserPlus,
  ShoppingBag,
  CreditCard,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Order, Product, Category, Theme, Story, Banner } from '../types';

interface AdminDashboardProps {
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const { 
    orders, 
    products, 
    categories,
    themes,
    stories,
    banners,
    updateOrderStatus, 
    user,
    notifications,
    getUnreadNotificationCount,
    addCategory,
    updateCategory,
    deleteCategory,
    addTheme,
    updateTheme,
    deleteTheme,
    setActiveTheme,
    addStory,
    updateStory,
    deleteStory,
    reorderStories,
    addBanner,
    updateBanner,
    deleteBanner,
    reorderBanners
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [sessionTime, setSessionTime] = useState(0);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showThemeForm, setShowThemeForm] = useState(false);
  const [showStoryForm, setShowStoryForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    icon: '',
    color: '#8B5CF6',
    isActive: true
  });

  const [themeForm, setThemeForm] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    bannerImage: '',
    icon: '',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#F59E0B',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    isActive: false,
    isDefault: false,
    settings: {
      showBanner: true,
      showCountdown: false,
      enableSpecialOffers: true
    }
  });

  const [storyForm, setStoryForm] = useState({
    title: '',
    subtitle: '',
    image: '',
    gradient: 'from-purple-600 to-pink-600',
    isActive: true,
    linkType: 'category' as 'category' | 'collection' | 'external' | 'none',
    linkValue: ''
  });

  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    gradient: 'from-purple-600 to-pink-600',
    textColor: 'text-white',
    buttonText: 'Shop Now',
    buttonColor: 'bg-white text-purple-600',
    isActive: true,
    linkType: 'category' as 'category' | 'collection' | 'external' | 'none',
    linkValue: '',
    bannerType: 'promotional' as 'hero' | 'promotional' | 'seasonal' | 'announcement',
    height: 'medium' as 'small' | 'medium' | 'large',
    position: 'top' as 'top' | 'middle' | 'bottom',
    showIcon: true,
    icon: '🔥'
  });

  const unreadNotifications = getUnreadNotificationCount();

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto logout after 8 hours
  useEffect(() => {
    const checkSession = () => {
      const expiry = localStorage.getItem('adminSessionExpiry');
      if (expiry && Date.now() > parseInt(expiry)) {
        handleLogout();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/';
    }
  };

  const formatSessionTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Calculate stats
  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    return new Date(order.createdAt).toDateString() === today;
  });

  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const totalProducts = products.length;
  const lowStockItems = products.filter(product => !product.inStock).length;

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'packed': return 'text-orange-600 bg-orange-100';
      case 'confirmed': return 'text-purple-600 bg-purple-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length },
    { id: 'products', label: 'Products', icon: Package, badge: totalProducts },
    { id: 'categories', label: 'Categories', icon: Layers, badge: categories.length },
    { id: 'themes', label: 'Themes', icon: Palette, badge: themes.length },
    { id: 'stories', label: 'Stories', icon: Image, badge: stories.length },
    { id: 'banners', label: 'Banners', icon: Layout, badge: banners.length },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Form handlers
  const handleCategorySubmit = () => {
    if (editingItem) {
      updateCategory(editingItem.id, {
        ...categoryForm,
        updatedAt: new Date().toISOString()
      });
    } else {
      addCategory({
        ...categoryForm,
        id: 'cat_' + Date.now(),
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sortOrder: categories.length + 1
      });
    }
    resetCategoryForm();
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      icon: '',
      color: '#8B5CF6',
      isActive: true
    });
    setEditingItem(null);
    setShowCategoryForm(false);
  };

  const handleThemeSubmit = () => {
    if (editingItem) {
      updateTheme(editingItem.id, {
        ...themeForm,
        updatedAt: new Date().toISOString()
      });
    } else {
      addTheme({
        ...themeForm,
        id: 'theme_' + Date.now(),
        slug: themeForm.slug || themeForm.name.toLowerCase().replace(/\s+/g, '-'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sortOrder: themes.length + 1
      });
    }
    resetThemeForm();
  };

  const resetThemeForm = () => {
    setThemeForm({
      name: '',
      slug: '',
      description: '',
      image: '',
      bannerImage: '',
      icon: '',
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        accent: '#F59E0B',
        background: '#FFFFFF',
        text: '#1F2937'
      },
      isActive: false,
      isDefault: false,
      settings: {
        showBanner: true,
        showCountdown: false,
        enableSpecialOffers: true
      }
    });
    setEditingItem(null);
    setShowThemeForm(false);
  };

  const handleStorySubmit = () => {
    if (editingItem) {
      updateStory(editingItem.id, {
        ...storyForm,
        updatedAt: new Date().toISOString()
      });
    } else {
      addStory({
        ...storyForm,
        id: 'story_' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sortOrder: stories.length + 1
      });
    }
    resetStoryForm();
  };

  const resetStoryForm = () => {
    setStoryForm({
      title: '',
      subtitle: '',
      image: '',
      gradient: 'from-purple-600 to-pink-600',
      isActive: true,
      linkType: 'category',
      linkValue: ''
    });
    setEditingItem(null);
    setShowStoryForm(false);
  };

  const handleBannerSubmit = () => {
    if (editingItem) {
      updateBanner(editingItem.id, {
        ...bannerForm,
        updatedAt: new Date().toISOString()
      });
    } else {
      addBanner({
        ...bannerForm,
        id: 'banner_' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sortOrder: banners.length + 1
      });
    }
    resetBannerForm();
  };

  const resetBannerForm = () => {
    setBannerForm({
      title: '',
      subtitle: '',
      description: '',
      image: '',
      gradient: 'from-purple-600 to-pink-600',
      textColor: 'text-white',
      buttonText: 'Shop Now',
      buttonColor: 'bg-white text-purple-600',
      isActive: true,
      linkType: 'category',
      linkValue: '',
      bannerType: 'promotional',
      height: 'medium',
      position: 'top',
      showIcon: true,
      icon: '🔥'
    });
    setEditingItem(null);
    setShowBannerForm(false);
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Security Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center space-x-4">
          <Shield className="h-8 w-8" />
          <div>
            <h3 className="text-xl font-bold">Secure Admin Session</h3>
            <p className="opacity-90">Session time: {formatSessionTime(sessionTime)} | Auto-logout in 8 hours</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Today's Orders",
            value: todayOrders.length,
            change: '+12%',
            icon: ShoppingCart,
            color: 'from-blue-500 to-cyan-500'
          },
          {
            title: "Today's Revenue",
            value: `₹${todayRevenue.toLocaleString()}`,
            change: '+8%',
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Total Products',
            value: totalProducts,
            change: '+3%',
            icon: Package,
            color: 'from-purple-500 to-indigo-500'
          },
          {
            title: 'Low Stock Items',
            value: lowStockItems,
            change: '-2%',
            icon: AlertTriangle,
            color: 'from-orange-500 to-red-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => setActiveTab('orders')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">#{order.id}</h4>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  ₹{order.total.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Order Management</h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders
                .filter(order => 
                  order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-0 ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="packed">Packed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ₹{order.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Product Management</h3>
        <button className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="relative">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Category Management</h3>
        <button 
          onClick={() => setShowCategoryForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Form */}
      <AnimatePresence>
        {showCategoryForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Category' : 'Add New Category'}
              </h4>
              <button onClick={resetCategoryForm}>
                <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
                <input
                  type="text"
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="category-slug"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Category description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <input
                  type="text"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="👗"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input
                  type="color"
                  value={categoryForm.color}
                  onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                  className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="categoryActive"
                  checked={categoryForm.isActive}
                  onChange={(e) => setCategoryForm({ ...categoryForm, isActive: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="categoryActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleCategorySubmit}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {editingItem ? 'Update Category' : 'Create Category'}
              </button>
              <button
                onClick={resetCategoryForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="relative h-48">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{category.icon}</span>
                <h4 className="font-bold text-gray-900">{category.name}</h4>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{category.productCount} products</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setEditingItem(category);
                      setCategoryForm({
                        name: category.name,
                        slug: category.slug,
                        description: category.description,
                        image: category.image,
                        icon: category.icon || '',
                        color: category.color || '#8B5CF6',
                        isActive: category.isActive
                      });
                      setShowCategoryForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderThemes = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Theme Management</h3>
        <button 
          onClick={() => setShowThemeForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Theme</span>
        </button>
      </div>

      {/* Theme Form */}
      <AnimatePresence>
        {showThemeForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Theme' : 'Add New Theme'}
              </h4>
              <button onClick={resetThemeForm}>
                <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={themeForm.name}
                  onChange={(e) => setThemeForm({ ...themeForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Theme name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <input
                  type="text"
                  value={themeForm.icon}
                  onChange={(e) => setThemeForm({ ...themeForm, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="🎉"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={themeForm.description}
                  onChange={(e) => setThemeForm({ ...themeForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Theme description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <input
                  type="color"
                  value={themeForm.colors.primary}
                  onChange={(e) => setThemeForm({ 
                    ...themeForm, 
                    colors: { ...themeForm.colors, primary: e.target.value }
                  })}
                  className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <input
                  type="color"
                  value={themeForm.colors.secondary}
                  onChange={(e) => setThemeForm({ 
                    ...themeForm, 
                    colors: { ...themeForm.colors, secondary: e.target.value }
                  })}
                  className="w-full h-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="themeActive"
                    checked={themeForm.isActive}
                    onChange={(e) => setThemeForm({ ...themeForm, isActive: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="themeActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="themeDefault"
                    checked={themeForm.isDefault}
                    onChange={(e) => setThemeForm({ ...themeForm, isDefault: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="themeDefault" className="ml-2 block text-sm text-gray-900">
                    Default
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleThemeSubmit}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {editingItem ? 'Update Theme' : 'Create Theme'}
              </button>
              <button
                onClick={resetThemeForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme) => (
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div 
              className="h-32 relative"
              style={{ 
                background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary})` 
              }}
            >
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <span className="text-2xl">{theme.icon}</span>
                <span className="text-white font-bold">{theme.name}</span>
              </div>
              <div className="absolute top-3 right-3 flex space-x-2">
                {theme.isDefault && (
                  <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  theme.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {theme.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{theme.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: theme.colors.primary }}
                    title="Primary"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: theme.colors.secondary }}
                    title="Secondary"
                  />
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-gray-200"
                    style={{ backgroundColor: theme.colors.accent }}
                    title="Accent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveTheme(theme.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Set as active"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setEditingItem(theme);
                      setThemeForm({
                        name: theme.name,
                        slug: theme.slug,
                        description: theme.description,
                        image: theme.image,
                        bannerImage: theme.bannerImage || '',
                        icon: theme.icon,
                        colors: theme.colors,
                        isActive: theme.isActive,
                        isDefault: theme.isDefault,
                        settings: theme.settings
                      });
                      setShowThemeForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteTheme(theme.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStories = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Story Management</h3>
        <button 
          onClick={() => setShowStoryForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Story</span>
        </button>
      </div>

      {/* Story Form */}
      <AnimatePresence>
        {showStoryForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Story' : 'Add New Story'}
              </h4>
              <button onClick={resetStoryForm}>
                <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={storyForm.title}
                  onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Story title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={storyForm.subtitle}
                  onChange={(e) => setStoryForm({ ...storyForm, subtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Story subtitle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={storyForm.image}
                  onChange={(e) => setStoryForm({ ...storyForm, image: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gradient</label>
                <select
                  value={storyForm.gradient}
                  onChange={(e) => setStoryForm({ ...storyForm, gradient: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="from-purple-600 to-pink-600">Purple to Pink</option>
                  <option value="from-blue-600 to-cyan-600">Blue to Cyan</option>
                  <option value="from-green-600 to-emerald-600">Green to Emerald</option>
                  <option value="from-orange-600 to-red-600">Orange to Red</option>
                  <option value="from-yellow-600 to-orange-600">Yellow to Orange</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
                <select
                  value={storyForm.linkType}
                  onChange={(e) => setStoryForm({ ...storyForm, linkType: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="category">Category</option>
                  <option value="collection">Collection</option>
                  <option value="external">External Link</option>
                  <option value="none">No Link</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Link Value</label>
                <input
                  type="text"
                  value={storyForm.linkValue}
                  onChange={(e) => setStoryForm({ ...storyForm, linkValue: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Category name or URL"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="storyActive"
                  checked={storyForm.isActive}
                  onChange={(e) => setStoryForm({ ...storyForm, isActive: e.target.checked })}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="storyActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleStorySubmit}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {editingItem ? 'Update Story' : 'Create Story'}
              </button>
              <button
                onClick={resetStoryForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stories.map((story) => (
          <motion.div
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className={`h-32 bg-gradient-to-br ${story.gradient} relative`}>
              <img
                src={story.image}
                alt={story.title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h4 className="font-bold text-sm">{story.title}</h4>
                  {story.subtitle && (
                    <p className="text-xs opacity-90">{story.subtitle}</p>
                  )}
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  story.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {story.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Order: {story.sortOrder}</span>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setEditingItem(story);
                      setStoryForm({
                        title: story.title,
                        subtitle: story.subtitle || '',
                        image: story.image,
                        gradient: story.gradient,
                        isActive: story.isActive,
                        linkType: story.linkType,
                        linkValue: story.linkValue || ''
                      });
                      setShowStoryForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteStory(story.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderBanners = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Banner Management</h3>
        <button 
          onClick={() => setShowBannerForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Banner Form */}
      <AnimatePresence>
        {showBannerForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-xl font-bold text-gray-900">
                {editingItem ? 'Edit Banner' : 'Add New Banner'}
              </h4>
              <button onClick={resetBannerForm}>
                <X className="h-6 w-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Banner title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Banner subtitle"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                  placeholder="Banner description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={bannerForm.buttonText}
                  onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Shop Now"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <input
                  type="text"
                  value={bannerForm.icon}
                  onChange={(e) => setBannerForm({ ...bannerForm, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="🔥"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Banner Type</label>
                <select
                  value={bannerForm.bannerType}
                  onChange={(e) => setBannerForm({ ...bannerForm, bannerType: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="promotional">Promotional</option>
                  <option value="hero">Hero</option>
                  <option value="seasonal">Seasonal</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <select
                  value={bannerForm.height}
                  onChange={(e) => setBannerForm({ ...bannerForm, height: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bannerActive"
                    checked={bannerForm.isActive}
                    onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="bannerActive" className="ml-2 block text-sm text-gray-900">
                    Active
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bannerShowIcon"
                    checked={bannerForm.showIcon}
                    onChange={(e) => setBannerForm({ ...bannerForm, showIcon: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="bannerShowIcon" className="ml-2 block text-sm text-gray-900">
                    Show Icon
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button
                onClick={handleBannerSubmit}
                className="bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {editingItem ? 'Update Banner' : 'Create Banner'}
              </button>
              <button
                onClick={resetBannerForm}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners Grid */}
      <div className="space-y-6">
        {banners.map((banner) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className={`h-32 bg-gradient-to-br ${banner.gradient} relative p-6 flex items-center justify-between`}>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  {banner.showIcon && banner.icon && (
                    <span className="text-2xl">{banner.icon}</span>
                  )}
                  <span className={`${banner.textColor} font-bold text-sm`}>
                    {banner.subtitle}
                  </span>
                </div>
                <h4 className={`text-2xl font-black ${banner.textColor} mb-2`}>
                  {banner.title}
                </h4>
                {banner.description && (
                  <p className={`${banner.textColor}/90 text-sm`}>
                    {banner.description}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="bg-white/20 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  {banner.bannerType}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">Order: {banner.sortOrder}</span>
                  <span className="text-sm text-gray-500">Height: {banner.height}</span>
                  <span className="text-sm text-gray-500">Position: {banner.position}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setEditingItem(banner);
                      setBannerForm({
                        title: banner.title,
                        subtitle: banner.subtitle || '',
                        description: banner.description || '',
                        image: banner.image,
                        gradient: banner.gradient,
                        textColor: banner.textColor,
                        buttonText: banner.buttonText,
                        buttonColor: banner.buttonColor,
                        isActive: banner.isActive,
                        linkType: banner.linkType,
                        linkValue: banner.linkValue || '',
                        bannerType: banner.bannerType,
                        height: banner.height,
                        position: banner.position,
                        showIcon: banner.showIcon,
                        icon: banner.icon || ''
                      });
                      setShowBannerForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => deleteBanner(banner.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-purple-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-xs text-gray-500">looom.shop Management</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Session Info */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Session: {formatSessionTime(sessionTime)}</span>
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Admin Profile */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-900">Admin</span>
              </div>

              {/* Logout */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden md:block">Logout</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <tab.icon className="h-5 w-5" />
                      <span className="font-medium">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        activeTab === tab.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </motion.button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && renderOverview()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'products' && renderProducts()}
                {activeTab === 'categories' && renderCategories()}
                {activeTab === 'themes' && renderThemes()}
                {activeTab === 'stories' && renderStories()}
                {activeTab === 'banners' && renderBanners()}
                {activeTab === 'customers' && (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Management</h3>
                    <p className="text-gray-600">Customer management features coming soon</p>
                  </div>
                )}
                {activeTab === 'analytics' && (
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Dashboard</h3>
                    <p className="text-gray-600">Advanced analytics and reporting coming soon</p>
                  </div>
                )}
                {activeTab === 'settings' && (
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h3>
                    <p className="text-gray-600">Configuration and settings panel coming soon</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;