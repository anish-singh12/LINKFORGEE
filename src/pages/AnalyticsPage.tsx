/**
 * Analytics Page
 * Display detailed analytics for a specific short URL
 */

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import * as urlService from '@/services/urlService'
import { ShortenedUrl, ClickEvent } from '@/types'
import { ArrowLeft, Calendar } from 'lucide-react'

export function AnalyticsPage() {
  const { urlId } = useParams<{ urlId: string }>()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [url, setUrl] = useState<ShortenedUrl | null>(null)
  const [clicks, setClicks] = useState<ClickEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [timePeriod, setTimePeriod] = useState<7 | 30 | 90>(7)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    loadData()
  }, [isAuthenticated, timePeriod, urlId])

  const loadData = async () => {
    if (!user || !urlId) return

    try {
      setIsLoading(true)

      // Load URL details
      const urls = await urlService.getUserUrls(user.id)
      const currentUrl = urls.find((u: ShortenedUrl) => u.id === urlId)

      if (!currentUrl) {
        navigate('/dashboard')
        return
      }

      setUrl(currentUrl)

      // Load analytics
      const analytics = await urlService.getUrlAnalytics(urlId, timePeriod)
      setClicks(analytics)
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading || !url) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          <p className="mt-4 text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const shortUrl = `${window.location.origin}/${url.short_code}`
  const clicksPerDay = Math.ceil(url.click_count / timePeriod)

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <div className="bg-dark-secondary border-b border-dark-tertiary">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 mt-2">
            {shortUrl} · {url.click_count} total clicks
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* URL Details */}
        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">URL Details</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-400 mb-1">Short URL</p>
              <code className="text-accent font-mono">{shortUrl}</code>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Original URL</p>
              <code className="text-gray-300 font-mono break-all">{url.original_url}</code>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-dark-tertiary">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Clicks</p>
                <p className="text-3xl font-bold text-white">{url.click_count}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Clicks per Day (avg)</p>
                <p className="text-3xl font-bold text-white">{clicksPerDay}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-1">Created</p>
                <p className="text-white">{new Date(url.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Period Filter */}
        <div className="mb-8 flex gap-4">
          {[7, 30, 90].map(period => (
            <button
              key={period}
              onClick={() => setTimePeriod(period as 7 | 30 | 90)}
              className={`px-4 py-2 rounded transition-colors ${
                timePeriod === period
                  ? 'bg-accent text-white'
                  : 'bg-dark-secondary border border-dark-tertiary text-gray-400 hover:text-white'
              }`}
            >
              Last {period} Days
            </button>
          ))}
        </div>

        {/* Click Events */}
        <div className="bg-dark-secondary border border-dark-tertiary rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Clicks</h2>

          {clicks.length === 0 ? (
            <p className="text-gray-400 py-8 text-center">No clicks in this period</p>
          ) : (
            <div className="space-y-3">
              {clicks.map(click => (
                <div key={click.id} className="flex items-center justify-between p-3 bg-dark-tertiary/50 rounded border border-dark-tertiary/50">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm text-white">
                        {new Date(click.clicked_at).toLocaleString()}
                      </p>
                      {click.referrer && (
                        <p className="text-xs text-gray-400 truncate">From: {click.referrer}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
