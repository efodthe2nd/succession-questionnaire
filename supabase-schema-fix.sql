-- =============================================
-- SUPABASE SCHEMA FIX
-- =============================================
-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This adds missing columns to the submissions table
-- =============================================

-- Add missing columns to submissions table
-- Using IF NOT EXISTS pattern to avoid errors if columns already exist

DO $$
BEGIN
  -- Add current_section_index column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'current_section_index'
  ) THEN
    ALTER TABLE submissions ADD COLUMN current_section_index INTEGER DEFAULT 1;
  END IF;

  -- Add time_remaining column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'time_remaining'
  ) THEN
    ALTER TABLE submissions ADD COLUMN time_remaining BIGINT DEFAULT 7200;
  END IF;

  -- Add status column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'status'
  ) THEN
    ALTER TABLE submissions ADD COLUMN status TEXT DEFAULT 'in_progress';
  END IF;

  -- Add submitted_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'submitted_at'
  ) THEN
    ALTER TABLE submissions ADD COLUMN submitted_at TIMESTAMPTZ;
  END IF;

  -- Add user_id column (if missing)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE submissions ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;

  -- Add created_at column (if missing)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'submissions' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE submissions ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END
$$;

-- =============================================
-- Verify the submissions table structure
-- =============================================
-- After running, you can verify with:
-- SELECT column_name, data_type, column_default
-- FROM information_schema.columns
-- WHERE table_name = 'submissions';

-- =============================================
-- IMPORTANT: After adding columns, refresh the schema cache
-- =============================================
-- Go to Supabase Dashboard > Settings > API > Click "Reload" next to schema cache
-- Or wait a few minutes for it to auto-refresh
