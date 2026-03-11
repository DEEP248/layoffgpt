"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const loadingMessages = [
    { text: "Scanning LinkedIn profile...", icon: "🔍" },
    { text: "Analyzing skills...", icon: "🧠" },
    { text: "Consulting robot overlords...", icon: "🤖" },
    { text: "Calculating replaceability...", icon: "📊" },
    { text: "Generating career obituary...", icon: "⚰️" },
    { text: "Preparing your roast...", icon: "🔥" },
];

export default function LoadingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const messageInterval = setInterval(() => {
            setCurrentIndex((prev) =>
                prev < loadingMessages.length - 1 ? prev + 1 : prev
            );
        }, 2000);

        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return 95;
                return prev + Math.random() * 8 + 2;
            });
        }, 300);

        return () => {
            clearInterval(messageInterval);
            clearInterval(progressInterval);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/95 backdrop-blur-xl"
        >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-neon-cyan/30"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                        }}
                        animate={{
                            y: [null, -100],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8 max-w-md px-6">
                {/* Pulsing Robot Icon */}
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="text-6xl"
                >
                    🤖
                </motion.div>

                {/* Loading Messages */}
                <div className="h-16 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center gap-3 text-center"
                        >
                            <span className="text-2xl">{loadingMessages[currentIndex].icon}</span>
                            <span className="font-display text-sm md:text-base text-neon-cyan tracking-wide">
                                {loadingMessages[currentIndex].text}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-full max-w-sm">
                    <div className="w-full h-2 bg-dark-600 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
                            initial={{ width: "0%" }}
                            animate={{ width: `${Math.min(progress, 95)}%` }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                    </div>
                    <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500 font-body">
                            {Math.round(Math.min(progress, 95))}% complete
                        </span>
                    </div>
                </div>

                {/* Dots Animation */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-neon-cyan"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
