# 🔧 SUPABASE CONNECTION - MANUAL SETUP REQUIRED

## ✅ Environment Variables Verified

Your `.env.local` file matches the code requirements:

| Variable | Code Location | Type Definition | Status |
|----------|---------------|-----------------|--------|
| `VITE_SUPABASE_URL` | `src/lib/supabase.ts:3` | `src/vite-env.d.ts:4` | ✅ Correct |
| `VITE_SUPABASE_ANON_KEY` | `src/lib/supabase.ts:4` | `src/vite-env.d.ts:5` | ✅ Correct |

Your `.env.local` is properly recognized by the application. ✅

---

## 🗄️ MANUAL STEPS REQUIRED IN SUPABASE DASHBOARD

You must run the database migration manually in your Supabase project.

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Paste the Migration SQL

Copy the entire SQL migration below and paste it into the SQL Editor:

```sql
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
-- Users can view their own URLs
CREATE POLICY "Users can view their own URLs"
  ON urls
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own URLs
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
```

### Step 3: Execute the SQL

1. Click the **Run** button (or press Ctrl+Enter)
2. Wait for the query to complete
3. You should see a green checkmark indicating success

### Step 4: Verify the Setup

After running the SQL, verify:

1. Go to **Database** → **Tables**
   - You should see: `urls` table
   - You should see: `click_events` table

2. Go to **Database** → **Functions**
   - You should see: `increment_click_count` function

3. Go to **Database** → **Policies**
   - You should see RLS policies listed

---

## ✅ What the Migration Creates

✅ **urls table** - Stores shortened URLs
- id (UUID)
- user_id (FK to auth.users)
- original_url (exact URL to redirect to)
- short_code (unique 6-char code)
- click_count (number of clicks)
- is_active (soft delete flag)
- expires_at (optional expiration)
- created_at, updated_at

✅ **click_events table** - Tracks clicks
- id (UUID)
- url_id (FK to urls)
- clicked_at (timestamp)
- referrer (HTTP referrer)
- user_agent (browser info)

✅ **Indexes** - For performance
- idx_urls_short_code
- idx_urls_user_id
- idx_urls_created_at
- idx_click_events_url_id
- idx_click_events_clicked_at

✅ **RLS Policies** - For security
- Users can only see/edit their own URLs
- Anyone can create click events
- Users can only view their own analytics

✅ **RPC Function** - For atomic clicks
- `increment_click_count(url_id)` - Updates click count atomically

✅ **Triggers** - For auto-updates
- Auto-updates `updated_at` timestamp on changes

---

## 🔐 Security Note

The RLS policies ensure:
- User A cannot see User B's URLs
- User A cannot delete User B's URLs
- User A can only create URLs as themselves
- Anyone can record a click (for public redirects)
- User A can only see analytics for their own URLs

Database-level security - cannot be bypassed from frontend.

---

## 🚀 After Running the Migration

Once the SQL migration is complete:

1. The application will automatically use the real Supabase database
2. All URL creation will save to the `urls` table
3. All authentication will use Supabase Auth
4. All dashboard data will load from Supabase
5. All click tracking will record to `click_events` table
6. All redirects will query the real database

---

## 📝 Verification Steps

After migration, I will verify:

1. ✅ URL creation saves to Supabase
2. ✅ Authentication uses Supabase Auth
3. ✅ Dashboard reads real Supabase data
4. ✅ Short codes retrieve original URL
5. ✅ URLs redirect exactly (preserving path, query params)
6. ✅ Clicks are recorded correctly

---

## ⚠️ Important Notes

- **Only Anon Key used** - Never the Service Role Key
- **No mock data** - All real Supabase storage
- **RLS enforced** - At database level, not frontend
- **Atomic operations** - Click counting is thread-safe
- **URL preservation** - Original URL stored exactly as entered

---

## ✅ Status

✅ Environment variables configured correctly  
✅ Application code ready to connect  
⏳ Waiting for: SQL migration to be run in Supabase  

**Next:** Run the SQL migration above in Supabase SQL Editor, then I'll test the connection.
