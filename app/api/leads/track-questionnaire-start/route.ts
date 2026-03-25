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
        funnel_stage: 'questionnaire_started',
        logged_in_at: new Date().toISOString(), // replaces track-login since login page is bypassed
      })
      .eq('email', cleanEmail)
      .is('logged_in_at', null) // first time only

    console.log(`[track-questionnaire-start] ${cleanEmail}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[track-questionnaire-start] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}