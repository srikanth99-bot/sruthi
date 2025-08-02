import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get environment variables with validation and defaults
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using mock data.');
}

// Create a dummy client for demo mode
const createDummyClient = () => {
  return {
    from: () => ({
      select: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
        limit: () => Promise.resolve({ data: [], error: null }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        }),
        order: () => Promise.resolve({ data: [], error: null })
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
      upsert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
      signOut: () => Promise.resolve({ error: null })
    },
    channel: () => ({
      on: () => ({ subscribe: () => ({ unsubscribe: () => {} }) })
    })
  } as any;
};

// Create the client if we have valid URL and key, otherwise use dummy client
export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey) 
  : createDummyClient();

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const hasValidUrl = supabaseUrl && supabaseUrl.startsWith('https://') && 
    (supabaseUrl.includes('supabase.co') || supabaseUrl.includes('supabase.in'));
  const hasValidKey = supabaseAnonKey && supabaseAnonKey.startsWith('eyJ');
  
  console.log('🔍 Supabase Configuration Check:');
  console.log('  URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
  console.log('  Key:', supabaseAnonKey ? '✅ Present' : '❌ Missing');
  console.log('  Valid URL:', hasValidUrl ? '✅ Valid' : '❌ Invalid');
  console.log('  Valid Key:', hasValidKey ? '✅ Valid' : '❌ Invalid');
  
  return !!(hasValidUrl && hasValidKey);
};

// Test connection and run migration if needed
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    console.log('🔗 Testing Supabase connection...');
    
    try {
      // Test basic connection with a simple query
      const { data, error } = await supabase
        .from('products')
        .select('count')
        .limit(1);
      
      if (error) {
        console.error('❌ Supabase connection error:', error);
        return { success: false, error: error.message };
      }
      
      console.log('✅ Supabase connection successful');
      return { success: true, data };
    } catch (fetchError) {
      console.error('❌ Supabase fetch error:', fetchError);
      return { success: false, error: 'Network error when connecting to Supabase' };
    }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error: 'Connection failed' };
  }
};

// Initialize Supabase connection
export const initializeSupabase = async () => {
  // Always log the configuration status
  if (!isSupabaseConfigured()) {
    console.log('⚠️  Supabase not configured, using demo mode');
    console.log('📝 To enable database functionality:');
    console.log('   1. Update .env file with your Supabase credentials');
    console.log('   2. Restart the development server');
    return false;
  }

  try {
    console.log('🚀 Initializing Supabase connection...');
    
    try {
      const result = await testSupabaseConnection();
      
      if (result.success) {
        console.log('✅ Supabase connected successfully');
        console.log('💾 Products will now persist in the database');
        return true;
      } else {
        console.error('❌ Supabase connection failed:', result.error);
        console.log('🔄 Falling back to demo mode');
        return false;
      }
    } catch (connectionError) {
      console.error('❌ Supabase connection error:', connectionError);
      console.log('🔄 Falling back to demo mode');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    console.log('🔄 Falling back to demo mode');
    return false;
  }
};

// Admin authentication helper
export const signInAsAdmin = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️  Demo mode: Admin authentication simulated');
    // Demo credentials check
    if (email === 'admin@looom.shop' && password === 'admin123') {
      return { success: true, user: { email, role: 'admin' } };
    }
    return { success: false, error: 'Invalid credentials' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('❌ Admin authentication failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Admin authenticated successfully');
    return { success: true, user: data.user };
  } catch (error) {
    console.error('❌ Admin authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
};

// Check if current user is authenticated
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    // In demo mode, check localStorage for admin session
    const adminSession = localStorage.getItem('adminSession');
    const sessionExpiry = localStorage.getItem('adminSessionExpiry');
    
    if (adminSession && sessionExpiry && Date.now() < parseInt(sessionExpiry)) {
      return { id: 'demo-admin', email: 'admin@looom.shop', role: 'admin' };
    }
    return null;
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Error getting current user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('❌ Error checking authentication:', error);
    return null;
  }
};

// Sign out user
export const signOut = async () => {
  if (!isSupabaseConfigured()) {
    // Clear demo session
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminSessionExpiry');
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Sign out failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Sign out error:', error);
    return { success: false, error: 'Sign out failed' };
  }
};