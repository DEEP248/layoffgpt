# 🤖 LayoffGPT — Setup & Deployment Guide

> **Complete beginner-friendly guide.** Follow every step in order.

---

## 📋 Table of Contents

1. [Install Required Software](#step-1--install-required-software)
2. [Project Setup](#step-2--project-setup)
3. [Get Your OpenAI API Key](#step-3--get-your-openai-api-key)
4. [Set Up Supabase Database](#step-4--set-up-supabase-database)
5. [Configure Environment Variables](#step-5--configure-environment-variables)
6. [Run Locally](#step-6--run-locally)
7. [Deploy to Vercel](#step-7--deploy-to-vercel)
8. [Project Structure](#project-structure-explained)

---

## Step 1 — Install Required Software

### Node.js (JavaScript runtime)

1. Go to **https://nodejs.org**
2. Download the **LTS** version (green button)
3. Run the installer — click "Next" on everything
4. Verify it installed by opening **Command Prompt** or **PowerShell** and typing:

```bash
node --version
npm --version
```

You should see version numbers like `v18.x.x` and `10.x.x`.

### Git (version control)

1. Go to **https://git-scm.com/download/win**
2. Download and run the installer — use all default settings
3. Verify:

```bash
git --version
```

### VS Code (code editor)

1. Go to **https://code.visualstudio.com**
2. Download and install
3. Open VS Code → File → Open Folder → select `D:\DEEP\DEEP\LayoffGPT`

---

## Step 2 — Project Setup

The project is already created! Just install the dependencies:

```bash
cd D:\DEEP\DEEP\LayoffGPT
npm install
```

Wait for it to finish (may take 1-2 minutes).

---

## Step 3 — Get Your Gemini API Key

1. Go to **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account
3. Click **"Create API Key"** and create one in a new project
4. Copy the key (starts with `AIza...`) — **save it somewhere safe!**

> 💡 The Gemini API free tier is extremely generous. You can generate thousands of roasts for free without entering a credit card.

---

## Step 4 — Set Up Supabase Database

1. Go to **https://supabase.com** and sign up (free)
2. Click **"New Project"**
3. Name it `layoffgpt`, choose a password, select your region
4. Wait for it to set up (~2 minutes)
5. Go to **SQL Editor** (left sidebar)
6. Paste this SQL and click **"Run"**:

```sql
CREATE TABLE roasts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title TEXT NOT NULL,
  skills TEXT,
  experience INTEGER,
  score INTEGER,
  roast TEXT,
  replacement_date TEXT,
  future_careers TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable public read access for leaderboard
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON roasts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public reads" ON roasts FOR SELECT USING (true);
```

7. Get your credentials:
   - Go to **Settings** → **API** (left sidebar)
   - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy the **anon/public key** (long string starting with `eyJ...`)

---

## Step 5 — Configure Environment Variables

1. In the project folder, find the file `.env.local.example`
2. Make a copy and rename it to `.env.local`
3. Open `.env.local` and fill in your values:

```env
GEMINI_API_KEY=AIza-your-actual-key-here
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-key
```

> 🔒 NEVER share your `.env.local` file or commit it to Git. It's already in `.gitignore`.

---

## Step 6 — Run Locally

```bash
npm run dev
```

Open your browser and go to:

**http://localhost:3000**

You should see the LayoffGPT homepage. Try entering a job title and clicking "Roast My Career"!

To stop the server, press `Ctrl + C` in the terminal.

---

## Step 7 — Deploy to Vercel

### 7a. Push to GitHub

1. Go to **https://github.com** and sign up / log in
2. Click **"New Repository"** (the `+` button top-right)
3. Name it `layoffgpt`, keep it **Public** or **Private**
4. **Don't** initialize with README
5. Run these commands in your terminal:

```bash
cd D:\DEEP\DEEP\LayoffGPT
git init
git add .
git commit -m "🤖 Initial LayoffGPT commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/layoffgpt.git
git push -u origin main
```

### 7b. Deploy on Vercel

1. Go to **https://vercel.com** and sign up with GitHub
2. Click **"Add New → Project"**
3. Import your `layoffgpt` repository
4. Vercel will auto-detect it's a Next.js app
5. **Before deploying**, click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `GEMINI_API_KEY` | `AIza-your-key-here` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...your-key` |

6. Click **"Deploy"**
7. Wait 1-2 minutes — your app is now LIVE! 🎉

Vercel will give you a URL like `https://layoffgpt.vercel.app`

### 7c. Custom Domain (Optional)

1. In Vercel → Settings → Domains
2. Add your custom domain (e.g. `layoffgpt.com`)
3. Follow Vercel's DNS instructions

---

## Project Structure Explained

```
LayoffGPT/
├── app/                     # 📱 Pages and API routes
│   ├── layout.tsx           # Root layout (shared across all pages)
│   ├── page.tsx             # Homepage (hero + form)
│   ├── globals.css          # Global styles (cyberpunk theme)
│   ├── api/
│   │   ├── roast/route.ts   # AI roast generation endpoint
│   │   └── leaderboard/route.ts  # Leaderboard data endpoint
│   └── leaderboard/
│       └── page.tsx         # Leaderboard page
├── components/              # 🧩 Reusable UI components
│   ├── Navbar.tsx           # Navigation bar
│   ├── Footer.tsx           # Page footer
│   ├── LoadingScreen.tsx    # Animated loading overlay
│   └── ResultsDisplay.tsx   # Score, roast, careers display
├── lib/                     # 🔧 Utility libraries
│   └── supabase.ts          # Supabase database client
├── .env.local.example       # Environment variables template
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind CSS theme config
└── SETUP.md                 # This file!
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm run dev` fails | Run `npm install` first |
| "OpenAI API key not configured" | Check your `.env.local` file |
| No roasts appear on leaderboard | Make some roasts first, or check Supabase connection |
| Page looks broken | Clear browser cache (`Ctrl + Shift + R`) |
| Build fails on Vercel | Check environment variables are set in Vercel dashboard |

---

**Need help?** Open an issue on GitHub or reach out. Happy roasting! 🔥🤖
