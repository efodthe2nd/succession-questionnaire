'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase'

/**
 * /auth/callback
 *
 * Supabase redirects magic links here first.
 * We exchange the token and send the user to /questionnaire silently.
 * No homepage flash. No visible redirect.
 *
 * Set this as your redirectTo in generateLink:
 * redirectTo: `${SITE_URL}/auth/callback`
 */
export default function AuthCallbackPage() {
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      const hash = window.location.hash
      if (!hash) {
        // No token — send home
        window.location.replace('/')
        return
      }

      const hashParams = new URLSearchParams(hash.substring(1))
      const errorCode = hashParams.get('error_code')
      const type = hashParams.get('type')
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')

      // Handle errors (expired link etc)
      if (errorCode) {
        window.location.replace(`/?auth_error=${errorCode}`)
        return
      }

      if (accessToken && refreshToken) {
        // Establish the session manually
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        })

        if (error) {
          console.error('[AuthCallback] setSession error:', error)
          window.location.replace('/')
          return
        }

        // Session established — route based on type
        if (type === 'recovery') {
          window.location.replace('/set-password')
          return
        }

        // magiclink or anything else — go to questionnaire
        window.location.replace('/questionnaire')
        return
      }

      // Fallback
      window.location.replace('/')
    }

    handleCallback()
  }, [])

  // Blank page while processing — no flash, no content
  return (
    <main style={{
      minHeight: '100vh',
      background: '#f9f6f1',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'Georgia, serif',
          color: '#B5A692',
          fontSize: '18px',
          letterSpacing: '0.04em',
        }}>
          Succession <span style={{ color: '#1a1a1a' }}>Story</span>
        </p>
      </div>
    </main>
  )
}