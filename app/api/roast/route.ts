import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

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
        const jobTitle = sanitizeInput(body.jobTitle);
        const skills = sanitizeInput(body.skills);
        const experience = sanitizeInput(body.experience);
        const linkedinUrl = sanitizeInput(body.linkedinUrl);
        const bio = sanitizeInput(body.bio);

        // --- 4. REQUIRED FIELD VALIDATION ---
        if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
            return NextResponse.json(
                { error: "A valid LinkedIn profile URL is mandatory to generate a roast." },
                { status: 400 }
            );
        }

        if (!jobTitle) {
            return NextResponse.json(
                { error: "Job title is required." },
                { status: 400 }
            );
        }

        // --- 5. SERVER-SIDE URL VERIFICATION ---
        // Removed `verifyUrl` ping because LinkedIn's aggressive bot protection frequently returns 
        // 999 or 403 blocks even for entirely valid URLs, causing false-positive rejections.
        // The pattern match `includes('linkedin.com/in/')` above is sufficient for format validation.

        // --- 6. PROMPT ENGINEERING (Tone & Formatting) ---
        const prompt = `You are LayoffGPT, a brutally hilarious, unhinged, angry, and scary AI career roasting engine. Your job is to analyze someone's career and roast them about how easily AI will replace them.

CAREER DETAILS:
- Job Title: ${jobTitle}
- Skills: ${skills || "Not provided (lazy trait detected)"}
- Years of Experience: ${experience || "Unknown"}
- LinkedIn URL: ${linkedinUrl}
- Bio: ${bio || "Nothing — they couldn't even be bothered to write a bio"}

YOUR TASK:
Generate a career roast in EXACTLY this JSON format. DO NOT wrap in markdown code blocks. Return ONLY valid JSON:

{
  "score": <number 0-100 indicating replaceability>,
  "roast": "<An aggressive, angry, hilarious, and scary roast. MUST USE lots of emojis (😡, 💀, 📉, 🤡, 🗑️). MUST BE FORMATTED WITH BULLET POINTS using the • character for readability. Make it personal, attack their specific skills, and use dramatic language about the AI revolution. Minimum 150 words. End with a terrifying farewell.>",
  "replacementDate": "<A funny specific date (e.g., 'March 15, 2027 (right after your review)')>",
  "futureCareers": [
    "<absurd future job 1>",
    "<absurd future job 2>",
    "<absurd future job 3>",
    "<absurd future job 4>"
  ]
}

IMPORTANT RULES:
- The 'roast' text field MUST USE BULLET POINTS (•) and line breaks (\n).
- The 'roast' text MUST BE HEAVILY LITTERED WITH EMOJIS.
- The tone MUST BE angry, scary, sarcastic, and threatening.
- Return ONLY the JSON object, absolutely zero markdown formatting blocks.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are an aggressive comedy AI that roasts careers with bullet points and emojis. You output ONLY valid raw JSON.",
                temperature: 0.9,
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
            const cleaned = content.replace(/```[a-z]*\n?/g, "").replace(/```\n?/g, "").trim();
            roastData = JSON.parse(cleaned);
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
                    experience: experience ? parseInt(experience) : null,
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
        return NextResponse.json(
            { error: "Failed to process request." },
            { status: 500 }
        );
    }
}
