'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase'

/**
 * AuthCallbackHandler
 *
 * Stripped down. Magic links now go to /auth/callback directly.
 * This component only handles:
 * 1. Recovery links that land on random pages
 * 2. Auth errors (expired links)
 */
export default function AuthCallbackHandler() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [error, setError] = useState<{ code: string; description: string } | null>(null)

  useEffect(() => {
    const handleHashChange = async () => {
      if (typeof window === 'undefined') return

      const hash = window.location.hash
      if (!hash) return

      const hashParams = new URLSearchParams(hash.substring(1))
      const errorCode = hashParams.get('error_code')
      const errorDescription = hashParams.get('error_description')
      const type = hashParams.get('type')
      const accessToken = hashParams.get('access_token')

      // Handle errors
      if (errorCode) {
        window.history.replaceState(null, '', pathname)
        setError({
          code: errorCode,
          description: errorDescription?.replace(/\+/g, ' ') || 'An error occurred',
        })
        return
      }

      // Recovery flow
      if (type === 'recovery' && accessToken) {
        window.location.href = '/set-password' + hash
        return
      }

      // Magic links should never land here anymore (they go to /auth/callback)
      // But just in case, handle them gracefully
      if (type === 'magiclink' && accessToken) {
        window.location.replace('/auth/callback' + hash)
        return
      }
    }

    handleHashChange()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY' && session) {
          window.history.replaceState(null, '', pathname)
          router.push('/set-password')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, pathname])

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-white/10 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-heading font-bold text-white mb-2">
            Link Expired
          </h2>
          <p className="text-white/70 mb-6">
            {error.code === 'otp_expired'
              ? 'This link has expired or has already been used.'
              : error.description}
          </p>
          <p className="text-white/50 text-sm mb-6">
            Please contact support at{' '}
            <a href="mailto:hello@successionstory.now" className="text-[#B5A692] hover:underline">
              hello@successionstory.now
            </a>{' '}
            to request a new link.
          </p>
          <button
            onClick={() => { setError(null); router.push('/') }}
            className="px-8 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  return null
}