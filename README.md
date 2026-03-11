# LayoffGPT 📉🤖

> *AI just reviewed your career. It was not impressed.*

LayoffGPT is a full-stack, cyberpunk-themed web application that takes a user's career details (LinkedIn, Job Title, Skills) and uses AI to generate a brutal, hilarious, and highly shareable roast about how quickly they will be replaced by artificial intelligence.

It features a stylized neon UI, an animated loading sequence, a global leaderboard of the "most replaceable" professions, and robust security measures.

## 🌟 Features

- **AI Career Roasting:** Uses Google Gemini 2.5 Flash to generate unique, funny, and aggressive career roasts formatting with emojis and bullet points.
- **Cyberpunk UI/UX:** Built with Tailwind CSS and Framer Motion for a dark mode, neon-glowing, highly animated experience.
- **Leaderboard:** Ranks the most replaceable professions globally using Supabase.
- **Security Built-In:** Includes IP-based rate limiting, HTML input sanitization (XSS prevention), and server-side LinkedIn URL verification.
- **Shareable:** 1-click sharing to Twitter/X and LinkedIn.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS (custom neon theme)
- **Animations:** Framer Motion
- **AI Engine:** Google Gemini SDK (`@google/genai`) - *100% Free Tier*
- **Database:** Supabase (PostgreSQL) - *Free Tier*
- **Deployment:** Vercel

---

## 🚀 Local Development Setup

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/DEEP248/layoffgpt.git
cd layoffgpt
npm install
```

### 3. Get Your Free API Keys
**A. Google Gemini (For the AI Roast):**
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Sign in and click "Create API Key".

**B. Supabase (For the Leaderboard Database):**
1. Go to [Supabase](https://supabase.com/) and create a free project.
2. Go to **Project Settings -> API** to find your `URL` and `anon public` key.
3. Go to **SQL Editor** and run this snippet to create the table:
```sql
CREATE TABLE roasts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title text NOT NULL,
  skills text,
  experience integer,
  score integer NOT NULL,
  roast text NOT NULL,
  replacement_date text,
  future_careers text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Allow public read/write
CREATE POLICY "Enable read access for all users" ON roasts FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON roasts FOR INSERT WITH CHECK (true);
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;
```

### 4. Environment Variables
Create a file named `.env.local` in the root of the project and add your keys:

```env
GEMINI_API_KEY=AIza-your-gemini-key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-supabase-key
```

### 5. Run the App
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security Features

LayoffGPT implements several layers of security to ensure the app remains safe and free tiers are not abused:
- **Mandatory LinkedIn Validation:** Frontend Regex and Backend HTTP HEAD requests ensure URLs look like `linkedin.com/in/*` and actually resolve to live pages.
- **Rate Limiting:** In-memory sliding window rate limiting restricts IPs to 5 generation requests per minute.
- **Sanitization:** All user inputs (skills, job titles, bio) are scrubbed of `<` and `>` tags to prevent stored Cross-Site Scripting (XSS) in the database.

---

## ☁️ Deployment (Vercel)

The easiest way to deploy this app is on Vercel:

1. Push your code to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com/) and click **Add New -> Project**.
3. Import your GitHub repository.
4. **Important:** Add the exact identical Environment Variables (`GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel deployment settings.
5. Click **Deploy**.
