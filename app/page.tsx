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
import { Footer } from "@/components/footer"

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

    const heroMovies = trending.slice(0, 5)

    return (
        <div className="min-h-screen">
            <Header />

            {/* Hero Section */}
            {heroMovies.length > 0 && <HeroSection movies={heroMovies} />}

            {/* Movie Rows */}
            <div className="space-y-8 md:space-y-12 pb-12 -mt-32 relative z-10">
                <MovieRow title="Trending Now" movies={trending} />
                <MovieRow title="Popular on SFLIX" movies={popular} />
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

            <Footer />
        </div>
    )
}
