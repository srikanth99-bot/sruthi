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