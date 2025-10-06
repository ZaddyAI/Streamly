import { Header } from "@/components/header"
import { getPopularMovies, getTopRatedMovies, getNowPlayingMovies, getUpcomingMovies } from "@/lib/tmdb"
import { MovieRow } from "@/components/movie-row"

export default async function MoviesPage() {
    const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
        getPopularMovies(),
        getTopRatedMovies(),
        getNowPlayingMovies(),
        getUpcomingMovies(),
    ])

    return (
        <div className="min-h-screen">
            <Header />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Movies</h1>

                <div className="space-y-8 md:space-y-12">
                    <MovieRow title="Popular Movies" movies={popular} />
                    <MovieRow title="Top Rated" movies={topRated} />
                    <MovieRow title="Now Playing" movies={nowPlaying} />
                    <MovieRow title="Coming Soon" movies={upcoming} />
                </div>
            </div>
        </div>
    )
}
