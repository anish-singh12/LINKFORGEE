/**
 * Premium Links Table
 * Polished responsive table with actions and hover states
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, ExternalLink, Trash2, BarChart3, ChevronDown } from 'lucide-react'
import { ShortenedUrl } from '@/types'

interface LinksTableProps {
  urls: ShortenedUrl[]
  onDelete: (urlId: string) => void
  onAnalytics: (urlId: string) => void
  loading?: boolean
}

export function LinksTable({ urls, onDelete, onAnalytics, loading }: LinksTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = (text: string, urlId: string) => {
    navigator.clipboard.writeText(text)
    setCopied(urlId)
    setTimeout(() => setCopied(null), 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const truncateUrl = (url: string, length = 50) => {
    return url.length > length ? url.substring(0, length) + '...' : url
  }

  const getShortUrl = (shortCode: string) => {
    return `${window.location.origin}/${shortCode}`
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        <p className="mt-4 text-gray-400">Loading links...</p>
      </div>
    )
  }

  if (urls.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-gradient-to-br from-dark-secondary/50 to-dark/50 border border-dark-tertiary light:border-gray-200 rounded-2xl p-12 text-center"
      >
        <div className="text-5xl mb-4">🔗</div>
        <h3 className="text-xl font-semibold text-white light:text-gray-900 mb-2">No links yet</h3>
        <p className="text-gray-400 light:text-gray-600">Create your first shortened link to get started.</p>
      </motion.div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header for larger screens */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 bg-dark/30 rounded-lg border border-dark-tertiary/30 text-xs font-semibold text-gray-400 light:text-gray-600 uppercase tracking-wider">
        <div className="col-span-2">Short Code</div>
        <div className="col-span-4">Original URL</div>
        <div className="col-span-2">Clicks</div>
        <div className="col-span-2">Created</div>
        <div className="col-span-2">Actions</div>
      </div>

      {/* Links */}
      {urls.map((url, idx) => (
        <motion.div
          key={url.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`rounded-lg border border-dark-tertiary/50 overflow-hidden transition-all ${
            !url.is_active ? 'opacity-50' : ''
          }`}
        >
          {/* Desktop View */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center p-6 bg-gradient-to-r from-dark-secondary/40 to-dark/20 hover:from-dark-secondary/60 hover:to-dark/40 transition-all duration-300">
            {/* Short Code */}
            <div className="col-span-2">
              <code className="px-3 py-1 bg-accent/10 text-accent rounded-md font-mono text-sm font-semibold">
                {url.short_code}
              </code>
            </div>

            {/* Original URL */}
            <div className="col-span-4 group cursor-help" title={url.original_url}>
              <p className="text-sm text-gray-300 light:text-gray-700 truncate group-hover:text-accent transition-colors">
                {truncateUrl(url.original_url)}
              </p>
            </div>

            {/* Clicks */}
            <div className="col-span-2">
              <motion.span
                key={url.click_count}
                initial={{ scale: 1.2, color: '#00ff00' }}
                animate={{ scale: 1, color: '#ffffff' }}
                transition={{ duration: 0.3 }}
                className="text-lg font-bold text-white light:text-gray-900"
              >
                {url.click_count}
              </motion.span>
            </div>

            {/* Created Date */}
            <div className="col-span-2">
              <p className="text-sm text-gray-400 light:text-gray-600">{formatDate(url.created_at)}</p>
            </div>

            {/* Actions */}
            <div className="col-span-2 flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopy(getShortUrl(url.short_code), url.id)}
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors text-gray-400 hover:text-accent"
                title="Copy short URL"
              >
                <Copy
                  size={18}
                  className={copied === url.id ? 'text-green-400' : 'text-gray-400'}
                />
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={getShortUrl(url.short_code)}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors text-gray-400 hover:text-accent"
                title="Open short URL"
              >
                <ExternalLink size={18} />
              </motion.a>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAnalytics(url.id)}
                className="p-2 hover:bg-accent/10 rounded-lg transition-colors text-gray-400 hover:text-accent"
                title="View analytics"
              >
                <BarChart3 size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setDeleteConfirm(url.id)}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                title="Delete URL"
              >
                <Trash2 size={18} />
              </motion.button>
            </div>
          </div>

          {/* Mobile/Tablet View */}
          <div className="lg:hidden p-4 bg-gradient-to-r from-dark-secondary/40 to-dark/20 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <code className="px-2 py-1 bg-accent/10 text-accent rounded font-mono text-xs font-semibold">
                  {url.short_code}
                </code>
                <p className="text-xs text-gray-500 mt-1">{formatDate(url.created_at)}</p>
              </div>
              <motion.button
                onClick={() => setExpandedId(expandedId === url.id ? null : url.id)}
                className="text-gray-400 hover:text-accent transition-colors"
              >
                <ChevronDown
                  size={20}
                  className={`transform transition-transform ${expandedId === url.id ? 'rotate-180' : ''}`}
                />
              </motion.button>
            </div>

            <p className="text-sm text-gray-300 truncate">{truncateUrl(url.original_url, 40)}</p>

            <div className="flex items-center justify-between pt-2 border-t border-dark-tertiary/30">
              <div className="text-sm">
                <span className="text-gray-400">Clicks: </span>
                <span className="font-bold text-white">{url.click_count}</span>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCopy(getShortUrl(url.short_code), url.id)}
                  className="p-2 hover:bg-accent/10 rounded transition-colors"
                >
                  <Copy size={16} className={copied === url.id ? 'text-green-400' : 'text-gray-400'} />
                </motion.button>

                <motion.a
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  href={getShortUrl(url.short_code)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-accent/10 rounded transition-colors"
                >
                  <ExternalLink size={16} className="text-gray-400" />
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDeleteConfirm(url.id)}
                  className="p-2 hover:bg-red-500/10 rounded transition-colors"
                >
                  <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {expandedId === url.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-3 border-t border-dark-tertiary/30 space-y-2"
                >
                  <p className="text-xs text-gray-400 break-all">{url.original_url}</p>
                  <motion.button
                    onClick={() => onAnalytics(url.id)}
                    className="w-full px-3 py-2 bg-accent/10 hover:bg-accent/20 text-accent text-sm rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={16} />
                    View Analytics
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Delete Confirmation */}
          <AnimatePresence>
            {deleteConfirm === url.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-3 bg-red-500/10 border-t border-red-500/20 flex items-center justify-between gap-3"
              >
                <p className="text-sm text-red-400">Delete this link permanently?</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      onDelete(url.id)
                      setDeleteConfirm(null)
                    }}
                    className="px-4 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded transition-colors"
                  >
                    Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setDeleteConfirm(null)}
                    className="px-4 py-1 bg-gray-500/20 hover:bg-gray-500/30 text-gray-400 text-sm rounded transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}
