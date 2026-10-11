"use client"

import Link from "next/link"
import { SafeImage } from "@/components/safe-image"
import {
    PlayIcon,
    Info,
    Star,
    Crown,
    Plus,
    Check,
    ChevronLeft,
    ChevronRight,
} from "@/components/icons"
import { getBackdropUrl } from "@/lib/tmdb"
import type { Movie } from "@/lib/tmdb"
import { useState, useEffect, useCallback } from "react"
import { useWatchlist } from "@/hooks/use-watchlist"

interface HeroSectionProps {
    movies: Movie[]
}

export function HeroSection({ movies }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const movie = movies[currentIndex]

    const { isInWatchlist, toggleWatchlist } = useWatchlist()
    const inList = movie ? isInWatchlist(movie.id) : false

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, [movies.length])

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
    }, [movies.length])

    useEffect(() => {
        if (isHovered || movies.length <= 1) return
        const interval = setInterval(nextSlide, 6500)
        return () => clearInterval(interval)
    }, [isHovered, movies.length, nextSlide])

    if (!movie) return null

    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null

    const handleToggleList = (e: React.MouseEvent) => {
        e.preventDefault()
        toggleWatchlist({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path,
            backdrop_path: movie.backdrop_path,
            vote_average: movie.vote_average,
            release_date: movie.release_date,
            media_type: "movie",
        })
    }

    return (
        <section
            className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[420px] md:min-h-[460px] xl:min-h-[500px] flex items-center border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group select-none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Featured Spotlight"
        >
            {/* Cinematic Backdrop Image with Directional Gradients */}
            <div className="absolute inset-0 z-0">
                <SafeImage
                    key={movie.id}
                    src={movie.backdrop_path ? getBackdropUrl(movie.backdrop_path, "original") : "/placeholder-landscape.svg"}
                    fallbackSrc="/placeholder-landscape.svg"
                    alt={movie.title}
                    fill
                    className="object-cover object-center transform scale-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
                    priority
                    sizes="(max-width: 1440px) 100vw, 1440px"
                />

                {/* Multiple Directional Gradients (theme.md Section 3.C) */}
                {/* Left heavy black gradient for pristine typography readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070D] via-[#05070D]/85 sm:via-[#05070D]/75 md:w-3/4 to-transparent" />
                {/* Bottom gradient fade into page background */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/30 to-transparent" />
                {/* Subtle top shade */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            </div>

            {/* Content Details (Left Aligned with Generous Padding) */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-12 w-full max-w-3xl space-y-4 md:space-y-5">
                {/* Badge & Metadata Pill Row */}
                <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-[#9165FF]/20 border border-[#9165FF]/40 text-[#B69AFF] backdrop-blur-md shadow-[0_0_12px_rgba(145,101,255,0.25)]">
                        <Crown className="w-3.5 h-3.5 text-[#B69AFF]" />
                        <span>STREAMLY ORIGINAL</span>
                    </span>

                    {year && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/[0.08] backdrop-blur-md text-[#F7F7FC] border border-white/[0.08]">
                            {year}
                        </span>
                    )}

                    {movie.vote_average > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/[0.08] backdrop-blur-md text-amber-400 border border-white/[0.08]">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {movie.vote_average.toFixed(1)}
                        </span>
                    )}

                    <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-white/[0.08] text-white/90 border border-white/[0.1] backdrop-blur-md">
                        4K ULTRA HD
                    </span>
                </div>

                {/* Hero Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-[#F7F7FC] tracking-tight leading-[1.08] text-balance drop-shadow-md">
                    {movie.title}
                </h1>

                {/* Synopsis */}
                <p className="text-sm sm:text-base text-[#929BB0] font-normal line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl drop-shadow">
                    {movie.overview}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                    {/* Watch Now Button */}
                    <Link
                        href={`/watch/${movie.id}`}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#9165FF] to-[#7B46F6] hover:from-[#A27BFF] hover:to-[#8E5AFF] text-white font-semibold text-sm shadow-[0_0_24px_rgba(145,101,255,0.4)] hover:shadow-[0_0_32px_rgba(145,101,255,0.6)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <PlayIcon className="w-4 h-4 fill-current" />
                        <span>Watch Now</span>
                    </Link>

                    {/* Interactive My List Button */}
                    <button
                        type="button"
                        onClick={handleToggleList}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-[#F7F7FC] border border-white/[0.12] backdrop-blur-md transition-all duration-200 text-sm font-medium"
                    >
                        {inList ? (
                            <>
                                <Check className="w-4 h-4 text-[#B69AFF]" />
                                <span>In My List</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>My List</span>
                            </>
                        )}
                    </button>

                    {/* Movie Info Link */}
                    <Link
                        href={`/movie/${movie.id}`}
                        aria-label="View movie details"
                        className="p-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-[#F7F7FC] border border-white/[0.12] backdrop-blur-md transition-all duration-200"
                    >
                        <Info className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Bottom Carousel Controls: Left indicators & Right circular prev/next */}
            <div className="absolute bottom-5 inset-x-6 sm:inset-x-10 lg:inset-x-12 z-20 flex items-center justify-between pointer-events-none">
                {/* Pagination Indicators (Bottom Left) */}
                <div className="pointer-events-auto flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/[0.08]">
                    {movies.map((_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => setCurrentIndex(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex ? "w-6 bg-[#9165FF] shadow-[0_0_8px_#9165FF]" : "w-1.5 bg-white/30 hover:bg-white/60"
                                }`}
                        />
                    ))}
                </div>

                {/* Circular Prev/Next Controls (Bottom Right) */}
                <div className="pointer-events-auto flex items-center gap-2">
                    <button
                        type="button"
                        onClick={prevSlide}
                        aria-label="Previous slide"
                        className="w-9 h-9 rounded-full bg-black/40 hover:bg-[#9165FF] text-white backdrop-blur-md border border-white/[0.1] hover:border-[#9165FF] transition-all flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_rgba(145,101,255,0.5)]"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        type="button"
                        onClick={nextSlide}
                        aria-label="Next slide"
                        className="w-9 h-9 rounded-full bg-black/40 hover:bg-[#9165FF] text-white backdrop-blur-md border border-white/[0.1] hover:border-[#9165FF] transition-all flex items-center justify-center shadow-lg hover:shadow-[0_0_15px_rgba(145,101,255,0.5)]"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}
