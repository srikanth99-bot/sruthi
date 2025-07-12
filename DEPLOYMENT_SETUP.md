# Deployment Setup Instructions

## Setting up Supabase Environment Variables

Your live site is currently in demo mode because it needs your Supabase credentials. Here's how to fix it:

### Step 1: Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://xyzcompany.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 2: Configure Netlify Environment Variables

1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Find your deployed site
3. Click **Site settings**
4. Go to **Build & deploy** → **Environment variables**
5. Add these two variables:

   **Variable 1:**
   - Key: `VITE_SUPABASE_URL`
   - Value: Your Supabase Project URL

   **Variable 2:**
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon/public key

### Step 3: Redeploy

After adding the environment variables, Netlify will automatically trigger a new deployment. Your admin panel will then connect to your real Supabase database instead of demo mode.

### Verification

Once redeployed, your live admin panel should:
- ✅ Connect to your Supabase database
- ✅ Show real product data
- ✅ Save changes permanently
- ✅ Remove "Demo Mode" notices

## Need Help?

If you need assistance with any of these steps, please let me know which specific part you're having trouble with.