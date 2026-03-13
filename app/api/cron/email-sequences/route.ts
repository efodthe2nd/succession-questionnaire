// app/api/cron/email-sequences/route.ts
// Vercel Cron — fires daily at 1am UTC (7pm CT)
// Sequence A: completed, didn't pay
// Sequence B: signed up, never started
// Sequence C: started, dropped off mid-way

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import sgMail from '@sendgrid/mail'
import { SEQUENCE_B_STEPS } from '@/lib/email-sequences/sequence-b'
import { SEQUENCE_A_STEPS, extractPersonalisation } from '@/lib/email-sequences/sequence-a'
import { SEQUENCE_C_STEPS, buildSequenceCContext } from '@/lib/email-sequences/sequence-c'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const SENDGRID_FROM_EMAIL =
  process.env.SENDGRID_FROM_EMAIL || 'noreply@successionstory.com'

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

function isAuthorized(req: NextRequest): boolean {
  return req.headers.get('authorization') === `Bearer ${process.env.CRON_SECRET}`
}

async function sendEmail(to: string, subject: string, html: string, text: string) {
  await sgMail.send({
    to,
    from: { email: SENDGRID_FROM_EMAIL, name: 'Succession Story' },
    subject,
    html,
    text,
    asm: {
      groupId: 29233,
      groupsToDisplay: [29233],
    }
  })
}

async function advanceOrComplete(
  entryId: string,
  nextStepIndex: number,
  totalSteps: number,
  nextStepDelayHours: number,
  currentStepDelayHours: number
) {
  const isLast = nextStepIndex >= totalSteps
  if (isLast) {
    await supabaseAdmin
      .from('email_sequence_state')
      .update({ current_step: nextStepIndex, completed: true })
      .eq('id', entryId)
  } else {
    const intervalHours = nextStepDelayHours - currentStepDelayHours
    const nextSendAt = new Date(Date.now() + intervalHours * 60 * 60 * 1000)
    await supabaseAdmin
      .from('email_sequence_state')
      .update({ current_step: nextStepIndex, next_send_at: nextSendAt.toISOString() })
      .eq('id', entryId)
  }
}

// ─── SEQUENCE A ───────────────────────────────────────────────────────────────

async function enrollSequenceATargets() {
  const { data, error } = await supabaseAdmin
    .from('submissions')
    .select('id, user_id, submitted_at')
    .eq('status', 'completed')
    .eq('paid', false)

  if (error || !data?.length) return

  for (const submission of data) {
    if (!submission.submitted_at) continue

    const hoursSince = (Date.now() - new Date(submission.submitted_at).getTime()) / 36e5
    if (hoursSince < 1) continue

    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(submission.user_id)
    const email = userData?.user?.email
    if (!email) continue

    const { data: existing } = await supabaseAdmin
      .from('email_sequence_state')
      .select('id')
      .eq('email', email)
      .eq('sequence', 'A')
      .maybeSingle()
    if (existing) continue

    const nextSendAt = new Date(
      new Date(submission.submitted_at).getTime() +
        SEQUENCE_A_STEPS[0].delayHours * 36e5
    )

    await supabaseAdmin.from('email_sequence_state').insert({
      email,
      sequence: 'A',
      current_step: 0,
      next_send_at: nextSendAt.toISOString(),
      metadata: JSON.stringify({ submission_id: submission.id }),
    })

    console.log(`[Cron/A] Enrolled ${email}`)
  }
}

async function processSequenceA() {
  const { data: pending, error } = await supabaseAdmin
    .from('email_sequence_state')
    .select('*')
    .eq('sequence', 'A')
    .eq('completed', false)
    .eq('opted_out', false)
    .lte('next_send_at', new Date().toISOString())

  if (error || !pending?.length) return
  console.log(`[Cron/A] Processing ${pending.length} emails`)

  for (const entry of pending) {
    const stepIndex = entry.current_step
    const stepConfig = SEQUENCE_A_STEPS[stepIndex]

    if (!stepConfig) {
      await supabaseAdmin.from('email_sequence_state').update({ completed: true }).eq('id', entry.id)
      continue
    }

    const metadata = entry.metadata ? JSON.parse(entry.metadata) : {}

    // Stop if paid
    if (metadata.submission_id) {
      const { data: sub } = await supabaseAdmin
        .from('submissions')
        .select('paid')
        .eq('id', metadata.submission_id)
        .single()
      if (sub?.paid) {
        await supabaseAdmin.from('email_sequence_state').update({ completed: true }).eq('id', entry.id)
        console.log(`[Cron/A] ${entry.email} paid — stopping`)
        continue
      }
    }

    // Fetch answers and build personalisation with email + unsubscribe token
    let answers: { question_id: string; answer_text: string }[] = []
    if (metadata.submission_id) {
      const { data: fetched } = await supabaseAdmin
        .from('answers')
        .select('question_id, answer_text')
        .eq('submission_id', metadata.submission_id)
      if (fetched?.length) answers = fetched
    }

    const personalisation = extractPersonalisation(
      answers,
      entry.email,
      entry.unsubscribe_token
    )

    try {
      await sendEmail(
        entry.email,
        stepConfig.subject(personalisation),
        stepConfig.getHTML(personalisation),
        `Your Succession Story is waiting. Visit https://www.successionstory.now/questionnaire`
      )
      console.log(`[Cron/A] Step ${stepConfig.step} → ${entry.email}`)
      await advanceOrComplete(
        entry.id,
        stepIndex + 1,
        SEQUENCE_A_STEPS.length,
        SEQUENCE_A_STEPS[stepIndex + 1]?.delayHours ?? 0,
        stepConfig.delayHours
      )
    } catch (err) {
      console.error(`[Cron/A] Failed step ${stepConfig.step} → ${entry.email}:`, err)
    }
  }
}

// ─── SEQUENCE B ───────────────────────────────────────────────────────────────

async function enrollSequenceBLeads() {
  const { data: leads, error } = await supabaseAdmin.rpc('get_unenrolled_sequence_b_leads')
  if (error || !leads?.length) return
  console.log(`[Cron/B] Enrolling ${leads.length} leads`)

  for (const lead of leads) {
    const nextSendAt = new Date(
      new Date(lead.created_at).getTime() + SEQUENCE_B_STEPS[0].delayHours * 36e5
    )
    await supabaseAdmin.from('email_sequence_state').insert({
      email: lead.email,
      sequence: 'B',
      current_step: 0,
      next_send_at: nextSendAt.toISOString(),
    })
  }
}

async function processSequenceB() {
  const { data: pending, error } = await supabaseAdmin
    .from('email_sequence_state')
    .select('*')
    .eq('sequence', 'B')
    .eq('completed', false)
    .eq('opted_out', false)
    .lte('next_send_at', new Date().toISOString())

  if (error || !pending?.length) return
  console.log(`[Cron/B] Processing ${pending.length} emails`)

  for (const entry of pending) {
    const stepIndex = entry.current_step
    const stepConfig = SEQUENCE_B_STEPS[stepIndex]

    if (!stepConfig) {
      await supabaseAdmin.from('email_sequence_state').update({ completed: true }).eq('id', entry.id)
      continue
    }

    // Stop if they've started the questionnaire
    const { data: userData } = await supabaseAdmin.auth.admin.listUsers()
    const user = userData?.users?.find(u => u.email === entry.email)
    if (user) {
      const { data: sub } = await supabaseAdmin
        .from('submissions')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()
      if (sub) {
        await supabaseAdmin.from('email_sequence_state').update({ completed: true }).eq('id', entry.id)
        console.log(`[Cron/B] ${entry.email} started — stopping`)
        continue
      }
    }

    try {
      await sendEmail(
        entry.email,
        stepConfig.subject,
        stepConfig.getHTML(entry.email, entry.unsubscribe_token),
        `Visit https://www.successionstory.now/login to start your Succession Story.`
      )
      console.log(`[Cron/B] Step ${stepConfig.step} → ${entry.email}`)
      await advanceOrComplete(
        entry.id,
        stepIndex + 1,
        SEQUENCE_B_STEPS.length,
        SEQUENCE_B_STEPS[stepIndex + 1]?.delayHours ?? 0,
        stepConfig.delayHours
      )
    } catch (err) {
      console.error(`[Cron/B] Failed step ${stepConfig.step} → ${entry.email}:`, err)
    }
  }
}

// ─── SEQUENCE C ───────────────────────────────────────────────────────────────

async function enrollSequenceCTargets() {
  const fourHoursAgo = new Date(Date.now() - 4 * 36e5).toISOString()

  const { data, error } = await supabaseAdmin
    .from('submissions')
    .select('id, user_id, current_section_index, updated_at')
    .eq('status', 'in_progress')
    .gte('current_section_index', 3)
    .lte('updated_at', fourHoursAgo)

  if (error || !data?.length) return

  for (const submission of data) {
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(submission.user_id)
    const email = userData?.user?.email
    if (!email) continue

    const { data: existing } = await supabaseAdmin
      .from('email_sequence_state')
      .select('id')
      .eq('email', email)
      .eq('sequence', 'C')
      .maybeSingle()
    if (existing) continue

    const nextSendAt = new Date(
      new Date(submission.updated_at).getTime() +
        SEQUENCE_C_STEPS[0].delayHours * 36e5
    )

    await supabaseAdmin.from('email_sequence_state').insert({
      email,
      sequence: 'C',
      current_step: 0,
      next_send_at: nextSendAt.toISOString(),
      metadata: JSON.stringify({
        submission_id: submission.id,
        stopped_at_section: submission.current_section_index,
      }),
    })

    console.log(`[Cron/C] Enrolled ${email} (stopped at section ${submission.current_section_index})`)
  }
}

async function processSequenceC() {
  const { data: pending, error } = await supabaseAdmin
    .from('email_sequence_state')
    .select('*')
    .eq('sequence', 'C')
    .eq('completed', false)
    .eq('opted_out', false)
    .lte('next_send_at', new Date().toISOString())

  if (error || !pending?.length) return
  console.log(`[Cron/C] Processing ${pending.length} emails`)

  for (const entry of pending) {
    const stepIndex = entry.current_step
    const stepConfig = SEQUENCE_C_STEPS[stepIndex]

    if (!stepConfig) {
      await supabaseAdmin.from('email_sequence_state').update({ completed: true }).eq('id', entry.id)
      continue
    }

    const metadata = entry.metadata ? JSON.parse(entry.metadata) : {}

    // Stop if they've completed or paid since enrolling
    if (metadata.submission_id) {
      const { data: sub } = await supabaseAdmin
        .from('submissions')
        .select('status, paid')
        .eq('id', metadata.submission_id)
        .single()

      if (sub?.status === 'completed' || sub?.paid) {
        await supabaseAdmin.from('email_sequence_state').update({ completed: true }).eq('id', entry.id)
        console.log(`[Cron/C] ${entry.email} completed/paid — stopping`)
        continue
      }
    }

    const stoppedAt = metadata.stopped_at_section ?? 4
    const ctx = buildSequenceCContext(stoppedAt, entry.email, entry.unsubscribe_token)

    try {
      await sendEmail(
        entry.email,
        stepConfig.subject(ctx),
        stepConfig.getHTML(ctx),
        `Your questionnaire progress is saved. Continue at https://www.successionstory.now/questionnaire`
      )
      console.log(`[Cron/C] Step ${stepConfig.step} → ${entry.email}`)
      await advanceOrComplete(
        entry.id,
        stepIndex + 1,
        SEQUENCE_C_STEPS.length,
        SEQUENCE_C_STEPS[stepIndex + 1]?.delayHours ?? 0,
        stepConfig.delayHours
      )
    } catch (err) {
      console.error(`[Cron/C] Failed step ${stepConfig.step} → ${entry.email}:`, err)
    }
  }
}

// ─── MAIN HANDLER ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await enrollSequenceATargets()
    await processSequenceA()

    await enrollSequenceBLeads()
    await processSequenceB()

    await enrollSequenceCTargets()
    await processSequenceC()

    return NextResponse.json({ success: true, timestamp: new Date().toISOString() })
  } catch (err) {
    console.error('[Cron] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}