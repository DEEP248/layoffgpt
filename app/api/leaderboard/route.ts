import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
    try {
        if (!supabase) {
            // Return mock data if Supabase is not configured
            return NextResponse.json({
                leaderboard: [
                    { job_title: "Recruiter", score: 97, roast_count: 342 },
                    { job_title: "Copywriter", score: 95, roast_count: 289 },
                    { job_title: "Product Manager", score: 92, roast_count: 567 },
                    { job_title: "Junior Developer", score: 88, roast_count: 1203 },
                    { job_title: "Data Entry Specialist", score: 96, roast_count: 156 },
                    { job_title: "Social Media Manager", score: 91, roast_count: 435 },
                    { job_title: "Customer Support Agent", score: 89, roast_count: 678 },
                    { job_title: "Financial Analyst", score: 85, roast_count: 234 },
                    { job_title: "Marketing Coordinator", score: 87, roast_count: 321 },
                    { job_title: "Administrative Assistant", score: 93, roast_count: 445 },
                ],
            });
        }

        // Fetch aggregated leaderboard from Supabase
        const { data, error } = await supabase
            .from("roasts")
            .select("job_title, score")
            .order("score", { ascending: false })
            .limit(100);

        if (error) {
            console.error("Supabase error:", error);
            throw error;
        }

        // Aggregate by job title — get average score and count
        const aggregated: Record<string, { totalScore: number; count: number }> = {};
        for (const row of data || []) {
            const title = row.job_title.toLowerCase().trim();
            if (!aggregated[title]) {
                aggregated[title] = { totalScore: 0, count: 0 };
            }
            aggregated[title].totalScore += row.score;
            aggregated[title].count += 1;
        }

        const leaderboard = Object.entries(aggregated)
            .map(([title, { totalScore, count }]) => ({
                job_title: title.charAt(0).toUpperCase() + title.slice(1),
                score: Math.round(totalScore / count),
                roast_count: count,
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 20);

        return NextResponse.json({ leaderboard });
    } catch (error) {
        console.error("Leaderboard API error:", error);
        // Return mock data on error
        return NextResponse.json({
            leaderboard: [
                { job_title: "Recruiter", score: 97, roast_count: 342 },
                { job_title: "Copywriter", score: 95, roast_count: 289 },
                { job_title: "Product Manager", score: 92, roast_count: 567 },
                { job_title: "Junior Developer", score: 88, roast_count: 1203 },
                { job_title: "Data Entry Specialist", score: 96, roast_count: 156 },
                { job_title: "Social Media Manager", score: 91, roast_count: 435 },
                { job_title: "Customer Support Agent", score: 89, roast_count: 678 },
                { job_title: "Financial Analyst", score: 85, roast_count: 234 },
                { job_title: "Marketing Coordinator", score: 87, roast_count: 321 },
                { job_title: "Administrative Assistant", score: 93, roast_count: 445 },
            ],
        });
    }
}
