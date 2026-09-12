/**
 * Authentication Diagnostic Script
 * Tests Supabase auth connection and error handling
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rbrdjmxxzejbuvpmqqcg.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_Gspsmu1U_LUT_yzoqHlI8w_kjj-HjAJ'

console.log('🔍 Authentication Diagnostic\n')
console.log('Supabase URL:', SUPABASE_URL)
console.log('Anon Key:', SUPABASE_ANON_KEY.substring(0, 30) + '...\n')

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

async function runDiagnostics() {
  console.log('TEST 1: Supabase Client Initialization')
  console.log('✓ Client created successfully\n')

  console.log('TEST 2: Check Current Session')
  try {
    const { data: session, error } = await supabase.auth.getSession()
    console.log('Current session:', session ? 'Active' : 'None')
    if (error) console.log('Error:', error)
  } catch (err) {
    console.log('Error checking session:', err)
  }
  console.log()

  console.log('TEST 3: Test Sign Up with Valid Email')
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'

  try {
    console.log(`Attempting sign up with: ${testEmail}`)
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    })

    if (error) {
      console.log('❌ Sign up failed:', error.message)
      console.log('Error code:', error.code)
      console.log('Full error:', JSON.stringify(error, null, 2))
    } else {
      console.log('✓ Sign up successful')
      console.log('User ID:', data.user?.id)
      console.log('Email:', data.user?.email)
      console.log('Email confirmed:', data.user?.email_confirmed_at)
      console.log('Session:', data.session ? 'Active' : 'None')

      // Try to sign out
      await supabase.auth.signOut()
      console.log('✓ Signed out\n')

      console.log('TEST 4: Test Sign In with Created Account')
      try {
        console.log(`Attempting sign in with: ${testEmail}`)
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        })

        if (signInError) {
          console.log('❌ Sign in failed:', signInError.message)
          console.log('Error code:', signInError.code)
          console.log('Full error:', JSON.stringify(signInError, null, 2))
        } else {
          console.log('✓ Sign in successful')
          console.log('User ID:', signInData.user?.id)
          console.log('Email:', signInData.user?.email)
          console.log('Session token exists:', !!signInData.session?.access_token)
        }
      } catch (err) {
        console.log('❌ Sign in error:', err)
      }
    }
  } catch (err) {
    console.log('❌ Sign up error:', err)
  }

  console.log('\n✅ Diagnostic Complete')
  console.log('\nNext Steps:')
  console.log('1. Check browser console (F12) when signing up/in on http://localhost:5173')
  console.log('2. Look for exact error message from Supabase')
  console.log('3. Verify email is valid format (test@example.com)')
  console.log('4. Check if email confirmation is enabled in Supabase settings')
}

runDiagnostics()
