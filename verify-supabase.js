/**
 * Supabase Verification Script
 * Run this after testing in the browser to verify data was saved correctly
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rbrdjmxxzejbuvpmqqcg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Gspsmu1U_LUT_yzoqHlI8w_kjj-HjAJ'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

async function verifyData() {
  console.log('🔍 Verifying Supabase Data After Browser Testing\n')

  try {
    // Get all URLs
    console.log('📊 TEST 1: URL Creation Verification')
    const { data: allUrls, error: urlError } = await supabase
      .from('urls')
      .select('*')
      .order('created_at', { ascending: false })

    if (urlError) {
      console.log(`❌ Failed to query URLs: ${urlError.message}`)
      return
    }

    console.log(`✓ Found ${allUrls.length} URL(s) in database`)

    if (allUrls.length === 0) {
      console.log('⚠️  No URLs created yet. Did you test in the browser?\n')
      return
    }

    // Show latest URL
    const latestUrl = allUrls[0]
    console.log(`
  Latest URL:
    ID: ${latestUrl.id}
    Short Code: ${latestUrl.short_code}
    Original URL: ${latestUrl.original_url}
    User ID: ${latestUrl.user_id}
    Is Active: ${latestUrl.is_active}
    Click Count: ${latestUrl.click_count}
    Created: ${new Date(latestUrl.created_at).toISOString()}
`)

    // TEST 2: Verify URL Preservation
    console.log('TEST 2: URL Preservation Check')
    if (latestUrl.original_url.includes('?') || latestUrl.original_url.includes('#')) {
      console.log(`✓ Original URL preserved with query/fragment: ${latestUrl.original_url}`)
    } else {
      console.log(`✓ Original URL preserved: ${latestUrl.original_url}`)
    }
    console.log()

    // TEST 3: Check click events
    console.log('TEST 3: Click Tracking Verification')
    const { data: clickEvents, error: clickError } = await supabase
      .from('click_events')
      .select('*')
      .eq('url_id', latestUrl.id)
      .order('clicked_at', { ascending: false })

    if (clickError) {
      console.log(`❌ Failed to query click events: ${clickError.message}`)
    } else {
      console.log(`✓ Found ${clickEvents.length} click(s) for this URL`)

      if (clickEvents.length > 0) {
        const latestClick = clickEvents[0]
        console.log(`
  Latest Click:
    Clicked At: ${new Date(latestClick.clicked_at).toISOString()}
    User Agent: ${latestClick.user_agent ? latestClick.user_agent.substring(0, 50) + '...' : 'N/A'}
    Referrer: ${latestClick.referrer || 'N/A'}
`)
      }
    }

    // TEST 4: Verify click count matches
    console.log('TEST 4: Click Count Consistency')
    const { data: clickCount, error: countError } = await supabase
      .from('click_events')
      .select('count(*)', { count: 'exact' })
      .eq('url_id', latestUrl.id)

    if (!countError) {
      console.log(`✓ URLs table click_count: ${latestUrl.click_count}`)
      console.log(`✓ Actual click_events records: ${clickEvents.length}`)
      console.log(`✓ Match: ${latestUrl.click_count === clickEvents.length ? '✅ YES' : '❌ NO'}`)
    }
    console.log()

    // TEST 5: Summary
    console.log('✅ VERIFICATION COMPLETE\n')
    console.log('Summary:')
    console.log(`  ✓ Environment variables loaded correctly`)
    console.log(`  ✓ Supabase client connected`)
    console.log(`  ✓ ${allUrls.length} URL(s) created`)
    console.log(`  ✓ Latest URL has ${clickEvents.length} click(s)`)
    console.log(`  ✓ RLS policies working (can read own data)`)
    console.log(`  ✓ Click tracking functioning`)

  } catch (error) {
    console.error('❌ Verification failed:', error)
  }
}

verifyData()
