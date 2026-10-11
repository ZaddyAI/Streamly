"use client"

import { useWatchlist } from "@/hooks/use-watchlist"
import { MovieCard } from "@/components/movie-card"
import { Bookmark, Sparkles, Film, Flame } from "@/components/icons"
import Link from "next/link"

export default function MyListPage() {
    const { items, loaded, count } = useWatchlist()

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Header */}
            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9165FF]/15 border border-[#9165FF]/30 text-[#B69AFF]">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Personal Collection</span>
                </span>
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                        My List
                    </h1>
                    {loaded && count > 0 && (
                        <span className="text-xs font-medium text-[#929BB0] bg-[#101522] border border-white/[0.08] px-3 py-1 rounded-full">
                            {count} {count === 1 ? "title" : "titles"} saved
                        </span>
                    )}
                </div>
                <p className="text-sm text-[#929BB0] max-w-2xl">
                    Your personal streaming queue. Jump back in anytime or queue up what you plan to watch next.
                </p>
            </div>

            {/* List Content */}
            {!loaded ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[2/3] rounded-2xl bg-[#101522] border border-white/[0.06] animate-pulse"
                        />
                    ))}
                </div>
            ) : items.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                    {items.map((item) => (
                        <MovieCard
                            key={item.id}
                            movie={item}
                            type={item.media_type || "movie"}
                        />
                    ))}
                </div>
            ) : (
                /* Empty State (theme.md Section 10) */
                <div className="glass-card rounded-3xl p-10 md:p-14 text-center space-y-5 max-w-xl mx-auto my-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9165FF] to-[#B69AFF] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(145,101,255,0.4)]">
                        <Bookmark className="w-8 h-8 text-white" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-bold text-[#F7F7FC]">Your list is empty</h2>
                        <p className="text-sm text-[#929BB0] leading-relaxed">
                            Explore popular movies, trending series, and originals. Click the bookmark or &quot;+ My List&quot; button on any title to save it here.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link
                            href="/trending"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9165FF] to-[#7B46F6] hover:from-[#A27BFF] hover:to-[#8E5AFF] text-white text-xs font-semibold shadow-[0_0_18px_rgba(145,101,255,0.35)] transition-all"
                        >
                            <Flame className="w-4 h-4" />
                            <span>Explore Trending</span>
                        </Link>
                        <Link
                            href="/movies"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#101522] hover:bg-[#171C2C] text-[#F7F7FC] border border-white/[0.08] text-xs font-semibold transition-all"
                        >
                            <Film className="w-4 h-4" />
                            <span>Browse Movies</span>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
