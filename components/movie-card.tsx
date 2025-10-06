"use client"

import Image from "next/image"
import Link from "next/link"
import { Play, Star } from "lucide-react"
import { getImageUrl } from "@/lib/tmdb"
import type { Movie } from "@/lib/tmdb"
import { useState } from "react"

interface MovieCardProps {
  movie: Movie
  type?: "movie" | "tv"
}

export function MovieCard({ movie, type = "movie" }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={`/${type}/${movie.id}`}
      className="group relative block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-secondary">
        <Image
          src={getImageUrl(movie.poster_path) || "/posterLogoSmall.png"}
          alt={movie.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />

        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
        >
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-balance">{movie.title}</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span>{movie.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-primary/20 px-2 py-1 rounded">
                <Play className="h-3 w-3" />
                <span>Watch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
