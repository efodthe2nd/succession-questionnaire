import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendLetterEmail } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Simple admin token check — matches what the frontend sends
function isAdminAuthorized(req: NextRequest): boolean {
  const token = req.headers.get('x-admin-token')
  return token === process.env.ADMIN_SECRET_TOKEN
}

export async function POST(req: NextRequest) {
  // Auth check — must come first
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const submissionId = formData.get('submission_id') as string
    const pdf = formData.get('pdf') as File

    if (!submissionId || !pdf) {
      return NextResponse.json(
        { error: 'Missing submission_id or pdf' },
        { status: 400 }
      )
    }

    // Validate it's actually a PDF
    if (pdf.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      )
    }

    // Fetch submission to get user_id
    const { data: submission, error: submissionError } = await supabaseAdmin
      .from('submissions')
      .select('user_id')
      .eq('id', submissionId)
      .single()

    if (submissionError || !submission) {
      console.error('[send-letter] Failed to fetch submission:', submissionError)
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Fetch user email from Supabase Auth
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      submission.user_id
    )

    if (userError || !userData.user) {
      console.error('[send-letter] Failed to fetch user:', userError)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userEmail = userData.user.email
    if (!userEmail) {
      return NextResponse.json({ error: 'User email not found' }, { status: 404 })
    }

    // Convert PDF to base64
    const arrayBuffer = await pdf.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    // Send the email with PDF attachment
    const emailSent = await sendLetterEmail(userEmail, base64)

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    console.log('[send-letter] Letter sent successfully to:', userEmail)
    return NextResponse.json({ success: true, message: 'Letter sent successfully' })

  } catch (error) {
    console.error('[send-letter] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}