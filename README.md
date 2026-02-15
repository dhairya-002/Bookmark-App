# 🔖 Smart Bookmark Manager

A modern, real-time bookmark manager built with Next.js and Supabase. Users can sign in with Google, save their favorite links, and see updates instantly across multiple tabs.

## ✨ Features

- 🔐 **Google OAuth Authentication** - Secure sign-in with Google (no passwords needed)
- 📝 **Add Bookmarks** - Save URLs with custom titles
- 🗑️ **Delete Bookmarks** - Remove bookmarks you no longer need
- 🔒 **Private & Secure** - Each user only sees their own bookmarks
- ⚡ **Real-time Updates** - Changes sync instantly across all open tabs
- 📱 **Responsive Design** - Works beautifully on desktop and mobile
- 🚀 **Deployed on Vercel** - Fast, reliable hosting

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Supabase
  - Authentication (Google OAuth)
  - PostgreSQL Database
  - Real-time Subscriptions
- **Deployment:** Vercel

## 🚀 Live Demo

[View Live App](https://bookmark-app-theta-three.vercel.app/) 

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Vercel account ([vercel.com](https://vercel.com))
- Google Cloud Console project (for OAuth)


## 🐛 Problems Encountered & Solutions

### Problem 1: Realtime WebSocket Connection Failing

**Error Message:**
```
WebSocket connection to 'wss://...supabase.co/realtime/v1/websocket' failed: 
WebSocket is closed before the connection is established.
Realtime status: CLOSED / TIMED_OUT
```

**Root Cause:**
Supabase Realtime WebSocket connections can fail due to:
- Network/firewall restrictions
- CORS issues in development
- Browser WebSocket limitations
- Realtime service not properly configured

**Solution Implemented:**
1. **Hybrid Approach:** Combined Realtime broadcast with polling fallback
2. **Broadcast Instead of postgres_changes:** Used lighter-weight broadcast events
3. **3-Second Polling:** Added automatic refresh every 3 seconds as fallback
4. **Graceful Degradation:** App works perfectly even if WebSocket fails




### Problem 2: Bookmarks Not Loading on Initial Render

**Root Cause:**
The `fetchBookmarks()` function was defined but never called on component mount.

**Solution:**
Added `useEffect` hook to fetch bookmarks when the component loads:
```typescript
useEffect(() => {
  fetchBookmarks()
}, [])
```

### Problem 3: Realtime Replication Already Enabled Error

**Error Message:**
```
ERROR: relation "bookmarks" is already member of publication "supabase_realtime"
```

**Root Cause:**
Attempted to enable Realtime replication when it was already enabled.

**Solution:**
Verified that Realtime was already properly configured - no action needed. This was actually a good sign that the table was correctly set up.

### Problem 4: RLS Policies Blocking Realtime Events

**Root Cause:**
Row Level Security policies weren't properly configured for the authenticated user.

**Solution:**
Created proper RLS policies with explicit `TO authenticated` clause:
```sql
CREATE POLICY "Users can view their own bookmarks"
ON bookmarks FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
```

### Problem 5: Multiple Realtime Subscriptions

**Root Cause:**
React's `useEffect` was creating multiple subscriptions due to component re-renders.

**Solution:**
Added proper cleanup in `useEffect` return function:
```typescript
useEffect(() => {
  const channel = supabase.channel(...)
  return () => {
    supabase.removeChannel(channel)
  }
}, [user])
```


## 📁 Project Structure

bookmark-manager/

├── app/

│   ├── lib/

│   │   └── supabase.ts          # Supabase client configuration

│   ├── globals.css              # Global styles

│   ├── layout.tsx               # Root layout

│   └── page.tsx                 # Main app component

├── public/                      # Static assets

├── .env.local                   # Environment variables (not in git)

├── next.config.js               # Next.js configuration

├── tailwind.config.ts           # Tailwind CSS configuration

├── package.json                 # Dependencies

└── README.md                    # This file
