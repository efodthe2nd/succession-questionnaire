import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase-admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  try {
    // 1. Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    const customerEmail = session.customer_details?.email || session.customer_email

    if (!customerEmail || session.payment_status !== 'paid') {
      console.error('[Stripe Success] Session not paid or email missing:', { sessionId, customerEmail, status: session.payment_status })
      return NextResponse.redirect(new URL('/', req.url))
    }

    const supabaseAdmin = createAdminClient()

    // 2. Ensure user exists (same logic as webhook)
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find((u) => u.email === customerEmail)

    if (!existingUser) {
      // Create user if they don't exist yet (webhook might not have run yet)
      const { error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: customerEmail,
        email_confirm: true,
      })

      if (createError && !createError.message.includes('already been registered')) {
        console.error('[Stripe Success] Failed to create user:', createError)
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    // 3. Generate magic link pointing to /auth/callback
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: customerEmail,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    })

    if (linkError || !linkData?.properties?.action_link) {
      console.error('[Stripe Success] generateLink error:', linkError)
      return NextResponse.redirect(new URL(`/login?email=${encodeURIComponent(customerEmail)}`, req.url))
    }

    // 4. Redirect to the magic link (which redirects to /auth/callback -> /questionnaire)
    return NextResponse.redirect(new URL(linkData.properties.action_link))

  } catch (error) {
    console.error('[Stripe Success] Error:', error)
    return NextResponse.redirect(new URL('/', req.url))
  }
}
