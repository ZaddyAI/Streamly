import { HeroSection } from "@/components/hero-section"
import { MovieRow } from "@/components/movie-row"
import { ContinueWatching } from "@/components/continue-watching"
import { RightRail } from "@/components/right-rail"
import {
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getNowPlayingMovies,
    getUpcomingMovies,
    getTrendingTVShows,
    getPopularTVShows,
} from "@/lib/tmdb"
import { Flame, Film, Tv, Compass, Sparkles } from "@/components/icons"
import Link from "next/link"

const GENRE_CHIPS = [
    { name: "Action", id: 28, emoji: "💥" },
    { name: "Sci-Fi", id: 878, emoji: "🚀" },
    { name: "Adventure", id: 12, emoji: "🧭" },
    { name: "Comedy", id: 35, emoji: "😂" },
    { name: "Drama", id: 18, emoji: "🎭" },
    { name: "Thriller", id: 53, emoji: "⚡" },
    { name: "Animation", id: 16, emoji: "✨" },
    { name: "Horror", id: 27, emoji: "👻" },
    { name: "Crime", id: 80, emoji: "🕵️" },
    { name: "Fantasy", id: 14, emoji: "🧙" },
]

export default async function HomePage() {
    // Fetch data with error resilience
    const results = await Promise.allSettled([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
        getTrendingTVShows(),
        getPopularTVShows(),
    ])

    const trending = results[0].status === "fulfilled" ? results[0].value : []
    const popular = results[1].status === "fulfilled" ? results[1].value : []
    const topRated = results[2].status === "fulfilled" ? results[2].value : []
    const nowPlaying = results[3].status === "fulfilled" ? results[3].value : []
    const upcoming = results[4].status === "fulfilled" ? results[4].value : []
    const trendingTV = results[5].status === "fulfilled" ? results[5].value : []
    const popularTV = results[6].status === "fulfilled" ? results[6].value : []

    const heroMovies = trending.slice(0, 6)

    return (
        <div className="space-y-10 md:space-y-12">
            {/* Cinematic Featured Hero (Spans full width above content area - Section 3.C) */}
            {heroMovies.length > 0 && <HeroSection movies={heroMovies} />}

            {/* Desktop 2-Column Split: Flexible Content Rails + Editorial Right Rail (Section 3.F) */}
            <div className="flex flex-col xl:flex-row gap-8 items-start">
                {/* Main Content Column */}
                <div className="flex-1 min-w-0 space-y-10 md:space-y-12 w-full">
                    {/* 1. Trending Now Row (Section 3.D) */}
                    <MovieRow
                        title="Trending Now"
                        movies={trending}
                        href="/trending"
                        icon={<Flame className="w-5 h-5 text-amber-400" />}
                    />

                    {/* 2. Continue Watching (Section 3.E) */}
                    <ContinueWatching featuredMovies={popular.slice(0, 8)} />

                    {/* 3. Popular Movies Row (Section 3.G) */}
                    <MovieRow
                        title="Popular Movies"
                        movies={popular}
                        href="/movies"
                        icon={<Film className="w-5 h-5 text-[#9165FF]" />}
                    />

                    {/* 4. Trending TV Series */}
                    <MovieRow
                        title="Trending TV Shows"
                        movies={trendingTV.map((show: any) => ({
                            ...show,
                            title: show.name,
                            release_date: show.first_air_date,
                        }))}
                        type="tv"
                        href="/tv-shows"
                        icon={<Tv className="w-5 h-5 text-[#B69AFF]" />}
                    />

                    {/* 5. Browse by Genre Quick Selector (Section 3.H) */}
                    <section className="space-y-3.5 pt-2" aria-label="Browse Genres">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Compass className="w-5 h-5 text-[#9165FF]" />
                                <h2 className="text-lg sm:text-xl font-bold text-[#F7F7FC] tracking-tight">
                                    Browse by Genre
                                </h2>
                            </div>
                            <Link
                                href="/genres"
                                className="text-xs font-semibold text-[#B69AFF] hover:text-white transition-colors"
                            >
                                All Genres
                            </Link>
                        </div>

                        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-1">
                            {GENRE_CHIPS.map((genre) => (
                                <Link
                                    key={genre.id}
                                    href={`/genres?id=${genre.id}&name=${encodeURIComponent(genre.name)}`}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#101522] hover:bg-[#171C2C] border border-white/[0.08] hover:border-[#9165FF]/40 text-xs font-semibold text-[#F7F7FC] transition-all whitespace-nowrap group hover:shadow-[0_0_15px_rgba(145,101,255,0.2)]"
                                >
                                    <span>{genre.emoji}</span>
                                    <span className="group-hover:text-[#B69AFF] transition-colors">
                                        {genre.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* 6. Popular TV Shows */}
                    <MovieRow
                        title="Popular TV Shows"
                        movies={popularTV.map((show: any) => ({
                            ...show,
                            title: show.name,
                            release_date: show.first_air_date,
                        }))}
                        type="tv"
                        href="/tv-shows"
                        icon={<Sparkles className="w-5 h-5 text-amber-400" />}
                    />

                    {/* 7. Now Playing & Coming Soon */}
                    <MovieRow title="Now Playing in Theaters" movies={nowPlaying} href="/movies" />
                    <MovieRow title="Coming Soon" movies={upcoming} href="/movies" />
                </div>

                {/* Editorial Right Rail (Section 3.F - Promotional Card + Top Rated Ranking) */}
                <RightRail topRated={topRated} />
            </div>
        </div>
    )
}
