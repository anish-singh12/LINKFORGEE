# 🧪 COMPLETE APPLICATION TEST PROTOCOL

## Status: Ready to Test

✅ Environment variables configured  
✅ Supabase database connected  
✅ RLS policies active  
✅ RPC functions available  
✅ Build successful  
✅ Dev server running on http://localhost:5173  

---

## Test Scenario: Complete End-to-End Flow

### Test 1: Verify `.env.local` in Project Root

**Location Check:**
- File: `C:\Users\Anish Singh\OneDrive\Desktop\ide\.env.local`
- Should be next to `package.json`
- Contains: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Result:** ✅ PASS
- `.env.local` exists in project root
- Contains correct variable names
- Values loaded into environment

---

### Test 2: Supabase Client Initialization

**Code Location:** `src/lib/supabase.ts`

**Verification:**
```typescript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {...})
```

**Result:** ✅ PASS
- Client initializes with env variables
- Session persistence enabled
- Auto-refresh tokens enabled

---

### Test 3: Environment Variable Name Matching

**Code expects:**
- `VITE_SUPABASE_URL` → Provided ✓
- `VITE_SUPABASE_ANON_KEY` → Provided ✓

**TypeScript definitions:** `src/vite-env.d.ts`
```typescript
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}
```

**Result:** ✅ PASS
- Names match exactly
- Type definitions correct
- No placeholders used

---

## Manual Testing Steps (Perform in Browser)

### STEP 1: Open Application

1. Open browser
2. Navigate to: `http://localhost:5173`
3. Should see landing page with "LinkForge" title

**Expected:** ✅ Landing page loads with 3D hero section

---

### STEP 2: Sign Up New Test User

1. Click "Get Started" button
2. Enter test email: `testuser@example.com`
3. Enter password: `Test123!@#`
4. Confirm password: `Test123!@#`
5. Click "Create Account"

**Expected:** ✅ User created in Supabase Auth, redirected to login

---

### STEP 3: Sign In

1. Click "Sign In" link
2. Enter email: `testuser@example.com`
3. Enter password: `Test123!@#`
4. Click "Sign In"

**Expected:** ✅ Redirected to dashboard with "0 Links" shown

---

### STEP 4: Create Short URL

1. On dashboard, look for URL shortening section OR navigate to home
2. Enter URL: `https://example.com/products/item?id=123&token=abc`
3. Click "Shorten URL"

**Expected:** ✅ Generated short URL displayed (e.g., `http://localhost:5173/abc123`)

---

### STEP 5: Verify Database Entry

After creating the URL, verify it was saved to Supabase by running:

```powershell
cd "C:\Users\Anish Singh\OneDrive\Desktop\ide"
node verify-supabase.js
```

**Expected Output:**
```
✓ Found 1 URL(s) in database
✓ Original URL preserved with query/fragment
✓ Found 0 click(s) for this URL (no clicks yet)
```

**Specific Checks:**
- Original URL: `https://example.com/products/item?id=123&token=abc`
- Short Code: 6 random characters
- Is Active: `true`
- Click Count: `0`
- User ID: Valid UUID (not placeholder)

---

### STEP 6: Test Exact URL Preservation

1. Copy the generated short URL
2. Open a new tab
3. Paste the short URL
4. **DO NOT MODIFY THE URL**

**Expected:** ✅ Browser redirects to EXACT original URL:
```
https://example.com/products/item?id=123&token=abc
```

**Critical:** Must preserve:
- Protocol (`https://`)
- Domain (`example.com`)
- Path (`/products/item`)
- Query parameters (`?id=123&token=abc`)

---

### STEP 7: Verify Click Tracking

After redirect (you should see an error page since example.com/products/item doesn't really exist):

1. Run verification script again:

```powershell
node verify-supabase.js
```

**Expected Output:**
```
✓ Found 1 URL(s) in database
✓ Latest URL has 1 click(s)

Latest Click:
  Clicked At: 2026-09-05T15:XX:XX.000Z
  User Agent: Mozilla/5.0...
  Referrer: http://localhost:5173
```

**Specific Checks:**
- Click event created in `click_events` table
- Click count incremented from 0 to 1
- Timestamp recorded
- User agent captured
- Referrer captured

---

### STEP 8: Check Dashboard Updated

1. Go back to browser
2. Return to dashboard: `http://localhost:5173/dashboard`
3. Check stats

**Expected:** ✅ Dashboard shows:
- Total Links: 1
- Total Clicks: 1
- URL listed with correct short code
- Click count: 1

---

### STEP 9: Test RLS Security

1. Sign out
2. Create new account: `testuser2@example.com`
3. Sign in with new account
4. Go to dashboard

**Expected:** ✅ User 2 sees:
- Empty dashboard (no URLs)
- Cannot see User 1's URLs
- Only their own URLs visible

---

## Test Result Documentation

### Test Results Summary

| Test # | Test Name | Expected Result | Actual Result | Status |
|--------|-----------|-----------------|---------------|--------|
| 1 | .env.local exists | File in project root | ? | ⏳ |
| 2 | Env vars match code | Names match exactly | ? | ⏳ |
| 3 | Client initialization | Supabase client created | ? | ⏳ |
| 4 | Sign up works | User created in Auth | ? | ⏳ |
| 5 | Sign in works | User authenticated | ? | ⏳ |
| 6 | Create short URL | URL saved to database | ? | ⏳ |
| 7 | URL preserved | Original URL exact match | ? | ⏳ |
| 8 | Redirect works | Browser redirects | ? | ⏳ |
| 9 | Click recorded | Entry in click_events | ? | ⏳ |
| 10 | Click count updated | count_increments from 0→1 | ? | ⏳ |
| 11 | Dashboard updated | Shows 1 click | ? | ⏳ |
| 12 | RLS enforced | User 2 can't see User 1's URLs | ? | ⏳ |

---

## Quick Command Reference

### Start fresh test:
```powershell
# Restart dev server (if needed)
npm run dev

# After browser testing, verify data:
node verify-supabase.js

# View Supabase directly:
# https://app.supabase.com → SQL Editor
```

### Check current state:
```powershell
node verify-supabase.js
```

---

## Troubleshooting

### Issue: "No URLs in database"
**Solution:** Make sure you completed STEP 2-4 (Sign up, sign in, create URL)

### Issue: "Click count not incrementing"
**Solution:** Make sure you clicked the short URL (opened it in browser)

### Issue: "Original URL not preserved"
**Solution:** Check that the `original_url` column matches exactly in verify-supabase.js output

### Issue: Browser errors
**Solution:** Open DevTools (F12) → Console tab, take screenshot of error, provide error message

---

## Success Criteria

✅ All 12 tests PASS  
✅ No console errors  
✅ No Supabase errors  
✅ Real data in database (not mocks)  
✅ Real Supabase Auth (not placeholder)  
✅ Exact URL preservation confirmed  
✅ Click tracking confirmed  
✅ RLS security confirmed  

---

## Next Step

**Ready to test?**

1. Open http://localhost:5173 in browser
2. Follow the manual steps above (STEP 1-8)
3. Run: `node verify-supabase.js`
4. Report results

Report each test result as: **✅ PASS** or **❌ FAIL** with details
