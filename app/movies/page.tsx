import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from "@/lib/tmdb"
import { MovieRow } from "@/components/movie-row"
import { Film, Crown, Sparkles, Clock } from "@/components/icons"

export default async function MoviesPage() {
    const results = await Promise.allSettled([
        getPopularMovies(),
        getTopRatedMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
    ])

    const popular = results[0].status === "fulfilled" ? results[0].value : []
    const topRated = results[1].status === "fulfilled" ? results[1].value : []
    const nowPlaying = results[2].status === "fulfilled" ? results[2].value : []
    const upcoming = results[3].status === "fulfilled" ? results[3].value : []

    return (
        <div className="space-y-10 md:space-y-12">
            {/* Header */}
            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9165FF]/15 border border-[#9165FF]/30 text-[#B69AFF]">
                    <Film className="w-3.5 h-3.5" />
                    <span>Cinematic Catalog</span>
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                    Movies
                </h1>
                <p className="text-sm text-[#929BB0] max-w-2xl leading-relaxed">
                    Blockbusters, cult classics, and independent masterpieces — curated in 4K Ultra HD and updated daily.
                </p>
            </div>

            {/* Rails */}
            <MovieRow
                title="Popular Movies"
                movies={popular}
                icon={<Film className="w-5 h-5 text-[#9165FF]" />}
            />
            <MovieRow
                title="Top Rated Cinema"
                movies={topRated}
                icon={<Crown className="w-5 h-5 text-amber-400" />}
            />
            <MovieRow
                title="Now Playing in Theaters"
                movies={nowPlaying}
                icon={<Sparkles className="w-5 h-5 text-[#B69AFF]" />}
            />
            <MovieRow
                title="Coming Soon"
                movies={upcoming}
                icon={<Clock className="w-5 h-5 text-[#929BB0]" />}
            />
        </div>
    )
}
