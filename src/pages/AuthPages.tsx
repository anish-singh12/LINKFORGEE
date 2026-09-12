/**
 * Enhanced Authentication Pages
 * Sign up and sign in with improved UX
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '@/services/authService'
import { Navbar } from '@/components/Navbar'
import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    console.log('[Login] Attempt:', { email })

    try {
      await authService.signIn(email, password)
      console.log('[Login] Success')
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in'
      console.error('[Login] Error:', errorMessage)

      // Map Supabase error codes to user-friendly messages
      if (errorMessage.includes('Email not confirmed')) {
        setError('Please confirm your email before signing in. Check your inbox for a verification link.')
      } else if (errorMessage.includes('Invalid login credentials')) {
        setError('Email or password is incorrect. Please try again.')
      } else if (errorMessage.includes('User not found')) {
        setError('No account found with this email. Create a new account to get started.')
      } else if (errorMessage.includes('Invalid email')) {
        setError('Please enter a valid email address.')
      } else {
        // Show actual error for diagnosis
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark dark:bg-gradient-dark text-white transition-colors duration-300">
      <Navbar />

      <div className="pt-32 pb-16">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-8 transition-colors duration-300">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">Sign In</h1>
              <p className="text-center text-gray-400 mb-8">Welcome back to LinkForge</p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 transition-colors duration-300"
                >
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-6"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-gray-400">
                Don't have an account?{' '}
                <a href="/signup" className="text-accent hover:text-accent-light font-medium transition-colors">
                  Sign up
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    console.log('[Signup] Attempt:', { email })

    try {
      await authService.signUp(email, password)
      console.log('[Signup] Success')
      setSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign up'

      console.error('[Signup] Error:', errorMessage)

      // Improved error messages
      if (errorMessage.includes('already registered')) {
        setError('An account with this email already exists. Try signing in instead.')
      } else if (errorMessage.includes('invalid email')) {
        setError('Please enter a valid email address.')
      } else if (errorMessage.includes('Invalid email')) {
        setError('Please enter a valid email address.')
      } else if (errorMessage.includes('Password')) {
        setError('Password does not meet security requirements.')
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-dark dark:bg-gradient-dark text-white transition-colors duration-300">
      <Navbar />

      <div className="pt-32 pb-16">
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="bg-dark-secondary border border-dark-tertiary rounded-xl p-8 transition-colors duration-300">
              <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
              <p className="text-center text-gray-400 mb-8">Join LinkForge and start shortening URLs</p>

              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex gap-3 transition-colors duration-300"
                >
                  <CheckCircle2 size={20} className="text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-green-400 text-sm font-medium">Account created successfully!</p>
                    <p className="text-green-400 text-xs mt-1">
                      {password ? 'Check your email to verify your account. Redirecting to login...' : ''}
                    </p>
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3 transition-colors duration-300"
                >
                  <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-1">At least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-dark border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 mt-6"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-gray-400">
                Already have an account?{' '}
                <a href="/login" className="text-accent hover:text-accent-light font-medium transition-colors">
                  Sign in
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
