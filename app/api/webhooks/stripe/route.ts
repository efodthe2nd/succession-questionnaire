import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'
import { sendWelcomeEmail, generatePassword } from '@/lib/email'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!

/**
 * Stripe Webhook Handler
 *
 * Handles checkout.session.completed events:
 * 1. Creates a new user in Supabase Auth
 * 2. Generates a password reset link for the user
 * 3. Sends a welcome email with the password setup link
 */
export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('[Stripe Webhook] Missing stripe-signature header')
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  // Verify webhook signature
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Stripe Webhook] Signature verification failed:', message)
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    )
  }

  console.log('[Stripe Webhook] Received event:', event.type)

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Extract customer email
    const customerEmail = session.customer_details?.email || session.customer_email

    if (!customerEmail) {
      console.error('[Stripe Webhook] No customer email found in session', {
        sessionId: session.id,
      })
      return NextResponse.json(
        { error: 'No customer email found' },
        { status: 400 }
      )
    }

    console.log('[Stripe Webhook] Processing payment for:', customerEmail)

    try {
      const supabaseAdmin = createAdminClient()

      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find(
        (user) => user.email === customerEmail
      )

      let userId: string
      let userPassword: string

      if (existingUser) {
        // User already exists - generate a new password for them
        console.log('[Stripe Webhook] User already exists:', customerEmail)
        userId = existingUser.id
        userPassword = generatePassword()

        // Update existing user's password
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          userId,
          { password: userPassword }
        )

        if (updateError) {
          console.error('[Stripe Webhook] Failed to update user password:', updateError)
          return NextResponse.json(
            { error: 'Failed to update user password' },
            { status: 500 }
          )
        }
      } else {
        // Create new user with a readable password
        userPassword = generatePassword()

        const { data: newUser, error: createError } =
          await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            password: userPassword,
            email_confirm: true, // Mark email as confirmed since they paid
          })

        if (createError) {
          console.error('[Stripe Webhook] Failed to create user:', createError)
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          )
        }

        console.log('[Stripe Webhook] Created new user:', customerEmail)
        userId = newUser.user.id
      }

      console.log('[Stripe Webhook] Generated credentials for:', customerEmail)

      // Send welcome email with credentials
      const emailSent = await sendWelcomeEmail({
        to: customerEmail,
        password: userPassword,
      })

      if (!emailSent) {
        console.warn(
          '[Stripe Webhook] Welcome email not sent (SendGrid may not be configured)',
          { customerEmail }
        )
        // Don't fail the webhook - the user was still created
      }

      console.log('[Stripe Webhook] Successfully processed payment for:', customerEmail)

      return NextResponse.json({
        success: true,
        userId,
        emailSent,
      })
    } catch (error) {
      console.error('[Stripe Webhook] Error processing checkout:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  // Return 200 for unhandled events (Stripe expects this)
  console.log('[Stripe Webhook] Unhandled event type:', event.type)
  return NextResponse.json({ received: true })
}
