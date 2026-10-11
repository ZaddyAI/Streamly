"use client"

import Link from "next/link"
import { Crown, Star, Sparkles, ChevronRight } from "@/components/icons"
import { getImageUrl, getBackdropUrl } from "@/lib/tmdb"
import { SafeImage } from "@/components/safe-image"
import type { Movie, TVShow } from "@/lib/tmdb"

interface RightRailProps {
    topRated: (Movie | TVShow | any)[]
}

export function RightRail({ topRated }: RightRailProps) {
    const topFive = (topRated || []).slice(0, 5)

    return (
        <aside className="w-full xl:w-[270px] flex flex-col gap-6 shrink-0" aria-label="Editorial Rail">
            {/* 1. Promotional Card (theme.md Section 3.F) */}
            <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-b from-[#171C2C] to-[#101522] border border-white/[0.08] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.7)] group">
                {/* Cinematic background artwork overlay with dark mask */}
                {topRated[0]?.backdrop_path && (
                    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                        <SafeImage
                            src={getBackdropUrl(topRated[0].backdrop_path, "w780")}
                            fallbackSrc="/placeholder-landscape.svg"
                            alt="Streamly Stories"
                            fill
                            className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                            sizes="270px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101522] via-[#101522]/80 to-transparent" />
                    </div>
                )}

                <div className="relative z-10 space-y-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9165FF]/20 border border-[#9165FF]/30 text-[#B69AFF]">
                        <Sparkles className="w-3 h-3" />
                        <span>Curated Spotlight</span>
                    </span>

                    <h3 className="text-base font-extrabold text-[#F7F7FC] leading-snug tracking-tight">
                        Great stories.
                        <br />
                        <span className="text-[#B69AFF]">Endless moments.</span>
                    </h3>

                    <p className="text-xs text-[#929BB0] leading-relaxed">
                        Stream critically-acclaimed originals, Hollywood premieres, and hidden cinema gems.
                    </p>

                    <Link
                        href="/movies"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#9165FF] to-[#7B46F6] hover:from-[#A27BFF] hover:to-[#8E5AFF] text-white text-xs font-semibold shadow-[0_0_18px_rgba(145,101,255,0.35)] transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <span>Explore Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>

            {/* 2. Top Rated Panel (theme.md Section 3.F) */}
            <div className="rounded-3xl p-5 bg-[#101522] border border-white/[0.08] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.6)] space-y-4">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                        <span className="text-[#9165FF]">
                            <Crown className="w-4 h-4" />
                        </span>
                        <h3 className="text-sm font-bold text-[#F7F7FC] tracking-tight">Top Rated</h3>
                    </div>

                    <Link
                        href="/movies"
                        className="text-[11px] font-semibold text-[#B69AFF] hover:text-white transition-colors"
                    >
                        See All
                    </Link>
                </div>

                {/* Numbered List of 5 Items */}
                <div className="space-y-3">
                    {topFive.map((item, index) => {
                        const isTV = "name" in item
                        const title = item.title || item.name || "Untitled"
                        const date = item.release_date || item.first_air_date
                        const year = date ? new Date(date).getFullYear() : ""
                        const rankNumber = String(index + 1).padStart(2, "0")

                        return (
                            <Link
                                key={item.id}
                                href={`/${isTV ? "tv" : "movie"}/${item.id}`}
                                className="group flex items-center gap-3 p-1.5 rounded-xl hover:bg-[#171C2C] transition-colors"
                            >
                                {/* Rank Number */}
                                <span className="w-5 text-center text-sm font-extrabold text-[#929BB0] group-hover:text-[#B69AFF] transition-colors">
                                    {rankNumber}
                                </span>

                                {/* Thumbnail */}
                                <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-[#171C2C] border border-white/[0.08] shrink-0">
                                    <SafeImage
                                        src={getImageUrl(item.poster_path, "w500")}
                                        fallbackSrc="/placeholder.svg"
                                        alt={title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                        sizes="40px"
                                    />
                                </div>

                                {/* Title & Metadata */}
                                <div className="flex-1 min-w-0 space-y-0.5">
                                    <h4 className="text-xs font-semibold text-[#F7F7FC] truncate group-hover:text-[#B69AFF] transition-colors">
                                        {title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[11px] text-[#929BB0]">
                                        <span className="inline-flex items-center gap-0.5 text-amber-400 font-medium">
                                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                            {item.vote_average ? item.vote_average.toFixed(1) : "—"}
                                        </span>
                                        <span>•</span>
                                        <span>{isTV ? "TV" : "Movie"}</span>
                                        {year && (
                                            <>
                                                <span>•</span>
                                                <span>{year}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </aside>
    )
}
