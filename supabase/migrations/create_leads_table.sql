-- Create leads table for capturing email leads from landing pages
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Create index on source for analytics
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Policy to allow inserts from authenticated and anonymous users (via service role in API)
-- The API uses the service role key which bypasses RLS
-- This policy is for reference if direct client access is needed in the future
CREATE POLICY "Allow insert leads" ON leads
  FOR INSERT
  WITH CHECK (true);

-- Policy to allow service role to select leads
CREATE POLICY "Allow select leads for service role" ON leads
  FOR SELECT
  USING (true);
