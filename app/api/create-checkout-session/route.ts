import { NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST() {
  // Check for required environment variables
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[Create Checkout Session] Missing STRIPE_SECRET_KEY')
    return NextResponse.json(
      { error: 'Server configuration error: Missing Stripe secret key' },
      { status: 500 }
    )
  }

  if (!process.env.STRIPE_PRICE_ID) {
    console.error('[Create Checkout Session] Missing STRIPE_PRICE_ID')
    return NextResponse.json(
      { error: 'Server configuration error: Missing Stripe price ID' },
      { status: 500 }
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  })

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: 'https://www.successionstory.now/questionnaire',
    })

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error('[Create Checkout Session] Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      { error: `Failed to create checkout session: ${message}` },
      { status: 500 }
    )
  }
}
