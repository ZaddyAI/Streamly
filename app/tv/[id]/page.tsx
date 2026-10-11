import { getTVShowDetails, getSimilarTVShows, getBackdropUrl, getImageUrl, getTVShowVideos } from "@/lib/tmdb"
import { SafeImage } from "@/components/safe-image"
import { Star, Calendar, ArrowLeft, Tv } from "@/components/icons"
import Link from "next/link"
import { MovieRow } from "@/components/movie-row"
import { notFound } from "next/navigation"
import { DetailsActions } from "@/components/details-actions"
import { SeasonEpisodes } from "@/components/season-episodes"

interface TVShowPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function TVShowPage({ params }: TVShowPageProps) {
    const { id } = await params
    const tvId = Number.parseInt(id)

    if (isNaN(tvId)) {
        notFound()
    }

    let tvShow: any = null
    let similarShows: any[] = []
    let videos: any[] = []

    try {
        const [tvData, similarData, videosData] = await Promise.all([
            getTVShowDetails(tvId),
            getSimilarTVShows(tvId),
            getTVShowVideos(tvId),
        ])
        tvShow = tvData
        similarShows = similarData || []
        videos = videosData || []
    } catch (e) {
        console.error("Failed to load TV show details", e)
        notFound()
    }

    const trailer =
        videos.find((v) => v.type === "Trailer" && v.official) || videos.find((v) => v.type === "Trailer") || videos[0]

    const releaseYear = tvShow.first_air_date ? new Date(tvShow.first_air_date).getFullYear() : null
    const firstSeason = tvShow.seasons.find((s: any) => s.season_number > 0) || tvShow.seasons[0]

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Breadcrumb / Back Link */}
            <div className="flex items-center">
                <Link
                    href="/tv-shows"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#929BB0] hover:text-[#F7F7FC] transition-colors bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/40 px-3.5 py-1.5 rounded-xl"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to TV Shows</span>
                </Link>
            </div>

            {/* Cinematic Backdrop Banner */}
            <section className="relative rounded-3xl overflow-hidden h-[260px] sm:h-[320px] md:h-[400px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
                <SafeImage
                    src={tvShow.backdrop_path ? getBackdropUrl(tvShow.backdrop_path, "original") : "/placeholder-landscape.svg"}
                    fallbackSrc="/placeholder-landscape.svg"
                    alt={tvShow.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070D] via-[#05070D]/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            </section>

            {/* TV Show Details Floating Presentation */}
            <section className="relative -mt-24 sm:-mt-32 md:-mt-44 z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Poster */}
                <div className="flex-none w-44 sm:w-52 md:w-64 mx-auto md:mx-0">
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_15px_35px_rgba(0,0,0,0.8)] bg-[#101522]">
                        <SafeImage
                            src={tvShow.poster_path ? getImageUrl(tvShow.poster_path, "w500") : "/placeholder.svg"}
                            fallbackSrc="/placeholder.svg"
                            alt={tvShow.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 176px, 256px"
                            priority
                        />
                    </div>
                </div>

                {/* Info Block */}
                <div className="flex-1 space-y-5 min-w-0 w-full">
                    <div className="space-y-3">
                        {/* Badges Row */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                            {tvShow.vote_average > 0 && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>{tvShow.vote_average.toFixed(1)} / 10</span>
                                </span>
                            )}
                            {releaseYear && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] border border-white/[0.08] text-[#F7F7FC]">
                                    {releaseYear}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] border border-white/[0.08] text-[#F7F7FC]">
                                <Calendar className="w-3.5 h-3.5 text-[#B69AFF]" />
                                <span>{tvShow.number_of_seasons} Seasons</span>
                            </span>
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#9165FF]/20 text-[#B69AFF] border border-[#9165FF]/30">
                                4K ULTRA HD
                            </span>
                        </div>

                        {/* Title & Tagline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F7F7FC] tracking-tight leading-tight text-balance">
                            {tvShow.name}
                        </h1>
                        {tvShow.tagline && (
                            <p className="text-sm md:text-base text-[#929BB0] italic leading-relaxed">
                                &ldquo;{tvShow.tagline}&rdquo;
                            </p>
                        )}
                    </div>

                    {/* Genres */}
                    {tvShow.genres && tvShow.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tvShow.genres.map((genre: any) => (
                                <span
                                    key={genre.id}
                                    className="px-3 py-1 rounded-xl text-xs font-medium bg-[#101522] border border-white/[0.08] text-[#F7F7FC]"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Overview Glass Card */}
                    <div className="glass-card rounded-2xl p-5 space-y-2">
                        <h2 className="text-xs font-bold text-[#B69AFF] uppercase tracking-wider">
                            Overview
                        </h2>
                        <p className="text-sm text-[#F7F7FC]/90 leading-relaxed text-pretty">
                            {tvShow.overview || "No overview available for this series."}
                        </p>
                    </div>

                    {/* Interactive Action Controls */}
                    <DetailsActions
                        id={tvShow.id}
                        title={tvShow.name}
                        poster_path={tvShow.poster_path}
                        backdrop_path={tvShow.backdrop_path}
                        vote_average={tvShow.vote_average}
                        release_date={tvShow.first_air_date}
                        type="tv"
                        trailerKey={trailer?.key}
                        firstSeasonNumber={firstSeason?.season_number || 1}
                    />
                </div>
            </section>

            {/* Seasons & Episodes Explorer (Section 5) */}
            <SeasonEpisodes
                tvId={tvShow.id}
                totalSeasonsCount={tvShow.number_of_seasons}
                seasons={tvShow.seasons.map((season: any) => ({
                    id: season.id,
                    name: season.name,
                    season_number: season.season_number,
                    episode_count: season.episode_count,
                    poster_path: season.poster_path,
                }))}
            />

            {/* Similar Shows Rail */}
            {similarShows.length > 0 && (
                <div className="pt-6 border-t border-white/[0.06]">
                    <MovieRow
                        title="More Like This"
                        movies={similarShows.map((show: any) => ({
                            ...show,
                            title: show.name,
                            release_date: show.first_air_date,
                        }))}
                        type="tv"
                        icon={<Tv className="w-5 h-5 text-[#B69AFF]" />}
                    />
                </div>
            )}
        </div>
    )
}
