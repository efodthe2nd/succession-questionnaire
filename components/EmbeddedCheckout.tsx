'use client'

import { useCallback, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

export default function EmbeddedCheckoutSection() {
  const [showCheckout, setShowCheckout] = useState(false)

  const fetchClientSecret = useCallback(async () => {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
    })
    const data = await response.json()
    return data.clientSecret
  }, [])

  if (!showCheckout) {
    return (
      <section id="checkout-section" className="py-16 md:py-24 bg-ivory">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
            Ready to Begin?
          </h2>
          <p className="mt-4 text-base md:text-lg text-charcoal/80 max-w-2xl mx-auto">
            Start your Succession Story today and give your family the clarity they deserve.
          </p>

          <div className="mt-8 bg-white border-2 border-taupe/30 rounded-lg p-6 md:p-8 max-w-md mx-auto">
            <p className="text-lg md:text-xl text-charcoal/70">
              Founder Price:
            </p>
            <p className="text-5xl font-bold text-charcoal mt-2">
              $97
            </p>
            <p className="text-base md:text-lg text-charcoal/60 mt-1">
              <span className="line-through">Regular price $197</span>
            </p>

            <button
              onClick={() => setShowCheckout(true)}
              className="mt-6 w-full bg-charcoal text-ivory font-sans font-medium px-8 py-4 rounded-full text-lg hover:bg-opacity-90 transition-all transform hover:scale-105"
            >
              Purchase Now
            </button>

            <p className="mt-4 text-sm text-charcoal/50">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="checkout-section" className="py-16 md:py-24 bg-ivory">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-charcoal">
            Complete Your Purchase
          </h2>
          <button
            onClick={() => setShowCheckout(false)}
            className="mt-4 text-charcoal/60 hover:text-charcoal underline text-sm"
          >
            &larr; Go back
          </button>
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
