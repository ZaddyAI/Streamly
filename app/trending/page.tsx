import { getTrendingMovies, getTrendingTVShows } from "@/lib/tmdb"
import { MovieRow } from "@/components/movie-row"
import { Flame, Film, Tv } from "@/components/icons"

export default async function TrendingPage() {
    const results = await Promise.allSettled([getTrendingMovies(), getTrendingTVShows()])

    const trendingMovies = results[0].status === "fulfilled" ? results[0].value : []
    const trendingTV = results[1].status === "fulfilled" ? results[1].value : []

    return (
        <div className="space-y-10 md:space-y-12">
            {/* Header */}
            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                    <Flame className="w-3.5 h-3.5" />
                    <span>Hot Right Now</span>
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                    Trending
                </h1>
                <p className="text-sm text-[#929BB0] max-w-2xl leading-relaxed">
                    The most-streamed entertainment across movies and television series this week worldwide.
                </p>
            </div>

            <MovieRow
                title="Trending Movies"
                movies={trendingMovies}
                icon={<Film className="w-5 h-5 text-[#9165FF]" />}
            />
            <MovieRow
                title="Trending TV Shows"
                movies={trendingTV.map((show: any) => ({
                    ...show,
                    title: show.name,
                    release_date: show.first_air_date,
                }))}
                type="tv"
                icon={<Tv className="w-5 h-5 text-[#B69AFF]" />}
            />
        </div>
    )
}
