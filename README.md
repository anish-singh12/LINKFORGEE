# LinkForge - Production URL Shortener SaaS

A complete, production-quality URL shortening platform built with React, Vite, TypeScript, Supabase, and premium UI components.

## 🚀 Features

- **Real URL Shortening**: Create short, memorable links from long URLs
- **Real-Time Redirects**: Working short codes that redirect to original URLs
- **Click Tracking**: Track every click with referrer and user agent info
- **Analytics Dashboard**: View detailed analytics for each link
- **Authentication**: Secure user accounts with Supabase Auth
- **User Dashboard**: Manage all your shortened URLs in one place
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **3D Hero Experience**: Stunning interactive Three.js visualization
- **Dark Mode**: Beautiful dark-first design with light mode support

## 📋 Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Vite for fast builds and HMR
- Tailwind CSS for styling
- Three.js + React Three Fiber for 3D effects
- Framer Motion for animations
- Lucide React for icons

**Backend:**
- Supabase (PostgreSQL database)
- Supabase Auth for user management
- Row Level Security (RLS) for data protection
- Atomic operations for click counting

**Database:**
- PostgreSQL via Supabase
- urls table: Stores URL mappings and metadata
- click_events table: Tracks individual clicks
- Indexes for performance optimization

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- A Supabase account (free tier at https://supabase.com)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for the project to be created (this takes a minute)
3. Go to Project Settings > API Keys and copy:
   - `Project URL` (VITE_SUPABASE_URL)
   - `Anon Key` (VITE_SUPABASE_ANON_KEY)

### Step 3: Create Environment Variables

Create `.env.local` in the project root:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 4: Run Database Migration

1. Open your Supabase project
2. Go to SQL Editor
3. Click "New Query"
4. Copy the entire contents of `supabase-migration.sql` from this project
5. Paste into the SQL editor
6. Click "Run"

This creates:
- `urls` table for storing URL mappings
- `click_events` table for tracking clicks
- Indexes for performance
- Row Level Security (RLS) policies
- Click counting function

### Step 5: Start Development Server

```bash
npm run dev
```

The app will open at http://localhost:5173

## 🔄 How It Works

### URL Shortening Flow

1. User enters a long URL on the landing page
2. App validates the URL format
3. Backend generates a cryptographically secure short code
4. URL mapping is stored in Supabase with user_id
5. Short URL is returned to user (e.g., `http://localhost:5173/abc123`)

### URL Redirection Flow

1. Visitor opens a short URL (e.g., `http://localhost:5173/abc123`)
2. App routes to `/:shortCode` handler
3. Handler queries Supabase for the original URL
4. Checks if link is active and not expired
5. Records click event asynchronously
6. Performs browser redirect to original URL
7. Click count is atomically incremented

### Security

- **Row Level Security**: Users can only access their own URLs
- **Input Validation**: URLs are validated before storage
- **Collision Resistance**: Short codes are cryptographically generated
- **No Secrets in Frontend**: Service role key never exposed
- **HTTPS Only**: All production URLs should use HTTPS
- **User Ownership**: Links tied to authenticated user_id

## 📊 Database Schema

### urls table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | Foreign key to auth.users |
| original_url | TEXT | The original long URL |
| short_code | TEXT | Unique short code (e.g., "abc123") |
| click_count | INTEGER | Number of times clicked |
| is_active | BOOLEAN | Whether link is active |
| expires_at | TIMESTAMP | Optional expiration date |
| created_at | TIMESTAMP | Created timestamp |
| updated_at | TIMESTAMP | Last updated timestamp |

### click_events table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| url_id | UUID | Foreign key to urls table |
| clicked_at | TIMESTAMP | When the click occurred |
| referrer | TEXT | Referrer URL if available |
| user_agent | TEXT | Browser user agent |

## 🧪 Testing the Application

### Test 1: Basic URL Shortening

1. Sign up for an account
2. Enter `https://example.com` in the URL input
3. Click "Shorten URL"
4. Verify short URL is generated
5. Click the short URL
6. You should be redirected to `https://example.com`

### Test 2: URL with Path and Query

1. Enter `https://example.com/products/category?id=123&sort=asc`
2. Shorten it
3. Open the short URL
4. Verify you're redirected to the exact URL including path and query params

### Test 3: Persistence

1. Create a short URL while logged in
2. Log out
3. Open the short URL in a new tab
4. It should still work and redirect
5. Log back in to dashboard
6. The URL should still be listed

### Test 4: Analytics

1. Create a short URL
2. Open it multiple times
3. Go to Dashboard > Analytics
4. Verify click count increases
5. Check that click events are recorded

### Test 5: URL Management

1. Create multiple URLs
2. Verify they appear in dashboard with different short codes
3. Delete one URL
4. Try opening the deleted URL - should show "Link Not Found"

## 📁 Project Structure

```
src/
├── components/         # Reusable React components
│   ├── Hero3D.tsx     # 3D visualization
│   └── ProtectedRoute.tsx
├── pages/             # Page components
│   ├── LandingPage.tsx
│   ├── AuthPages.tsx
│   ├── DashboardPage.tsx
│   └── AnalyticsPage.tsx
├── hooks/             # Custom React hooks
│   └── useAuth.ts
├── services/          # Business logic
│   ├── urlService.ts
│   └── authService.ts
├── lib/               # Utilities and config
│   ├── supabase.ts
│   └── redirectHandler.ts
├── types/             # TypeScript types
│   └── index.ts
├── App.tsx            # Main app with routes
├── main.tsx           # Entry point
└── index.css          # Global styles

supabase-migration.sql # Database schema
```

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import the GitHub repository
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy!

### Custom Domain

1. Update DNS to point to your deployment
2. Update `VITE_SUPABASE_URL` if needed
3. Short URLs will use your custom domain

## 🔐 Security Best Practices

- [ ] Never commit `.env.local` (already in .gitignore)
- [ ] Use HTTPS in production
- [ ] Keep Supabase credentials private
- [ ] Regularly review RLS policies
- [ ] Monitor click_events for abuse
- [ ] Set up rate limiting if needed
- [ ] Consider adding link expiration

## 📈 Future Enhancements

- Custom short codes (instead of random)
- Link password protection
- Scheduled link expiration
- Advanced analytics (geography, device type)
- Bulk URL import
- API for programmatic access
- Link sharing and collaboration
- QR code generation
- A/B testing support

## 🐛 Troubleshooting

### "Link not found" when opening short URL

- Verify the short code exists in dashboard
- Check that the link is marked as active
- Ensure Supabase credentials are correct

### "Cannot find module" errors

- Run `npm install` again
- Clear node_modules: `rm -r node_modules && npm install`
- Restart dev server

### Supabase connection errors

- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Check Supabase project is running
- Verify RLS policies are applied

### Authentication issues

- Ensure migration SQL was run completely
- Check Supabase Auth is enabled in project settings
- Verify email verification settings if needed

## 📝 License

MIT

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using React, Supabase, and TypeScript.
