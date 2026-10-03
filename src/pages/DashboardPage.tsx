/**
 * Premium Dashboard Page
 * Complete redesign with polished analytics and management
 */

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import * as urlService from '@/services/urlService'
import { ShortenedUrl } from '@/types'
import { DashboardHeader } from '@/components/DashboardHeader'
import { StatGrid } from '@/components/StatCard'
import { LinksTable } from '@/components/LinksTable'
import { NewUrlModal } from '@/components/NewUrlModal'
import { motion } from 'framer-motion'
import { Plus, Link as LinkIcon, TrendingUp, Zap, Clock } from 'lucide-react'

export function DashboardPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [urls, setUrls] = useState<ShortenedUrl[]>([])
  const [filteredUrls, setFilteredUrls] = useState<ShortenedUrl[]>([])
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    clicksToday: 0,
    avgClicksPerLink: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'clicks' | 'name'>('recent')
  const [isNewUrlModalOpen, setIsNewUrlModalOpen] = useState(false)

  useEffect(() => {
    if (authLoading) return

    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadData()
  }, [isAuthenticated, user, authLoading])

  useEffect(() => {
    // Filter and sort URLs
    let filtered = urls.filter(url =>
      url.original_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.short_code.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (sortBy === 'clicks') {
      filtered.sort((a, b) => b.click_count - a.click_count)
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.original_url.localeCompare(b.original_url))
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredUrls(filtered)
  }, [searchQuery, urls, sortBy])

  const loadData = async () => {
    if (!user) return

    try {
      setIsLoading(true)
      const userUrls = await urlService.getUserUrls(user.id)
      setUrls(userUrls)

      // Calculate stats
      const totalClicks = userUrls.reduce((sum: number, url: ShortenedUrl) => sum + url.click_count, 0)
      const avgClicks = userUrls.length > 0 ? Math.round(totalClicks / userUrls.length) : 0

      // Count click events from the start of the user's local day.
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayClicks = await urlService.getClicksSince(
        userUrls.map(url => url.id),
        today
      )

      setStats({
        totalLinks: userUrls.length,
        totalClicks,
        clicksToday: todayClicks,
        avgClicksPerLink: avgClicks,
      })
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (urlId: string) => {
    try {
      await urlService.deleteUrl(urlId)
      setUrls(urls.map(u => (u.id === urlId ? { ...u, is_active: false } : u)))
    } catch (error) {
      console.error('Failed to delete URL:', error)
    }
  }

  const handleAnalytics = (urlId: string) => {
    navigate(`/dashboard/analytics/${urlId}`)
  }

  const handleNewUrlSuccess = () => {
    loadData()
    setIsNewUrlModalOpen(false)
  }

  const getUserGreeting = () => {
    const name = user?.user_metadata?.name || user?.email?.split('@')[0] || 'there'
    return `Welcome back, ${name} 👋`
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-shell min-h-screen bg-gradient-dark text-white light:text-gray-900">
      <DashboardHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">{getUserGreeting()}</h1>
            <p className="text-gray-400">Here's what's happening with your links today.</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsNewUrlModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-accent hover:bg-gradient-accent-dark text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-accent/20"
          >
            <Plus size={20} />
            New URL
          </motion.button>
        </motion.div>

        {/* Statistics Grid */}
        {!isLoading && (
          <div className="mb-12">
            <StatGrid
              stats={[
                {
                  title: 'Total Links',
                  value: stats.totalLinks,
                  icon: LinkIcon,
                },
                {
                  title: 'Total Clicks',
                  value: stats.totalClicks,
                  icon: TrendingUp,
                },
                {
                  title: 'Today\'s Clicks',
                  value: stats.clicksToday,
                  icon: Zap,
                },
                {
                  title: 'Avg Clicks/Link',
                  value: stats.avgClicksPerLink,
                  icon: Clock,
                },
              ]}
            />
          </div>
        )}

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-br from-dark-secondary/50 to-dark/30 light:from-white light:to-white light:bg-white border border-dark-tertiary/50 light:border-slate-200/90 rounded-2xl p-6 mb-8 backdrop-blur-sm light:backdrop-blur-none light:shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
        >
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <label className="text-xs font-semibold text-gray-400 light:text-slate-500 uppercase tracking-wider block mb-2.5">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by URL or short code..."
                className="w-full px-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-200 rounded-xl focus:border-accent light:focus:border-blue-500 focus:outline-none light:focus:bg-white text-white light:text-slate-900 placeholder-gray-500 light:placeholder-slate-400 transition-all text-sm font-normal"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-400 light:text-slate-500 uppercase tracking-wider block mb-2.5">Sort By</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as 'recent' | 'clicks' | 'name')}
                className="px-4 py-3 bg-dark light:bg-slate-50 border border-dark-tertiary light:border-slate-200 rounded-xl focus:border-accent light:focus:border-blue-500 focus:outline-none text-white light:text-slate-900 transition-all cursor-pointer text-sm font-medium"
              >
                <option value="recent">Recent</option>
                <option value="clicks">Most Clicks</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Links Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-white light:text-slate-900">Your Links</h2>
          <LinksTable
            urls={filteredUrls}
            onDelete={handleDelete}
            onAnalytics={handleAnalytics}
            loading={isLoading}
          />
        </motion.div>
      </main>

      {/* New URL Modal */}
      <NewUrlModal
        isOpen={isNewUrlModalOpen}
        onClose={() => setIsNewUrlModalOpen(false)}
        userId={user?.id}
        onSuccess={handleNewUrlSuccess}
      />
    </div>
  )
}
