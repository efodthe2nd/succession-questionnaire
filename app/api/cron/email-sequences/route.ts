// app/api/cron/email-sequences/route.ts
// Vercel Cron — fires daily at 1am UTC (7pm CT)
// Handles Sequence A (completed, didn't pay) + Sequence B (never started)
// Sequence C (dropped off mid-way) to be added

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import { SEQUENCE_B_STEPS } from '@/lib/email-sequences/sequence-b'
import {
  SEQUENCE_A_STEPS,
  extractPersonalisation,
} from '@/lib/email-sequences/sequence-a'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY!
const SENDGRID_FROM_EMAIL =
  process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY)

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}

// ─── Sequence A: enroll completed unpaid submissions ─────────────────────────

async function enrollSequenceATargets() {
  // Find completed, unpaid submissions not yet enrolled in Sequence A
  const { data, error } = await supabaseAdmin
    .from('submissions')
    .select('id, user_id, submitted_at')
    .eq('status', 'completed')
    .eq('paid', false)

  if (error || !data?.length) return

  for (const submission of data) {
    // Get email from auth.users
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
      submission.user_id
    )
    const email = userData?.user?.email
    if (!email) continue

    // Check not already enrolled
    const { data: existing } = await supabaseAdmin
      .from('email_sequence_state')
      .select('id')
      .eq('email', email)
      .eq('sequence', 'A')
      .single()

    if (existing) continue

    // Check submission is at least 1hr old (submitted_at exists)
    if (!submission.submitted_at) continue
    const submittedAt = new Date(submission.submitted_at)
    const hoursSinceSubmit =
      (Date.now() - submittedAt.getTime()) / (1000 * 60 * 60)
    if (hoursSinceSubmit < 1) continue

    // Enroll — first email sends 24hrs after submission
    const nextSendAt = new Date(
      submittedAt.getTime() + SEQUENCE_A_STEPS[0].delayHours * 60 * 60 * 1000
    )

    await supabaseAdmin.from('email_sequence_state').insert({
      email,
      sequence: 'A',
      current_step: 0,
      next_send_at: nextSendAt.toISOString(),
      // Store submission_id so we can fetch answers later
      metadata: JSON.stringify({ submission_id: submission.id }),
    })

    console.log(`[Cron] Enrolled ${email} in Sequence A`)
  }
}

// ─── Sequence A: send pending emails ─────────────────────────────────────────

async function processSequenceA() {
  const now = new Date().toISOString()

  const { data: pending, error } = await supabaseAdmin
    .from('email_sequence_state')
    .select('*')
    .eq('sequence', 'A')
    .eq('completed', false)
    .eq('opted_out', false)
    .lte('next_send_at', now)

  if (error || !pending?.length) return

  console.log(`[Cron] Processing ${pending.length} Sequence A emails`)

  for (const entry of pending) {
    const stepIndex = entry.current_step
    const stepConfig = SEQUENCE_A_STEPS[stepIndex]

    if (!stepConfig) {
      await supabaseAdmin
        .from('email_sequence_state')
        .update({ completed: true })
        .eq('id', entry.id)
      continue
    }

    // Stop if they've paid since enrolling
    const metadata = entry.metadata ? JSON.parse(entry.metadata) : {}
    const submissionId = metadata.submission_id

    if (submissionId) {
      const { data: submission } = await supabaseAdmin
        .from('submissions')
        .select('paid')
        .eq('id', submissionId)
        .single()

      if (submission?.paid) {
        console.log(`[Cron] ${entry.email} has paid — stopping Sequence A`)
        await supabaseAdmin
          .from('email_sequence_state')
          .update({ completed: true })
          .eq('id', entry.id)
        continue
      }
    }

    // Fetch answers for personalisation
    let personalisation = extractPersonalisation([])
    if (submissionId) {
      const { data: answers } = await supabaseAdmin
        .from('answers')
        .select('question_id, answer_text')
        .eq('submission_id', submissionId)

      if (answers?.length) {
        personalisation = extractPersonalisation(answers)
      }
    }

    // Send
    try {
      await sgMail.send({
        to: entry.email,
        from: { email: SENDGRID_FROM_EMAIL, name: 'Succession Story' },
        subject: stepConfig.subject(personalisation),
        html: stepConfig.getHTML(personalisation),
        text: `Your Succession Story is waiting. Complete your purchase at https://www.successionstory.now/questionnaire`,
      })

      console.log(
        `[Cron] Sent Sequence A step ${stepConfig.step} to ${entry.email}`
      )

      const nextStepIndex = stepIndex + 1
      const isLast = nextStepIndex >= SEQUENCE_A_STEPS.length

      if (isLast) {
        await supabaseAdmin
          .from('email_sequence_state')
          .update({ current_step: nextStepIndex, completed: true })
          .eq('id', entry.id)
      } else {
        const nextStep = SEQUENCE_A_STEPS[nextStepIndex]
        const intervalHours =
          nextStep.delayHours - stepConfig.delayHours
        const nextSendAt = new Date(
          Date.now() + intervalHours * 60 * 60 * 1000
        )
        await supabaseAdmin
          .from('email_sequence_state')
          .update({
            current_step: nextStepIndex,
            next_send_at: nextSendAt.toISOString(),
          })
          .eq('id', entry.id)
      }
    } catch (err) {
      console.error(
        `[Cron] Failed Sequence A step ${stepConfig.step} to ${entry.email}:`,
        err
      )
    }
  }
}

// ─── Sequence B: enroll new leads ────────────────────────────────────────────

async function enrollSequenceBLeads() {
  const { data: leads, error } = await supabaseAdmin.rpc(
    'get_unenrolled_sequence_b_leads'
  )
  if (error || !leads?.length) return

  console.log(`[Cron] Enrolling ${leads.length} leads in Sequence B`)

  for (const lead of leads) {
    const nextSendAt = new Date(
      new Date(lead.created_at).getTime() +
        SEQUENCE_B_STEPS[0].delayHours * 60 * 60 * 1000
    )
    await supabaseAdmin.from('email_sequence_state').insert({
      email: lead.email,
      sequence: 'B',
      current_step: 0,
      next_send_at: nextSendAt.toISOString(),
    })
  }
}

// ─── Sequence B: send pending emails ─────────────────────────────────────────

async function processSequenceB() {
  const now = new Date().toISOString()

  const { data: pending, error } = await supabaseAdmin
    .from('email_sequence_state')
    .select('*')
    .eq('sequence', 'B')
    .eq('completed', false)
    .eq('opted_out', false)
    .lte('next_send_at', now)

  if (error || !pending?.length) return

  console.log(`[Cron] Processing ${pending.length} Sequence B emails`)

  for (const entry of pending) {
    const stepIndex = entry.current_step
    const stepConfig = SEQUENCE_B_STEPS[stepIndex]

    if (!stepConfig) {
      await supabaseAdmin
        .from('email_sequence_state')
        .update({ completed: true })
        .eq('id', entry.id)
      continue
    }

    // Stop if they've started the questionnaire
    const { data: userRecord } = await supabaseAdmin.auth.admin.listUsers()
    const user = userRecord?.users?.find(u => u.email === entry.email)
    if (user) {
      const { data: submission } = await supabaseAdmin
        .from('submissions')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (submission) {
        console.log(`[Cron] ${entry.email} has started — stopping Sequence B`)
        await supabaseAdmin
          .from('email_sequence_state')
          .update({ completed: true })
          .eq('id', entry.id)
        continue
      }
    }

    try {
      await sgMail.send({
        to: entry.email,
        from: { email: SENDGRID_FROM_EMAIL, name: 'Succession Story' },
        subject: stepConfig.subject,
        html: stepConfig.getHTML(),
        text: `Visit https://www.successionstory.now/login to start your Succession Story.`,
      })

      console.log(
        `[Cron] Sent Sequence B step ${stepConfig.step} to ${entry.email}`
      )

      const nextStepIndex = stepIndex + 1
      const isLast = nextStepIndex >= SEQUENCE_B_STEPS.length

      if (isLast) {
        await supabaseAdmin
          .from('email_sequence_state')
          .update({ current_step: nextStepIndex, completed: true })
          .eq('id', entry.id)
      } else {
        const nextStep = SEQUENCE_B_STEPS[nextStepIndex]
        const intervalHours =
          nextStep.delayHours - stepConfig.delayHours
        const nextSendAt = new Date(
          Date.now() + intervalHours * 60 * 60 * 1000
        )
        await supabaseAdmin
          .from('email_sequence_state')
          .update({
            current_step: nextStepIndex,
            next_send_at: nextSendAt.toISOString(),
          })
          .eq('id', entry.id)
      }
    } catch (err) {
      console.error(
        `[Cron] Failed Sequence B step ${stepConfig.step} to ${entry.email}:`,
        err
      )
    }
  }
}

// ─── Main handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Sequence A — completed, didn't pay
    await enrollSequenceATargets()
    await processSequenceA()

    // Sequence B — signed up, never started
    await enrollSequenceBLeads()
    await processSequenceB()

    // Sequence C — started, dropped off (coming next)

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[Cron] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}