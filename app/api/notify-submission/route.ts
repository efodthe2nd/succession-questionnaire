import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendSubmissionNotificationEmail } from '@/lib/email'

// Create admin client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { submissionId } = await req.json()

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Missing submissionId' },
        { status: 400 }
      )
    }

    // Get submission with answers
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .select('*, answers(*)')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      console.error('[notify-submission] Failed to fetch submission:', submissionError)
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Get the user's email
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      submission.user_id
    )

    if (userError || !userData.user) {
      console.error('[notify-submission] Failed to fetch user:', userError)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get the name from question q7_5 (signature name)
    const signatureAnswer = submission.answers?.find(
      (a: { question_id: string }) => a.question_id === 'q7_5'
    )
    const submitterName = signatureAnswer?.answer_text || 'Anonymous'

    // Send the notification email
    const emailSent = await sendSubmissionNotificationEmail({
      submitterName,
      submitterEmail: userData.user.email || 'Unknown',
      submissionId,
    })

    return NextResponse.json({
      success: true,
      emailSent,
      submitterName,
    })
  } catch (error) {
    console.error('[notify-submission] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
