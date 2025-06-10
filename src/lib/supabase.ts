import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Using mock data.');
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'https://placeholder.supabase.co' && 
    supabaseAnonKey !== 'placeholder-key' &&
    supabaseUrl.includes('supabase.co'));
};

// Test connection and run migration if needed
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    console.log('🔗 Testing Supabase connection...');
    
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
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return { success: false, error: 'Connection failed' };
  }
};

// Initialize Supabase connection
export const initializeSupabase = async () => {
  if (!isSupabaseConfigured()) {
    console.log('⚠️  Supabase not configured, using demo mode');
    console.log('📝 To enable database functionality:');
    console.log('   1. Update .env file with your Supabase credentials');
    console.log('   2. Restart the development server');
    return false;
  }

  try {
    console.log('🚀 Initializing Supabase connection...');
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
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    console.log('🔄 Falling back to demo mode');
    return false;
  }
};