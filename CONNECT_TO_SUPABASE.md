# 🔧 SUPABASE CONNECTION GUIDE - EXACT STEPS

## Project Inspection Summary

### ✅ What's Already Implemented

| Component | File | Status |
|-----------|------|--------|
| **Supabase Client** | `src/lib/supabase.ts` | ✅ Ready (waiting for credentials) |
| **URL Creation** | `src/services/urlService.ts` - `createShortUrl()` | ✅ Ready (lines 38-88) |
| **URL Resolution** | `src/services/urlService.ts` - `resolveShortUrl()` | ✅ Ready (lines 93-118) |
| **Click Tracking** | `src/services/urlService.ts` - `recordClick()` | ✅ Ready (lines 123-140) |
| **Redirect Handler** | `src/lib/redirectHandler.ts` - `handleRedirect()` | ✅ Ready |
| **Auth Service** | `src/services/authService.ts` | ✅ Ready |
| **Auth Hook** | `src/hooks/useAuth.ts` | ✅ Ready |
| **Dashboard** | `src/pages/DashboardPage.tsx` | ✅ Ready (loads real data) |
| **Database Migration** | `supabase-migration.sql` | ✅ Ready (107 lines) |
| **Environment Template** | `.env.example` | ✅ Ready |

---

## 🔑 WHERE TO PUT YOUR CREDENTIALS

### Create `.env.local` File

**Location:** `C:\Users\Anish Singh\OneDrive\Desktop\ide\.env.local`

**Content:**
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to get these values:**

1. Go to your Supabase project dashboard
2. Click **Settings** (gear icon) in left sidebar
3. Click **API** tab
4. Under "Project API keys", you'll see:
   - **Project URL** → Copy this to `VITE_SUPABASE_URL`
   - **Anon Key** (under "anon public") → Copy this to `VITE_SUPABASE_ANON_KEY`

**CRITICAL:** Do NOT use the Service Role Key - only the Anon Key

---

## 🗄️ MANUAL STEPS IN SUPABASE DASHBOARD

You must manually do these steps in your Supabase project:

### Step 1: Create Tables and Functions (via SQL Editor)

Go to **SQL Editor** → **New Query** and run the entire migration SQL:

**Copy the complete SQL from:** `supabase-migration.sql`

This creates:
- ✅ `urls` table (with user_id FK to auth.users)
- ✅ `click_events` table (with url_id FK)
- ✅ 5 indexes (for performance)
- ✅ Row Level Security enabled on both tables
- ✅ 6 RLS policies (protecting user data)
- ✅ `increment_click_count()` RPC function
- ✅ Triggers for auto-updating timestamps

**After running, verify in SQL Editor that all CREATE statements succeeded (green checkmark)**

### Step 2: Verify Tables Were Created

Go to **Database** → **Tables** and verify you see:
- ✅ `urls` table
- ✅ `click_events` table

### Step 3: Verify Functions Were Created

Go to **Database** → **Functions** and verify:
- ✅ `increment_click_count(url_id UUID)` exists

---

## 📱 How the Application Works (Data Flow)

### URL Shortening Flow

```
User enters: https://example.com/products/item?id=123
    ↓
App calls: urlService.createShortUrl(user.id, url)
    ↓
App validates URL using new URL(originalUrl)
    ↓
App normalizes: url.toString() preserves exact URL
    ↓
App generates random code: "abc123" (6 chars)
    ↓
Supabase INSERT into urls table:
  - user_id: authenticated user ID
  - original_url: "https://example.com/products/item?id=123"
  - short_code: "abc123"
  - click_count: 0
  - is_active: true
    ↓
Returns: http://localhost:5173/abc123
```

### Redirect Flow (CRITICAL - URL PRESERVATION)

```
User opens: http://localhost:5173/abc123
    ↓
React router captures: /:shortCode
    ↓
App calls: handleRedirect('abc123')
    ↓
Supabase queries:
  SELECT id, original_url, is_active, expires_at
  FROM urls
  WHERE short_code = 'abc123'
    ↓
App checks:
  - is_active = true ✓
  - not expired ✓
    ↓
App records click asynchronously (doesn't block redirect)
    ↓
Browser: window.location.href = original_url
    ↓
Browser navigates to:
  https://example.com/products/item?id=123
    ↓
✅ EXACT URL PRESERVED (protocol, path, query params all intact)
```

### Click Tracking Flow

```
After redirect is initiated:
    ↓
App inserts into click_events table:
  - url_id: the URL's database ID
  - clicked_at: current timestamp
  - referrer: document.referrer (where click came from)
  - user_agent: navigator.userAgent
    ↓
App calls RPC: increment_click_count(url_id)
    ↓
Database function atomically increments:
  UPDATE urls SET click_count = click_count + 1
  WHERE id = url_id
    ↓
✅ Click recorded and counted
```

---

## 🔐 Security Model

### Row Level Security (RLS) Policies

**URLs Table:**
- ✅ Users can SELECT only their own URLs (`auth.uid() = user_id`)
- ✅ Users can INSERT only as themselves (`auth.uid() = user_id`)
- ✅ Users can UPDATE only their own (`auth.uid() = user_id`)
- ✅ Users can DELETE only their own (`auth.uid() = user_id`)
- ✅ PUBLIC can SELECT any active URL by short_code (for redirects)

**Click Events Table:**
- ✅ Users can SELECT only clicks from their URLs
- ✅ ANYONE can INSERT (for anonymous tracking)
- ✅ No DELETE/UPDATE (immutable)

**Enforced by:** Supabase database - frontend cannot bypass

---

## ✅ Exact Code That Will Run

### When User Creates Short URL (LandingPage.tsx)

```typescript
// Line 49-50 - Gets authenticated user ID
const result = await urlService.createShortUrl(
  user!.id,  // ← Real authenticated user
  originalUrl
)
```

**Maps to:** `urlService.createShortUrl()` (lines 38-88)
- Validates URL
- Normalizes to preserve exact URL
- Generates cryptographically random short code
- Inserts to Supabase urls table
- Returns with short_code

### When User Opens Short URL (RedirectPage.tsx)

```typescript
// Captured route: /:shortCode
const handleRedirect = async (shortCode: string) => {
  // Calls redirectHandler.ts
  const success = await handleRedirect(shortCode)
}
```

**Maps to:** `redirectHandler.ts` (lines 12-64)
- Queries Supabase for original_url by short_code
- Checks is_active = true and not expired
- Records click asynchronously
- Performs: `window.location.href = original_url`
- Browser redirects to EXACT original URL

### When Dashboard Loads (DashboardPage.tsx)

```typescript
// Line 41 - Gets authenticated user's URLs
const userUrls = await urlService.getUserUrls(user.id)
```

**Maps to:** `urlService.getUserUrls()` (lines 145-154)
- Queries Supabase with RLS filter: `user_id = auth.uid()`
- Returns only user's URLs
- Displays in dashboard

---

## 🛠️ What Needs to Happen Now

### You Must Do:

1. **Create `.env.local` file** with your credentials
   - Location: `C:\Users\Anish Singh\OneDrive\Desktop\ide\.env.local`
   - Content: Your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY

2. **Run SQL Migration in Supabase**
   - Go to Supabase SQL Editor
   - Create new query
   - Copy entire `supabase-migration.sql`
   - Click Run
   - Verify all statements succeeded

3. **No Code Changes Needed**
   - Application already uses real Supabase data
   - No placeholder values
   - All URLs preserved exactly
   - RLS enforced automatically

---

## 🔍 Critical URLs in Code

| Feature | Function | File | Preserves URL? |
|---------|----------|------|---|
| **Create** | `createShortUrl()` | `urlService.ts:38` | ✅ Uses `url.toString()` |
| **Resolve** | `resolveShortUrl()` | `urlService.ts:93` | ✅ Returns exact `original_url` |
| **Redirect** | `window.location.href` | `redirectHandler.ts:57` | ✅ Native browser redirect |

---

## ✨ After Setup

Your application will:

✅ Sign up users via Supabase Auth  
✅ Store URLs with exact preservation  
✅ Generate random 6-char codes  
✅ Redirect to exact original URL  
✅ Track clicks with referrer/UA  
✅ Show real analytics  
✅ Enforce RLS security  
✅ Persist all data to PostgreSQL  

---

## 🎯 Before Running Dev Server Again

1. ✅ Create `.env.local` with your credentials
2. ✅ Run SQL migration in Supabase dashboard
3. ✅ Verify tables created (Database → Tables)
4. ✅ Verify functions created (Database → Functions)

Then restart: `npm run dev`

Everything else is ready - no code changes needed.

---

## 📋 Checklist

Before Starting:
- [ ] You have your Supabase project URL
- [ ] You have your Supabase Anon Key
- [ ] You can access Supabase SQL Editor

To Connect:
- [ ] Create `.env.local` with credentials
- [ ] Copy entire `supabase-migration.sql`
- [ ] Run migration in Supabase SQL Editor
- [ ] Verify tables and functions created
- [ ] Restart dev server: `npm run dev`

After Connection:
- [ ] Sign up works
- [ ] Create short URL works
- [ ] Open short URL redirects correctly
- [ ] Click count increases
- [ ] Dashboard shows real data

---

**Status: Ready to Connect**

The application code is complete. Just need your credentials and database setup.
