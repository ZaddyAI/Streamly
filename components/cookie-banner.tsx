"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Sparkles, X, Check } from "@/components/icons"
import { cn } from "@/lib/utils"

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        try {
            const consent = localStorage.getItem("streamly_cookie_consent")
            if (!consent) {
                // Show banner after a slight initial delay for smooth entry
                const timer = setTimeout(() => setIsVisible(true), 800)
                return () => clearTimeout(timer)
            }
        } catch {
            // If localStorage is unavailable, do not show
        }
    }, [])

    const handleAccept = (choice: "all" | "necessary") => {
        try {
            localStorage.setItem("streamly_cookie_consent", choice)
        } catch {
            // Ignore
        }
        setIsVisible(false)
    }

    if (!isMounted || !isVisible) return null

    return (
        <div
            role="region"
            aria-label="Cookie consent banner"
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm sm:max-w-md animate-in fade-in slide-in-from-bottom-5 duration-400"
        >
            <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-[#101522]/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.85)] space-y-3.5">
                {/* Ambient violet corner glow */}
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#9165FF]/20 rounded-full blur-2xl pointer-events-none" />

                {/* Header */}
                <div className="flex items-start justify-between gap-3 relative z-10">
                    <div className="flex items-center gap-2.5">
                        <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#9165FF] to-[#B69AFF] text-white shadow-[0_0_12px_rgba(145,101,255,0.4)]">
                            <Sparkles className="w-4 h-4" />
                        </span>
                        <div>
                            <h4 className="text-xs sm:text-sm font-bold text-[#F7F7FC] tracking-tight">
                                Cookie & Privacy Preferences
                            </h4>
                            <span className="text-[10px] text-[#B69AFF] font-medium">
                                No registration or personal account required
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleAccept("necessary")}
                        className="text-[#929BB0] hover:text-white p-1 rounded-lg transition-colors"
                        aria-label="Dismiss cookie notice"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-xs text-[#929BB0] leading-relaxed relative z-10">
                    Streamly uses essential cookies and local device storage to remember your watchlist, save playback progress, and provide seamless streaming without requiring sign-in or authorization. Read our{" "}
                    <Link
                        href="/cookies-policy"
                        className="text-[#B69AFF] hover:underline font-medium"
                    >
                        Cookies Policy
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy-policy"
                        className="text-[#B69AFF] hover:underline font-medium"
                    >
                        Privacy Policy
                    </Link>.
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-2 pt-1 relative z-10">
                    <button
                        type="button"
                        onClick={() => handleAccept("all")}
                        className="flex-1 py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#9165FF] to-[#7B46F6] hover:from-[#A27BFF] hover:to-[#8E5AFF] text-white text-xs font-semibold shadow-[0_0_15px_rgba(145,101,255,0.35)] transition-all flex items-center justify-center gap-1.5"
                    >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept All</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleAccept("necessary")}
                        className="py-2 px-3 rounded-xl bg-[#171C2C] hover:bg-[#1F2538] border border-white/[0.08] hover:border-white/[0.15] text-[#929BB0] hover:text-[#F7F7FC] text-xs font-medium transition-all"
                    >
                        Necessary Only
                    </button>
                </div>
            </div>
        </div>
    )
}
