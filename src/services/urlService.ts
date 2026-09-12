/**
 * URL Shortener Service
 * Handles URL creation, validation, and short code generation
 */

import { supabase } from '@/lib/supabase'

const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
const SHORT_CODE_LENGTH = 6
const MAX_RETRIES = 5

/**
 * Validates a URL string
 */
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Generates a cryptographically secure random short code
 */
function generateShortCode(): string {
  const array = new Uint8Array(SHORT_CODE_LENGTH)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map(byte => CHARACTERS[byte % CHARACTERS.length])
    .join('')
}

/**
 * Creates a new shortened URL in Supabase
 */
export async function createShortUrl(
  userId: string,
  originalUrl: string,
  expiresAt?: Date
) {
  if (!validateUrl(originalUrl)) {
    throw new Error('Invalid URL format')
  }

  // Normalize URL
  const url = new URL(originalUrl)
  const normalizedUrl = url.toString()

  // Try to generate a unique short code
  for (let i = 0; i < MAX_RETRIES; i++) {
    const shortCode = generateShortCode()

    try {
      const { data, error } = await supabase
        .from('urls')
        .insert({
          user_id: userId,
          original_url: normalizedUrl,
          short_code: shortCode,
          expires_at: expiresAt?.toISOString() || null,
          is_active: true,
          click_count: 0,
        })
        .select()
        .single()

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation (collision), retry
          continue
        }
        throw error
      }

      return data
    } catch (error: any) {
      if (error?.code === '23505') {
        // Collision, try again
        continue
      }
      throw error
    }
  }

  throw new Error('Failed to generate unique short code after multiple attempts')
}

/**
 * Resolves a short code to the original URL
 */
export async function resolveShortUrl(shortCode: string) {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('short_code', shortCode)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    throw error
  }

  // Check if expired
  if (data.expires_at) {
    const expiresAt = new Date(data.expires_at)
    if (expiresAt < new Date()) {
      return null
    }
  }

  return data
}

/**
 * Records a click event and increments click count
 */
export async function recordClick(urlId: string, referrer?: string, userAgent?: string) {
  try {
    // Record click event
    await supabase.from('click_events').insert({
      url_id: urlId,
      referrer: referrer || null,
      user_agent: userAgent || null,
    })

    // Increment click count using raw SQL for atomicity
    await supabase.rpc('increment_click_count', {
      url_id: urlId,
    })
  } catch (error) {
    console.error('Failed to record click:', error)
    // Don't throw - click recording is not critical to redirect
  }
}

/**
 * Gets all URLs for a user
 */
export async function getUserUrls(userId: string) {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Gets the number of clicks received by a user's links since the given time.
 */
export async function getClicksSince(urlIds: string[], since: Date) {
  if (urlIds.length === 0) return 0

  const { data, error } = await supabase
    .from('click_events')
    .select('id')
    .in('url_id', urlIds)
    .gte('clicked_at', since.toISOString())

  if (error) throw error
  return data.length
}

/**
 * Deletes a URL (soft delete via is_active = false)
 */
export async function deleteUrl(urlId: string) {
  const { error } = await supabase
    .from('urls')
    .update({ is_active: false })
    .eq('id', urlId)

  if (error) throw error
}

/**
 * Gets analytics for a specific URL
 */
export async function getUrlAnalytics(urlId: string, days: number = 7) {
  const since = new Date()
  since.setDate(since.getDate() - days)

  const { data, error } = await supabase
    .from('click_events')
    .select('*')
    .eq('url_id', urlId)
    .gte('clicked_at', since.toISOString())
    .order('clicked_at', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Gets the most clicked URLs for a user
 */
export async function getTopUrls(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('urls')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('click_count', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
