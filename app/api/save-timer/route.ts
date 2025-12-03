// /app/api/save-timer/route.ts
import { createClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, timeRemaining } = body;

    if (!submissionId || timeRemaining === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient();
    
    const { error } = await supabase
      .from('submissions')
      .update({ time_remaining: timeRemaining })
      .eq('id', submissionId);

    if (error) {
      console.error('Error saving timer:', error);
      return NextResponse.json(
        { error: 'Failed to save timer' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in save-timer API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}