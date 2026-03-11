import { NextResponse } from "next/server";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
    try {
        // Check for API key
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: "OpenAI API key not configured. Add OPENAI_API_KEY to your .env.local file." },
                { status: 500 }
            );
        }

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        const body = await request.json();
        const { jobTitle, skills, experience, linkedinUrl, bio } = body;

        if (!jobTitle || jobTitle.trim() === "") {
            return NextResponse.json(
                { error: "Job title is required" },
                { status: 400 }
            );
        }

        // Build the roast prompt
        const prompt = `You are LayoffGPT, a brutally hilarious AI career roasting engine. Your job is to analyze someone's career and roast them about how easily AI could replace them.

CAREER DETAILS:
- Job Title: ${jobTitle}
- Skills: ${skills || "Not provided (already a red flag)"}
- Years of Experience: ${experience || "Unknown"}
- LinkedIn URL: ${linkedinUrl || "Too embarrassed to share"}
- Bio: ${bio || "Nothing — they couldn't even be bothered to write a bio"}

YOUR TASK:
Generate a career roast in the following EXACT JSON format. Do NOT wrap in markdown code blocks. Return ONLY valid JSON:

{
  "score": <number from 0-100 representing how replaceable they are by AI>,
  "roast": "<a hilarious, sarcastic, dramatic roast of 150-300 words. Reference their specific job title and skills. Include specific jabs like 'I analyzed your entire career in 0.2 seconds. It took you ${experience || 'years'} years.' or 'Your LinkedIn says [skill]. I simulated 12 million [skill] strategies while you were updating your headline.' Make it personal, absurd, and shareable. Use dramatic language about the AI revolution. End with a backhanded compliment or a dramatic farewell.>",
  "replacementDate": "<a funny specific date like 'March 15, 2027 (right after your annual review)' or 'Next Tuesday at 3:47 PM' or 'Already happened, you just haven't been told yet'>",
  "futureCareers": [
    "<absurd future job suggestion 1 like 'Robot Babysitter'>",
    "<absurd future job suggestion 2 like 'Prompt Whisperer'>",
    "<absurd future job suggestion 3 like 'Professional AI Therapist'>",
    "<absurd future job suggestion 4 like 'Human Nostalgia Consultant'>"
  ]
}

IMPORTANT RULES:
- The roast must be 150-300 words
- Make it extremely funny, sarcastic, and dramatic
- Reference their SPECIFIC job title and skills throughout
- The score should feel realistic but slightly exaggerated
- Future careers should be absurd but creative
- Each response must be unique — no generic roasts
- Do NOT use markdown. Return ONLY the JSON object.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a comedy AI that roasts people's careers. You always respond with valid JSON only, no markdown formatting, no code blocks. Just raw JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.9,
            max_tokens: 1000,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) {
            return NextResponse.json(
                { error: "AI failed to generate a roast. Even AI has off days." },
                { status: 500 }
            );
        }

        // Parse the JSON response
        let roastData;
        try {
            // Clean potential markdown code blocks
            const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
            roastData = JSON.parse(cleaned);
        } catch {
            console.error("Failed to parse AI response:", content);
            return NextResponse.json(
                { error: "AI returned something unparseable. Classic AI." },
                { status: 500 }
            );
        }

        // Validate response shape
        const { score, roast, replacementDate, futureCareers } = roastData;
        if (
            typeof score !== "number" ||
            typeof roast !== "string" ||
            typeof replacementDate !== "string" ||
            !Array.isArray(futureCareers)
        ) {
            return NextResponse.json(
                { error: "AI response was malformed. It's having an existential crisis." },
                { status: 500 }
            );
        }

        // Save to Supabase (non-blocking — don't fail if DB is down)
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
            console.error("Failed to save to Supabase:", dbError);
            // Don't fail the request — roast is still valid
        }

        return NextResponse.json({
            score,
            roast,
            replacementDate,
            futureCareers,
        });
    } catch (error: unknown) {
        console.error("Roast API error:", error);
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json(
            { error: `Failed to generate roast: ${message}` },
            { status: 500 }
        );
    }
}
