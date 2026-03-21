import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendWelcomeEmail, generatePassword } from '@/lib/email'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { email, source = 'variant-1' } = await req.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const cleanEmail = email.toLowerCase().trim()

    // 1. Save to leads table
    const { error: leadError } = await supabaseAdmin
      .from('leads')
      .upsert({ email: cleanEmail, source }, { onConflict: 'email' })

    if (leadError) {
      console.error('[leads/capture] leads upsert error:', leadError)
    }

    // 2. Generate a password
    const password = generatePassword()

    // 3. Create user with email_confirm: true and a real password
    const { error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true, // ← no magic link, no confirmation email from Supabase
      user_metadata: { source },
    })

    // 4. If user already exists, update their password so the email we send is valid
    if (signUpError && signUpError.message.includes('already been registered')) {
      const { error: listError, data: listData } = await supabaseAdmin.auth.admin.listUsers()
      if (!listError) {
        const existingUser = listData.users.find(u => u.email === cleanEmail)
        if (existingUser) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { password })
        }
      }
    } else if (signUpError) {
      console.error('[leads/capture] createUser error:', signUpError)
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
    }

    // 5. Send our welcome email with credentials
    // 5. Send our welcome email with credentials
const emailSent = await sendWelcomeEmail({ to: cleanEmail, password })

// 6. Update funnel_stage and email_sent_at
if (emailSent) {
  await supabaseAdmin
    .from('leads')
    .update({
      funnel_stage: 'email_sent',
      email_sent_at: new Date().toISOString(),
    })
    .eq('email', cleanEmail)
}

return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[leads/capture] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}