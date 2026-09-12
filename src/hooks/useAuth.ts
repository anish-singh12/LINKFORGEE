/**
 * Custom hooks for authentication
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { User, AuthState } from '@/types'
import * as authService from '@/services/authService'

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check current session
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        setState({
          user: user as User,
          isLoading: false,
          isAuthenticated: !!user,
        })
      } catch (error) {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        })
      }
    }

    checkAuth()

    // Listen to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({
        user: session?.user as User,
        isLoading: false,
        isAuthenticated: !!session?.user,
      })
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  return state
}
