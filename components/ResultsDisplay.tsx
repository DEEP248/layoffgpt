"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

interface RoastResult {
    score: number;
    roast: string;
    replacementDate: string;
    futureCareers: string[];
    jobTitle: string;
}

interface ResultsDisplayProps {
    result: RoastResult;
    onReset: () => void;
}

function ScoreRing({ score }: { score: number }) {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    const getScoreColor = () => {
        if (score <= 30) return { color: "#39ff14", label: "🛡️ SAFE (for now)", bg: "from-green-500/10 to-green-500/5" };
        if (score <= 70) return { color: "#ffe600", label: "⚠️ RISKY", bg: "from-yellow-500/10 to-yellow-500/5" };
        return { color: "#ff003c", label: "🚜 START LEARNING FARMING", bg: "from-red-500/10 to-red-500/5" };
    };

    const scoreInfo = getScoreColor();

    return (
        <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center gap-4"
        >
            <h2 className="font-display text-xl md:text-2xl text-white tracking-wider">
                AI TAKEOVER SCORE
            </h2>
            <div className="relative w-52 h-52">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {/* Background ring */}
                    <circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                    />
                    {/* Score ring */}
                    <motion.circle
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="none"
                        stroke={scoreInfo.color}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                        style={{
                            filter: `drop-shadow(0 0 10px ${scoreInfo.color}40)`,
                        }}
                    />
                </svg>
                {/* Score Number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="font-display text-5xl font-bold"
                        style={{ color: scoreInfo.color }}
                    >
                        {score}
                    </motion.span>
                    <span className="text-gray-500 text-sm font-body">/ 100</span>
                </div>
            </div>
            {/* Score Label */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className={`px-6 py-2 rounded-full bg-gradient-to-r ${scoreInfo.bg} border border-white/10`}
            >
                <span className="font-display text-sm tracking-wider" style={{ color: scoreInfo.color }}>
                    {scoreInfo.label}
                </span>
            </motion.div>
        </motion.div>
    );
}

function TypewriterText({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const indexRef = useRef(0);

    useEffect(() => {
        indexRef.current = 0;
        setDisplayed("");
        setDone(false);
        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayed(text.slice(0, indexRef.current + 1));
                indexRef.current++;
            } else {
                setDone(true);
                clearInterval(interval);
            }
        }, 15);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <p className={`font-body text-gray-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap ${!done ? "typewriter-cursor" : ""}`}>
            {displayed}
        </p>
    );
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
    const careerEmojis = ["🤖", "🎭", "🧠", "🌌", "🛸", "🎪", "🧬", "🎰"];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
            {/* Score Section */}
            <motion.section
                className="glass-card p-8 md:p-12 flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <ScoreRing score={result.score} />
            </motion.section>

            {/* Roast Section */}
            <motion.section
                className="glass-card p-8 md:p-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🔥</span>
                    <h2 className="font-display text-xl md:text-2xl text-white tracking-wider">
                        YOUR AI ROAST
                    </h2>
                </div>
                <TypewriterText text={result.roast} />
            </motion.section>

            {/* Replacement Date */}
            <motion.section
                className="glass-card p-8 md:p-12 text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
            >
                <div className="flex items-center justify-center gap-3 mb-4">
                    <span className="text-3xl">📅</span>
                    <h2 className="font-display text-xl md:text-2xl text-white tracking-wider">
                        ESTIMATED REPLACEMENT DATE
                    </h2>
                </div>
                <motion.p
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                    className="font-display text-3xl md:text-4xl neon-text text-neon-cyan mt-4"
                >
                    {result.replacementDate}
                </motion.p>
                <p className="text-gray-500 text-sm mt-3 font-body">
                    (give or take a firmware update)
                </p>
            </motion.section>

            {/* Future Careers */}
            <motion.section
                className="glass-card p-8 md:p-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
            >
                <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">🛸</span>
                    <h2 className="font-display text-xl md:text-2xl text-white tracking-wider">
                        YOUR FUTURE CAREER OPTIONS
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.futureCareers.map((career, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1 + index * 0.15 }}
                            className="flex items-center gap-3 p-4 rounded-xl bg-dark-700/50 border border-white/5 hover:border-neon-cyan/20 transition-all duration-300 group"
                        >
                            <span className="text-xl group-hover:scale-125 transition-transform">
                                {careerEmojis[index % careerEmojis.length]}
                            </span>
                            <span className="font-body text-gray-300 group-hover:text-neon-cyan transition-colors">
                                {career}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Share & Reset */}
            <motion.section
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
            >
                <ShareButtons result={result} />

                <button
                    onClick={onReset}
                    className="neon-button px-8 py-3 rounded-xl text-sm"
                >
                    Roast Another Career
                </button>
            </motion.section>
        </div>
    );
}

function ShareButtons({ result }: { result: RoastResult }) {
    const [copied, setCopied] = useState(false);

    const shareText = `🤖 My AI Takeover Score: ${result.score}/100\n\n"${result.roast.split('.')[0]}." \n\nCheck yours at LayoffGPT!`;

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback
        }
    };

    return (
        <div className="flex items-center gap-3">
            <a
                href={twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-dark-600 border border-white/10 hover:border-neon-cyan/30 text-gray-400 hover:text-white text-sm font-body transition-all duration-300 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Share
            </a>

            <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-dark-600 border border-white/10 hover:border-neon-cyan/30 text-gray-400 hover:text-white text-sm font-body transition-all duration-300 flex items-center gap-2"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                LinkedIn
            </a>

            <button
                onClick={copyToClipboard}
                className="px-5 py-3 rounded-xl bg-dark-600 border border-white/10 hover:border-neon-cyan/30 text-gray-400 hover:text-white text-sm font-body transition-all duration-300 flex items-center gap-2"
            >
                {copied ? (
                    <>
                        <svg className="w-4 h-4 text-neon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Copied!
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        Copy
                    </>
                )}
            </button>
        </div>
    );
}
