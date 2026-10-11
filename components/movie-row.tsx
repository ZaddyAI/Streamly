"use client"

import { MovieCard } from "./movie-card"
import type { Movie, TVShow } from "@/lib/tmdb"
import { ChevronLeft, ChevronRight } from "@/components/icons"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface MovieRowProps {
    title: string
    movies: (Movie | TVShow | any)[]
    type?: "movie" | "tv"
    href?: string
    icon?: React.ReactNode
}

export function MovieRow({ title, movies, type = "movie", href, icon }: MovieRowProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const updateScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
            setCanScrollLeft(scrollLeft > 10)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        updateScrollButtons()
    }, [movies])

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = scrollContainerRef.current.clientWidth * 0.75
            const newScrollLeft =
                scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount)

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: "smooth",
            })
        }
    }

    if (!movies || movies.length === 0) return null

    return (
        <section className="relative group/row space-y-3.5" aria-label={title}>
            {/* Header: Title + Section Icon + View All */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {icon && <span className="text-[#9165FF] flex items-center">{icon}</span>}
                    <h2 className="text-lg sm:text-xl font-bold text-[#F7F7FC] tracking-tight">{title}</h2>
                </div>

                {href && (
                    <Link
                        href={href}
                        className="group/link flex items-center gap-1 text-xs font-semibold text-[#B69AFF] hover:text-white transition-colors"
                    >
                        <span>View All</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                )}
            </div>

            {/* Carousel Container */}
            <div className="relative -mx-1 px-1">
                {/* Left Navigation Chevron Button */}
                {canScrollLeft && (
                    <button
                        type="button"
                        aria-label={`Scroll ${title} left`}
                        onClick={() => scroll("left")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-16 rounded-xl bg-[#090D18]/85 backdrop-blur-md border border-white/[0.1] text-white hover:bg-[#9165FF] hover:border-[#9165FF] opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-all duration-200 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Horizontal Scroll Track */}
                <div
                    ref={scrollContainerRef}
                    onScroll={updateScrollButtons}
                    className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide py-1.5 scroll-smooth"
                >
                    {movies.map((movie, index) => (
                        <div
                            key={movie.id || index}
                            className="flex-none w-[130px] sm:w-[155px] md:w-[170px] lg:w-[185px] xl:w-[195px]"
                        >
                            <MovieCard movie={movie} type={type} />
                        </div>
                    ))}
                </div>

                {/* Right Navigation Chevron Button */}
                {canScrollRight && (
                    <button
                        type="button"
                        aria-label={`Scroll ${title} right`}
                        onClick={() => scroll("right")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-16 rounded-xl bg-[#090D18]/85 backdrop-blur-md border border-white/[0.1] text-white hover:bg-[#9165FF] hover:border-[#9165FF] opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 transition-all duration-200 flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}
            </div>
        </section>
    )
}
