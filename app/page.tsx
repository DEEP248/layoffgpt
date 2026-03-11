"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ResultsDisplay from "@/components/ResultsDisplay";

interface FormData {
    linkedinUrl: string;
    jobTitle: string;
    skills: string;
    experience: string;
    bio: string;
}

interface RoastResult {
    score: number;
    roast: string;
    replacementDate: string;
    futureCareers: string[];
    jobTitle: string;
}

export default function Home() {
    const [formData, setFormData] = useState<FormData>({
        linkedinUrl: "",
        jobTitle: "",
        skills: "",
        experience: "",
        bio: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<RoastResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Frontend Validation
        if (!formData.linkedinUrl.trim()) {
            setError("We need your LinkedIn URL to properly roast you.");
            return;
        }

        if (!formData.linkedinUrl.includes("linkedin.com/in/")) {
            setError("That doesn't look like a valid LinkedIn profile URL.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/roast", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Failed to generate roast");
            }

            const data = await res.json();
            setResult({ ...data, jobTitle: data.jobTitle || formData.jobTitle || "Your Career" });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Something went wrong. Even AI makes mistakes sometimes.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setFormData({
            linkedinUrl: "",
            jobTitle: "",
            skills: "",
            experience: "",
            bio: "",
        });
        setError(null);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <main className="min-h-screen">
            <Navbar />

            <AnimatePresence>
                {isLoading && <LoadingScreen />}
            </AnimatePresence>

            {result ? (
                <div className="pt-24">
                    <ResultsDisplay result={result} onReset={handleReset} />
                    <Footer />
                </div>
            ) : (
                <div className="pt-24 pb-16">
                    {/* Hero Section */}
                    <section className="max-w-5xl mx-auto px-6 pt-12 md:pt-20 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Floating Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/5 border border-neon-cyan/20 mb-8"
                            >
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-neon-cyan"></span>
                                </span>
                                <span className="text-neon-cyan text-xs font-display tracking-wider">
                                    AI CAREER ANALYSIS ENGINE v2.0
                                </span>
                            </motion.div>

                            {/* Title */}
                            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="text-white">AI Just Reviewed</span>
                                <br />
                                <span className="text-white">Your Career.</span>
                                <br />
                                <motion.span
                                    className="bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent"
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                                    }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                    style={{ backgroundSize: "200% auto" }}
                                >
                                    It Was Not Impressed.
                                </motion.span>
                            </h1>

                            {/* Subtitle */}
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="mt-6 text-gray-400 text-lg md:text-xl font-body max-w-2xl mx-auto leading-relaxed"
                            >
                                Paste your LinkedIn profile and see if AI is about to{" "}
                                <span className="text-neon-pink">eat your job</span>.
                            </motion.p>
                        </motion.div>
                    </section>

                    {/* Form Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="max-w-2xl mx-auto px-6 mt-16"
                    >
                        <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                                    <span className="text-sm">🎯</span>
                                </div>
                                <h2 className="font-display text-lg text-white tracking-wider">
                                    ENTER YOUR DETAILS
                                </h2>
                            </div>

                            {/* LinkedIn URL */}
                            <div>
                                <label className="block text-gray-400 text-sm font-body mb-2">
                                    LinkedIn Profile URL <span className="text-neon-pink">*</span>
                                </label>
                                <input
                                    type="url"
                                    name="linkedinUrl"
                                    value={formData.linkedinUrl}
                                    onChange={handleChange}
                                    placeholder="https://www.linkedin.com/in/yourprofile"
                                    pattern="https?:\/\/(www\.)?linkedin\.com\/in\/.*"
                                    title="Must be a valid LinkedIn profile URL (e.g. https://linkedin.com/in/username)"
                                    className="cyber-input w-full px-4 py-3 text-sm"
                                    required
                                />
                            </div>

                            {/* Job Title */}
                            <div>
                                <label className="block text-gray-400 text-sm font-body mb-2">
                                    Job Title <span className="text-gray-600 text-xs ml-2">(optional, overridden if LinkedIn is public)</span>
                                </label>
                                <input
                                    type="text"
                                    name="jobTitle"
                                    value={formData.jobTitle}
                                    onChange={handleChange}
                                    placeholder="e.g. Senior Product Manager"
                                    className="cyber-input w-full px-4 py-3 text-sm"
                                />
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-gray-400 text-sm font-body mb-2">
                                    Key Skills
                                    <span className="text-gray-600 text-xs ml-2">(comma separated)</span>
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="e.g. Strategy, Leadership, PowerPoint, Looking Busy"
                                    className="cyber-input w-full px-4 py-3 text-sm"
                                />
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="block text-gray-400 text-sm font-body mb-2">
                                    Years of Experience
                                </label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="e.g. 5"
                                    min="0"
                                    max="50"
                                    className="cyber-input w-full px-4 py-3 text-sm"
                                />
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-gray-400 text-sm font-body mb-2">
                                    Short Bio
                                    <span className="text-gray-600 text-xs ml-2">(optional — more info = better roast)</span>
                                </label>
                                <textarea
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us about your career achievements, responsibilities, or your LinkedIn headline..."
                                    rows={3}
                                    className="cyber-input w-full px-4 py-3 text-sm resize-none"
                                />
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 rounded-xl bg-neon-red/10 border border-neon-red/30"
                                    >
                                        <p className="text-red-400 text-sm font-body">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="neon-button w-full py-4 rounded-xl text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "ANALYZING..." : "🔥 ROAST MY CAREER"}
                            </motion.button>

                            <p className="text-center text-gray-600 text-xs font-body">
                                No data is stored permanently. We just roast and forget.
                            </p>
                        </form>
                    </motion.section>

                    {/* Fun Stats */}
                    <motion.section
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="max-w-4xl mx-auto px-6 mt-20"
                    >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { value: "2.4M+", label: "Careers Analyzed", icon: "🧠" },
                                { value: "97%", label: "Avg Roast Accuracy", icon: "🎯" },
                                { value: "0.3s", label: "Avg Analysis Time", icon: "⚡" },
                                { value: "∞", label: "Hurt Feelings", icon: "😭" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.4 + i * 0.1 }}
                                    className="glass-card p-4 text-center"
                                >
                                    <span className="text-xl">{stat.icon}</span>
                                    <p className="font-display text-lg text-neon-cyan mt-1">
                                        {stat.value}
                                    </p>
                                    <p className="text-gray-500 text-xs font-body mt-1">
                                        {stat.label}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    <div className="mt-20">
                        <Footer />
                    </div>
                </div>
            )}
        </main>
    );
}
