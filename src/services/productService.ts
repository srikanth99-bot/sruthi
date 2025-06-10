import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Product } from '../types';
import { mockProducts } from '../data/mockData';

// Transform database row to Product type
const transformDbProduct = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  price: dbProduct.price,
  originalPrice: dbProduct.original_price,
  category: dbProduct.category,
  description: dbProduct.description,
  images: dbProduct.images || [],
  sizes: dbProduct.sizes || [],
  colors: dbProduct.colors || [],
  inStock: dbProduct.stock > 0,
  featured: dbProduct.featured,
  rating: dbProduct.rating,
  reviewCount: dbProduct.review_count,
  tags: dbProduct.tags || [],
  supportsFeedingFriendly: dbProduct.supports_feeding_friendly,
  isStitchedDress: dbProduct.is_stitched_dress,
  createdAt: dbProduct.created_at,
  updatedAt: dbProduct.updated_at
});

// Transform Product type to database insert
const transformProductToDb = (product: Partial<Product>) => ({
  name: product.name,
  price: product.price,
  original_price: product.originalPrice,
  category: product.category,
  description: product.description || '',
  images: product.images || [],
  sizes: product.sizes || [],
  colors: product.colors || [],
  stock: product.inStock ? 10 : 0, // Default stock quantity
  featured: product.featured || false,
  rating: product.rating || 4.5,
  review_count: product.reviewCount || 0,
  tags: product.tags || [],
  supports_feeding_friendly: product.supportsFeedingFriendly || false,
  is_stitched_dress: product.isStitchedDress || false
});

export const productService = {
  // Get all products
  async getProducts(): Promise<Product[]> {
    if (!isSupabaseConfigured()) {
      console.log('Using mock data - Supabase not configured');
      return mockProducts;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return mockProducts; // Fallback to mock data
      }

      return data?.map(transformDbProduct) || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      return mockProducts; // Fallback to mock data
    }
  },

  // Get product by ID
  async getProduct(id: string): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      return mockProducts.find(p => p.id === id) || null;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        return null;
      }

      return data ? transformDbProduct(data) : null;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  },

  // Create product
  async createProduct(product: Partial<Product>): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      console.log('Mock mode: Product would be created');
      const newProduct: Product = {
        id: 'mock_' + Date.now(),
        name: product.name || '',
        price: product.price || 0,
        originalPrice: product.originalPrice,
        category: product.category || '',
        description: product.description || '',
        images: product.images || [],
        sizes: product.sizes || [],
        colors: product.colors || [],
        inStock: product.inStock ?? true,
        featured: product.featured || false,
        rating: product.rating || 4.5,
        reviewCount: product.reviewCount || 0,
        tags: product.tags || [],
        supportsFeedingFriendly: product.supportsFeedingFriendly || false,
        isStitchedDress: product.isStitchedDress || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newProduct;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([transformProductToDb(product)])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        throw error;
      }

      return data ? transformDbProduct(data) : null;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Update product
  async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (!isSupabaseConfigured()) {
      console.log('Mock mode: Product would be updated');
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('products')
        .update(transformProductToDb(updates))
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }

      return data ? transformDbProduct(data) : null;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.log('Mock mode: Product would be deleted');
      return true;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },

  // Subscribe to product changes
  subscribeToProducts(callback: (products: Product[]) => void) {
    if (!isSupabaseConfigured()) {
      return () => {}; // Return empty unsubscribe function
    }

    const subscription = supabase
      .channel('products_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          // Refetch all products when any change occurs
          const products = await this.getProducts();
          callback(products);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }
};