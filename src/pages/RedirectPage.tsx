/**
 * Redirect Page Component
 * Handles /:shortCode routes and performs the redirect
 */

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { handleRedirect } from '@/lib/redirectHandler'

type RedirectStatus = 'loading' | 'not-found' | 'expired' | 'error'

export function RedirectPage() {
  const { shortCode } = useParams<{ shortCode: string }>()
  const [status, setStatus] = useState<RedirectStatus>('loading')
  const redirectStarted = useRef(false)

  useEffect(() => {
    const performRedirect = async () => {
      if (redirectStarted.current) return
      redirectStarted.current = true

      if (!shortCode) {
        setStatus('not-found')
        return
      }

      const success = await handleRedirect(shortCode)

      if (!success) {
        // Check if it's because it's expired (we can't really tell from handleRedirect)
        // For now, treat all failures as "not found"
        setStatus('not-found')
      }
      // If success, the page will redirect before we set status
    }

    performRedirect()
  }, [shortCode])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
        <div className="text-center">
          <div className="inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
          <p className="mt-4 text-gray-400">Redirecting you...</p>
        </div>
      </div>
    )
  }

  if (status === 'not-found') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Link Not Found</h1>
          <p className="text-gray-400 mb-8">
            The short link you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-dark">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Link Expired</h1>
          <p className="text-gray-400 mb-8">This link has expired and is no longer active.</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    )
  }

  return null
}
