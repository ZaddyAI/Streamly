import { Header } from "@/components/header"
import { getTVShowDetails, getSimilarTVShows, getBackdropUrl, getImageUrl } from "@/lib/tmdb"
import Image from "next/image"
import { Play, Star, Calendar, Tv } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MovieRow } from "@/components/movie-row"
import { notFound } from "next/navigation"

interface TVShowPageProps {
  params: {
    id: string
  }
}

export default async function TVShowPage({ params }: TVShowPageProps) {
  const tvId = Number.parseInt(params.id)

  if (isNaN(tvId)) {
    notFound()
  }

  const [tvShow, similarShows] = await Promise.all([getTVShowDetails(tvId), getSimilarTVShows(tvId)])

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Backdrop */}
      <div className="relative h-[60vh] md:h-[70vh] w-full">
        <div className="absolute inset-0">
          <Image
            src={getBackdropUrl(tvShow.backdrop_path, "original") || "/placeholder.svg"}
            alt={tvShow.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>
      </div>

      {/* TV Show Details */}
      <div className="relative -mt-48 z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <div className="flex-none w-48 md:w-64">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={getImageUrl(tvShow.poster_path, "w500") || "/placeholder.svg"}
                  alt={tvShow.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 192px, 256px"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">{tvShow.name}</h1>
                {tvShow.tagline && <p className="text-lg text-muted-foreground italic">{tvShow.tagline}</p>}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-semibold">{tvShow.vote_average.toFixed(1)}</span>
                  <span className="text-muted-foreground">/10</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(tvShow.first_air_date).getFullYear()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Tv className="h-4 w-4" />
                  <span>{tvShow.number_of_seasons} Seasons</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>{tvShow.number_of_episodes} Episodes</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2">
                {tvShow.genres.map((genre) => (
                  <span key={genre.id} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>

              {/* Overview */}
              <div>
                <h2 className="text-xl font-semibold mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{tvShow.overview}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gap-2">
                  <Link href={`/watch/${tvShow.id}?type=tv&season=1&episode=1`}>
                    <Play className="h-5 w-5 fill-current" />
                    Watch Now
                  </Link>
                </Button>
              </div>

              {/* Seasons List */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Seasons</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {tvShow.seasons
                    .filter((season) => season.season_number > 0)
                    .map((season) => (
                      <Link
                        key={season.id}
                        href={`/watch/${tvShow.id}?type=tv&season=${season.season_number}&episode=1`}
                        className="group relative aspect-[2/3] rounded-lg overflow-hidden bg-secondary hover:ring-2 hover:ring-primary transition-all"
                      >
                        {season.poster_path ? (
                          <Image
                            src={getImageUrl(season.poster_path, "w500") || "/placeholder.svg"}
                            alt={season.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Tv className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="font-semibold text-sm">{season.name}</p>
                          <p className="text-xs text-muted-foreground">{season.episode_count} Episodes</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Similar Shows */}
          {similarShows.length > 0 && (
            <div className="mt-16">
              <MovieRow
                title="More Like This"
                movies={similarShows.map((show: any) => ({
                  ...show,
                  title: show.name,
                  release_date: show.first_air_date,
                }))}
                type="tv"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
