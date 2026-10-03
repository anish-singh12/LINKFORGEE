import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import * as authService from '@/services/authService'
import { Navbar } from '@/components/Navbar'
import { motion } from 'framer-motion'
import {
  Mail,
  Lock,
  Link2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'

type AuthMode = 'login' | 'register'

interface AuthPageProps {
  initialMode: AuthMode
}

export function LoginPage() {
  return <AuthPage initialMode="login" />
}

export function SignupPage() {
  return <AuthPage initialMode="register" />
}

export function AuthPage({ initialMode }: AuthPageProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const [mode, setMode] = useState<AuthMode>(() => {
    return location.pathname === '/signup' ? 'register' : initialMode
  })

  useEffect(() => {
    if (location.pathname === '/signup' && mode !== 'register') {
      setMode('register')
    } else if (location.pathname === '/login' && mode !== 'login') {
      setMode('login')
    }
  }, [location.pathname])

  // Login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // Register
  const [registerName, setRegisterName] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('')
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)

  const switchToLogin = () => {
    setLoginError('')
    setRegisterError('')
    setRegisterSuccess(false)
    setMode('login')
    navigate('/login')
  }

  const switchToRegister = () => {
    setLoginError('')
    setRegisterError('')
    setRegisterSuccess(false)
    setMode('register')
    navigate('/signup')
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      await authService.signIn(loginEmail, loginPassword)
      navigate('/dashboard')
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign in'

      if (errorMessage.includes('Email not confirmed')) {
        setLoginError('Please confirm your email before signing in. Check your inbox.')
      } else if (errorMessage.includes('Invalid login credentials')) {
        setLoginError('Email or password is incorrect. Please try again.')
      } else if (errorMessage.includes('User not found')) {
        setLoginError('No account found with this email. Create an account first.')
      } else if (errorMessage.toLowerCase().includes('invalid email')) {
        setLoginError('Please enter a valid email address.')
      } else {
        setLoginError(errorMessage)
      }
    } finally {
      setLoginLoading(false)
    }
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setRegisterError('')
    setRegisterSuccess(false)

    if (registerPassword !== registerConfirmPassword) {
      setRegisterError('Passwords do not match.')
      return
    }

    if (registerPassword.length < 6) {
      setRegisterError('Password must be at least 6 characters.')
      return
    }

    setRegisterLoading(true)

    try {
      await authService.signUp(registerEmail, registerPassword, registerName.trim())
      setRegisterSuccess(true)
      setRegisterName('')
      setRegisterEmail('')
      setRegisterPassword('')
      setRegisterConfirmPassword('')

      setTimeout(() => {
        setMode('login')
        setRegisterSuccess(false)
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign up'

      if (errorMessage.toLowerCase().includes('already registered')) {
        setRegisterError('An account with this email already exists. Try signing in instead.')
      } else if (errorMessage.toLowerCase().includes('invalid email')) {
        setRegisterError('Please enter a valid email address.')
      } else if (errorMessage.toLowerCase().includes('password')) {
        setRegisterError(errorMessage)
      } else {
        setRegisterError(errorMessage)
      }
    } finally {
      setRegisterLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08090a] via-[#0d0e10] to-[#08090a] light:from-[#f0f4ff] light:via-[#e8eef8] light:to-[#f0f4ff] transition-colors duration-300">
      <Navbar />

      <main className="min-h-[calc(100vh-68px)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card Container */}
          <div className="bg-dark-secondary/80 light:bg-white backdrop-blur-xl border border-dark-tertiary/50 light:border-slate-200 rounded-2xl shadow-2xl light:shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-8 pt-8 pb-6 text-center border-b border-dark-tertiary/30 light:border-slate-200">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-light light:from-blue-500 light:to-blue-600 mb-4 shadow-lg">
                <Link2 size={28} className="text-white" strokeWidth={2.5} />
              </div>

              {mode === 'login' ? (
                <>
                  <h1 className="text-2xl font-bold text-white light:text-slate-900 mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-sm text-gray-400 light:text-slate-600">
                    Sign in to continue to LinkForge
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white light:text-slate-900 mb-2">
                    Create Account
                  </h1>
                  <p className="text-sm text-gray-400 light:text-slate-600">
                    Join LinkForge and start shortening URLs
                  </p>
                </>
              )}
            </div>

            {/* Form Content */}
            <div className="p-8">
              {mode === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 light:text-slate-600 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 light:text-slate-400" size={18} />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-300 rounded-lg focus:border-accent light:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-accent/20 light:focus:ring-blue-500/20 text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 light:text-slate-600 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 light:text-slate-400" size={18} />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-300 rounded-lg focus:border-accent light:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-accent/20 light:focus:ring-blue-500/20 text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  {loginError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 bg-red-500/10 light:bg-rose-50 border border-red-500/20 light:border-rose-200 rounded-lg"
                    >
                      <AlertCircle size={16} className="text-red-400 light:text-rose-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-400 light:text-rose-600">{loginError}</span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent to-accent-light light:from-blue-600 light:to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/20 light:hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loginLoading ? (
                      'Signing in...'
                    ) : (
                      <>
                        Sign In
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 light:text-slate-600 uppercase tracking-wider mb-2">
                      Name
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 light:text-slate-400" size={18} />
                      <input
                        type="text"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-300 rounded-lg focus:border-accent light:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-accent/20 light:focus:ring-blue-500/20 text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 light:text-slate-600 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 light:text-slate-400" size={18} />
                      <input
                        type="email"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-300 rounded-lg focus:border-accent light:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-accent/20 light:focus:ring-blue-500/20 text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 light:text-slate-600 uppercase tracking-wider mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 light:text-slate-400" size={18} />
                      <input
                        type="password"
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Create a password"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-300 rounded-lg focus:border-accent light:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-accent/20 light:focus:ring-blue-500/20 text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 light:text-slate-600 uppercase tracking-wider mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 light:text-slate-400" size={18} />
                      <input
                        type="password"
                        value={registerConfirmPassword}
                        onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-300 rounded-lg focus:border-accent light:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-accent/20 light:focus:ring-blue-500/20 text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 transition-all"
                      />
                    </div>
                  </div>

                  {registerError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 bg-red-500/10 light:bg-rose-50 border border-red-500/20 light:border-rose-200 rounded-lg"
                    >
                      <AlertCircle size={16} className="text-red-400 light:text-rose-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-red-400 light:text-rose-600">{registerError}</span>
                    </motion.div>
                  )}

                  {registerSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 bg-green-500/10 light:bg-emerald-50 border border-green-500/20 light:border-emerald-200 rounded-lg"
                    >
                      <CheckCircle2 size={16} className="text-green-400 light:text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-green-400 light:text-emerald-600">
                        Account created successfully! Redirecting...
                      </span>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={registerLoading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-accent to-accent-light light:from-blue-600 light:to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-accent/20 light:hover:shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {registerLoading ? (
                      'Creating account...'
                    ) : (
                      <>
                        Create Account
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Switch Mode */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 light:text-slate-600">
                  {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                  <button
                    type="button"
                    onClick={mode === 'login' ? switchToRegister : switchToLogin}
                    className="ml-2 text-accent light:text-blue-600 hover:text-accent-light light:hover:text-blue-500 font-semibold transition-colors"
                  >
                    {mode === 'login' ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
