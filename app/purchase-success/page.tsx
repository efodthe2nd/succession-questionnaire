'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function PurchaseSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    if (sessionId) {
      // The webhook will handle user creation and email sending
      // We just show a success message here
      setStatus('success')
    } else {
      setStatus('error')
    }
  }, [sessionId])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
          <p className="mt-4 text-charcoal/70">Processing your purchase...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">!</div>
          <h1 className="font-serif text-3xl text-charcoal mb-4">
            Something went wrong
          </h1>
          <p className="text-charcoal/70 mb-8">
            We couldn&apos;t verify your purchase. Please contact support if you believe this is an error.
          </p>
          <Link
            href="/"
            className="inline-block bg-charcoal text-ivory px-8 py-3 rounded-full hover:bg-opacity-90 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-charcoal mb-4">
          Thank You!
        </h1>

        <p className="text-lg text-charcoal/80 mb-6">
          Your purchase was successful. We&apos;re preparing your Succession Story experience.
        </p>

        <div className="bg-white border border-taupe/30 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-charcoal mb-2">What happens next?</h2>
          <p className="text-charcoal/70 text-sm">
            Check your email for a welcome message with instructions to set up your password and access your account.
          </p>
        </div>

        <p className="text-sm text-charcoal/50">
          Didn&apos;t receive an email? Check your spam folder or contact{' '}
          <a
            href="mailto:successionstory.now@gmail.com"
            className="text-taupe hover:underline"
          >
            successionstory.now@gmail.com
          </a>
        </p>
      </div>
    </div>
  )
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-ivory flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-charcoal mx-auto"></div>
            <p className="mt-4 text-charcoal/70">Loading...</p>
          </div>
        </div>
      }
    >
      <PurchaseSuccessContent />
    </Suspense>
  )
}
