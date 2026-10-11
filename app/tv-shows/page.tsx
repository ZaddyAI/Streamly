import { getTrendingTVShows, getPopularTVShows, getTopRatedTVShows } from "@/lib/tmdb"
import { MovieRow } from "@/components/movie-row"
import { Tv, Flame, Crown, Sparkles } from "@/components/icons"

export default async function TVShowsPage() {
    const results = await Promise.allSettled([
        getTrendingTVShows(),
        getPopularTVShows(),
        getTopRatedTVShows(),
    ])

    const trending = results[0].status === "fulfilled" ? results[0].value : []
    const popular = results[1].status === "fulfilled" ? results[1].value : []
    const topRated = results[2].status === "fulfilled" ? results[2].value : []

    return (
        <div className="space-y-10 md:space-y-12">
            {/* Header */}
            <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#9165FF]/15 border border-[#9165FF]/30 text-[#B69AFF]">
                    <Tv className="w-3.5 h-3.5" />
                    <span>Television & Series</span>
                </span>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#F7F7FC] tracking-tight">
                    TV Shows
                </h1>
                <p className="text-sm text-[#929BB0] max-w-2xl leading-relaxed">
                    Binge-worthy series, trending seasons, and top-rated dramas streaming episode-by-episode with zero interruptions.
                </p>
            </div>

            <MovieRow
                title="Trending TV Shows"
                movies={trending.map((show: any) => ({
                    ...show,
                    title: show.name,
                    release_date: show.first_air_date,
                }))}
                type="tv"
                icon={<Flame className="w-5 h-5 text-amber-400" />}
            />
            <MovieRow
                title="Popular TV Shows"
                movies={popular.map((show: any) => ({
                    ...show,
                    title: show.name,
                    release_date: show.first_air_date,
                }))}
                type="tv"
                icon={<Sparkles className="w-5 h-5 text-[#9165FF]" />}
            />
            <MovieRow
                title="Top Rated TV Series"
                movies={topRated.map((show: any) => ({
                    ...show,
                    title: show.name,
                    release_date: show.first_air_date,
                }))}
                type="tv"
                icon={<Crown className="w-5 h-5 text-amber-400" />}
            />
        </div>
    )
}
