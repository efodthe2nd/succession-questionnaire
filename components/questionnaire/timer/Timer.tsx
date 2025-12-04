'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import TimerDisplay from './TimerDisplay';

interface TimerProps {
  submissionId: string | null;
  initialTime: number;
  onTimeUpdate?: (timeRemaining: number) => void;
}

export default function Timer({ submissionId, initialTime, onTimeUpdate }: TimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  // Format time as HH:MM:SS
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0'),
    };
  };

  const time = formatTime(timeRemaining);

  // Timer countdown logic
  useEffect(() => {
    if (!isTimerPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerPaused, timeRemaining]);

  // Notify parent of time updates
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(timeRemaining);
    }
  }, [timeRemaining, onTimeUpdate]);

  // Save timer on visibility change (tab switch, minimize)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.hidden && submissionId) {
        // Save timer when leaving page
        await supabase
          .from('submissions')
          .update({ time_remaining: timeRemaining })
          .eq('id', submissionId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submissionId, timeRemaining, supabase]);

  // Save timer before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (submissionId) {
        // Use sendBeacon for reliable save on page close
        navigator.sendBeacon?.(
          '/api/save-timer',
          JSON.stringify({ submissionId, timeRemaining })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [submissionId, timeRemaining]);

  return <TimerDisplay hours={time.hours} minutes={time.minutes} seconds={time.seconds} />;
}
