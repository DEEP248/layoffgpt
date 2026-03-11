import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                neon: {
                    cyan: "#00f0ff",
                    pink: "#ff00e5",
                    purple: "#b000ff",
                    green: "#39ff14",
                    yellow: "#ffe600",
                    red: "#ff003c",
                    orange: "#ff6a00",
                },
                dark: {
                    900: "#0a0a0f",
                    800: "#0f0f1a",
                    700: "#141425",
                    600: "#1a1a2e",
                    500: "#22223a",
                },
            },
            fontFamily: {
                display: ["Orbitron", "sans-serif"],
                body: ["Inter", "sans-serif"],
            },
            animation: {
                "glow-pulse": "glow-pulse 2s ease-in-out infinite",
                "neon-flicker": "neon-flicker 3s ease-in-out infinite",
                "slide-up": "slide-up 0.6s ease-out",
                "fade-in": "fade-in 0.8s ease-out",
                "progress-bar": "progress-bar 2s ease-out forwards",
                float: "float 3s ease-in-out infinite",
            },
            keyframes: {
                "glow-pulse": {
                    "0%, 100%": {
                        boxShadow: "0 0 20px rgba(0, 240, 255, 0.3), 0 0 40px rgba(0, 240, 255, 0.1)",
                    },
                    "50%": {
                        boxShadow: "0 0 30px rgba(0, 240, 255, 0.6), 0 0 60px rgba(0, 240, 255, 0.3)",
                    },
                },
                "neon-flicker": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0.8" },
                    "75%": { opacity: "0.9" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(30px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
                "progress-bar": {
                    "0%": { width: "0%" },
                    "100%": { width: "var(--progress-width)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            backgroundImage: {
                "cyber-grid":
                    "linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px)",
            },
            backgroundSize: {
                "cyber-grid": "50px 50px",
            },
        },
    },
    plugins: [],
};
export default config;
