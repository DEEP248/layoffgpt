"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LeaderboardEntry {
    job_title: string;
    score: number;
    roast_count: number;
}

const dangerEmojis = ["💀", "☠️", "🤖", "⚡", "🔥", "💣", "🎯", "⚰️", "🚀", "🧠"];

function getScoreStyle(score: number) {
    if (score >= 90) return { color: "text-neon-red", bg: "bg-neon-red/10", border: "border-neon-red/30", glow: "shadow-red-500/20" };
    if (score >= 70) return { color: "text-neon-yellow", bg: "bg-neon-yellow/10", border: "border-neon-yellow/30", glow: "shadow-yellow-500/20" };
    if (score >= 50) return { color: "text-neon-orange", bg: "bg-neon-orange/10", border: "border-neon-orange/30", glow: "shadow-orange-500/20" };
    return { color: "text-neon-green", bg: "bg-neon-green/10", border: "border-neon-green/30", glow: "shadow-green-500/20" };
}

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch("/api/leaderboard");
                const data = await res.json();
                setLeaderboard(data.leaderboard || []);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="pt-24 pb-16">
                {/* Header */}
                <section className="max-w-5xl mx-auto px-6 pt-12 md:pt-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-red/5 border border-neon-red/20 mb-8"
                        >
                            <span className="text-sm">☠️</span>
                            <span className="text-neon-red text-xs font-display tracking-wider">
                                MOST REPLACEABLE PROFESSIONS
                            </span>
                        </motion.div>

                        <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                            <span className="text-white">The AI</span>{" "}
                            <span className="bg-gradient-to-r from-neon-red via-neon-orange to-neon-yellow bg-clip-text text-transparent">
                                Hit List
                            </span>
                        </h1>

                        <p className="mt-6 text-gray-400 text-lg font-body max-w-2xl mx-auto">
                            These professions are living on borrowed time.
                            <br />
                            Is yours on the list?
                        </p>
                    </motion.div>
                </section>

                {/* Leaderboard */}
                <section className="max-w-3xl mx-auto px-6 mt-16">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4 py-20">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full"
                            />
                            <span className="text-gray-500 text-sm font-body">Loading the hit list...</span>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {leaderboard.map((entry, index) => {
                                const style = getScoreStyle(entry.score);
                                return (
                                    <motion.div
                                        key={entry.job_title}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.08, duration: 0.5 }}
                                        className={`glass-card p-5 flex items-center gap-4 hover:${style.border} transition-all duration-300 group`}
                                    >
                                        {/* Rank */}
                                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-dark-700 border border-white/5 flex items-center justify-center">
                                            <span className="font-display text-sm text-gray-500">
                                                {index < 3 ? ["🥇", "🥈", "🥉"][index] : `#${index + 1}`}
                                            </span>
                                        </div>

                                        {/* Emoji */}
                                        <span className="text-xl flex-shrink-0 group-hover:scale-125 transition-transform">
                                            {dangerEmojis[index % dangerEmojis.length]}
                                        </span>

                                        {/* Job Title */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-body font-semibold text-white text-base truncate">
                                                {entry.job_title}
                                            </h3>
                                            <p className="text-gray-600 text-xs font-body">
                                                {entry.roast_count.toLocaleString()} careers roasted
                                            </p>
                                        </div>

                                        {/* Score */}
                                        <div className={`flex-shrink-0 px-4 py-2 rounded-lg ${style.bg} border ${style.border}`}>
                                            <span className={`font-display font-bold text-lg ${style.color}`}>
                                                {entry.score}%
                                            </span>
                                        </div>

                                        {/* Bar */}
                                        <div className="hidden md:block w-32 flex-shrink-0">
                                            <div className="w-full h-2 bg-dark-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        background: entry.score >= 90
                                                            ? "linear-gradient(90deg, #ff003c, #ff6a00)"
                                                            : entry.score >= 70
                                                                ? "linear-gradient(90deg, #ffe600, #ff6a00)"
                                                                : "linear-gradient(90deg, #39ff14, #00f0ff)",
                                                    }}
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${entry.score}%` }}
                                                    transition={{ delay: 0.5 + index * 0.08, duration: 1 }}
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* CTA */}
                <motion.section
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="max-w-2xl mx-auto px-6 mt-16 text-center"
                >
                    <div className="glass-card p-8">
                        <p className="font-display text-lg text-white tracking-wider mb-4">
                            THINK YOUR JOB IS SAFE?
                        </p>
                        <p className="text-gray-400 text-sm font-body mb-6">
                            There&apos;s only one way to find out.
                        </p>
                        <a href="/">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="neon-button px-8 py-3 rounded-xl text-sm"
                            >
                                🔥 GET YOUR ROAST
                            </motion.button>
                        </a>
                    </div>
                </motion.section>

                <div className="mt-20">
                    <Footer />
                </div>
            </div>
        </main>
    );
}
