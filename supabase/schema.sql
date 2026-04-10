-- Create the works table for Works Tracker
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS works (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client TEXT,
  description TEXT,
  start_date DATE NOT NULL,
  due_date DATE NOT NULL,
  actual_end_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional, can be disabled for development)
ALTER TABLE works ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (adjust as needed for production)
CREATE POLICY "Allow all" ON works FOR ALL USING (true) WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_works_created_at ON works(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_works_start_date ON works(start_date);
CREATE INDEX IF NOT EXISTS idx_works_due_date ON works(due_date);
