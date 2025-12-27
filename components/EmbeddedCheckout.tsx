'use client'

import { useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function EmbeddedCheckoutSection() {
  const fetchClientSecret = useCallback(async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    })
    const data = await response.json()

    if (data.error) {
      console.error('[EmbeddedCheckout] Error:', data.error)
      throw new Error(data.error)
    }

    return data.clientSecret
  }, [])

  return (
    <section id="checkout-section" className="py-16 md:py-24 bg-ivory">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <p className="text-lg text-charcoal/70">Founder Price:</p>
          <p className="text-5xl font-bold text-charcoal">
            <span className="line-through text-3xl text-charcoal/50 mr-2">$197</span>
            $97
          </p>
        </div>

        <div id="checkout" className="bg-white rounded-lg shadow-lg overflow-hidden">
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        </div>
      </div>
    </section>
  )
}
