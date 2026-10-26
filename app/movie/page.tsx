"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { getMovieDetails, getSimilarMovies, getBackdropUrl, getImageUrl, getMovieVideos } from "@/lib/tmdb"
import { SafeImage } from "@/components/safe-image"
import { Star, Clock, ArrowLeft, Film } from "@/components/icons"
import { MovieRow } from "@/components/movie-row"
import { DetailsActions } from "@/components/details-actions"
import MovieLoading from "./loading"

function TitleMissing({ backHref, backLabel }: { backHref: string; backLabel: string }) {
    return (
        <div className="glass-card rounded-3xl p-10 sm:p-14 text-center space-y-5 max-w-xl mx-auto my-10">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto text-[#929BB0]">
                <Film className="w-7 h-7" />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-[#F7F7FC]">Title not found</h1>
                <p className="text-sm text-[#929BB0] leading-relaxed">
                    We couldn&apos;t load this title. The link may be broken, or the title is no longer available in
                    the catalogue.
                </p>
            </div>
            <Link
                href={backHref}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#9165FF] to-[#7B46F6] text-white font-semibold text-sm shadow-[0_0_24px_rgba(145,101,255,0.4)] transition-all hover:-translate-y-0.5"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>{backLabel}</span>
            </Link>
        </div>
    )
}

function MovieContent() {
    const searchParams = useSearchParams()
    const rawId = searchParams.get("id") ?? ""
    const movieId = Number.parseInt(rawId, 10)
    const isValidId = Number.isInteger(movieId) && movieId > 0

    const [movie, setMovie] = useState<any>(null)
    const [similarMovies, setSimilarMovies] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [status, setStatus] = useState<"loading" | "ready" | "missing">("loading")

    useEffect(() => {
        if (!isValidId) {
            setMovie(null)
            setStatus("missing")
            return
        }

        let cancelled = false
        setStatus("loading")
        setMovie(null)
        setSimilarMovies([])
        setVideos([])

        ;(async () => {
            try {
                const [movieData, similarData, videosData] = await Promise.all([
                    getMovieDetails(movieId),
                    getSimilarMovies(movieId),
                    getMovieVideos(movieId),
                ])
                if (cancelled) return
                setMovie(movieData)
                setSimilarMovies(similarData || [])
                setVideos(videosData || [])
                setStatus("ready")
            } catch (e) {
                console.error("Failed to load movie details", e)
                if (!cancelled) setStatus("missing")
            }
        })()

        return () => {
            cancelled = true
        }
    }, [movieId, isValidId])

    if (status === "missing") {
        return <TitleMissing backHref="/movies" backLabel="Back to Movies" />
    }

    if (status === "loading" || !movie) {
        return <MovieLoading />
    }

    const trailer =
        videos.find((v: any) => v.type === "Trailer" && v.official) ||
        videos.find((v: any) => v.type === "Trailer") ||
        videos[0]

    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : null

    return (
        <div className="space-y-8 md:space-y-10">
            {/* Breadcrumb / Back Link */}
            <div className="flex items-center">
                <Link
                    href="/movies"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#929BB0] hover:text-[#F7F7FC] transition-colors bg-[#101522] border border-white/[0.08] hover:border-[#9165FF]/40 px-3.5 py-1.5 rounded-xl"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Movies</span>
                </Link>
            </div>

            {/* Cinematic Backdrop Banner */}
            <section className="relative rounded-3xl overflow-hidden h-[260px] sm:h-[320px] md:h-[400px] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] group">
                <SafeImage
                    src={movie.backdrop_path ? getBackdropUrl(movie.backdrop_path, "original") : "/placeholder-landscape.svg"}
                    fallbackSrc="/placeholder-landscape.svg"
                    alt={movie.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    priority
                    sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05070D] via-[#05070D]/75 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070D] via-[#05070D]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
            </section>

            {/* Movie Details Floating Presentation */}
            <section className="relative -mt-24 sm:-mt-32 md:-mt-44 z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start">
                {/* Poster */}
                <div className="flex-none w-44 sm:w-52 md:w-64 mx-auto md:mx-0">
                    <div className="relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/[0.1] shadow-[0_15px_35px_rgba(0,0,0,0.8)] bg-[#101522]">
                        <SafeImage
                            src={movie.poster_path ? getImageUrl(movie.poster_path, "w500") : "/placeholder.svg"}
                            fallbackSrc="/placeholder.svg"
                            alt={movie.title}
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
                            {movie.vote_average > 0 && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    <span>{movie.vote_average.toFixed(1)} / 10</span>
                                </span>
                            )}
                            {releaseYear && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] border border-white/[0.08] text-[#F7F7FC]">
                                    {releaseYear}
                                </span>
                            )}
                            {movie.runtime > 0 && (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] border border-white/[0.08] text-[#B69AFF]">
                                    <Clock className="w-3.5 h-3.5 text-[#B69AFF]" />
                                    <span>{movie.runtime} min</span>
                                </span>
                            )}
                            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#9165FF]/20 text-[#B69AFF] border border-[#9165FF]/30">
                                4K ULTRA HD
                            </span>
                        </div>

                        {/* Title & Tagline */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#F7F7FC] tracking-tight leading-tight text-balance">
                            {movie.title}
                        </h1>
                        {movie.tagline && (
                            <p className="text-sm md:text-base text-[#929BB0] italic leading-relaxed">
                                &ldquo;{movie.tagline}&rdquo;
                            </p>
                        )}
                    </div>

                    {/* Genres */}
                    {movie.genres && movie.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {movie.genres.map((genre: any) => (
                                <Link
                                    key={genre.id}
                                    href={`/genres?id=${genre.id}&name=${encodeURIComponent(genre.name)}`}
                                    className="px-3 py-1 rounded-xl text-xs font-medium bg-[#101522] hover:bg-[#171C2C] border border-white/[0.08] hover:border-[#9165FF]/40 text-[#F7F7FC] transition-colors"
                                >
                                    {genre.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Overview Glass Card */}
                    <div className="glass-card rounded-2xl p-5 space-y-2">
                        <h2 className="text-xs font-bold text-[#B69AFF] uppercase tracking-wider">
                            Overview
                        </h2>
                        <p className="text-sm text-[#F7F7FC]/90 leading-relaxed text-pretty">
                            {movie.overview || "No overview available for this title."}
                        </p>
                    </div>

                    {/* Interactive Action Controls */}
                    <DetailsActions
                        id={movie.id}
                        title={movie.title}
                        poster_path={movie.poster_path}
                        backdrop_path={movie.backdrop_path}
                        vote_average={movie.vote_average}
                        release_date={movie.release_date}
                        type="movie"
                        trailerKey={trailer?.key}
                    />
                </div>
            </section>

            {/* Similar Movies Rail */}
            {similarMovies.length > 0 && (
                <div className="pt-6 border-t border-white/[0.06]">
                    <MovieRow
                        title="More Like This"
                        movies={similarMovies}
                        icon={<Film className="w-5 h-5 text-[#9165FF]" />}
                    />
                </div>
            )}
        </div>
    )
}

export default function MoviePage() {
    return (
        <Suspense fallback={<MovieLoading />}>
            <MovieContent />
        </Suspense>
    )
}
