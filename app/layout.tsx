import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "LayoffGPT — Will AI Take Your Job?",
    description:
        "Paste your LinkedIn career info and discover how easily AI could replace your job. Get your AI Takeover Score, a hilarious roast, and absurd future career suggestions.",
    keywords: ["AI", "career", "roast", "LinkedIn", "artificial intelligence", "job replacement", "humor"],
    openGraph: {
        title: "LayoffGPT — AI Just Reviewed Your Career",
        description: "Paste your LinkedIn profile and see if AI is about to eat your job.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "LayoffGPT — Will AI Take Your Job?",
        description: "Get roasted by AI. Find out your AI Takeover Score.",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="cyber-bg min-h-screen antialiased">
                <div className="relative z-10">
                    {children}
                </div>
            </body>
        </html>
    );
}
