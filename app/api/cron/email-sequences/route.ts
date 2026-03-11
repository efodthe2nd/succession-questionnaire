// app/api/cron/email-sequences/route.ts
// Vercel Cron Job — runs every hour
// Processes Sequence B (never started) — A and C will be added here too

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import { SEQUENCE_B_STEPS } from '@/lib/email-sequences/sequence-b'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY)
}

// Vercel cron security — reject requests without the secret
function isAuthorized(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization')
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}

/**
 * Enroll new leads into Sequence B if they haven't been enrolled yet
 * and have no submission row (never started the questionnaire)
 */
async function enrollNewSequenceBLeads() {
  // Find leads with no submission and no existing sequence B enrollment
  const { data: leads, error } = await supabaseAdmin.rpc(
    'get_unenrolled_sequence_b_leads'
  )

  if (error) {
    console.error('[Cron] Failed to fetch unenrolled leads:', error)
    return
  }

  if (!leads || leads.length === 0) return

  console.log(`[Cron] Enrolling ${leads.length} new leads into Sequence B`)

  for (const lead of leads) {
    const firstStep = SEQUENCE_B_STEPS[0]
    const nextSendAt = new Date(
      new Date(lead.created_at).getTime() + firstStep.delayHours * 60 * 60 * 1000
    )

    await supabaseAdmin.from('email_sequence_state').insert({
      email: lead.email,
      sequence: 'B',
      current_step: 0, // 0 = enrolled, not yet sent step 1
      next_send_at: nextSendAt.toISOString(),
    })
  }
}

/**
 * Send pending Sequence B emails
 */
async function processSequenceB() {
  const now = new Date().toISOString()

  // Get all sequence B entries that are due and not completed/opted out
  const { data: pending, error } = await supabaseAdmin
    .from('email_sequence_state')
    .select('*')
    .eq('sequence', 'B')
    .eq('completed', false)
    .eq('opted_out', false)
    .lte('next_send_at', now)

  if (error) {
    console.error('[Cron] Failed to fetch pending Sequence B:', error)
    return
  }

  if (!pending || pending.length === 0) {
    console.log('[Cron] No pending Sequence B emails')
    return
  }

  console.log(`[Cron] Processing ${pending.length} Sequence B emails`)

  for (const entry of pending) {
    const nextStepIndex = entry.current_step // current_step is the NEXT step to send (0-indexed into array)
    const stepConfig = SEQUENCE_B_STEPS[nextStepIndex]

    if (!stepConfig) {
      // All steps sent — mark complete
      await supabaseAdmin
        .from('email_sequence_state')
        .update({ completed: true })
        .eq('id', entry.id)
      continue
    }

    // Check: has this person started the questionnaire since enrolling?
    // If so, stop sequence B — they've moved on
    const { data: submission } = await supabaseAdmin
      .from('submissions')
      .select('id')
      .eq('user_id', 
        (await supabaseAdmin.auth.admin.listUsers())
          .data.users.find(u => u.email === entry.email)?.id ?? ''
      )
      .single()

    if (submission) {
      console.log(`[Cron] ${entry.email} has started — stopping Sequence B`)
      await supabaseAdmin
        .from('email_sequence_state')
        .update({ completed: true })
        .eq('id', entry.id)
      continue
    }

    // Send the email
    try {
      await sgMail.send({
        to: entry.email,
        from: {
          email: SENDGRID_FROM_EMAIL,
          name: 'Succession Story',
        },
        subject: stepConfig.subject,
        html: stepConfig.getHTML(),
        text: `Visit https://www.successionstory.now/login to start your Succession Story.`,
      })

      console.log(`[Cron] Sent Sequence B step ${stepConfig.step} to ${entry.email}`)

      // Advance to next step
      const nextStep = nextStepIndex + 1
      const isLastStep = nextStep >= SEQUENCE_B_STEPS.length

      if (isLastStep) {
        await supabaseAdmin
          .from('email_sequence_state')
          .update({
            current_step: nextStep,
            completed: true,
          })
          .eq('id', entry.id)
      } else {
        const nextStepConfig = SEQUENCE_B_STEPS[nextStep]
        const currentStepSentAt = new Date()
        const nextSendAt = new Date(
          currentStepSentAt.getTime() +
            (nextStepConfig.delayHours - stepConfig.delayHours) * 60 * 60 * 1000
        )

        await supabaseAdmin
          .from('email_sequence_state')
          .update({
            current_step: nextStep,
            next_send_at: nextSendAt.toISOString(),
          })
          .eq('id', entry.id)
      }
    } catch (err) {
      console.error(`[Cron] Failed to send Sequence B step ${stepConfig.step} to ${entry.email}:`, err)
      // Don't advance — will retry next cron run
    }
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await enrollNewSequenceBLeads()
    await processSequenceB()

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('[Cron] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}