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
          id: number
          name: string
          price: number
          brand: string
          category: string
          description: string
          features: string[]
          specifications: Json
          stock: number
          image: string 
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          price: number
          brand: string
          category: string
          description: string
          features?: string[]
          specifications?: Json
          stock: number
          image: string 
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          price?: number
          brand?: string
          category?: string
          description?: string
          features?: string[]
          specifications?: Json
          stock?: number
          image?: string 
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          }
        ]
      }
      product_ratings: {
        Row: {
          id: number
          product_id: number
          average_rating: number
          rating_count: number
          one_star_count: number
          two_star_count: number
          three_star_count: number
          four_star_count: number
          five_star_count: number
          updated_at: string
        }
        Insert: {
          id?: number
          product_id: number
          average_rating: number
          rating_count?: number
          one_star_count?: number
          two_star_count?: number
          three_star_count?: number
          four_star_count?: number
          five_star_count?: number
          updated_at?: string
        }
        Update: {
          id?: number
          product_id?: number
          average_rating?: number
          rating_count?: number
          one_star_count?: number
          two_star_count?: number
          three_star_count?: number
          four_star_count?: number
          five_star_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_ratings_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      vendors: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      featured_products: {
        Row: {
          id: number
          product_id: number
          vendor_id: number
          position: number
          featured_since: string
        }
        Insert: {
          id?: number
          product_id: number
          vendor_id: number
          position?: number
          featured_since?: string
        }
        Update: {
          id?: number
          product_id?: number
          vendor_id?: number
          position?: number
          featured_since?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_products_vendor_id_fkey"
            columns: ["vendor_id"]
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}