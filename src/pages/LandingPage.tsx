/**
 * Enhanced Landing Page
 * Shows different content for authenticated vs unauthenticated users
 */

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import * as urlService from '@/services/urlService'
import { Navbar } from '@/components/Navbar'
import { Hero3D } from '@/components/Hero3D'
import { ShortUrlSuccessCard } from '@/components/ShortUrlSuccessCard'
import { ShortenedUrl } from '@/types'
import { Copy, Link as LinkIcon, TrendingUp, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export function LandingPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const navigate = useNavigate()
  const [originalUrl, setOriginalUrl] = useState('')
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Authenticated-only state
  const [userUrls, setUserUrls] = useState<ShortenedUrl[]>([])
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    todayClicks: 0,
  })
  const [statsLoading, setStatsLoading] = useState(false)

  // Load user URLs and stats when authenticated
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      loadUserStats()
    }
  }, [isAuthenticated, user, isLoading])

  const loadUserStats = async () => {
    if (!user) return
    try {
      setStatsLoading(true)
      const urls = await urlService.getUserUrls(user.id)
      setUserUrls(urls.slice(0, 5)) // Show recent 5

      const totalClicks = urls.reduce((sum: number, url: ShortenedUrl) => sum + url.click_count, 0)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // Count today's clicks (simplified - would need click_events query for accurate count)
      const todayClicks = 0 // Would need to query click_events table

      setStats({
        totalLinks: urls.length,
        totalClicks,
        todayClicks,
      })
    } catch (err) {
      console.error('Failed to load stats:', err)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShortUrl(null)

    if (!originalUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!urlService.validateUrl(originalUrl)) {
      setError('Please enter a valid URL')
      return
    }

    setIsCreating(true)

    try {
      if (!isAuthenticated && !isLoading) {
        navigate('/signup')
        return
      }

      if (!user?.id) {
        setError('User not authenticated')
        setIsCreating(false)
        return
      }

      const result = await urlService.createShortUrl(user.id, originalUrl)

      if (result) {
        const full = `${window.location.origin}/${result.short_code}`
        setShortUrl(full)
        setOriginalUrl('')
        // Reload stats to show new URL
        await loadUserStats()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create short URL')
    } finally {
      setIsCreating(false)
    }
  }

  // Landing Page
  if (!isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark text-white">
        <Navbar />

        {/* Hero Section */}
        <div className="pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    Turn long links into
                    <span className="bg-gradient-accent text-transparent bg-clip-text">
                      {' '}
                      powerful short URLs
                    </span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-8">
                    Create, share, and track your links from one beautifully simple workspace.
                  </p>
                </div>

                {/* URL Shortener Form */}
                <form onSubmit={handleShorten} className="space-y-4">
                  <div className="flex gap-2 flex-col sm:flex-row">
                    <input
                      type="url"
                      value={originalUrl}
                      onChange={e => setOriginalUrl(e.target.value)}
                      placeholder="Paste your long URL here..."
                      className="flex-1 px-4 py-3 bg-dark-secondary border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={isCreating}
                      className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {isCreating ? 'Creating...' : 'Shorten URL'}
                    </motion.button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm"
                    >
                      {error}
                    </motion.p>
                  )}

                  {shortUrl && (
                    <ShortUrlSuccessCard
                      shortUrl={shortUrl}
                      originalUrl={originalUrl || 'URL'}
                      onCreateAnother={() => {
                        setShortUrl(null)
                        setOriginalUrl('')
                      }}
                    />
                  )}
                </form>
              </motion.div>

              {/* Right: 3D Visualization */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="hidden lg:block"
              >
                <Hero3D />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-dark-secondary/50 border-y border-dark-tertiary py-20">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-bold text-center mb-16">Why Choose LinkForge?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-dark-tertiary hover:border-accent/50 transition-colors"
              >
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">Instant Shortening</h3>
                <p className="text-gray-400">Generate short, memorable links in seconds. No complexity, just simplicity.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-dark-tertiary hover:border-accent/50 transition-colors"
              >
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2">Real-Time Analytics</h3>
                <p className="text-gray-400">Track clicks, referrers, and more. Watch your links perform in real-time.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                className="p-6 rounded-lg border border-dark-tertiary hover:border-accent/50 transition-colors"
              >
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">Enterprise Security</h3>
                <p className="text-gray-400">Your links are secure and private. We use industry-standard encryption.</p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-dark-tertiary py-8">
          <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
            <p>&copy; 2024 LinkForge. Built for the modern web.</p>
          </div>
        </footer>
      </div>
    )
  }

  // Authenticated Home (SaaS Workspace)
  if (isAuthenticated && user && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark text-white">
        <Navbar />

        <div className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-12"
            >
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, <span className="bg-gradient-accent text-transparent bg-clip-text">{user.email?.split('@')[0]}</span>
              </h1>
              <p className="text-gray-400">Create and manage your shortened links from here.</p>
            </motion.div>

            {/* Stats Grid */}
            {!statsLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 font-semibold">Total Links</h3>
                    <LinkIcon size={24} className="text-accent/50" />
                  </div>
                  <p className="text-4xl font-bold">{stats.totalLinks}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 font-semibold">Total Clicks</h3>
                    <TrendingUp size={24} className="text-accent/50" />
                  </div>
                  <p className="text-4xl font-bold">{stats.totalClicks}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="bg-dark-secondary border border-dark-tertiary rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-400 font-semibold">Today's Clicks</h3>
                    <Zap size={24} className="text-accent/50" />
                  </div>
                  <p className="text-4xl font-bold">{stats.todayClicks}</p>
                </motion.div>
              </div>
            )}

            {/* Create New URL Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-dark-secondary border border-dark-tertiary rounded-xl p-8 mb-12"
            >
              <h2 className="text-xl font-bold mb-6">Create New Short URL</h2>
              <form onSubmit={handleShorten} className="space-y-4">
                <div className="flex gap-2 flex-col sm:flex-row">
                  <input
                    type="url"
                    value={originalUrl}
                    onChange={e => setOriginalUrl(e.target.value)}
                    placeholder="Paste your long URL here..."
                    className="flex-1 px-4 py-3 bg-dark border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isCreating}
                    className="px-8 py-3 bg-accent hover:bg-accent-light text-white font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {isCreating ? 'Creating...' : 'Shorten'}
                  </motion.button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.p>
                )}

                {shortUrl && (
                  <ShortUrlSuccessCard
                    shortUrl={shortUrl}
                    originalUrl={originalUrl || 'URL'}
                    onCreateAnother={() => {
                      setShortUrl(null)
                      setOriginalUrl('')
                    }}
                  />
                )}
              </form>
            </motion.div>

            {/* Recent Links */}
            {userUrls.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-dark-secondary border border-dark-tertiary rounded-xl p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Links</h2>
                  <a href="/dashboard" className="text-accent hover:text-accent-light text-sm font-medium">
                    View All →
                  </a>
                </div>

                <div className="space-y-3">
                  {userUrls.map((url, idx) => (
                    <motion.div
                      key={url.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * idx }}
                      className="flex items-center justify-between p-4 bg-dark/50 border border-dark-tertiary rounded-lg hover:border-accent/30 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-accent truncate">
                          {window.location.origin}/{url.short_code}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-1">{url.original_url}</p>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <span className="text-sm text-gray-400">{url.click_count} clicks</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${url.short_code}`)}
                          className="p-2 hover:bg-accent/10 rounded transition-colors"
                          title="Copy"
                        >
                          <Copy size={16} className="text-gray-400 hover:text-accent" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  )
}
