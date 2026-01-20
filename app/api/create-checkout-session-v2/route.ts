import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  // Check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[Create Checkout Session V2] Missing STRIPE_SECRET_KEY')
    return NextResponse.json(
      { error: 'Server configuration error: Missing Stripe secret key' },
      { status: 500 }
    )
  }

  if (!process.env.STRIPE_PRICE_ID) {
    console.error('[Create Checkout Session V2] Missing STRIPE_PRICE_ID')
    return NextResponse.json(
      { error: 'Server configuration error: Missing Stripe price ID' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  })

  try {
    const { email } = await req.json()

    // Get the host from headers to build the return URL
    const host = req.headers.get('host') || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const returnUrl = `${protocol}://${host}/succession-story-v2/thank-you?session_id={CHECKOUT_SESSION_ID}`

    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      ui_mode: 'embedded',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: returnUrl,
      allow_promotion_codes: true,
    }

    // Pre-fill email if provided
    if (email) {
      sessionConfig.customer_email = email
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error('[Create Checkout Session V2] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to create checkout session: ${message}` },
      { status: 500 }
    )
  }
}
