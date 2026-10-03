/**
 * Authentication Service
 * Handles Supabase Auth integration
 */

import { supabase } from '@/lib/supabase'

export async function signUp(email: string, password: string, name?: string) {
  console.log('[Auth Service] Sign up attempt:', { email })

  // Validate email format
  if (!email || !email.includes('@')) {
    const error = new Error('Invalid email format')
    console.error('[Auth Service] Validation error:', error.message)
    throw error
  }

  // Validate password
  if (!password || password.length < 6) {
    const error = new Error('Password must be at least 6 characters')
    console.error('[Auth Service] Validation error:', error.message)
    throw error
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })

    console.log('[Auth Service] Sign up response:', { error: error?.message, userId: data?.user?.id })

    if (error) {
      console.error('[Auth Service] Sign up error:', {
        message: error.message,
        code: error.code,
        status: error.status,
      })
      throw error
    }

    return data
  } catch (err) {
    console.error('[Auth Service] Sign up exception:', err)
    throw err
  }
}

export async function signIn(email: string, password: string) {
  console.log('[Auth Service] Sign in attempt:', { email })

  // Validate email format
  if (!email || !email.includes('@')) {
    const error = new Error('Invalid email format')
    console.error('[Auth Service] Validation error:', error.message)
    throw error
  }

  // Validate password
  if (!password) {
    const error = new Error('Password is required')
    console.error('[Auth Service] Validation error:', error.message)
    throw error
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    console.log('[Auth Service] Sign in response:', { error: error?.message, userId: data?.user?.id })

    if (error) {
      console.error('[Auth Service] Sign in error:', {
        message: error.message,
        code: error.code,
        status: error.status,
      })
      throw error
    }

    return data
  } catch (err) {
    console.error('[Auth Service] Sign in exception:', err)
    throw err
  }
}

export async function signOut() {
  console.log('[Auth Service] Sign out attempt')

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('[Auth Service] Sign out error:', error.message)
      throw error
    }

    console.log('[Auth Service] Sign out successful')
  } catch (err) {
    console.error('[Auth Service] Sign out exception:', err)
    throw err
  }
}

export async function getCurrentUser() {
  console.log('[Auth Service] Get current user')

  try {
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.error('[Auth Service] Get user error:', error.message)
      throw error
    }

    console.log('[Auth Service] Current user:', data.user?.email)
    return data.user
  } catch (err) {
    console.error('[Auth Service] Get user exception:', err)
    throw err
  }
}

export async function getSession() {
  console.log('[Auth Service] Get session')

  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('[Auth Service] Get session error:', error.message)
      throw error
    }

    console.log('[Auth Service] Session exists:', !!data.session)
    return data.session
  } catch (err) {
    console.error('[Auth Service] Get session exception:', err)
    throw err
  }
}
