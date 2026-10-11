"use client"

import Link from "next/link"
import { PlayIcon, Star, Bookmark, BookmarkCheck } from "@/components/icons"
import { getImageUrl } from "@/lib/tmdb"
import type { Movie, TVShow } from "@/lib/tmdb"
import { useWatchlist } from "@/hooks/use-watchlist"
import { cn } from "@/lib/utils"
import { SafeImage } from "@/components/safe-image"

interface MovieCardProps {
    movie: Movie | TVShow | any
    type?: "movie" | "tv"
    priority?: boolean
}

export function MovieCard({ movie, type = "movie", priority = false }: MovieCardProps) {
    const isTV = type === "tv" || "name" in movie
    const title = movie.title || movie.name || "Untitled"
    const releaseDate = movie.release_date || movie.first_air_date
    const year = releaseDate ? new Date(releaseDate).getFullYear() : null

    const { isInWatchlist, toggleWatchlist } = useWatchlist()
    const inList = isInWatchlist(movie.id)

    const handleBookmark = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleWatchlist({
            id: movie.id,
            title,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            vote_average: movie.vote_average,
            release_date: releaseDate,
            media_type: isTV ? "tv" : "movie",
        })
    }

    return (
        <div className="group relative block rounded-2xl overflow-hidden bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/40 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.5)] hover:shadow-[0_8px_30px_rgba(145,101,255,0.15)] transition-all duration-300">
            <Link
                href={`/${isTV ? "tv" : "movie"}/${movie.id}`}
                className="block relative aspect-[2/3] w-full overflow-hidden"
                aria-label={title}
            >
                <SafeImage
                    src={movie.poster_path ? getImageUrl(movie.poster_path, "w500") : "/placeholder.svg"}
                    fallbackSrc="/placeholder.svg"
                    alt={title}
                    fill
                    priority={priority}
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 28vw, (max-width: 1440px) 16vw, 220px"
                />

                {/* Dark Vignette Overlay for Crisp Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-75" />

                {/* Floating Centered Play Button on Hover */}
                <div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#9165FF] text-white flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(145,101,255,0.7)]">
                    <PlayIcon className="w-4 h-4 ml-0.5 fill-current" />
                </div>

                {/* Top-Right Quick Bookmark Action */}
                <button
                    type="button"
                    onClick={handleBookmark}
                    aria-label={inList ? "Remove from My List" : "Add to My List"}
                    className={cn(
                        "absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-all duration-200",
                        inList
                            ? "bg-[#9165FF] text-white border-[#9165FF] shadow-[0_0_10px_rgba(145,101,255,0.4)] opacity-100"
                            : "bg-black/50 text-white/80 border-white/10 hover:bg-[#9165FF] hover:text-white opacity-0 group-hover:opacity-100",
                    )}
                >
                    {inList ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>

                {/* Bottom Metadata Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-3 space-y-1 z-10">
                    <div className="flex items-center justify-between gap-1.5 text-[11px]">
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-400">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {movie.vote_average > 0 ? movie.vote_average.toFixed(1) : "—"}
                        </span>

                        <div className="flex items-center gap-1 text-[#929BB0]">
                            {year && <span>{year}</span>}
                        </div>
                    </div>

                    <h3 className="text-[13px] font-semibold text-[#F7F7FC] truncate group-hover:text-[#B69AFF] transition-colors leading-tight">
                        {title}
                    </h3>
                </div>
            </Link>
        </div>
    )
}
