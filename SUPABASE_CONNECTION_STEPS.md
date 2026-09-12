# 🎯 SUPABASE CONNECTION - EXACT STEPS

## Summary of What's Already Built

✅ **All code is ready** - Every function calls Supabase
✅ **All services created** - URL shortening, auth, redirects
✅ **All pages built** - Landing, dashboard, analytics
✅ **All types defined** - TypeScript ready

**What's missing:** Your Supabase credentials and database tables

---

## 🔑 Step 1: Get Your Credentials from Supabase

### In your Supabase dashboard:

1. Click **Settings** (gear icon) in left sidebar
2. Click **API** tab
3. Copy these TWO values:

```
Project URL:
https://[something].supabase.co

Anon Key:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Keep these handy - you'll need them next.**

---

## 📝 Step 2: Create `.env.local` File

1. In your project root (C:\Users\Anish Singh\OneDrive\Desktop\ide\)
2. Create a new file called `.env.local`
3. Add these exact lines (replace with YOUR credentials):

```
VITE_SUPABASE_URL=https://your-project-here.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Example (don't use this):**
```
VITE_SUPABASE_URL=https://abcxyz123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY3h5ejEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjI0NzE4MjAwLCJleHAiOjE5MzA0OTQyMDB9.xH3sD7F9kL4mP8qN6rT2vW1zU
```

---

## 🗄️ Step 3: Create Database Tables

1. Go to your Supabase project
2. Click **SQL Editor** in left sidebar
3. Click **New Query**
4. **Copy the entire SQL below** and paste it:

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
CREATE POLICY "Anyone can insert click events"
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

5. Click **Run** button
6. Wait for green "Success" message

---

## 🐛 Step 4: Fix One Line of Code

**File:** `src/pages/LandingPage.tsx`  
**Line:** Around line 50

**Find this:**
```typescript
const result = await urlService.createShortUrl(
  'placeholder-user-id',
  originalUrl
)
```

**Replace with:**
```typescript
const result = await urlService.createShortUrl(
  user!.id,
  originalUrl
)
```

---

## 🚀 Step 5: Restart Dev Server

In PowerShell:
```bash
npm run dev
```

The dev server will restart and load your `.env.local` credentials.

---

## ✅ Step 6: Test Everything

1. Open http://localhost:5173
2. Click "Get Started"
3. Sign up with an email and password
4. Enter a URL like `https://example.com`
5. Click "Shorten URL"
6. You should see a short URL generated
7. Copy it and open in a new tab
8. It should redirect to `https://example.com`
9. Go back to dashboard
10. You should see your URL listed with click count = 1

**If all of that works: ✅ You're connected!**

---

## 📋 Checklist

Before you start:
- [ ] Supabase project created
- [ ] You have your Project URL
- [ ] You have your Anon Key
- [ ] You're ready to run SQL

After each step:
- [ ] `.env.local` created with credentials
- [ ] SQL migration ran successfully
- [ ] Code fix applied (LandingPage.tsx)
- [ ] Dev server restarted
- [ ] Tests pass

---

## 🔒 Security Note

You're using:
- ✅ **VITE_SUPABASE_ANON_KEY** - Safe, public key for frontend
- ✅ **RLS Policies** - Database enforces access control
- ✅ **Auth checks** - User ID from authenticated session

You're NOT using:
- ❌ Service Role Key (which would be unsafe in frontend)
- ❌ Hardcoded credentials
- ❌ Placeholder values (except one place we're fixing)

---

## ⚠️ Troubleshooting

**"Cannot find module" errors:**
- Run `npm install` again
- Restart dev server

**"Supabase credentials not configured" warning:**
- Check `.env.local` file exists
- Verify credentials are correct
- Restart dev server

**"Link not found" when opening short URL:**
- Check database tables were created
- Check RLS policies were applied
- Check auth is working (can you login?)

**Click count not increasing:**
- Check `click_events` table exists
- Check `increment_click_count` function exists
- Open browser console (F12) and check for errors

---

## 📞 Need Help?

Check these files:
- `INSPECTION_REPORT.md` - Full technical report
- `COMPLETE_GUIDE.md` - Deep technical guide
- `README.md` - User documentation

---

**Ready to connect?** 

Give me your credentials and I'll create the `.env.local` file for you, or follow the steps above yourself!

Once database is set up and `.env.local` is created, everything will work automatically.
