import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminDashboard from '../../pages/AdminDashboard';

const AdminRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    
    // Only listen for auth state changes if Supabase is configured
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setIsAuthenticated(!!session);
        setIsLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // For demo mode, check localStorage for admin session
      const adminSession = localStorage.getItem('adminSession');
      const sessionExpiry = localStorage.getItem('adminSessionExpiry');
      
      if (adminSession && sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } else {
        // Demo mode authentication check
        const adminSession = localStorage.getItem('adminSession');
        const sessionExpiry = localStorage.getItem('adminSessionExpiry');
        
        if (adminSession && sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsAuthenticated(true);
      // Set session expiry for 8 hours
      const expiry = Date.now() + (8 * 60 * 60 * 1000);
      localStorage.setItem('adminSession', 'true');
      localStorage.setItem('adminSessionExpiry', expiry.toString());
    }
  };

  const handleLogout = async () => {
    try {
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
      }
      
      // Clear demo session
      localStorage.removeItem('adminSession');
      localStorage.removeItem('adminSessionExpiry');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
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