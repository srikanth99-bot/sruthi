import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from '../../pages/AdminDashboard';

const AdminRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const session = localStorage.getItem('adminSession');
    const expiry = localStorage.getItem('adminSessionExpiry');
    
    if (session && expiry) {
      const now = Date.now();
      const expiryTime = parseInt(expiry);
      
      if (now < expiryTime) {
        setIsAuthenticated(true);
      } else {
        // Session expired
        localStorage.removeItem('adminSession');
        localStorage.removeItem('adminSessionExpiry');
        setIsAuthenticated(false);
      }
    }
    
    setIsLoading(false);
  };

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminRoute;