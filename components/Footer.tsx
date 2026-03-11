"use client";

import { motion } from "framer-motion";

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="border-t border-neon-cyan/10 bg-dark-900/50 backdrop-blur-sm"
        >
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm tracking-wider">
                            <span className="text-white">LAYOFF</span>
                            <span className="text-neon-cyan">GPT</span>
                        </span>
                        <span className="text-gray-600 text-xs">|</span>
                        <span className="text-gray-500 text-xs font-body">
                            AI career forecasting (for laughs)
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-gray-600 text-xs font-body">
                            Built with 🤖 and questionable humor
                        </span>
                        <span className="text-gray-700 text-xs">
                            © {new Date().getFullYear()} LayoffGPT
                        </span>
                    </div>
                </div>
            </div>
        </motion.footer>
    );
}
