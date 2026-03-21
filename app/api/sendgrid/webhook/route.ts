import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const events = await req.json()

    if (!Array.isArray(events)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    for (const event of events) {
      const email = event.email?.toLowerCase().trim()
      const eventType = event.event

      if (!email || !eventType) continue

      if (eventType === 'open') {
        await supabaseAdmin
          .from('leads')
          .update({
            funnel_stage: 'email_opened',
            email_opened_at: new Date(event.timestamp * 1000).toISOString(),
          })
          .eq('email', email)
          .is('email_opened_at', null) // only set once — first open wins

        console.log(`[SendGrid] open → ${email}`)
      }

      if (eventType === 'click') {
        await supabaseAdmin
          .from('leads')
          .update({
            funnel_stage: 'email_clicked',
            email_clicked_at: new Date(event.timestamp * 1000).toISOString(),
          })
          .eq('email', email)
          .is('email_clicked_at', null) // only set once — first click wins

        console.log(`[SendGrid] click → ${email}`)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[SendGrid webhook] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}