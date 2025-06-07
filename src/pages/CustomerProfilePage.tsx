import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings,
  Edit,
  Plus,
  Truck,
  Star,
  Calendar,
  Phone,
  Mail,
  ArrowLeft,
  CheckCircle,
  Clock,
  X,
  Bell,
  Gift,
  Award,
  ShoppingBag,
  Eye,
  LogOut,
  Shield,
  Camera,
  Save,
  Trash2
} from 'lucide-react';
import { useStore } from '../store/useStore';
import type { Address } from '../types';

interface CustomerProfilePageProps {
  onBack: () => void;
  onTrackOrder?: (orderId: string) => void;
}

const CustomerProfilePage: React.FC<CustomerProfilePageProps> = ({ onBack, onTrackOrder }) => {
  const { 
    user, 
    cartItems, 
    getUserOrders, 
    logout, 
    updateProfile, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    setDefaultAddress,
    notifications,
    markNotificationAsRead,
    clearNotifications,
    getUnreadNotificationCount,
    isInWishlist,
    removeFromWishlist,
    products
  } = useStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [editingProfile, setEditingProfile] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    gender: user?.gender || ''
  });
  const [newAddress, setNewAddress] = useState<Address>({
    type: 'home',
    name: user?.name || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    phone: user?.phone || ''
  });

  const orders = user ? getUserOrders(user.id) : [];
  const unreadNotifications = getUnreadNotificationCount();
  const wishlistProducts = products.filter(product => isInWishlist(product.id));

  const handleSaveProfile = () => {
    updateProfile(profileData);
    setEditingProfile(false);
  };

  const handleAddAddress = () => {
    if (editingAddress) {
      updateAddress(editingAddress.id!, newAddress);
      setEditingAddress(null);
    } else {
      addAddress(newAddress);
    }
    setNewAddress({
      type: 'home',
      name: user?.name || '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      landmark: '',
      phone: user?.phone || ''
    });
    setShowAddressForm(false);
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress(address);
    setShowAddressForm(true);
  };

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
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package, badge: orders.length },
    { id: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistProducts.length },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifications },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 rounded-3xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
              <span className="text-2xl font-black">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-black">Welcome back, {user?.name}!</h2>
              <p className="opacity-90">Member since {user?.joinedAt ? new Date(user.joinedAt).getFullYear() : '2024'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="text-2xl font-black">{user?.totalOrders || 0}</div>
              <div className="text-sm opacity-90">Total Orders</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="text-2xl font-black">₹{(user?.totalSpent || 0).toLocaleString()}</div>
              <div className="text-sm opacity-90">Total Spent</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="text-2xl font-black">{user?.loyaltyPoints || 0}</div>
              <div className="text-sm opacity-90">Loyalty Points</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <div className="text-2xl font-black">{wishlistProducts.length}</div>
              <div className="text-sm opacity-90">Wishlist Items</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Package, label: 'Track Orders', action: () => setActiveTab('orders'), color: 'from-blue-500 to-cyan-500' },
          { icon: Heart, label: 'My Wishlist', action: () => setActiveTab('wishlist'), color: 'from-pink-500 to-red-500' },
          { icon: MapPin, label: 'Addresses', action: () => setActiveTab('addresses'), color: 'from-green-500 to-emerald-500' },
          { icon: Bell, label: 'Notifications', action: () => setActiveTab('notifications'), color: 'from-purple-500 to-indigo-500' },
        ].map((action, index) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.action}
            className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-3xl shadow-xl`}
          >
            <action.icon className="h-8 w-8 mx-auto mb-3" />
            <span className="font-bold text-sm">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('orders')}
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            View All
          </motion.button>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h4>
            <p className="text-gray-600">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onTrackOrder?.(order.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">#{order.id}</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
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
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">My Orders</h3>
        <div className="text-sm text-gray-500">
          {orders.length} order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h4>
          <p className="text-gray-600">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900">Order #{order.id}</h4>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </p>
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

              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="h-16 w-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{item.product.name}</h5>
                      <p className="text-sm text-gray-600">
                        Size: {item.selectedSize} | Color: {item.selectedColor} | Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  {order.status === 'delivered' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Star className="h-4 w-4" />
                      <span>Rate & Review</span>
                    </motion.button>
                  )}
                  {(order.status === 'shipped' || order.status === 'packed') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onTrackOrder?.(order.id)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <Truck className="h-4 w-4" />
                      <span>Track Order</span>
                    </motion.button>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTrackOrder?.(order.id)}
                  className="text-gray-600 hover:text-gray-700 font-medium flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderWishlist = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">My Wishlist</h3>
        <div className="text-sm text-gray-500">
          {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''}
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h4>
          <p className="text-gray-600">Save items you love to your wishlist</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button 
                  onClick={() => removeFromWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <button className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-purple-700 transition-colors">
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Saved Addresses</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddressForm(true)}
          className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add New</span>
        </motion.button>
      </div>

      {/* Address Form */}
      <AnimatePresence>
        {showAddressForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <h4 className="font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                <select
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="home">Home</option>
                  <option value="office">Office</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                value={newAddress.street}
                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter street address"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter pincode"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter landmark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddAddress}
                className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition-colors"
              >
                {editingAddress ? 'Update Address' : 'Save Address'}
              </motion.button>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  setNewAddress({
                    type: 'home',
                    name: user?.name || '',
                    street: '',
                    city: '',
                    state: '',
                    pincode: '',
                    landmark: '',
                    phone: user?.phone || ''
                  });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user?.addresses?.map((address) => (
          <motion.div
            key={address.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    address.type === 'home' ? 'bg-green-100 text-green-800' :
                    address.type === 'office' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {address.type?.charAt(0).toUpperCase() + address.type?.slice(1)}
                  </span>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-gray-900">{address.name}</h4>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditAddress(address)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
                <button 
                  onClick={() => deleteAddress(address.id!)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="space-y-2 text-gray-700 mb-4">
              <p>{address.street}</p>
              <p>{address.city}, {address.state} - {address.pincode}</p>
              {address.landmark && <p>Near {address.landmark}</p>}
              {address.phone && (
                <div className="flex items-center space-x-2 pt-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{address.phone}</span>
                </div>
              )}
            </div>

            {!address.isDefault && (
              <button
                onClick={() => setDefaultAddress(address.id!)}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
              >
                Set as Default
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-900">Notifications</h3>
        {notifications.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearNotifications}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            Clear All
          </motion.button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h4>
          <p className="text-gray-600">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                notification.isRead 
                  ? 'bg-gray-50 border-gray-200' 
                  : 'bg-blue-50 border-blue-200'
              }`}
              onClick={() => markNotificationAsRead(notification.id)}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-xl ${
                  notification.type === 'order' ? 'bg-green-100' :
                  notification.type === 'promotion' ? 'bg-purple-100' :
                  notification.type === 'delivery' ? 'bg-blue-100' :
                  'bg-gray-100'
                }`}>
                  {notification.type === 'order' && <Package className="h-5 w-5 text-green-600" />}
                  {notification.type === 'promotion' && <Gift className="h-5 w-5 text-purple-600" />}
                  {notification.type === 'delivery' && <Truck className="h-5 w-5 text-blue-600" />}
                  {notification.type === 'system' && <Bell className="h-5 w-5 text-gray-600" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                  <p className="text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Account Settings</h3>

      {/* Profile Settings */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-xl font-bold text-gray-900">Profile Information</h4>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setEditingProfile(!editingProfile)}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>{editingProfile ? 'Cancel' : 'Edit'}</span>
          </motion.button>
        </div>

        <div className="flex items-center space-x-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {editingProfile && (
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-lg border border-gray-200">
                <Camera className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
          <div>
            <h4 className="text-2xl font-bold text-gray-900">{user?.name}</h4>
            <p className="text-gray-600">Member since {user?.joinedAt ? new Date(user.joinedAt).getFullYear() : '2024'}</p>
            {user?.isVerified && (
              <div className="flex items-center space-x-1 mt-2">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-green-600 text-sm font-medium">Verified Account</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={!editingProfile}
              className={`w-full px-4 py-3 border rounded-xl transition-all ${
                editingProfile 
                  ? 'border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
              disabled={!editingProfile}
              className={`w-full px-4 py-3 border rounded-xl transition-all ${
                editingProfile 
                  ? 'border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
              disabled={!editingProfile}
              className={`w-full px-4 py-3 border rounded-xl transition-all ${
                editingProfile 
                  ? 'border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={profileData.dateOfBirth}
              onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
              disabled={!editingProfile}
              className={`w-full px-4 py-3 border rounded-xl transition-all ${
                editingProfile 
                  ? 'border-purple-500 focus:ring-2 focus:ring-purple-200' 
                  : 'border-gray-300 bg-gray-50'
              }`}
            />
          </div>
        </div>

        {editingProfile && (
          <div className="flex space-x-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSaveProfile}
              className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </motion.button>
            <button
              onClick={() => setEditingProfile(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Preferences</h4>
        <div className="space-y-4">
          {[
            { key: 'newsletter', label: 'Email Newsletter', description: 'Receive updates about new products and offers' },
            { key: 'smsUpdates', label: 'SMS Updates', description: 'Get order updates via SMS' },
            { key: 'emailUpdates', label: 'Email Updates', description: 'Receive order confirmations and shipping updates' },
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h5 className="font-semibold text-gray-900">{pref.label}</h5>
                <p className="text-sm text-gray-600">{pref.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user?.preferences?.[pref.key as keyof typeof user.preferences] || false}
                  onChange={(e) => updateProfile({
                    preferences: {
                      ...user?.preferences,
                      [pref.key]: e.target.checked
                    }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Account Actions</h4>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            logout();
            onBack();
          }}
          className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Please Login</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to view your profile</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
          >
            Go Back
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
                <p className="text-sm text-gray-500">Manage your profile and orders</p>
              </div>
            </div>
            {unreadNotifications > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('notifications')}
                className="relative p-3 bg-purple-100 rounded-xl"
              >
                <Bell className="h-6 w-6 text-purple-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              
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
                    {tab.badge && tab.badge > 0 && (
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
          <div className="lg:col-span-3">
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
                {activeTab === 'wishlist' && renderWishlist()}
                {activeTab === 'addresses' && renderAddresses()}
                {activeTab === 'notifications' && renderNotifications()}
                {activeTab === 'settings' && renderSettings()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfilePage;