import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { MovieRow } from "@/components/movie-row"
import {
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getNowPlayingMovies,
    getUpcomingMovies,
    getTrendingTVShows,
    getPopularTVShows,
} from "@/lib/tmdb"

export default async function HomePage() {
    const [trending, popular, topRated, nowPlaying, upcoming, trendingTV, popularTV] = await Promise.all([
        getTrendingMovies(),
        getPopularMovies(),
        getTopRatedMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
        getTrendingTVShows(),
        getPopularTVShows(),
    ])

    // Use the first trending movie as hero
    const heroMovie = trending[0]

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            {heroMovie && <HeroSection movie={heroMovie} />}

            {/* Movie Rows */}
            <div className="space-y-8 md:space-y-12 pb-12 -mt-32 relative z-10">
                <MovieRow title="Trending Now" movies={trending} />
                <MovieRow title="Popular on STREAMLY" movies={popular} />
                <MovieRow
                    title="Trending TV Shows"
                    movies={trendingTV.map((show: any) => ({ ...show, title: show.name, release_date: show.first_air_date }))}
                    type="tv"
                />
                <MovieRow title="Top Rated" movies={topRated} />
                <MovieRow
                    title="Popular TV Shows"
                    movies={popularTV.map((show: any) => ({ ...show, title: show.name, release_date: show.first_air_date }))}
                    type="tv"
                />
                <MovieRow title="Now Playing" movies={nowPlaying} />
                <MovieRow title="Coming Soon" movies={upcoming} />
            </div>
        </div>
    )
}
