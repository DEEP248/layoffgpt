import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";
import { ApifyClient } from "apify-client";

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = ipRequestCounts.get(ip);

    if (!entry || now > entry.resetTime) {
        ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return true;
    }

    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
        return false;
    }

    entry.count += 1;
    return true;
}

// Basic HTML sanitizer to prevent XSS
function sanitizeInput(str: string | undefined | null): string {
    if (!str) return '';
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

export async function POST(request: Request) {
    try {
        // --- 1. RATE LIMITING (Network Security) ---
        const forwardedFor = request.headers.get('x-forwarded-for');
        const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown-ip';

        if (!checkRateLimit(ip)) {
            return NextResponse.json(
                { error: "Too many requests. Go outside and touch some grass for a minute." },
                { status: 429 }
            );
        }

        // --- 2. API KEY VALIDATION ---
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key not configured. Add GEMINI_API_KEY to your .env.local file. You can get a free one at https://aistudio.google.com/" },
                { status: 500 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const body = await request.json();

        // --- 3. INPUT SANITIZATION (Data Security) ---
        let jobTitle = sanitizeInput(body.jobTitle);
        let skills = sanitizeInput(body.skills);
        let experience = sanitizeInput(body.experience);
        const linkedinUrl = sanitizeInput(body.linkedinUrl);
        let bio = sanitizeInput(body.bio);

        // --- 4. REQUIRED FIELD VALIDATION ---
        if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
            return NextResponse.json(
                { error: "A valid LinkedIn profile URL is mandatory to generate a roast." },
                { status: 400 }
            );
        }

        // Ensure the URL is actually formed correctly
        let formattedUrl = linkedinUrl;
        if (!formattedUrl.startsWith('http')) {
            formattedUrl = `https://${formattedUrl}`;
        }

        // --- 5. REAL LINKEDIN SCRAPING (Apify) ---
        let profileDataScraped = false;
        const apifyToken = process.env.APIFY_API_TOKEN;

        if (apifyToken) {
            try {
                console.log(`Starting Apify scrape for: ${formattedUrl}`);
                const apifyClient = new ApifyClient({ token: apifyToken });

                // Using a common public LinkedIn scraper actor. 
                // We pass both standard URL formats used by different actors to hit the right one
                const run = await apifyClient.actor("mipam/linkedin-profile-scraper").call({
                    urls: [formattedUrl],
                    linkedinUrls: [formattedUrl]
                });

                const { items } = await apifyClient.dataset(run.defaultDatasetId).listItems();

                if (items && items.length > 0) {
                    const profile = items[0] as any;
                    console.log("Successfully scraped LinkedIn data!");

                    // Override manual inputs with REAL scraped data
                    if (profile.headline || profile.title) jobTitle = profile.headline || profile.title;
                    if (profile.about || profile.summary) bio = profile.about || profile.summary;

                    if (profile.skills && Array.isArray(profile.skills)) {
                        skills = profile.skills.map((s: any) => s?.name || s?.title || s).join(', ');
                    }

                    if (profile.experience && Array.isArray(profile.experience)) {
                        experience = `${profile.experience.length} roles spanning multiple companies`;
                    }
                    if (profile.educations && Array.isArray(profile.educations)) {
                        bio += `\nEducation: ${profile.educations.map((e: any) => e.degree || e.schoolName).join(', ')}`;
                    }

                    profileDataScraped = true;
                } else {
                    console.log("Apify returned zero items. Profile might be completely private.");
                }
            } catch (err) {
                console.error("Apify scraping failed. Falling back to manual input.", err);
            }
        } else {
            console.log("No APIFY_API_TOKEN found, skipping real scraping and relying on form inputs.");
        }

        // Final sanity check before calling AI
        if (!profileDataScraped && !jobTitle) {
            return NextResponse.json(
                { error: "Could not scrape LinkedIn profile, and no manual Job Title was provided as backup." },
                { status: 400 }
            );
        }

        // --- 6. PROMPT ENGINEERING (Tone & Formatting) ---
        const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); // E.g., March 2026

        const prompt = `You are LayoffGPT, a brutally hilarious, unhinged internet troll who roasts people's careers. It is currently ${today}.

CAREER DETAILS (Scraped directly from their actual LinkedIn, DO NOT HOLD BACK):
- Job Title / Headline: ${jobTitle}
- Skills: ${skills || "Not provided (lazy trait detected)"}
- Experience: ${experience || "Unknown"}
- LinkedIn URL: ${linkedinUrl}
- About / Bio: ${bio || "Nothing — they couldn't even be bothered to write a bio"}

YOUR TASK:
Generate a career roast. DO NOT use heavy, complex, or academic words. Use punchy, funny, internet-slang humor. Be mean but absolutely hilarious.

Score: 0-100 indicating replaceability. CRITICAL: DO NOT automatically give a 98%. Actually evaluate how easy it is to replace this specific job with AI. A plumber is a 12. A button-centering frontend dev is a 95. VARY THE SCORE based on the job!
Roast length: Minimum 150 words.
Roast formatting: MUST USE lots of emojis (😡, 💀, 📉, 🤡, 🗑️). MUST BE FORMATTED WITH BULLET POINTS using the • character for readability. Use line breaks (\\n) between bullet points.
Tone: Funny internet troll. Attack their specific skills, their headline, and their past experience. Make fun of their job title.
Replacement Date: A funny specific date IN THE FUTURE (after ${today}). Do NOT say 2024.
Future Careers: 4 absurd future job suggestions based on their background.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an aggressive comedy AI that roasts careers with bullet points and emojis.",
                temperature: 0.9,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        score: { type: "INTEGER" },
                        roast: { type: "STRING" },
                        replacementDate: { type: "STRING" },
                        futureCareers: {
                            type: "ARRAY",
                            items: { type: "STRING" }
                        }
                    },
                    required: ["score", "roast", "replacementDate", "futureCareers"]
                }
            }
        });

        const content = response.text;
        if (!content) {
            return NextResponse.json(
                { error: "AI failed to generate a roast. It's too disgusted." },
                { status: 500 }
            );
        }

        // Parse JSON
        let roastData;
        try {
            roastData = JSON.parse(content);
        } catch {
            return NextResponse.json(
                { error: "AI returned unparseable hostility." },
                { status: 500 }
            );
        }

        const { score, roast, replacementDate, futureCareers } = roastData;

        // Save to DB
        try {
            if (supabase) {
                await supabase.from("roasts").insert({
                    job_title: jobTitle,
                    skills: skills || null,
                    experience: profileDataScraped ? null : (experience ? parseInt(experience) : null), // Experience might be string now if scraped
                    score,
                    roast,
                    replacement_date: replacementDate,
                    future_careers: futureCareers,
                });
            }
        } catch (dbError) {
            console.error(dbError);
        }

        return NextResponse.json({ score, roast, replacementDate, futureCareers });

    } catch (error: unknown) {
        console.error("Roast error:", error);
        return NextResponse.json(
            { error: "Failed to process request." },
            { status: 500 }
        );
    }
}
