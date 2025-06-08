import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Layout/Header';
import BottomNav from './components/Layout/BottomNav';
import MobileMenu from './components/Layout/MobileMenu';
import CartDrawer from './components/Cart/CartDrawer';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SimpleCheckoutPage from './pages/SimpleCheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CustomerProfilePage from './pages/CustomerProfilePage';
import AdminRoute from './components/Admin/AdminRoute';
import LoginPage from './pages/LoginPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import { useStore } from './store/useStore';
import type { Product } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  const [trackingOrderId, setTrackingOrderId] = useState<string>('');
  const { setProducts, isAuthenticated } = useStore();

  // Initialize with mock data
  React.useEffect(() => {
    import('./data/mockData').then(({ mockProducts }) => {
      setProducts(mockProducts);
    });
  }, [setProducts]);

  // Check if current path is admin
  const isAdminRoute = window.location.pathname === '/admin';

  // If admin route, show admin interface
  if (isAdminRoute) {
    return <AdminRoute />;
  }

  const handleTabChange = (tab: string) => {
    // Check if user needs to login for certain pages
    if (!isAuthenticated && (tab === 'profile' || tab === 'cart')) {
      setCurrentPage('login');
      return;
    }
    
    setCurrentPage(tab);
    setSelectedProduct(null);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage('collection');
    setSelectedProduct(null);
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-detail');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedCategory('');
    setSelectedProduct(null);
  };

  const handleBackToCollection = () => {
    setCurrentPage('collection');
    setSelectedProduct(null);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage('checkout');
  };

  const handleCheckoutBack = () => {
    if (selectedProduct) {
      setCurrentPage('product-detail');
    } else {
      setCurrentPage('collection');
    }
  };

  const handleOrderComplete = (orderId: string) => {
    setCompletedOrderId(orderId);
    setCurrentPage('order-confirmation');
  };

  const handleOrderConfirmationBack = () => {
    setCurrentPage('home');
    setSelectedCategory('');
    setSelectedProduct(null);
    setCompletedOrderId('');
  };

  const handleProfileBack = () => {
    setCurrentPage('home');
  };

  const handleLoginSuccess = () => {
    // Redirect to intended page after login
    setCurrentPage('home');
  };

  const handleTrackOrder = (orderId: string) => {
    setTrackingOrderId(orderId);
    setCurrentPage('order-tracking');
  };

  const handleTrackingBack = () => {
    setCurrentPage('profile');
    setTrackingOrderId('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Only show header on desktop */}
      <div className="hidden md:block">
        <Header />
      </div>
      
      <MobileMenu />
      <CartDrawer />
      
      <main className="pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <HomePage key="home" onCategoryClick={handleCategoryClick} />
          )}
          {currentPage === 'collection' && (
            <CollectionPage 
              key="collection" 
              category={selectedCategory} 
              onBack={handleBackToHome}
              onProductClick={handleProductClick}
            />
          )}
          {currentPage === 'product-detail' && selectedProduct && (
            <ProductDetailPage
              key="product-detail"
              product={selectedProduct}
              onBack={handleBackToCollection}
              onBuyNow={handleBuyNow}
            />
          )}
          {currentPage === 'checkout' && (
            <SimpleCheckoutPage
              key="checkout"
              onBack={handleCheckoutBack}
              onOrderComplete={handleOrderComplete}
            />
          )}
          {currentPage === 'order-confirmation' && completedOrderId && (
            <OrderConfirmationPage
              key="order-confirmation"
              orderId={completedOrderId}
              onBackToHome={handleOrderConfirmationBack}
            />
          )}
          {currentPage === 'order-tracking' && trackingOrderId && (
            <OrderTrackingPage
              key="order-tracking"
              orderId={trackingOrderId}
              onBack={handleTrackingBack}
            />
          )}
          {currentPage === 'login' && (
            <LoginPage
              key="login"
              onBack={handleBackToHome}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
          {currentPage === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
                <p className="text-gray-600">Category page coming soon...</p>
              </div>
            </motion.div>
          )}
          {currentPage === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-screen flex items-center justify-center"
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cart</h2>
                <p className="text-gray-600">Use the cart icon in the header to view your cart</p>
              </div>
            </motion.div>
          )}
          {currentPage === 'profile' && (
            <CustomerProfilePage
              key="profile"
              onBack={handleProfileBack}
              onTrackOrder={handleTrackOrder}
            />
          )}
        </AnimatePresence>
      </main>

      <BottomNav activeTab={currentPage} onTabChange={handleTabChange} />
    </div>
  );
}

export default App;