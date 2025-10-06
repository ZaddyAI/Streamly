"use client"

import Image from "next/image"
import { Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getBackdropUrl } from "@/lib/tmdb"
import type { Movie } from "@/lib/tmdb"
import Link from "next/link"

interface HeroSectionProps {
  movie: Movie
}

export function HeroSection({ movie }: HeroSectionProps) {
  return (
    <div className="relative h-[70vh] md:h-[85vh] w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getBackdropUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
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
        </div>
      </div>
    </div>
  )
}
