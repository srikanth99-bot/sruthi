export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      landing_settings: {
        Row: {
          id: string
          page_title: string
          page_subtitle: string | null
          banner_image_url: string | null
          categories_list: string[] | null
          hero_description: string | null
          cta_text: string | null
          cta_link: string | null
          show_featured_products: boolean | null
          show_categories: boolean | null
          top_banner_text: string | null
          top_banner_active: boolean | null
          site_logo_url: string | null
          site_name: string | null
          best_selling_title: string | null
          best_selling_product_ids: string[] | null
          trending_title: string | null
          trending_product_ids: string[] | null
          popular_categories_title: string | null
          popular_category_ids: string[] | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          page_title?: string
          page_subtitle?: string | null
          banner_image_url?: string | null
          categories_list?: string[] | null
          hero_description?: string | null
          cta_text?: string | null
          cta_link?: string | null
          show_featured_products?: boolean | null
          show_categories?: boolean | null
          top_banner_text?: string | null
          top_banner_active?: boolean | null
          site_logo_url?: string | null
          site_name?: string | null
          best_selling_title?: string | null
          best_selling_product_ids?: string[] | null
          trending_title?: string | null
          trending_product_ids?: string[] | null
          popular_categories_title?: string | null
          popular_category_ids?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          page_title?: string
          page_subtitle?: string | null
          banner_image_url?: string | null
          categories_list?: string[] | null
          hero_description?: string | null
          cta_text?: string | null
          cta_link?: string | null
          show_featured_products?: boolean | null
          show_categories?: boolean | null
          top_banner_text?: string | null
          top_banner_active?: boolean | null
          site_logo_url?: string | null
          site_name?: string | null
          best_selling_title?: string | null
          best_selling_product_ids?: string[] | null
          trending_title?: string | null
          trending_product_ids?: string[] | null
          popular_categories_title?: string | null
          popular_category_ids?: string[] | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: string
          name: string
          price: number
          original_price: number | null
          category: string
          description: string
          images: string[]
          sizes: string[]
          colors: string[]
          stock: number
          featured: boolean
          rating: number
          review_count: number
          tags: string[]
          supports_feeding_friendly: boolean
          is_stitched_dress: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price: number
          original_price?: number | null
          category: string
          description?: string
          images?: string[]
          sizes?: string[]
          colors?: string[]
          stock?: number
          featured?: boolean
          rating?: number
          review_count?: number
          tags?: string[]
          supports_feeding_friendly?: boolean
          is_stitched_dress?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price?: number
          original_price?: number | null
          category?: string
          description?: string
          images?: string[]
          sizes?: string[]
          colors?: string[]
          stock?: number
          featured?: boolean
          rating?: number
          review_count?: number
          tags?: string[]
          supports_feeding_friendly?: boolean
          is_stitched_dress?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}