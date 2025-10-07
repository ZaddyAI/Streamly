"use client"

import Image from "next/image"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBackdropUrl } from "@/lib/tmdb"
import type { Movie } from "@/lib/tmdb"
import Link from "next/link"
import { useState, useEffect } from "react"

interface HeroSectionProps {
    movies: Movie[]
}

export function HeroSection({ movies }: HeroSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const movie = movies[currentIndex]

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % movies.length)
        }, 5000)

        return () => clearInterval(interval)
    }, [movies.length])

    return (
        <div className="relative h-[70vh] md:h-[85vh] w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    key={movie.id}
                    src={getBackdropUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover transition-opacity duration-1000"
                    priority
                    sizes="100vw"
                />
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full container mx-auto px-4 md:px-8 flex items-center">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-balance">{movie.title}</h1>

                    <p className="text-sm md:text-lg text-muted-foreground line-clamp-3 md:line-clamp-4 text-pretty">
                        {movie.overview}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <Button asChild size="lg" className="gap-2">
                            <Link href={`/watch/${movie.id}`}>
                                <Play className="h-5 w-5 fill-current" />
                                Play Now
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" size="lg" className="gap-2">
                            <Link href={`/movie/${movie.id}`}>
                                <Info className="h-5 w-5" />
                                More Info
                            </Link>
                        </Button>
                    </div>

                    <div className="flex gap-2 pt-4">
                        {movies.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`h-1 rounded-full transition-all ${index === currentIndex ? "w-8 bg-primary" : "w-1 bg-muted-foreground/50"
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
