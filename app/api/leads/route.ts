import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Insert or update lead (upsert based on email)
    const { data, error } = await supabase
      .from('leads')
      .upsert(
        {
          email: email.toLowerCase().trim(),
          source: source || 'unknown',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
          ignoreDuplicates: false,
        }
      )
      .select()
      .single()

    if (error) {
      console.error('[leads API] Error saving lead:', error)
      // Don't fail the request if it's a duplicate or constraint error
      // The lead capture should succeed even if DB has issues
      return NextResponse.json({ success: true, message: 'Lead processed' })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[leads API] Error:', error)
    // Return success anyway to not block the checkout flow
    return NextResponse.json({ success: true, message: 'Lead processed' })
  }
}
