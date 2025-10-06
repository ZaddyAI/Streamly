import { Header } from "@/components/header"
import { getTrendingMovies, getTrendingTVShows } from "@/lib/tmdb"
import { MovieRow } from "@/components/movie-row"

export default async function TrendingPage() {
    const [trendingMovies, trendingTV] = await Promise.all([getTrendingMovies(), getTrendingTVShows()])

    return (
        <div className="min-h-screen">
            <Header />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">Trending</h1>

                <div className="space-y-8 md:space-y-12">
                    <MovieRow title="Trending Movies" movies={trendingMovies} />
                    <MovieRow
                        title="Trending TV Shows"
                        movies={trendingTV.map((show: any) => ({ ...show, title: show.name, release_date: show.first_air_date }))}
                        type="tv"
                    />
                </div>
            </div>
        </div>
    )
}
