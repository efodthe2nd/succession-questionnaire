import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  if (!token || !email) {
    return NextResponse.redirect('https://www.successionstory.now/unsubscribed')
  }

  const { data, error } = await supabaseAdmin
    .from('email_sequence_state')
    .select('id, unsubscribe_token')
    .eq('email', email)

  if (error || !data?.length) {
    return NextResponse.redirect('https://www.successionstory.now/unsubscribed')
  }

  const validEntry = data.find(e => e.unsubscribe_token === token)
  if (!validEntry) {
    return NextResponse.redirect('https://www.successionstory.now/unsubscribed')
  }

  await supabaseAdmin
    .from('email_sequence_state')
    .update({ opted_out: true })
    .eq('email', email)

  return NextResponse.redirect('https://www.successionstory.now/unsubscribed')
}