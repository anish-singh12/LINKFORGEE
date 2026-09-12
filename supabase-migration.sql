/**
 * Supabase SQL Migration
 * Run this in Supabase SQL Editor (Database > SQL Editor > New Query)
 */

-- Create urls table
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code TEXT NOT NULL UNIQUE,
  click_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create click_events table
CREATE TABLE IF NOT EXISTS click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url_id UUID NOT NULL REFERENCES urls(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP DEFAULT now(),
  referrer TEXT NULL,
  user_agent TEXT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_urls_short_code ON urls(short_code);
CREATE INDEX IF NOT EXISTS idx_urls_user_id ON urls(user_id);
CREATE INDEX IF NOT EXISTS idx_urls_created_at ON urls(created_at);
CREATE INDEX IF NOT EXISTS idx_click_events_url_id ON click_events(url_id);
CREATE INDEX IF NOT EXISTS idx_click_events_clicked_at ON click_events(clicked_at);

-- Enable Row Level Security
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for urls table
-- Users can only see their own URLs
CREATE POLICY "Users can view their own URLs"
  ON urls
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own URLs
CREATE POLICY "Users can create their own URLs"
  ON urls
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own URLs
CREATE POLICY "Users can update their own URLs"
  ON urls
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own URLs
CREATE POLICY "Users can delete their own URLs"
  ON urls
  FOR DELETE
  USING (auth.uid() = user_id);

-- Allow public resolution of short codes (no auth required for viewing)
CREATE POLICY "Public can resolve short codes"
  ON urls
  FOR SELECT
  USING (true)
  WITH CHECK (false);

-- RLS Policies for click_events table
-- Users can view click events for their URLs
CREATE POLICY "Users can view click events for their URLs"
  ON click_events
  FOR SELECT
  USING (
    url_id IN (
      SELECT id FROM urls WHERE user_id = auth.uid()
    )
  );

-- Anyone can insert click events (for tracking)
CREATE POLICY "Anyone can create click events"
  ON click_events
  FOR INSERT
  WITH CHECK (true);

-- Function to increment click count atomically
CREATE OR REPLACE FUNCTION increment_click_count(url_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE urls SET click_count = click_count + 1 WHERE id = url_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_urls_updated_at BEFORE UPDATE ON urls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
