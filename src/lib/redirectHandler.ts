/**
 * URL Resolution and Redirect Handler
 * This is the core redirect mechanism that handles /:shortCode routes
 */

import { supabase } from '@/lib/supabase'

/**
 * Resolves and redirects to the original URL
 * Returns true if successful, false if not found or expired
 */
export async function handleRedirect(shortCode: string): Promise<boolean> {
  try {
    // Query the URL
    const { data, error } = await supabase
      .from('urls')
      .select('id, original_url, is_active, expires_at')
      .eq('short_code', shortCode)
      .single()

    if (error || !data) {
      return false
    }

    // Check if active
    if (!data.is_active) {
      return false
    }

    // Check if expired
    if (data.expires_at) {
      const expiresAt = new Date(data.expires_at)
      if (expiresAt < new Date()) {
        return false
      }
    }

    // Record click event asynchronously (don't block redirect)
    try {
      // Record click
      await supabase.from('click_events').insert({
        url_id: data.id,
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      })

      // Increment click count
      await supabase.rpc('increment_click_count', {
        url_id: data.id,
      })
    } catch (e) {
      // Don't block redirect if click recording fails
      console.error('Failed to record click:', e)
    }

    // Perform the actual redirect
    window.location.href = data.original_url

    return true
  } catch (error) {
    console.error('Redirect error:', error)
    return false
  }
}
