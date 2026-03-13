// app/api/cron/test-email/route.ts
// Dev-only test route. Never expose in production without auth.

import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'
import { SEQUENCE_A_STEPS } from '@/lib/email-sequences/sequence-a'
import { SEQUENCE_B_STEPS } from '@/lib/email-sequences/sequence-b'
import { SEQUENCE_C_STEPS, buildSequenceCContext } from '@/lib/email-sequences/sequence-c'

const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
}

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const sequence = searchParams.get('sequence')?.toUpperCase() // A, B, or C
  const step = parseInt(searchParams.get('step') ?? '1')       // 1-based
  const to = searchParams.get('email')

  if (!sequence || !to) {
    return NextResponse.json({ error: 'Missing sequence or email param' }, { status: 400 })
  }

  const FAKE_TOKEN = 'test-token-000'
  const stepIndex = step - 1

  try {
    let subject = ''
    let html = ''

    if (sequence === 'A') {
      const stepConfig = SEQUENCE_A_STEPS[stepIndex]
      if (!stepConfig) return NextResponse.json({ error: 'Invalid step' }, { status: 400 })

      const mockPersonalisation = {
        email: to,
        unsubscribeToken: FAKE_TOKEN,
        spouseName: 'Grace',
        childNames: ['Emeka', 'Tolu'],
        signOffName: 'David',
        coreValue: 'Integrity: Always do the right thing even when no one is watching',
        legacyStatement: 'I want to be remembered as someone who showed up fully for his family',
        finalWish: 'stay close and always look after each other',
        advice: 'Work hard, stay humble, and never stop learning',
      }

      subject = stepConfig.subject(mockPersonalisation)
      html = stepConfig.getHTML(mockPersonalisation)

    } else if (sequence === 'B') {
      const stepConfig = SEQUENCE_B_STEPS[stepIndex]
      if (!stepConfig) return NextResponse.json({ error: 'Invalid step' }, { status: 400 })

      subject = stepConfig.subject
      html = stepConfig.getHTML(to, FAKE_TOKEN)

    } else if (sequence === 'C') {
      const stepConfig = SEQUENCE_C_STEPS[stepIndex]
      if (!stepConfig) return NextResponse.json({ error: 'Invalid step' }, { status: 400 })

      const ctx = buildSequenceCContext(5, to, FAKE_TOKEN) // section 5 = My Family
      subject = stepConfig.subject(ctx)
      html = stepConfig.getHTML(ctx)

    } else {
      return NextResponse.json({ error: 'Invalid sequence. Use A, B, or C' }, { status: 400 })
    }

    await sgMail.send({
      to,
      from: { email: SENDGRID_FROM_EMAIL, name: 'Succession Story' },
      subject,
      html,
      text: 'Test email from Succession Story.',
    })

    return NextResponse.json({
      success: true,
      sent: { to, sequence, step },
    })

  } catch (err) {
    console.error('[TestEmail] Error:', err)
    return NextResponse.json({ error: 'Send failed', detail: String(err) }, { status: 500 })
  }
}