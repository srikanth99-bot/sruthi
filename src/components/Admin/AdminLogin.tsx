import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertCircle, 
  Check,
  Loader,
  KeyRound,
  User,
  Mail
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { isSupabaseConfigured } from '../../lib/supabase';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const { adminLogin } = useStore();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    // Validate input
    if (!credentials.email || !credentials.password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    // Trim whitespace from inputs
    const trimmedCredentials = {
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password.trim()
    };
    try {
      console.log('🔐 Attempting admin login...');
      const success = await adminLogin(trimmedCredentials.email, trimmedCredentials.password);
      
      if (success) {
        // Successful login
        console.log('✅ Admin login successful');
        setError('');
        onLogin(true);
      } else {
        // Failed login
        console.log('❌ Admin login failed');
        setError('Invalid credentials. Please use: admin@looom.shop / admin123');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Security Warning */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 backdrop-blur-sm"
        >
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-red-400" />
            <div>
              <h3 className="text-red-300 font-bold">Restricted Access</h3>
              <p className="text-red-200 text-sm">Authorized personnel only</p>
            </div>
          </div>
        </motion.div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full mb-6 shadow-2xl">
              <Lock className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">Admin Access</h1>
            <p className="text-gray-300">Enter your credentials to continue</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center space-x-3"
            >
              <AlertCircle className="h-5 w-5 text-red-400" />
              <span className="text-red-300 font-medium">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                  placeholder="Enter password"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={!isLoading ? { scale: 1.02 } : {}}
              whileTap={!isLoading ? { scale: 0.98 } : {}}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span>Secure Login</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Demo Credentials Info */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <div className="text-center text-gray-400 text-sm">
              <p className="mb-2">🔒 {isSupabaseConfigured() ? 'Live Database Mode' : 'Demo Mode Active'}:</p>
              {!isSupabaseConfigured() && (
                <div className="bg-white/5 rounded-lg p-3 mb-3">
                  <p className="font-mono text-xs text-green-300">Email: admin@looom.shop</p>
                  <p className="font-mono text-xs text-green-300">Password: admin123</p>
                  <div className="mt-2 text-xs text-yellow-300">
                    <p>⚠️ Demo mode detected. Check console for details.</p>
                  </div>
                </div>
              )}
              <p className="text-xs">
                {isSupabaseConfigured() 
                  ? 'Use your Supabase account credentials' 
                  : 'Supabase not configured - using demo mode'
                }
              </p>
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-4 text-center text-gray-400 text-sm">
            <p className="mb-2">🔒 This area is protected by advanced security</p>
            <p>All login attempts are monitored and logged</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-400 text-sm">
          <p>© 2024 looom.shop - Admin Panel</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;