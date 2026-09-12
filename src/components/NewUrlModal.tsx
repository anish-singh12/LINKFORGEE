/**
 * New URL Modal
 * Polished modal for creating new shortened URLs
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'
import * as urlService from '@/services/urlService'
import { ShortUrlSuccessCard } from './ShortUrlSuccessCard'

interface NewUrlModalProps {
  isOpen: boolean
  onClose: () => void
  userId?: string
  onSuccess?: () => void
}

export function NewUrlModal({ isOpen, onClose, userId, onSuccess }: NewUrlModalProps) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!originalUrl.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!urlService.validateUrl(originalUrl)) {
      setError('Please enter a valid URL')
      return
    }

    if (!userId) {
      setError('User not authenticated')
      return
    }

    setIsLoading(true)

    try {
      const result = await urlService.createShortUrl(userId, originalUrl)
      if (result) {
        const full = `${window.location.origin}/${result.short_code}`
        setShortUrl(full)
        setOriginalUrl('')
        onSuccess?.()
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create short URL')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setOriginalUrl('')
    setError('')
    setShortUrl(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none"
          >
            <div className="new-url-modal pointer-events-auto w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-dark-secondary to-dark light:from-white light:to-gray-50 border border-dark-tertiary light:border-gray-200 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-dark-tertiary light:border-gray-200 bg-dark/50 light:bg-gray-50">
                <h2 className="text-2xl font-bold text-white light:text-gray-900">Create New Short URL</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="p-2 hover:bg-dark-secondary light:hover:bg-gray-200 rounded-lg transition-colors text-gray-400 hover:text-white light:hover:text-gray-900"
                >
                  <X size={24} />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6">
                {shortUrl ? (
                  // Success State
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ShortUrlSuccessCard
                      shortUrl={shortUrl}
                      originalUrl={originalUrl || 'URL'}
                      onCreateAnother={() => {
                        setShortUrl(null)
                        setOriginalUrl('')
                        setError('')
                      }}
                    />
                  </motion.div>
                ) : (
                  // Form State
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 light:text-gray-700 mb-3">
                        Enter Long URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={originalUrl}
                          onChange={e => setOriginalUrl(e.target.value)}
                          placeholder="https://example.com/very/long/url?with=params"
                          className="w-full px-4 py-3 bg-dark border border-dark-tertiary rounded-lg focus:border-accent focus:outline-none text-white placeholder-gray-500 transition-colors"
                          autoFocus
                        />
                      </div>
                      <p                       className="text-xs text-gray-500 light:text-gray-600 mt-2">
                        Enter any valid URL. We'll create a short, memorable link for you.
                      </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex gap-3"
                      >
                        <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-400 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-3 bg-gradient-accent hover:bg-gradient-accent-dark text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={18} />
                            Shorten URL
                          </>
                        )}
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={handleClose}
                        className="px-6 py-3 bg-dark-secondary hover:bg-dark-tertiary light:bg-white light:hover:bg-gray-100 text-white light:text-gray-900 font-semibold rounded-lg transition-colors border border-dark-tertiary light:border-gray-300"
                      >
                        Cancel
                      </motion.button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
