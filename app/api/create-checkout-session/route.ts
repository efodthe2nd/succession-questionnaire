import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      line_items: [
        {
          // Use your existing price ID or create one in Stripe Dashboard
          // This should match the price from your buy button
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      mode: 'payment',
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.successionstory.now'}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    })

    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (error) {
    console.error('[Create Checkout Session] Error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
