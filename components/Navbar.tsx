"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-dark-900/70 border-b border-neon-cyan/10"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 flex items-center justify-center group-hover:border-neon-cyan/60 transition-all duration-300">
                            <span className="text-neon-cyan font-display font-bold text-lg">L</span>
                        </div>
                        <div className="absolute -inset-1 rounded-lg bg-neon-cyan/10 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-wider">
                        <span className="text-white">LAYOFF</span>
                        <span className="text-neon-cyan">GPT</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-8">
                    {[
                        { name: "Home", href: "/" },
                        { name: "Leaderboard", href: "/leaderboard" },
                    ].map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onMouseEnter={() => setHoveredLink(link.name)}
                            onMouseLeave={() => setHoveredLink(null)}
                            className="relative font-body text-sm tracking-wide text-gray-400 hover:text-neon-cyan transition-colors duration-300"
                        >
                            {link.name}
                            {hoveredLink === link.name && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-1 left-0 right-0 h-px bg-neon-cyan"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </motion.nav>
    );
}
