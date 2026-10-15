"use client"

import Link from "next/link"
import React, { useEffect, useState } from "react"
import {
    StreamlyMark,
    StreamlyWordmark,
    GitForkIcon,
    StarIcon,
    TmdbLogo,
    Github,
    ExternalLink,
} from "@/components/icons"
import { Developer, DeveloperURL } from "@/lib/constants"

function GitHubStats() {
    const [stats, setStats] = useState<{ forks: number | null; stars: number | null }>({ forks: null, stars: null })
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let active = true
        fetch("/api/github-stats")
            .then((r) => r.json())
            .then((data) => {
                if (!active) return
                setStats({
                    forks: typeof data.forks === "number" ? data.forks : null,
                    stars: typeof data.stars === "number" ? data.stars : null,
                })
            })
            .catch(() => { })
            .finally(() => active && setLoaded(true))
        return () => {
            active = false
        }
    }, [])

    if (loaded && stats.forks === null && stats.stars === null) return null

    return (
        <a
            href="https://github.com/ZaddyAI/streamly"
            target="_blank"
            rel="noopener noreferrer"
            title="Star Streamly on GitHub"
            className="inline-flex items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#101522] px-3.5 py-2 text-[#929BB0] transition-all hover:border-[#9165FF]/50 hover:text-white hover:shadow-[0_0_15px_rgba(145,101,255,0.25)]"
        >
            <Github className="h-4 w-4 text-[#F7F7FC]" />
            {!loaded ? (
                <span className="h-3 w-10 animate-pulse rounded bg-white/10" />
            ) : (
                <>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                        <StarIcon className="h-3 w-3 text-amber-400" />
                        {stats.stars?.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold">
                        <GitForkIcon className="h-3 w-3 text-[#929BB0]" />
                        {stats.forks}
                    </span>
                </>
            )}
        </a>
    )
}

export function Footer() {
    const year = new Date().getFullYear()

    return (
        <footer className="mt-auto border-t border-white/[0.08] bg-[#090D18]/95 backdrop-blur-xl transition-all">
            <div className="w-full max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
                {/* Top Multi-Column Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
                    {/* Brand & Mission Info (Spans 2 columns on large viewports) */}
                    <div className="lg:col-span-2 space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2.5">
                            <StreamlyMark size="md" />
                            <StreamlyWordmark size="md" />
                        </Link>

                        <p className="text-xs sm:text-sm text-[#929BB0] leading-relaxed max-w-sm">
                            Next-generation cinematic streaming directory. Explore thousands of blockbusters, trending series, and independent cinema with zero sign-up or authorization required.
                        </p>

                        <div className="flex items-center gap-2 pt-1 flex-wrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span>100% Free · No Authorization</span>
                            </span>

                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-[#9165FF]/10 border border-[#9165FF]/20 text-[#B69AFF]">
                                <span>Open Source</span>
                            </span>
                        </div>
                    </div>

                    {/* Column 2: Navigation Links */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F7FC]">
                            Discover
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/movies" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    Movies
                                </Link>
                            </li>
                            <li>
                                <Link href="/tv-shows" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    TV Shows
                                </Link>
                            </li>
                            <li>
                                <Link href="/trending" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    Trending Now
                                </Link>
                            </li>
                            <li>
                                <Link href="/genres" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    Browse Genres
                                </Link>
                            </li>
                            <li>
                                <Link href="/my-list" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    My Watchlist
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Policies */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F7FC]">
                            Legal & Policies
                        </h4>
                        <ul className="space-y-2 text-xs">
                            <li>
                                <Link href="/privacy-policy" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies-policy" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    Cookies Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy-policy#disclaimer" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    DMCA Disclaimer
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies-policy#storage" className="text-[#929BB0] hover:text-[#B69AFF] transition-colors">
                                    Local Storage Notice
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Platform Ecosystem*/}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#F7F7FC]">
                            Ecosystem
                        </h4>

                        {/* GitHub & TMDB badges with prominent gap */}
                        <div className="flex flex-wrap items-center gap-3.5">
                            <GitHubStats />

                            <a
                                href="https://www.themoviedb.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Data and imagery provided by The Movie Database"
                                className="inline-flex items-center justify-center rounded-xl border border-white/[0.08] bg-[#101522] px-3.5 py-2 opacity-90 transition-all hover:opacity-100 hover:border-[#9165FF]/40 hover:shadow-[0_0_12px_rgba(145,101,255,0.2)]"
                            >
                                <TmdbLogo className="h-4.5 w-auto" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Legal Disclaimer, Copyright & Developer Credit */}
                <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[11px] text-[#929BB0]/80">
                    <p className="max-w-3xl leading-relaxed">
                        <strong className="text-white font-medium">Disclaimer:</strong> Streamly does not host, upload, or store any media files on its servers. All video streams are retrieved and embedded from third-party services. We are not responsible for the compliance, copyright, or legality of third-party hosted content.
                    </p>

                    <div className="flex items-center gap-3 shrink-0 flex-wrap">
                        <span>© {year} Streamly. All rights reserved.</span>
                        <span className="text-white/20">|</span>
                        <span>
                            Crafted by {" "}
                            <a
                                href={DeveloperURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-[#B69AFF] hover:text-white transition-colors underline decoration-[#9165FF]/40 underline-offset-2"
                            >
                                {Developer}
                            </a>
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
