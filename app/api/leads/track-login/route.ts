import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    await supabaseAdmin
      .from('leads')
      .update({
        funnel_stage: 'logged_in',
        logged_in_at: new Date().toISOString(),
      })
      .eq('email', cleanEmail)
      .is('logged_in_at', null) // first login only

    console.log(`[track-login] ${cleanEmail}`)
    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[track-login] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}