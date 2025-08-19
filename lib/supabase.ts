import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (generated from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          name: string
          role: 'admin' | 'receptionist' | 'housekeeping' | 'maintenance' | 'accountant' | 'restaurant' | 'events' | 'spa' | 'support'
          department: string | null
          phone: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          name: string
          role: 'admin' | 'receptionist' | 'housekeeping' | 'maintenance' | 'accountant' | 'restaurant' | 'events' | 'spa' | 'support'
          department?: string
          phone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          name?: string
          role?: 'admin' | 'receptionist' | 'housekeeping' | 'maintenance' | 'accountant' | 'restaurant' | 'events' | 'spa' | 'support'
          department?: string
          phone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      guests: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          country: string | null
          city: string | null
          address: string | null
          id_number: string | null
          nationality: string | null
          date_of_birth: string | null
          loyalty_tier: string
          loyalty_points: number
          preferences: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email?: string
          phone?: string
          country?: string
          city?: string
          address?: string
          id_number?: string
          nationality?: string
          date_of_birth?: string
          loyalty_tier?: string
          loyalty_points?: number
          preferences?: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          country?: string
          city?: string
          address?: string
          id_number?: string
          nationality?: string
          date_of_birth?: string
          loyalty_tier?: string
          loyalty_points?: number
          preferences?: any
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          booking_reference: string
          guest_id: string
          booking_type: 'room' | 'dining' | 'event' | 'facility' | 'package'
          room_id: string | null
          check_in_date: string | null
          check_out_date: string | null
          adults: number
          children: number
          dining_venue_id: string | null
          dining_date: string | null
          dining_time: string | null
          party_size: number | null
          event_space_id: string | null
          event_date: string | null
          event_start_time: string | null
          event_end_time: string | null
          event_type: string | null
          attendees: number | null
          facility_service_id: string | null
          service_date: string | null
          service_time: string | null
          total_amount: number
          deposit_amount: number
          currency: string
          status: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show'
          payment_status: 'pending' | 'partial' | 'paid' | 'refunded'
          special_requests: string | null
          internal_notes: string | null
          confirmation_code: string | null
          email_sent: boolean
          sms_sent: boolean
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_reference: string
          guest_id: string
          booking_type: 'room' | 'dining' | 'event' | 'facility' | 'package'
          room_id?: string
          check_in_date?: string
          check_out_date?: string
          adults?: number
          children?: number
          dining_venue_id?: string
          dining_date?: string
          dining_time?: string
          party_size?: number
          event_space_id?: string
          event_date?: string
          event_start_time?: string
          event_end_time?: string
          event_type?: string
          attendees?: number
          facility_service_id?: string
          service_date?: string
          service_time?: string
          total_amount: number
          deposit_amount?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show'
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded'
          special_requests?: string
          internal_notes?: string
          confirmation_code?: string
          email_sent?: boolean
          sms_sent?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          booking_reference?: string
          guest_id?: string
          booking_type?: 'room' | 'dining' | 'event' | 'facility' | 'package'
          room_id?: string
          check_in_date?: string
          check_out_date?: string
          adults?: number
          children?: number
          dining_venue_id?: string
          dining_date?: string
          dining_time?: string
          party_size?: number
          event_space_id?: string
          event_date?: string
          event_start_time?: string
          event_end_time?: string
          event_type?: string
          attendees?: number
          facility_service_id?: string
          service_date?: string
          service_time?: string
          total_amount?: number
          deposit_amount?: number
          currency?: string
          status?: 'pending' | 'confirmed' | 'checked_in' | 'completed' | 'cancelled' | 'no_show'
          payment_status?: 'pending' | 'partial' | 'paid' | 'refunded'
          special_requests?: string
          internal_notes?: string
          confirmation_code?: string
          email_sent?: boolean
          sms_sent?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      room_types: {
        Row: {
          id: string
          name: string
          description: string | null
          base_price: number
          max_occupancy: number
          amenities: any
          images: any
          features: string[] | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string
          base_price: number
          max_occupancy: number
          amenities?: any
          images?: any
          features?: string[]
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          base_price?: number
          max_occupancy?: number
          amenities?: any
          images?: any
          features?: string[]
          is_active?: boolean
          created_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          room_number: string
          room_type_id: string
          floor: number | null
          status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out_of_order'
          view_type: string | null
          balcony: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_number: string
          room_type_id: string
          floor?: number
          status?: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out_of_order'
          view_type?: string
          balcony?: boolean
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_number?: string
          room_type_id?: string
          floor?: number
          status?: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out_of_order'
          view_type?: string
          balcony?: boolean
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      dining_venues: {
        Row: {
          id: string
          name: string
          type: 'fine_dining' | 'casual_dining' | 'bar_lounge' | 'pool_bar' | 'coffee_shop' | 'room_service' | 'private_dining'
          description: string | null
          capacity: number | null
          opening_hours: any | null
          menu_items: any
          images: any
          price_range: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'fine_dining' | 'casual_dining' | 'bar_lounge' | 'pool_bar' | 'coffee_shop' | 'room_service' | 'private_dining'
          description?: string
          capacity?: number
          opening_hours?: any
          menu_items?: any
          images?: any
          price_range?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'fine_dining' | 'casual_dining' | 'bar_lounge' | 'pool_bar' | 'coffee_shop' | 'room_service' | 'private_dining'
          description?: string
          capacity?: number
          opening_hours?: any
          menu_items?: any
          images?: any
          price_range?: string
          is_active?: boolean
          created_at?: string
        }
      }
      event_spaces: {
        Row: {
          id: string
          name: string
          type: 'meeting_room' | 'conference_hall' | 'banquet_hall' | 'outdoor_space' | 'boardroom' | 'wedding_venue'
          capacity: number
          area_sqm: number | null
          equipment: any
          catering_available: boolean
          av_equipment: boolean
          wifi: boolean
          natural_light: boolean
          price_per_hour: number | null
          images: any
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'meeting_room' | 'conference_hall' | 'banquet_hall' | 'outdoor_space' | 'boardroom' | 'wedding_venue'
          capacity: number
          area_sqm?: number
          equipment?: any
          catering_available?: boolean
          av_equipment?: boolean
          wifi?: boolean
          natural_light?: boolean
          price_per_hour?: number
          images?: any
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'meeting_room' | 'conference_hall' | 'banquet_hall' | 'outdoor_space' | 'boardroom' | 'wedding_venue'
          capacity?: number
          area_sqm?: number
          equipment?: any
          catering_available?: boolean
          av_equipment?: boolean
          wifi?: boolean
          natural_light?: boolean
          price_per_hour?: number
          images?: any
          is_active?: boolean
          created_at?: string
        }
      }
      facility_services: {
        Row: {
          id: string
          name: string
          category: 'spa' | 'fitness' | 'pool' | 'wellness' | 'recreation' | 'business' | 'transport' | 'laundry'
          description: string | null
          duration_minutes: number | null
          price: number | null
          capacity: number
          equipment_needed: string[] | null
          images: any
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category: 'spa' | 'fitness' | 'pool' | 'wellness' | 'recreation' | 'business' | 'transport' | 'laundry'
          description?: string
          duration_minutes?: number
          price?: number
          capacity?: number
          equipment_needed?: string[]
          images?: any
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: 'spa' | 'fitness' | 'pool' | 'wellness' | 'recreation' | 'business' | 'transport' | 'laundry'
          description?: string
          duration_minutes?: number
          price?: number
          capacity?: number
          equipment_needed?: string[]
          images?: any
          is_active?: boolean
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          booking_id: string
          payment_method: 'card' | 'mobile_money' | 'bank_transfer' | 'cash' | 'paypal'
          provider: string | null
          transaction_id: string | null
          reference_number: string | null
          amount: number
          currency: string
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          phone_number: string | null
          failure_reason: string | null
          metadata: any
          processed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          payment_method: 'card' | 'mobile_money' | 'bank_transfer' | 'cash' | 'paypal'
          provider?: string
          transaction_id?: string
          reference_number?: string
          amount: number
          currency?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          phone_number?: string
          failure_reason?: string
          metadata?: any
          processed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          payment_method?: 'card' | 'mobile_money' | 'bank_transfer' | 'cash' | 'paypal'
          provider?: string
          transaction_id?: string
          reference_number?: string
          amount?: number
          currency?: string
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded'
          phone_number?: string
          failure_reason?: string
          metadata?: any
          processed_at?: string
          created_at?: string
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
  }
}
