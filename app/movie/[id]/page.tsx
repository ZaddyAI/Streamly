import { Header } from "@/components/header"
import { getMovieDetails, getSimilarMovies, getBackdropUrl, getImageUrl } from "@/lib/tmdb"
import Image from "next/image"
import { Play, Star, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MovieRow } from "@/components/movie-row"
import { notFound } from "next/navigation"

interface MoviePageProps {
  params: {
    id: string
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const movieId = Number.parseInt(params.id)

  if (isNaN(movieId)) {
    notFound()
  }

  const [movie, similarMovies] = await Promise.all([getMovieDetails(movieId), getSimilarMovies(movieId)])

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl(movie.backdrop_path, "original") || "/placeholder.svg"}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>
      </div>

      {/* Movie Details */}
      <div className="relative -mt-48 z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-none w-48 md:w-64">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(movie.poster_path, "w500") || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
                {movie.tagline && <p className="text-lg text-muted-foreground italic">{movie.tagline}</p>}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.runtime} min</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{movie.overview}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href={`/watch/${movie.id}`}>
                    <Play className="h-5 w-5 fill-current" />
                    Watch Now
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Similar Movies */}
          {similarMovies.length > 0 && (
            <div className="mt-16">
              <MovieRow title="More Like This" movies={similarMovies} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
