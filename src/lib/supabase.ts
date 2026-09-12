import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Add to .env.local:')
  console.warn('VITE_SUPABASE_URL=your_url')
  console.warn('VITE_SUPABASE_ANON_KEY=your_key')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  }
)

export type Database = {
  public: {
    Tables: {
      urls: {
        Row: {
          id: string
          user_id: string
          original_url: string
          short_code: string
          click_count: number
          is_active: boolean
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          original_url: string
          short_code: string
          click_count?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          original_url?: string
          short_code?: string
          click_count?: number
          is_active?: boolean
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      click_events: {
        Row: {
          id: string
          url_id: string
          clicked_at: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          url_id: string
          clicked_at?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          url_id?: string
          clicked_at?: string
          referrer?: string | null
          user_agent?: string | null
        }
      }
    }
  }
}
