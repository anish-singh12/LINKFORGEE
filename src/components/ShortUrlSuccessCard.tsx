/**
 * Short URL Success Card Component
 * Displays created short URL with actions
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, ExternalLink, ArrowRight, CheckCircle2 } from 'lucide-react'

interface ShortUrlSuccessCardProps {
  shortUrl: string
  originalUrl: string
  onCreateAnother: () => void
}

export function ShortUrlSuccessCard({ shortUrl, originalUrl, onCreateAnother }: ShortUrlSuccessCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Success Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <CheckCircle2 size={28} className="text-green-400" />
        </motion.div>
        <h3 className="text-xl font-semibold text-white light:text-gray-900">Your short link is ready!</h3>
      </div>

      {/* Card Container */}
      <div className="bg-gradient-to-br from-dark-secondary via-dark to-dark-secondary light:from-white light:via-gray-50 light:to-white border border-dark-tertiary light:border-gray-200 rounded-xl p-6 space-y-4 shadow-xl">
        {/* Original URL */}
        <div>
          <label className="text-xs font-semibold text-gray-400 light:text-gray-600 uppercase tracking-wider block mb-2">
            Original URL
          </label>
          <div className="bg-dark/50 light:bg-white border border-dark-tertiary light:border-gray-300 rounded-lg p-3 truncate">
            <p className="text-sm text-gray-300 light:text-gray-700 truncate">{originalUrl}</p>
          </div>
        </div>

        {/* Short URL */}
        <div>
          <label className="text-xs font-semibold text-gray-400 light:text-gray-600 uppercase tracking-wider block mb-2">
            Your Short URL
          </label>
          <div className="flex gap-2">
            <div className="flex-1 bg-dark/50 light:bg-white border border-accent/20 rounded-lg p-3 flex items-center">
              <code className="text-sm font-mono text-accent flex-1 truncate">{shortUrl}</code>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="p-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg transition-colors"
              title="Copy to clipboard"
            >
              <Copy
                size={18}
                className={`transition-colors ${copied ? 'text-green-400' : 'text-accent'}`}
              />
            </motion.button>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-accent/10 hover:bg-accent/20 border border-accent/30 rounded-lg transition-colors text-accent"
              title="Open short URL"
            >
              <ExternalLink size={18} />
            </motion.a>
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCreateAnother}
          className="w-full py-3 bg-gradient-accent hover:bg-gradient-accent-dark text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group"
        >
          Create Another
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  )
}
