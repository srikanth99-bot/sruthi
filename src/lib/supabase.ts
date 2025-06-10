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
    supabaseAnonKey !== 'placeholder-key');
};

// Test connection and run migration if needed
export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured()) {
    return { success: false, error: 'Supabase not configured' };
  }

  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('products')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Supabase connection failed:', error);
    return { success: false, error: 'Connection failed' };
  }
};

// Initialize Supabase connection
export const initializeSupabase = async () => {
  if (!isSupabaseConfigured()) {
    console.log('Supabase not configured, using demo mode');
    return false;
  }

  try {
    console.log('Testing Supabase connection...');
    const result = await testSupabaseConnection();
    
    if (result.success) {
      console.log('✅ Supabase connected successfully');
      return true;
    } else {
      console.error('❌ Supabase connection failed:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    return false;
  }
};