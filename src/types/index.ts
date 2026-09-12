/**
 * Global types for the application
 */

export interface ShortenedUrl {
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

export interface ClickEvent {
  id: string
  url_id: string
  clicked_at: string
  referrer: string | null
  user_agent: string | null
}

export interface User {
  id: string
  email: string
  user_metadata?: Record<string, any>
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
