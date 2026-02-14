import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('submissions')
      .select('*, answers(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[Admin API] Failed to fetch submissions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ submissions: data })
  } catch (error) {
    console.error('[Admin API] Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}